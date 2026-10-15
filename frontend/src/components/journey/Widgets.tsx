import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getSectorRankings } from "@/lib/api";
import { getSectorInfo } from "@/lib/sectorGuide";
import { sectorEmoji } from "@/lib/sectorEmoji";
import type { WidgetKey } from "@/lib/journey";
import Sparkline from "@/components/Sparkline";
import SectorRankCard from "@/components/SectorRankCard";

const BOX = "rounded-2xl border border-border bg-card p-5 space-y-4";
const rupees = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage unavailable, ignore
    }
  }, [key, value]);
  return [value, setValue] as const;
}

function Slider(props: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format?: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const { label, value, min, max, step, format, onChange } = props;
  return (
    <div>
      <p className="text-sm font-medium">
        {label}: <span className="text-primary">{format ? format(value) : value}</span>
      </p>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
        aria-label={label}
      />
    </div>
  );
}

function InflationDemo() {
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(6);
  const value = 100 / Math.pow(1 + rate / 100, years);

  return (
    <div className={BOX}>
      <h3 className="font-semibold">🪙 What happens to idle money?</h3>
      <Slider label="After" value={years} min={1} max={30} step={1} format={(v) => `${v} years`} onChange={setYears} />
      <Slider label="Prices rise by" value={rate} min={3} max={8} step={1} format={(v) => `${v}% a year`} onChange={setRate} />
      <div className="rounded-xl bg-secondary/60 p-4 text-center">
        <motion.div
          className="text-5xl inline-block"
          animate={{ scale: Math.max(0.35, value / 100) }}
          transition={{ type: "spring", stiffness: 120, damping: 12 }}
          aria-hidden="true"
        >
          🪙
        </motion.div>
        <p className="mt-2 text-sm">
          ₹100 kept idle today would buy only about{" "}
          <span className="font-bold text-red-500">₹{value.toFixed(0)}</span> worth of things in{" "}
          {years} years.
        </p>
      </div>
      <p className="text-[11px] text-muted-foreground">
        An example that assumes the same inflation every year. Real inflation changes.
      </p>
    </div>
  );
}

function PriceMover() {
  const [prices, setPrices] = useState<number[]>([100]);
  const last = prices[prices.length - 1];
  const change = ((last - 100) / 100) * 100;

  const move = (dir: 1 | -1) => {
    const pct = 2 + Math.random() * 5;
    setPrices((p) => [...p.slice(-19), +(p[p.length - 1] * (1 + (dir * pct) / 100)).toFixed(2)]);
  };

  return (
    <div className={BOX}>
      <h3 className="font-semibold">🎢 Make the price move</h3>
      <div className="flex items-center justify-between gap-4">
        <div>
          <motion.p
            key={last}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className={`text-3xl font-bold ${change >= 0 ? "text-emerald-600" : "text-red-500"}`}
          >
            ₹{last.toFixed(2)}
          </motion.p>
          <p className="text-xs text-muted-foreground">
            {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(1)}% from ₹100
          </p>
        </div>
        <Sparkline values={prices} up={change >= 0} className="w-32 h-12" />
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => move(1)}
          className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-medium text-emerald-800"
        >
          📰👍 Good news: more people want to buy
        </button>
        <button
          type="button"
          onClick={() => move(-1)}
          className="rounded-full bg-red-100 px-4 py-2 text-xs font-medium text-red-800"
        >
          📰👎 Bad news: more people want to sell
        </button>
        <button
          type="button"
          onClick={() => setPrices([100])}
          className="rounded-full border border-border px-4 py-2 text-xs"
        >
          Reset
        </button>
      </div>
      <p className="text-[11px] text-muted-foreground">
        A made-up example. Real prices move for many reasons at once.
      </p>
    </div>
  );
}

