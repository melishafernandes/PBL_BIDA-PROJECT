import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSectorRankings } from "@/lib/api";
import Sparkline from "@/components/Sparkline";

const rupees = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

export default function WhatIf() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["sectorRankings"],
    queryFn: getSectorRankings,
  });

  const [name, setName] = useState<string | null>(null);
  const [amount, setAmount] = useState(10000);

  const sectors = (data?.rankings ?? []).filter((r: any) => (r.sparkline?.length ?? 0) > 1);
  const current: any = sectors.find((s: any) => s.sector === name) ?? sectors[0];

  if (isLoading) {
    return <div className="h-40 rounded-2xl bg-muted animate-pulse" />;
  }
  if (isError || !current) {
    return (
      <p className="text-sm text-muted-foreground">
        We could not load price trends right now. Please try again in a moment.
      </p>
    );
  }

  const line: number[] = current.sparkline;
  const ratio = line[line.length - 1] / line[0];
  const value = amount * ratio;
  const change = value - amount;
  const pct = (ratio - 1) * 100;
  const up = change >= 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
      <div>
        <p className="text-sm font-medium mb-2">1. Pick a sector</p>
        <div className="flex flex-wrap gap-2">
          {sectors.map((s: any) => {
            const active = s.sector === current.sector;
            return (
              <button
                key={s.sector}
                type="button"
                onClick={() => setName(s.sector)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:bg-secondary"
                }`}
              >
                {s.sector}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">
          2. Imagine you put in <span className="text-primary">{rupees(amount)}</span>
        </p>
        <input
          type="range"
          min={1000}
          max={100000}
          step={1000}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full accent-primary"
          aria-label="Amount to invest"
        />
        <div className="flex justify-between text-[11px] text-muted-foreground">
          <span>₹1,000</span>
          <span>₹1,00,000</span>
        </div>
      </div>

      <div
        className={`rounded-xl p-5 ${
          up
            ? "bg-emerald-50 dark:bg-emerald-500/10"
            : "bg-red-50 dark:bg-red-500/10"
        }`}
      >
        <p className="text-xs text-muted-foreground">
          About a month ago, {rupees(amount)} in {current.sector} would be worth about
        </p>
        <p className={`text-3xl font-bold ${up ? "text-emerald-600" : "text-red-500"}`}>
          {rupees(value)}
        </p>
        <p className={`text-sm font-medium ${up ? "text-emerald-600" : "text-red-500"}`}>
          {up ? "▲ Up" : "▼ Down"} {rupees(Math.abs(change))} ({pct >= 0 ? "+" : ""}
          {pct.toFixed(1)}%)
        </p>
        <div className="mt-3">
          <Sparkline values={line} up={up} className="w-full h-12" />
        </div>
      </div>

      <p className="text-sm">
        {up
          ? "It would have grown 🎉 But remember, the next month could go either way."
          : "It would have dropped 😮 This is why investing always has risk."}
      </p>

      <p className="text-[11px] text-muted-foreground">
        This looks backwards at roughly the last month. It is not a prediction. Real investing also
        has fees, taxes and other risks. Always ask a parent or guardian before investing real
        money.
      </p>
    </div>
  );
}