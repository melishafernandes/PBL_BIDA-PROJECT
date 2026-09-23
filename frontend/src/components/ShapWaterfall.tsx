import { motion } from "framer-motion";
import InfoTooltip from "@/components/InfoTooltip";
import { GLOSSARY } from "@/lib/glossary";

interface Contributor {
  feature: string;
  impact_pct: number;
}

// Maps the human-readable feature names coming from the backend
// to glossary keys, so each one can show its own tooltip.
const FEATURE_TO_GLOSSARY_KEY: Record<string, keyof typeof GLOSSARY> = {
  "Sector Momentum": "sectorMomentum",
  "Volatility": "volatility",
  "Short-Term Trend": "shortTermTrend",
  "Long-Term Trend": "longTermTrend",
  "GDP Growth": "gdpGrowth",
  "Inflation": "inflation",
  "Interest Rate Trend": "interestRate",
};

export default function ShapWaterfall({
  positive,
  negative,
}: {
  positive: Contributor[];
  negative: Contributor[];
}) {
  const all = [...positive, ...negative];
  const maxAbs = Math.max(...all.map((c) => Math.abs(c.impact_pct)), 1);

  return (
    <div className="space-y-2">
      {all.map((c, i) => {
        const isPositive = c.impact_pct > 0;
        const widthPct = (Math.abs(c.impact_pct) / maxAbs) * 100;
        const glossaryKey = FEATURE_TO_GLOSSARY_KEY[c.feature];

        return (
          <div key={c.feature} className="flex items-center gap-3">
            <span className="text-sm w-44 text-right text-muted-foreground shrink-0 flex items-center justify-end">
              {c.feature}
              {glossaryKey && <InfoTooltip termKey={glossaryKey} />}
            </span>
            <div className="flex-1 h-6 flex items-center relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border" />

              <div className="w-1/2 flex justify-end pr-0.5">
                {!isPositive && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPct}%` }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    className="h-5 rounded-l bg-red-500/80"
                  />
                )}
              </div>
              <div className="w-1/2 flex justify-start pl-0.5">
                {isPositive && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPct}%` }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    className="h-5 rounded-r bg-emerald-500/80"
                  />
                )}
              </div>
            </div>
            <span
              className={`text-sm w-16 shrink-0 font-medium ${
                isPositive ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {isPositive ? "+" : ""}
              {c.impact_pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
}