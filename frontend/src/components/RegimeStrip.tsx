import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import InfoTooltip from "@/components/InfoTooltip";

interface RegimeData {
  regime: string;
  indicators: {
    gdp_growth: "up" | "down" | "flat";
    inflation: "up" | "down" | "flat";
    interest_rate: "up" | "down" | "flat";
  };
}

const DirectionIcon = ({ direction }: { direction: "up" | "down" | "flat" }) => {
  if (direction === "up") return <TrendingUp className="w-4 h-4 text-emerald-500" />;
  if (direction === "down") return <TrendingDown className="w-4 h-4 text-red-500" />;
  return <Minus className="w-4 h-4 text-slate-400" />;
};

export default function RegimeStrip({ data }: { data: RegimeData }) {
  const items: { label: string; value: "up" | "down" | "flat"; key: "gdpGrowth" | "inflation" | "interestRate" }[] = [
    { label: "GDP Growth", value: data.indicators.gdp_growth, key: "gdpGrowth" },
    { label: "Inflation", value: data.indicators.inflation, key: "inflation" },
    { label: "Interest Rate", value: data.indicators.interest_rate, key: "interestRate" },
  ];

  return (
    <div className="rounded-xl border border-border bg-card px-5 py-4 flex flex-wrap items-center gap-6">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center">
          Current Regime
          <InfoTooltip termKey="regime" />
        </p>
        <p className="text-lg font-semibold">{data.regime}</p>
      </div>
      <div className="h-8 w-px bg-border hidden sm:block" />
      <div className="flex gap-6">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <DirectionIcon direction={item.value} />
            <span className="text-sm text-muted-foreground flex items-center">
              {item.label}
              <InfoTooltip termKey={item.key} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}