function LemonadeStand() {
  const [cups, setCups] = useState(60);
  const [price, setPrice] = useState(20);
  const [cost, setCost] = useState(8);
  const [fixed, setFixed] = useState(200);

  const revenue = cups * price;
  const costs = cups * cost + fixed;
  const profit = revenue - costs;

  return (
    <div className={BOX}>
      <h3 className="font-semibold">🍋 Run a lemonade stand for one day</h3>
      <Slider label="Cups sold" value={cups} min={10} max={200} step={5} onChange={setCups} />
      <Slider label="Price per cup" value={price} min={5} max={50} step={1} format={rupees} onChange={setPrice} />
      <Slider label="Cost to make a cup" value={cost} min={2} max={30} step={1} format={rupees} onChange={setCost} />
      <Slider label="Fixed costs (stall, helper)" value={fixed} min={0} max={500} step={10} format={rupees} onChange={setFixed} />
      <div className="rounded-xl bg-secondary/60 p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>💰 Revenue</span>
          <span className="font-semibold">{rupees(revenue)}</span>
        </div>
        <div className="flex justify-between">
          <span>🧾 Costs</span>
          <span className="font-semibold">{rupees(costs)}</span>
        </div>
        <div className={`flex justify-between text-base font-bold ${profit >= 0 ? "text-emerald-600" : "text-red-500"}`}>
          <span>{profit >= 0 ? "📊 Profit" : "📉 Loss"}</span>
          <span>{rupees(Math.abs(profit))}</span>
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground">
        Real companies work the same way, just with far bigger numbers.
      </p>
    </div>
  );
}

const MATCH_ITEMS = [
  { company: "Tata Steel", answer: "Metal" },
  { company: "Sun Pharmaceutical", answer: "Pharma" },
  { company: "HDFC Bank", answer: "Bank" },
  { company: "TCS", answer: "IT" },
];
const MATCH_OPTIONS = ["Auto", "Pharma", "Metal", "IT", "Bank", "FMCG"];

