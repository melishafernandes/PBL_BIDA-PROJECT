import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import InfoTooltip from "@/components/InfoTooltip";

type Direction = "up" | "down" | "flat";

interface Triple<T> {
  gdp_growth: T;
  inflation: T;
  interest_rate: T;
}

interface RegimeData {
  regime: string;
  indicators: Triple<Direction>;
  values?: Triple<number | null>;
  as_of?: Triple<string | null>;
  stale?: Triple<boolean>;
}

const DirectionIcon = ({ direction }: { direction: Direction }) => {
  if (direction === "up") return <TrendingUp className="w-4 h-4 text-emerald-500" />;
  if (direction === "down") return <TrendingDown className="w-4 h-4 text-red-500" />;
  return <Minus className="w-4 h-4 text-slate-400" />;
};

const formatLevel = (v: number | null | undefined) =>
  v === null || v === undefined ? "n/a" : `${v.toFixed(1)}%`;

export default function RegimeStrip({ data }: { data: RegimeData }) {
  const items: {
    label: string;
    id: "gdp_growth" | "inflation" | "interest_rate";
    tip: "gdpGrowth" | "inflation" | "interestRate";
  }[] = [
    { label: "GDP Growth", id: "gdp_growth", tip: "gdpGrowth" },
    { label: "Inflation", id: "inflation", tip: "inflation" },
    { label: "Interest Rate", id: "interest_rate", tip: "interestRate" },
  ];

  return (
    <div className="rounded-xl border border-border bg-card px-5 py-4 space-y-3">
      <div className="flex flex-wrap items-center gap-6">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center">
            Current Regime
            <InfoTooltip termKey="regime" />
          </p>
          <p className="text-lg font-semibold">{data.regime}</p>
        </div>
        <div className="h-8 w-px bg-border hidden sm:block" />
        <div className="flex flex-wrap gap-6">
          {items.map((item) => {
            const label = data.as_of?.[item.id];
            const isStale = data.stale?.[item.id];
            return (
              <div key={item.id} className="flex items-center gap-2">
                <DirectionIcon direction={data.indicators[item.id]} />
                <div>
                  <span className="text-sm text-muted-foreground flex items-center">
                    {item.label}
                    <InfoTooltip termKey={item.tip} />
                  </span>
                  <span className="text-sm font-semibold">
                    {formatLevel(data.values?.[item.id])}
                  </span>
                  {label && (
                    <span
                      className={`block text-[11px] ${
                        isStale ? "text-amber-600" : "text-muted-foreground"
                      }`}
                    >
                      {label}
                      {isStale ? " · older data" : ""}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground">
        Arrows compare with about a year earlier. GDP growth and inflation are yearly figures, so
        they update once a year. Interest rate is the short-term interbank rate, which closely
        follows the RBI's policy rate. Figures come from public data and can be months old.
      </p>
    </div>
  );
}