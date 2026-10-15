import { useQuery } from "@tanstack/react-query";

interface IndexQuote {
  name: string;
  symbol: string;
  price: number;
  change: number;
  change_pct: number;
  sparkline: number[];
}

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

async function getMarketIndices(): Promise<{ indices: IndexQuote[] }> {
  const res = await fetch(`${API_BASE}/api/market/indices`);
  if (!res.ok) throw new Error("Failed to load market indices");
  return res.json();
}

function Sparkline({ values, up }: { values: number[]; up: boolean }) {
  if (values.length < 2) return <div className="w-24 h-8" />;
  const w = 100;
  const h = 32;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-24 h-8">
      <polyline
        points={points}
        fill="none"
        stroke={up ? "#10b981" : "#ef4444"}
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function MarketPanel() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["marketIndices"],
    queryFn: getMarketIndices,
    refetchInterval: 5 * 60 * 1000,
  });

  const indices = data?.indices ?? [];

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-lg font-semibold">Global Market</h2>
      </div>

      {isLoading && (
        <div className="p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-sm text-red-500 p-4">Couldn't load market data.</p>
      )}

      {indices.map((q) => {
        const up = q.change_pct >= 0;
        const color = up ? "text-emerald-500" : "text-red-500";
        return (
          <div
            key={q.symbol}
            className="flex items-center justify-between gap-3 px-5 py-3 border-b border-border last:border-b-0"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{q.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {q.symbol.replace("^", "")}
              </p>
            </div>
            <Sparkline values={q.sparkline} up={up} />
            <div className="text-right">
              <p className="text-sm font-medium">{fmt(q.price)}</p>
              <p className={`text-xs ${color}`}>
                {up ? "+" : ""}
                {q.change_pct.toFixed(2)}%
              </p>
            </div>
          </div>
        );
      })}

      <p className="text-[11px] text-muted-foreground px-5 py-3">
        Daily closes, last 30 days. Data may be delayed.
      </p>
    </div>
  );
}