function SectorMatch() {
  const [picked, setPicked] = useState<Record<string, string>>({});

  return (
    <div className={BOX}>
      <h3 className="font-semibold">🎮 Match each company to its sector</h3>
      {MATCH_ITEMS.map((item) => {
        const choice = picked[item.company];
        const correct = choice === item.answer;
        return (
          <div key={item.company} className="space-y-2">
            <p className="text-sm font-medium">
              {item.company} {choice && (correct ? "✅" : "❌")}
            </p>
            <div className="flex flex-wrap gap-2">
              {MATCH_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setPicked((p) => ({ ...p, [item.company]: opt }))}
                  className={`rounded-full border px-3 py-1.5 text-xs ${
                    choice === opt
                      ? correct
                        ? "border-emerald-500 bg-emerald-100 text-emerald-800"
                        : "border-red-400 bg-red-100 text-red-800"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  {sectorEmoji(opt)} {opt}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const EXPLORE = ["Auto", "Pharma", "Metal", "IT", "Bank", "FMCG", "Energy", "Realty", "Infrastructure"];

function SectorExplorer() {
  const [sel, setSel] = useState("Metal");
  const info = getSectorInfo(sel);

  return (
    <div className={BOX}>
      <h3 className="font-semibold">🔭 Tap a sector to explore</h3>
      <div className="flex flex-wrap gap-2">
        {EXPLORE.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSel(s)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
              sel === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"
            }`}
          >
            {sectorEmoji(s)} {s}
          </button>
        ))}
      </div>
      <p className="text-sm">{info.about}</p>
      <div className="grid gap-3 sm:grid-cols-2 text-sm">
        <div className="rounded-xl bg-secondary/60 p-3">
          <p className="font-medium mb-1">What moves it</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            {info.drivers.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-secondary/60 p-3">
          <p className="font-medium mb-1">What can go wrong</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            {info.risks.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function RankingPreview() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["sectorRankings"],
    queryFn: getSectorRankings,
  });
  const top: any[] = (data?.rankings ?? []).slice(0, 5);

  return (
    <div className={BOX}>
      <h3 className="font-semibold">🏆 Today's top 5 sectors in InvestIQ</h3>
      {isLoading && <div className="h-40 rounded-xl bg-muted animate-pulse" />}
      {isError && <p className="text-sm text-red-500">Couldn't load the ranking right now.</p>}
      {top.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border">
          {top.map((s, i) => (
            <SectorRankCard key={s.sector} data={s} index={i} />
          ))}
        </div>
      )}
      <Link to="/sectors" className="inline-block text-sm text-primary underline">
        See all sectors →
      </Link>
    </div>
  );
}

const DETECTIVE = [
  "What does it sell, and to whom?",
  "Have its sales and profit grown over several years?",
  "How much debt does it have?",
  "Is its price reasonable compared with its profit (P/E) and with similar companies?",
  "Have I read its latest results or annual report?",
];

function CompanyDetective() {
  const { data } = useQuery({ queryKey: ["sectorRankings"], queryFn: getSectorRankings });
  const rankings: any[] = data?.rankings ?? [];
  const [name, setName] = useState<string | null>(null);
  const [ticks, setTicks] = useState<number[]>([]);

  const current = rankings.find((r) => r.sector === name) ?? rankings[0];
  const companies: string[] = current?.companies ?? [];

  return (
    <div className={BOX}>
      <h3 className="font-semibold">🕵️ Company detective</h3>
      {rankings.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {rankings.map((r) => (
            <button
              key={r.sector}
              type="button"
              onClick={() => setName(r.sector)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                current?.sector === r.sector
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:bg-secondary"
              }`}
            >
              {sectorEmoji(r.sector)} {r.sector}
            </button>
          ))}
        </div>
      )}
      {companies.length > 0 && (
        <p className="text-sm">
          Well-known companies in {current.sector}:{" "}
          <span className="font-medium">{companies.join(", ")}</span>
          <span className="block text-[11px] text-muted-foreground">
            For reference only, not recommendations.
          </span>
        </p>
      )}
      <div className="space-y-1">
        <p className="text-sm font-medium">Ask these questions about any company you study:</p>
        {DETECTIVE.map((q, i) => {
          const on = ticks.includes(i);
          return (
            <button
              key={q}
              type="button"
              role="checkbox"
              aria-checked={on}
              onClick={() => setTicks((t) => (on ? t.filter((x) => x !== i) : [...t, i]))}
              className="flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-secondary/70"
            >
              <span>{on ? "✅" : "⬜"}</span>
              <span className={on ? "text-muted-foreground line-through" : ""}>{q}</span>
            </button>
          );
        })}
      </div>
      <div className="rounded-xl bg-secondary/60 p-3 text-xs text-muted-foreground space-y-1">
        <p><span className="font-medium text-foreground">Revenue:</span> money from sales.</p>
        <p><span className="font-medium text-foreground">Profit:</span> revenue minus costs.</p>
        <p><span className="font-medium text-foreground">Debt:</span> money the company owes.</p>
        <p>
          <span className="font-medium text-foreground">P/E:</span> share price divided by profit per
          share. A rough way to compare similar companies.
        </p>
      </div>
    </div>
  );
}

interface DecisionState {
  goal: string;
  horizon: number;
  comfort: number;
  reason: string;
}

const HORIZONS = ["Less than 1 year", "1 to 3 years", "3 to 5 years", "More than 5 years"];
const COMFORT = ["Very worried", "A bit worried", "Fairly calm"];

function DecisionNote() {
  const [s, setS] = useStored<DecisionState>("investiq_decision", {
    goal: "",
    horizon: 3,
    comfort: 1,
    reason: "",
  });

  const messages: string[] = [];
  if (s.horizon <= 1) {
    messages.push(
      "Money you may need within about 3 years is usually not a good fit for risky investments, because prices can be down just when you need it."
    );
  }
  if (s.comfort === 0) {
    messages.push(
      "Big swings may feel stressful. Spreading money across many companies, for example through an index fund, can make the ride smoother than betting on one sector."
    );
  }
  if (s.horizon >= 2 && s.comfort === 2) {
    messages.push(
      "More time and a calm mind give risky investments longer to recover from dips. Nothing is guaranteed, though."
    );
  }

  const field = "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm";

  return (
    <div className={BOX}>
      <h3 className="font-semibold">📝 My decision note</h3>
      <label className="block text-sm">
        <span className="font-medium">My goal</span>
        <input
          className={field}
          placeholder="For example: a laptop, a trip, my studies"
          value={s.goal}
          onChange={(e) => setS({ ...s, goal: e.target.value })}
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium">When will I need this money?</span>
        <select
          className={field}
          value={s.horizon}
          onChange={(e) => setS({ ...s, horizon: Number(e.target.value) })}
        >
          {HORIZONS.map((h, i) => (
            <option key={h} value={i}>
              {h}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="font-medium">If my investment fell by a fifth, I would feel</span>
        <select
          className={field}
          value={s.comfort}
          onChange={(e) => setS({ ...s, comfort: Number(e.target.value) })}
        >
          {COMFORT.map((c, i) => (
            <option key={c} value={i}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="font-medium">Why I like this choice, and what would change my mind</span>
        <textarea
          rows={3}
          className={field}
          value={s.reason}
          onChange={(e) => setS({ ...s, reason: e.target.value })}
        />
      </label>
      {messages.length > 0 && (
        <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900 space-y-1 dark:bg-amber-500/10 dark:text-amber-200">
          {messages.map((m) => (
            <p key={m}>💡 {m}</p>
          ))}
        </div>
      )}
      <p className="text-[11px] text-muted-foreground">
        Saved only on this device. General education, not personal advice.
      </p>
    </div>
  );
}

function Readiness() {
  // The First Steps page has 15 checklist items.
  const total = 15;
  let count = 0;
  try {
    const raw = localStorage.getItem("investiq_steps_done");
    const arr = raw ? JSON.parse(raw) : [];
    count = Array.isArray(arr) ? arr.length : 0;
  } catch {
    count = 0;
  }
  const pct = Math.round((count / total) * 100);

  return (
    <div className={BOX}>
      <h3 className="font-semibold">🎒 How packed is your bag?</h3>
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>
            {count} of {total} readiness items ticked
          </span>
          <span>{pct}%</span>
        </div>
        <div className="h-3 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <Link
        to="/steps"
        className="inline-block rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Open the checklist →
      </Link>
    </div>
  );
}

const REVIEW = [
  "I checked my investment (not more than once every few months)",
  "I re-read why I invested",
  "Nothing has changed my original reason",
  "I kept my monthly amount going",
  "I learned one new thing",
];

function ReviewChecklist() {
  const [ticks, setTicks] = useStored<number[]>("investiq_review_done", []);

  return (
    <div className={BOX}>
      <h3 className="font-semibold">🗓️ My review checklist</h3>
      <div className="space-y-1">
        {REVIEW.map((q, i) => {
          const on = ticks.includes(i);
          return (
            <button
              key={q}
              type="button"
              role="checkbox"
              aria-checked={on}
              onClick={() => setTicks(on ? ticks.filter((x) => x !== i) : [...ticks, i])}
              className="flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-secondary/70"
            >
              <span>{on ? "✅" : "⬜"}</span>
              <span className={on ? "text-muted-foreground line-through" : ""}>{q}</span>
            </button>
          );
        })}
      </div>
      {ticks.length > 0 && (
        <button type="button" onClick={() => setTicks([])} className="text-xs text-muted-foreground underline">
          Start a new review
        </button>
      )}
    </div>
  );
}

export const WIDGETS: Record<WidgetKey, ComponentType> = {
  inflation: InflationDemo,
  priceMover: PriceMover,
  lemonade: LemonadeStand,
  sectorMatch: SectorMatch,
  explorer: SectorExplorer,
  ranking: RankingPreview,
  companies: CompanyDetective,
  decision: DecisionNote,
  readiness: Readiness,
  review: ReviewChecklist,
};