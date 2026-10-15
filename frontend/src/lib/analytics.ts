// frontend/src/lib/analytics.ts  (plain TypeScript, NO JSX in this file)
export type Signal = "Strong" | "Moderate" | "Neutral";

export interface SectorRow {
  sector: string;
  rank: number;
  score: number;
  signal: Signal;
  risk: string | null;
  ret30: number | null;
  companies: number;
}

export const SIGNAL_COLOR: Record<Signal, string> = {
  Strong: "#10b981",
  Moderate: "#f59e0b",
  Neutral: "#94a3b8",
};

export function toRows(rankings: any[]): SectorRow[] {
  return rankings.map((r) => {
    const s: number[] = r.sparkline ?? [];
    const ret30 =
      s.length > 1 && s[0] !== 0 ? (s[s.length - 1] / s[0] - 1) * 100 : null;
    return {
      sector: r.sector,
      rank: r.rank,
      score: Number(r.score),
      signal: r.signal,
      risk: r.risk ?? null,
      ret30,
      companies: (r.companies ?? []).length,
    };
  });
}

export function pearson(xs: number[], ys: number[]): number | null {
  const n = xs.length;
  if (n < 3) return null;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    dx += (xs[i] - mx) ** 2;
    dy += (ys[i] - my) ** 2;
  }
  if (dx === 0 || dy === 0) return null;
  return num / Math.sqrt(dx * dy);
}

const pct = (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`;

export function buildInsights(rows: SectorRow[]): { icon: string; text: string }[] {
  if (rows.length === 0) return [];
  const out: { icon: string; text: string }[] = [];
  const byScore = [...rows].sort((a, b) => b.score - a.score);
  const top = byScore[0];
  const strong = rows.filter((r) => r.signal === "Strong").length;

  out.push({ icon: "🏆", text: `${top.sector} has the highest score (${top.score}).` });
  out.push({ icon: "🌟", text: `${strong} of ${rows.length} sectors show a Strong signal.` });

  const withRet = rows.filter((r) => r.ret30 !== null) as (SectorRow & { ret30: number })[];
  if (withRet.length > 1) {
    const sorted = [...withRet].sort((a, b) => b.ret30 - a.ret30);
    const best = sorted[0];
    const worst = sorted[sorted.length - 1];
    out.push({
      icon: "📈",
      text: `Best 30-day move: ${best.sector} (${pct(best.ret30)}). Weakest: ${worst.sector} (${pct(worst.ret30)}).`,
    });
    if (top.ret30 !== null && top.ret30 < 0) {
      out.push({
        icon: "⚠️",
        text: `The top-scoring sector is down ${Math.abs(top.ret30).toFixed(1)}% over 30 days. Scores come from model patterns, not only recent price moves.`,
      });
    }
    const r = pearson(
      withRet.map((x) => x.score),
      withRet.map((x) => x.ret30)
    );
    if (r !== null) {
      out.push({
        icon: "🔗",
        text: `Across ${withRet.length} sectors, score and 30-day change have a correlation of r = ${r.toFixed(
          2
        )}. With so few sectors this is only indicative.`,
      });
    }
  }
  return out;
}

export function downloadCsv(rows: SectorRow[]) {
  const header = ["Rank", "Sector", "Score", "Signal", "Volatility", "Change30d_pct", "Companies"];
  const lines = rows.map((r) =>
    [
      r.rank,
      `"${r.sector.replace(/"/g, '""')}"`,
      r.score,
      r.signal,
      r.risk ?? "",
      r.ret30 === null ? "" : r.ret30.toFixed(2),
      r.companies,
    ].join(",")
  );
  const blob = new Blob([[header.join(","), ...lines].join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "investiq_sectors.csv";
  a.click();
  URL.revokeObjectURL(url);
}