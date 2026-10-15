// REPLACE: frontend/src/pages/Analytics.tsx
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  CartesianGrid,
  ZAxis,
  ReferenceLine,
  LabelList,
} from "recharts";
import { Compass, Download, Gauge, Trophy, Zap, CloudSun, Lightbulb } from "lucide-react";
import { getRegime, getSectorRankings } from "@/lib/api";
import { SIGNAL_COLOR, buildInsights, downloadCsv, toRows } from "@/lib/analytics";
import type { SectorRow, Signal } from "@/lib/analytics";
import { PageHeader, Panel, Stat } from "@/components/ui-kit";

const AXIS = { fontSize: 11, fill: "#64748b" };
const GRID = { strokeDasharray: "3 3", stroke: "#94a3b8", opacity: 0.3 };

function CountUp({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 700);
      setV(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{v.toFixed(decimals)}</>;
}

function Tip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow">
      <p className="font-semibold">{d.sector}</p>
      <p>Score: {d.score}</p>
      <p>Signal: {d.signal}</p>
      {d.ret30 !== null && d.ret30 !== undefined && <p>30-day change: {d.ret30.toFixed(1)}%</p>}
    </div>
  );
}

const FILTERS: ("All" | Signal)[] = ["All", "Strong", "Moderate", "Neutral"];
const COLUMNS: { key: keyof SectorRow; label: string }[] = [
  { key: "rank", label: "#" },
  { key: "sector", label: "Sector" },
  { key: "score", label: "Score" },
  { key: "signal", label: "Signal" },
  { key: "risk", label: "Volatility" },
  { key: "ret30", label: "30-day change" },
];

