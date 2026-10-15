// REPLACE: frontend/src/pages/Project.tsx
import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Activity,
  BarChart3,
  Brain,
  CalendarDays,
  Compass,
  Cpu,
  Database,
  Download,
  Eraser,
  LayoutDashboard,
  MousePointerClick,
  PieChart,
  Plug,
  Scale,
  Search,
  ShieldCheck,
  Target,
  TrendingUp,
  Trophy,
  Wrench,
  History,
  Compass as JourneyIcon,
  TriangleAlert,
} from "lucide-react";
import { getRegime, getSectorRankings } from "@/lib/api";
import PipelineDiagram from "@/components/PipelineDiagram";
import type { Stage } from "@/components/PipelineDiagram";
import { PageHeader, Panel, Stat } from "@/components/ui-kit";

// Edit these to match your project. Leave TEAM empty to hide that block.
const TEAM: { name: string; role: string }[] = [];
const TITLE = "InvestIQ: Sector Intelligence for Beginners";

const STAGES: Stage[] = [
  {
    icon: Download,
    title: "Collect",
    short: "Prices and economy data",
    details: [
      "Sector and benchmark prices from Yahoo Finance.",
      "Economic indicators from FRED and the World Bank.",
      "Results are cached so the APIs are not called on every page load.",
    ],
  },
  {
    icon: Eraser,
    title: "Clean",
    short: "Align everything weekly",
    details: [
      "Daily prices become weekly (Friday) closes.",
      "Monthly and yearly economic data is forward-filled to weekly rows.",
      "Rows with missing values are dropped, and sectors with no usable rows are skipped.",
    ],
  },
  {
    icon: Wrench,
    title: "Engineer",
    short: "Turn data into signals",
    details: [
      "4-week rolling return and volatility.",
      "4-week and 12-week moving averages of price.",
      "Changes in GDP, inflation and the interest rate.",
    ],
  },
  {
    icon: Cpu,
    title: "Model",
    short: "One classifier per sector",
    details: [
      "An XGBoost classifier is trained for each sector.",
      "Target: does the sector beat the benchmark in the following week?",
      "The model outputs a probability, not a price forecast.",
    ],
  },
  {
    icon: Search,
    title: "Explain",
    short: "Score and signal",
    details: [
      "The probability is turned into a 0 to 100 score.",
      "Scores are grouped into Strong, Moderate or Neutral signals.",
      "Each sector page explains the score in plain language for beginners.",
    ],
  },
  {
    icon: LayoutDashboard,
    title: "Deliver",
    short: "APIs and dashboards",
    details: [
      "A FastAPI backend serves rankings, regime and market data.",
      "A React app shows the Analytics Hub, sector outlook and the beginner journey.",
      "Data can be exported as CSV for Excel or Power BI.",
    ],
  },
];

const KPIS = [
  { icon: Trophy, name: "Sector score", note: "Model probability scaled to 0 to 100" },
  { icon: PieChart, name: "Signal mix", note: "How many sectors are Strong, Moderate or Neutral" },
  { icon: Activity, name: "Volatility class", note: "Low, Medium or High relative to other sectors" },
  { icon: TrendingUp, name: "30-day momentum", note: "Recent price change by sector" },
  { icon: Scale, name: "Strategy vs benchmark", note: "Backtest return against NIFTY 50" },
  { icon: Target, name: "Pick accuracy", note: "How often the top pick beat the benchmark" },
];

const DICTIONARY = [
  { name: "return", meaning: "Weekly price change of the sector", source: "Yahoo Finance" },
  { name: "rolling_return_4w", meaning: "Average weekly return over 4 weeks", source: "Derived" },
  { name: "rolling_vol_4w", meaning: "Spread of weekly returns over 4 weeks (volatility)", source: "Derived" },
  { name: "ma_4w, ma_12w", meaning: "Moving averages of price (short and medium term)", source: "Derived" },
  { name: "gdp_roc", meaning: "Change in GDP", source: "FRED" },
  { name: "inflation_roc", meaning: "Change in consumer prices", source: "FRED" },
  { name: "rate_change", meaning: "Change in the interest rate", source: "FRED" },
  { name: "outperformed_next_week", meaning: "Target: 1 if the sector beats the benchmark next week", source: "Derived" },
];

// Keep this honest and up to date. Edit when the data sources or models change.
const LIMITS = [
  "Some free economic series are published with long delays or have stopped updating, so macro inputs can be stale. The freshness table above monitors this.",
  "The model predicts weekly outperformance, which is a noisy target. Scores are pattern signals, not forecasts.",
  "The backtest window is short, so results are a sanity check and not proof of skill.",
  "Fees, taxes and trading costs are not included in the backtest.",
  "Company lists are hand-written and shown for reference only.",
];

// SHAP removed because the project does not use it. Add it back only if you implement it.
const TECH = [
  "Python",
  "FastAPI",
  "pandas",
  "XGBoost",
  "SQLAlchemy",
  "React",
  "TypeScript",
  "Vite",
  "Tailwind CSS",
  "Recharts",
  "TanStack Query",
  "Framer Motion",
];

