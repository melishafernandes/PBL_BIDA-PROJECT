// REPLACE: frontend/src/pages/Welcome.tsx
// If your old Welcome.tsx redirected logged-in users (e.g. to /dashboard), add that logic back at the top of the component.
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  BarChart3,
  Gamepad2,
  Database,
  Sparkles,
  LineChart,
  ShieldCheck,
  Check,
} from "lucide-react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

const SAMPLE = [
  { name: "IT", score: 82, color: "#10b981" },
  { name: "Pharma", score: 74, color: "#10b981" },
  { name: "Bank", score: 61, color: "#f59e0b" },
  { name: "Auto", score: 55, color: "#f59e0b" },
  { name: "Metal", score: 43, color: "#94a3b8" },
];

const FEATURES = [
  {
    icon: BookOpen,
    title: "Learn in 13 small steps",
    text: "From what a share is to your first investment, each step has one idea, one demo and one quick check.",
  },
  {
    icon: BarChart3,
    title: "Analyse real sector data",
    text: "A live dashboard scores sectors from market and economy data, with charts, filters and CSV export.",
  },
  {
    icon: Gamepad2,
    title: "Practise with no risk",
    text: "Quizzes and pretend investing let you test ideas before any real money is involved.",
  },
];

const STEPS = [
  { icon: Database, title: "Collect", text: "Prices and economy data" },
  { icon: Sparkles, title: "Model", text: "One classifier per sector" },
  { icon: LineChart, title: "Score", text: "A 0 to 100 score and signal" },
  { icon: ShieldCheck, title: "Explain", text: "Clear limits, no hype" },
];

const STATS = [
  { value: "13", label: "guided steps" },
  { value: "Weekly", label: "data refresh" },
  { value: "XGBoost", label: "model per sector" },
  { value: "CSV", label: "export for Power BI" },
];

function Preview() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-xl shadow-primary/10">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold">Sector Outlook</p>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">Sample data</span>
      </div>
      <div className="mb-4 grid grid-cols-3 gap-2">
        {[
          ["Sectors", "9"],
          ["Strong", "2"],
          ["Avg score", "63"],
        ].map(([l, v]) => (
          <div key={l} className="rounded-lg border border-border p-2.5">
            <p className="text-[11px] text-muted-foreground">{l}</p>
            <p className="font-heading text-lg font-bold">{v}</p>
          </div>
        ))}
      </div>
      <div className="space-y-2.5">
        {SAMPLE.map((s, i) => (
          <div key={s.name} className="flex items-center gap-3 text-xs">
            <span className="w-14 text-muted-foreground">{s.name}</span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full"
                style={{ background: s.color }}
                initial={{ width: 0 }}
                animate={{ width: `${s.score}%` }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: "easeOut" }}
              />
            </div>
            <span className="w-6 text-right font-semibold">{s.score}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[11px] text-muted-foreground">
        Scores show how favourable past patterns look. They are not forecasts.
      </p>
    </div>
  );
}

export default function Welcome() {
  const reduce = useReducedMotion();
  const fade = reduce
    ? {}
    : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Logo />
          <nav className="flex items-center gap-2">
            <a href="#features" className="hidden px-3 text-sm text-muted-foreground hover:text-foreground sm:block">
              Features
            </a>
            <a href="#how" className="hidden px-3 text-sm text-muted-foreground hover:text-foreground sm:block">
              How it works
            </a>
            <ThemeToggle />
            <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary">
              Log in
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:py-24 lg:grid-cols-2">
          <motion.div {...fade}>
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Business intelligence project for beginners
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] md:text-6xl">
              Understand the market before you invest in it.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              InvestIQ teaches investing step by step and shows live sector analytics, so beginners learn with real data
              instead of guesswork.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:opacity-90"
              >
                Start learning free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold hover:bg-secondary"
              >
                I have an account
              </Link>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {["No real money needed", "Plain-language lessons", "Simple Mode for first-timers"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-500" /> {t}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Preview />
          </motion.div>
        </section>

        <section className="border-y border-border bg-card">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-8 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-heading text-2xl font-extrabold md:text-3xl">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
          <h2 className="text-3xl font-bold md:text-4xl">Learn it, see it, try it</h2>
          <p className="mt-2 max-w-xl text-muted-foreground">Three parts that work together in one app.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how" className="scroll-mt-20 border-t border-border bg-card">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <h2 className="text-3xl font-bold md:text-4xl">From raw data to a clear score</h2>
            <p className="mt-2 max-w-xl text-muted-foreground">The same pipeline a real analytics team would build.</p>
            <ol className="mt-10 grid list-none gap-4 md:grid-cols-4">
              {STEPS.map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="relative rounded-2xl border border-border bg-background p-5">
                  <span className="text-xs font-semibold text-primary">Stage {i + 1}</span>
                  <Icon className="mt-3 h-6 w-6" />
                  <h3 className="mt-3 font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-5 py-20 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Ready to take the first step?</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Create a free account and start with step 1. It takes about five minutes.
          </p>
          <Link
            to="/register"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:opacity-90"
          >
            Create free account <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-xs text-muted-foreground">
          <Logo size={24} />
          <p>Educational project. Not personal investment advice. Investments can lose money.</p>
        </div>
      </footer>
    </div>
  );
}