export default function Analytics() {
  const rankingsQ = useQuery({ queryKey: ["sectorRankings"], queryFn: getSectorRankings });
  const regimeQ = useQuery({ queryKey: ["regime"], queryFn: getRegime });
  const rows = useMemo(() => toRows(rankingsQ.data?.rankings ?? []), [rankingsQ.data]);
  const [filter, setFilter] = useState<"All" | Signal>("All");
  const [sort, setSort] = useState<{ key: keyof SectorRow; dir: 1 | -1 }>({ key: "rank", dir: 1 });

  const visible = useMemo(() => {
    const list = rows.filter((r) => filter === "All" || r.signal === filter);
    return [...list].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (av === null || av === undefined) return 1;
      if (bv === null || bv === undefined) return -1;
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * sort.dir;
      return String(av).localeCompare(String(bv)) * sort.dir;
    });
  }, [rows, filter, sort]);

  if (rankingsQ.isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-24 animate-pulse rounded-2xl bg-muted" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
        <div className="h-72 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }
  if (rankingsQ.isError || rows.length === 0) {
    return <p className="text-sm text-red-500">Couldn't load the analytics data right now.</p>;
  }

  const byScore = [...visible].sort((a, b) => b.score - a.score);
  const top = [...rows].sort((a, b) => b.score - a.score)[0];
  const avg = rows.reduce((s, r) => s + r.score, 0) / rows.length;
  const strongCount = rows.filter((r) => r.signal === "Strong").length;
  const dist = (["Strong", "Moderate", "Neutral"] as Signal[])
    .map((name) => ({ name, value: rows.filter((r) => r.signal === name).length }))
    .filter((d) => d.value > 0);
  const scatter = rows.filter((r) => r.ret30 !== null);
  const momentum = [...scatter].sort((a, b) => (b.ret30 as number) - (a.ret30 as number));
  const insights = buildInsights(rows);
  const toggleSort = (key: keyof SectorRow) =>
    setSort((s) => (s.key === key ? { key, dir: (s.dir * -1) as 1 | -1 } : { key, dir: 1 }));

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Business intelligence"
        title="Analytics Hub"
        subtitle="Sector scores, signals and momentum in one view, live from the model."
        actions={
          <button
            type="button"
            onClick={() => downloadCsv(visible)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <Download className="h-4 w-4" /> Download CSV
          </button>
        }
      />

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat label="Sectors tracked" icon={Compass}>
          <CountUp value={rows.length} />
        </Stat>
        <Stat label="Strong signals" icon={Zap}>
          <CountUp value={strongCount} />
        </Stat>
        <Stat label="Top sector" icon={Trophy}>
          <span className="text-lg">{top.sector}</span>{" "}
          <span className="text-sm font-medium text-muted-foreground">
            (<CountUp value={top.score} />)
          </span>
        </Stat>
        <Stat label="Average score" icon={Gauge}>
          <CountUp value={avg} decimals={1} />
        </Stat>
        <Stat label="Market regime" icon={CloudSun}>
          <span className="text-base">{regimeQ.data?.regime ?? "…"}</span>
        </Stat>
      </section>

      <Panel title="Key insights" action={<Lightbulb className="h-4 w-4 text-muted-foreground" />}>
        <ul className="grid gap-2 sm:grid-cols-2">
          {insights.map((i) => (
            <li key={i.text} className="flex gap-2 rounded-lg bg-secondary/60 p-3 text-sm">
              <span aria-hidden="true">{i.icon}</span>
              <span>{i.text}</span>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => {
          const count = f === "All" ? rows.length : rows.filter((r) => r.signal === f).length;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"
              }`}
            >
              {f} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Panel title="Score by sector" subtitle="Colour shows the signal.">
          <ResponsiveContainer width="100%" height={Math.max(240, byScore.length * 34)}>
            <BarChart data={byScore} layout="vertical" margin={{ left: 4, right: 30 }}>
              <CartesianGrid {...GRID} horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={AXIS} />
              <YAxis type="category" dataKey="sector" width={95} tick={{ ...AXIS, fontSize: 12 }} />
              <Tooltip content={<Tip />} cursor={{ fill: "rgba(100,116,139,0.1)" }} />
              <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                {byScore.map((b) => (
                  <Cell key={b.sector} fill={SIGNAL_COLOR[b.signal]} />
                ))}
                <LabelList dataKey="score" position="right" style={{ fontSize: 11, fill: "#64748b" }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Signal mix" subtitle="Sectors in each group.">
          <div className="relative">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={dist} dataKey="value" nameKey="name" innerRadius={60} outerRadius={88} paddingAngle={2}>
                  {dist.map((d) => (
                    <Cell key={d.name} fill={SIGNAL_COLOR[d.name as Signal]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{rows.length}</span>
              <span className="text-[11px] text-muted-foreground">sectors</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            {dist.map((d) => (
              <span key={d.name} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: SIGNAL_COLOR[d.name as Signal] }} />
                {d.name} ({d.value})
              </span>
            ))}
          </div>
        </Panel>
      </div>

      {scatter.length > 1 && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Score vs 30-day change" subtitle="Does a higher score go with recent price strength?">
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid {...GRID} />
                <XAxis type="number" dataKey="ret30" name="30-day change" unit="%" tick={AXIS} tickFormatter={(v) => Number(v).toFixed(0)} />
                <YAxis type="number" dataKey="score" name="Score" domain={[0, 100]} tick={AXIS} />
                <ZAxis range={[90, 90]} />
                <ReferenceLine x={0} stroke="#94a3b8" strokeDasharray="4 4" />
                <Tooltip content={<Tip />} cursor={{ strokeDasharray: "3 3" }} />
                <Scatter
                  data={scatter}
                  shape={(p: any) => (
                    <g>
                      <circle cx={p.cx} cy={p.cy} r={7} fill={SIGNAL_COLOR[p.payload.signal as Signal]} fillOpacity={0.9} />
                      <text x={p.cx} y={p.cy - 11} textAnchor="middle" fontSize={10} fill="#64748b">
                        {p.payload.sector}
                      </text>
                    </g>
                  )}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="30-day momentum" subtitle="Price change over about a month.">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={momentum} margin={{ top: 10, right: 10, bottom: 30, left: 0 }}>
                <CartesianGrid {...GRID} vertical={false} />
                <XAxis dataKey="sector" interval={0} angle={-35} textAnchor="end" height={60} tick={{ ...AXIS, fontSize: 10 }} />
                <YAxis unit="%" tick={AXIS} tickFormatter={(v) => Number(v).toFixed(0)} />
                <ReferenceLine y={0} stroke="#94a3b8" />
                <Tooltip content={<Tip />} cursor={{ fill: "rgba(100,116,139,0.1)" }} />
                <Bar dataKey="ret30" radius={[3, 3, 0, 0]}>
                  {momentum.map((m) => (
                    <Cell key={m.sector} fill={(m.ret30 as number) >= 0 ? "#10b981" : "#ef4444"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </div>
      )}

      <Panel title="Sector data table" subtitle="Click a heading to sort.">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                {COLUMNS.map((c) => (
                  <th key={c.key} className="px-2 py-2 font-medium">
                    <button type="button" onClick={() => toggleSort(c.key)} className="hover:text-foreground">
                      {c.label}
                      {sort.key === c.key ? (sort.dir === 1 ? " ▲" : " ▼") : ""}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr key={r.sector} className="border-b border-border/60 hover:bg-secondary/50">
                  <td className="px-2 py-2 text-muted-foreground">{r.rank}</td>
                  <td className="px-2 py-2 font-medium">{r.sector}</td>
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-2">
                      <span className="w-7 font-semibold">{r.score}</span>
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full" style={{ width: `${r.score}%`, background: SIGNAL_COLOR[r.signal] }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <span className="h-2 w-2 rounded-full" style={{ background: SIGNAL_COLOR[r.signal] }} />
                      {r.signal}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-muted-foreground">{r.risk ?? "–"}</td>
                  <td
                    className={`px-2 py-2 font-medium ${
                      r.ret30 === null ? "text-muted-foreground" : r.ret30 >= 0 ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {r.ret30 === null ? "–" : `${r.ret30 >= 0 ? "+" : ""}${r.ret30.toFixed(1)}%`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <p className="text-[11px] text-muted-foreground">
        Scores come from the InvestIQ model. The 30-day change uses the sector index, or an average of its major
        companies when the index is unavailable (Yahoo Finance). Correlations on a small number of sectors are
        indicative only. Not investment advice.
      </p>
    </div>
  );
}