const OUTCOMES = [
  { icon: Database, title: "Data engineering", text: "APIs, caching, cleaning and alignment" },
  { icon: Wrench, title: "Feature engineering", text: "Turning prices into signals" },
  { icon: Brain, title: "Machine learning", text: "Training and evaluating models over time" },
  { icon: BarChart3, title: "Business intelligence", text: "KPIs, charts and exports" },
  { icon: MousePointerClick, title: "User experience", text: "Designing for complete beginners" },
  { icon: ShieldCheck, title: "Responsible analytics", text: "Honest limits and clear disclaimers" },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

const BADGE = {
  bad: "bg-red-500/15 text-red-700 dark:text-red-300",
  warn: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
  ok: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
};

function Freshness() {
  const { data, isLoading } = useQuery({ queryKey: ["regime"], queryFn: getRegime });

  const rows = [
    { label: "GDP growth", source: "World Bank (annual)", key: "gdp_growth" },
    { label: "Inflation", source: "FRED (annual)", key: "inflation" },
    { label: "Interest rate", source: "FRED (monthly)", key: "interest_rate" },
  ] as const;

  return (
    <Panel title="Live data freshness" subtitle="Checked each time this page loads.">
      {isLoading ? (
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-2 py-2 font-medium">Indicator</th>
                <th className="px-2 py-2 font-medium">Source</th>
                <th className="px-2 py-2 font-medium">Latest period</th>
                <th className="px-2 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const asOf = data?.as_of?.[r.key];
                const stale = data?.stale?.[r.key];
                const status = !asOf
                  ? { text: "Unavailable", cls: BADGE.bad }
                  : stale
                  ? { text: "Older data", cls: BADGE.warn }
                  : { text: "Current", cls: BADGE.ok };
                return (
                  <tr key={r.key} className="border-b border-border/60">
                    <td className="px-2 py-2 font-medium">{r.label}</td>
                    <td className="px-2 py-2 text-muted-foreground">{r.source}</td>
                    <td className="px-2 py-2">{asOf ?? "–"}</td>
                    <td className="px-2 py-2">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${status.cls}`}>
                        {status.text}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

export default function Project() {
  const { data } = useQuery({ queryKey: ["sectorRankings"], queryFn: getSectorRankings });
  const sectorCount = data?.rankings?.length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Project-based learning · Business Intelligence and Data Analytics"
        title={TITLE}
        subtitle="An end-to-end analytics project: data to model to dashboard, built for people who are new to investing."
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Sectors analysed" icon={Compass}>
          {sectorCount ?? "–"}
        </Stat>
        <Stat label="Data frequency" icon={CalendarDays}>
          <span className="text-xl">Weekly</span>
        </Stat>
        <Stat label="Model per sector" icon={Cpu}>
          <span className="text-xl">XGBoost</span>
        </Stat>
        <Stat label="Data sources" icon={Plug}>
          3
        </Stat>
      </div>

      <Section title="The business question">
        <Panel>
          <p className="text-sm font-semibold">Which sectors deserve a beginner's attention this week, and why?</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Decision supported: where to study next. The project does not tell anyone what to buy.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {KPIS.map(({ icon: Icon, name, note }) => (
              <div key={name} className="flex gap-3 rounded-lg bg-secondary/60 p-3">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold leading-tight">{name}</p>
                  <p className="text-[11px] text-muted-foreground">{note}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </Section>

      <Section title="The data pipeline">
        <p className="text-xs text-muted-foreground">Tap a stage to see what happens in it.</p>
        <PipelineDiagram stages={STAGES} />
      </Section>

      <Section title="Data dictionary">
        <Panel>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-2 py-2 font-medium">Field</th>
                  <th className="px-2 py-2 font-medium">Meaning</th>
                  <th className="px-2 py-2 font-medium">Source</th>
                </tr>
              </thead>
              <tbody>
                {DICTIONARY.map((d) => (
                  <tr key={d.name} className="border-b border-border/60">
                    <td className="px-2 py-2 font-mono text-xs">{d.name}</td>
                    <td className="px-2 py-2">{d.meaning}</td>
                    <td className="px-2 py-2 text-muted-foreground">{d.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </Section>

      <Section title="Data quality">
        <Freshness />
        <div className="rounded-xl border border-amber-400/60 bg-amber-500/10 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <TriangleAlert className="h-4 w-4 text-amber-600" /> Known limitations
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {LIMITS.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      </Section>

      <Section title="Results">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { to: "/analytics", icon: BarChart3, title: "Analytics Hub", text: "Live KPIs, charts and a data table" },
            { to: "/backtest", icon: History, title: "Backtest", text: "Strategy vs the benchmark over time" },
            { to: "/dashboard", icon: JourneyIcon, title: "Beginner journey", text: "13 steps from zero to a first investment" },
          ].map(({ to, icon: Icon, title, text }) => (
            <Link
              key={to}
              to={to}
              className="rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-secondary"
            >
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-2 font-semibold">{title}</p>
              <p className="text-xs text-muted-foreground">{text}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Tech stack">
        <div className="flex flex-wrap gap-2">
          {TECH.map((t) => (
            <span key={t} className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium">
              {t}
            </span>
          ))}
        </div>
      </Section>

      <Section title="What this project demonstrates">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {OUTCOMES.map(({ icon: Icon, title, text }) => (
            <Panel key={title}>
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-2 font-semibold">{title}</p>
              <p className="text-xs text-muted-foreground">{text}</p>
            </Panel>
          ))}
        </div>
      </Section>

      {TEAM.length > 0 && (
        <Section title="Team">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((m) => (
              <Panel key={m.name}>
                <p className="font-semibold">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.role}</p>
              </Panel>
            ))}
          </div>
        </Section>
      )}

      <p className="text-xs text-muted-foreground">
        InvestIQ is an educational project. It does not give personal investment advice.
      </p>
    </div>
  );
}