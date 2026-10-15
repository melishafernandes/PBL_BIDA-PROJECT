import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import ReadAloud from "@/components/ReadAloud";
import Mascot from "@/components/Mascot";
import { useSimpleMode } from "@/components/SimpleMode";

interface Item {
  id: string;
  icon: string;
  short: string;
  full: string;
}

interface Step {
  id: string;
  emoji: string;
  grad: string;
  title: string;
  line: string;
  simple: string;
  anim: Record<string, number[]>;
  items: Item[];
}

const STORAGE_KEY = "investiq_steps_done";

const STEPS: Step[] = [
  {
    id: "base",
    emoji: "🧱",
    grad: "bg-[linear-gradient(135deg,#fbbf24_0%,#f97316_100%)]",
    title: "Build your base",
    line: "Be money-safe before you invest.",
    simple: "Clear big debts and keep a little money aside.",
    anim: { y: [0, -5, 0] },
    items: [
      {
        id: "base-debt",
        icon: "💳",
        short: "No big debts",
        full: "Pay off high-interest debt first, such as credit card dues.",
      },
      {
        id: "base-emergency",
        icon: "🐷",
        short: "Small emergency fund",
        full: "Keep a small emergency fund (1 to 3 months of expenses) in a savings account or fixed deposit.",
      },
      {
        id: "base-rule",
        icon: "🔒",
        short: "Only spare money",
        full: "Only invest money you will not need soon. Never use money meant for daily or college expenses.",
      },
    ],
  },
  {
    id: "rule",
    emoji: "🐢",
    grad: "bg-[linear-gradient(135deg,#38bdf8_0%,#6366f1_100%)]",
    title: "Go slow and steady",
    line: "Small amounts, many years.",
    simple: "Save a little every month, for a long time.",
    anim: { x: [-4, 4, -4] },
    items: [
      {
        id: "rule-avoid",
        icon: "🚫",
        short: "No day trading",
        full: "Avoid day trading and borrowed money (leverage). Both can lose money quickly.",
      },
      {
        id: "rule-long",
        icon: "⏳",
        short: "Think long term",
        full: "Think long term. Compounding means your gains can earn gains, and it rewards patience.",
      },
      {
        id: "rule-sip",
        icon: "🔁",
        short: "Try a small SIP",
        full: "Learn about a SIP, which invests a fixed amount every month. Some funds accept ₹100 to ₹500, depending on the fund.",
      },
    ],
  },
  {
    id: "account",
    emoji: "🪪",
    grad: "bg-[linear-gradient(135deg,#f472b6_0%,#a855f7_100%)]",
    title: "Get your account ready",
    line: "Real investing needs a safe account.",
    simple: "A grown-up must help if you are under 18.",
    anim: { rotate: [-8, 8, -8] },
    items: [
      {
        id: "account-kyc",
        icon: "🆔",
        short: "Finish KYC",
        full: "Complete KYC, the identity check needed for mutual funds and trading accounts.",
      },
      {
        id: "account-broker",
        icon: "✅",
        short: "Check it is registered",
        full: "Choose a SEBI-registered broker or fund platform. Check its registration on SEBI's website and read its fees.",
      },
      {
        id: "account-minor",
        icon: "👨‍👩‍👧",
        short: "Parent helps if under 18",
        full: "If you are under 18, a parent or guardian must open and operate the account for you.",
      },
    ],
  },
  {
    id: "first",
    emoji: "🧺",
    grad: "bg-[linear-gradient(135deg,#34d399_0%,#0d9488_100%)]",
    title: "Don't use one basket",
    line: "Spread your money across many companies.",
    simple: "Funds hold many companies at once, so you are not betting on just one.",
    anim: { scale: [1, 1.15, 1] },
    items: [
      {
        id: "first-index",
        icon: "🧺",
        short: "Learn index funds",
        full: "Learn what an index fund is: it holds many companies at once, so your money is spread out.",
      },
      {
        id: "first-compare",
        icon: "🔍",
        short: "Compare the fees",
        full: "Compare a few broad-market index funds, such as ones that follow NIFTY 50. Look at their yearly fee (the expense ratio).",
      },
      {
        id: "first-sectors",
        icon: "🧭",
        short: "Use InvestIQ to learn",
        full: "Use InvestIQ to understand why sectors behave differently, not to pick winners.",
      },
    ],
  },
  {
    id: "habit",
    emoji: "⏰",
    grad: "bg-[linear-gradient(135deg,#a78bfa_0%,#d946ef_100%)]",
    title: "Do it every month",
    line: "Steady habits beat perfect timing.",
    simple: "Pick a small amount, set it up, and stay calm when prices dip.",
    anim: { rotate: [-10, 10, -10] },
    items: [
      {
        id: "habit-amount",
        icon: "💰",
        short: "Pick a monthly amount",
        full: "Choose a fixed monthly amount you can comfortably afford from pocket money, a stipend or a salary.",
      },
      {
        id: "habit-auto",
        icon: "🤖",
        short: "Set it to automatic",
        full: "Set it up to happen automatically every month.",
      },
      {
        id: "habit-calm",
        icon: "😌",
        short: "Stay calm in dips",
        full: "Do not panic-sell or check the app every day during dips. Consistency over years matters more than timing.",
      },
    ],
  },
];

const ALL_IDS = STEPS.flatMap((s) => s.items.map((i) => i.id));
const POP = { scale: [1, 1.25, 1] };

const rupees = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

function plantStage(percent: number) {
  if (percent === 0) return { emoji: "🌰", label: "A seed. Let's start!" };
  if (percent < 40) return { emoji: "🌱", label: "A tiny sprout" };
  if (percent < 80) return { emoji: "🌿", label: "Growing nicely" };
  if (percent < 100) return { emoji: "🌳", label: "Almost fully grown" };
  return { emoji: "🌟", label: "Fully grown! Great job" };
}

function sipValue(monthly: number, years: number, annualPct: number) {
  const n = years * 12;
  const i = annualPct / 100 / 12;
  if (i === 0) return monthly * n;
  return monthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
}

function Confetti() {
  const pieces = ["🎉", "✨", "🌟", "🎊"];
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2" aria-hidden="true">
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl"
          initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
          animate={{
            opacity: 0,
            x: (i - 7.5) * 22,
            y: -90 - (i % 4) * 25,
            scale: 1.2,
            rotate: (i % 2 === 0 ? 1 : -1) * 120,
          }}
          transition={{ duration: 1.6, delay: i * 0.05, ease: "easeOut" }}
        >
          {pieces[i % pieces.length]}
        </motion.span>
      ))}
    </div>
  );
}

function EmergencyFund() {
  const [expenses, setExpenses] = useState(10000);

  const rows = [
    { label: "Starter goal", months: 1 },
    { label: "Comfortable goal", months: 3 },
    { label: "Extra cushion", months: 6 },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <div>
        <h3 className="font-semibold">🐷 Emergency fund calculator</h3>
        <p className="text-xs text-muted-foreground">
          How much should you keep aside before you invest?
        </p>
      </div>

      <label className="block text-sm">
        <span className="font-medium">Your monthly expenses (₹)</span>
        <input
          type="number"
          min={0}
          step={500}
          value={expenses}
          onChange={(e) => setExpenses(Number(e.target.value) || 0)}
          className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
        />
      </label>

      <div className="space-y-2">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between rounded-xl bg-secondary/60 px-4 py-3 text-sm"
          >
            <span>
              {r.label}{" "}
              <span className="text-xs text-muted-foreground">
                ({r.months} {r.months === 1 ? "month" : "months"})
              </span>
            </span>
            <span className="font-semibold">{rupees(expenses * r.months)}</span>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-muted-foreground">
        Many people aim for 3 to 6 months of expenses. Students often start with 1 to 3 months.
        Keep it somewhere safe and easy to reach, like a savings account or fixed deposit.
      </p>
    </div>
  );
}

function SipCalculator() {
  const [monthly, setMonthly] = useState(1000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(8);

  const invested = monthly * years * 12;
  const value = sipValue(monthly, years, rate);
  const gain = value - invested;
  const investedShare = value > 0 ? (invested / value) * 100 : 100;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <div>
        <h3 className="font-semibold">🌱 Regular saving calculator (SIP)</h3>
        <p className="text-xs text-muted-foreground">
          See how a small monthly amount can add up over time.
        </p>
      </div>

      <div>
        <p className="text-sm font-medium">
          Monthly amount: <span className="text-primary">{rupees(monthly)}</span>
        </p>
        <input
          type="range"
          min={100}
          max={10000}
          step={100}
          value={monthly}
          onChange={(e) => setMonthly(Number(e.target.value))}
          className="w-full accent-primary"
          aria-label="Monthly amount"
        />
      </div>

      <div>
        <p className="text-sm font-medium">
          For: <span className="text-primary">{years} years</span>
        </p>
        <input
          type="range"
          min={1}
          max={30}
          step={1}
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          className="w-full accent-primary"
          aria-label="Number of years"
        />
      </div>

      <div>
        <p className="text-sm font-medium">
          Assumed yearly growth: <span className="text-primary">{rate}%</span>
        </p>
        <input
          type="range"
          min={4}
          max={12}
          step={1}
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="w-full accent-primary"
          aria-label="Assumed yearly growth"
        />
      </div>

      <div className="rounded-xl bg-secondary/60 p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">You put in</span>
          <span className="font-semibold">{rupees(invested)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Growth in this example</span>
          <span className="font-semibold text-emerald-600">{rupees(gain)}</span>
        </div>
        <div className="flex justify-between text-base">
          <span className="font-medium">Total in this example</span>
          <span className="font-bold">{rupees(value)}</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden flex bg-muted">
          <div className="bg-primary" style={{ width: `${investedShare}%` }} />
          <div className="bg-emerald-500" style={{ width: `${100 - investedShare}%` }} />
        </div>
        <div className="flex gap-4 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" /> Your money
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Growth
          </span>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground">
        This is an example, not a forecast. It assumes the same growth every year, but real
        investments go up and down and can lose money. It also ignores fees and taxes. What it
        shows is how time and regular saving can add up.
      </p>
    </div>
  );
}

export default function FirstSteps() {
  const { simple } = useSimpleMode();
  const reduce = useReducedMotion();

  const [done, setDone] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
    } catch {
      // storage unavailable, ignore
    }
  }, [done]);

  const toggle = (id: string) =>
    setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));

  const completed = ALL_IDS.filter((id) => done.includes(id)).length;
  const percent = Math.round((completed / ALL_IDS.length) * 100);
  const stage = plantStage(percent);

  const readText = STEPS.map(
    (s, i) => `Step ${i + 1}. ${s.title}. ${simple ? s.simple : s.line}`
  ).join(" ");

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl p-5 text-white shadow-lg bg-[linear-gradient(135deg,#0d9488_0%,#4f46e5_60%,#db2777_100%)]">
        {["🪙", "✨"].map((emoji, i) => (
          <motion.span
            key={emoji}
            aria-hidden="true"
            className="pointer-events-none absolute text-2xl opacity-30"
            style={{ top: `${10 + i * 30}%`, right: `${6 + i * 10}%` }}
            animate={reduce ? undefined : { y: [0, -10, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
          >
            {emoji}
          </motion.span>
        ))}

        {percent === 100 && <Confetti />}

        <div className="relative flex items-center gap-3">
          <Mascot className="w-20 h-20 shrink-0" />
          <div>
            <h1 className="text-2xl font-extrabold">Your First Steps 🚀</h1>
            <p className="text-sm text-white/90">
              Tap each button when you finish it. Watch your plant grow!
            </p>
          </div>
        </div>

        <div className="relative mt-4 flex items-center gap-3 rounded-2xl bg-white/15 p-3">
          <motion.div
            key={stage.emoji}
            initial={{ scale: 0.3, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 14 }}
            className="text-4xl"
            aria-hidden="true"
          >
            {stage.emoji}
          </motion.div>
          <div className="flex-1">
            <div className="flex justify-between text-xs text-white/90">
              <span>{stage.label}</span>
              <span>
                {completed}/{ALL_IDS.length} · {percent}%
              </span>
            </div>
            <div className="mt-1 h-3 overflow-hidden rounded-full bg-white/25">
              <motion.div
                className="h-full rounded-full bg-white"
                initial={false}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        <div className="relative mt-3">
          <ReadAloud text={readText} label="Read the steps aloud" />
        </div>
      </div>

      {percent === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-400 bg-emerald-50 p-4 dark:bg-emerald-500/10"
        >
          <p className="text-sm font-medium">
            🎉 You finished the basics! Ready to look at a sector?
          </p>
          <Link
            to="/steps?tab=plan"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Act on a sector →
          </Link>
        </motion.div>
      )}

      <ol className="list-none">
        {STEPS.map((step, index) => {
          const stepDone = step.items.every((i) => done.includes(i.id));
          const last = index === STEPS.length - 1;
          return (
            <li key={step.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <motion.div
                  animate={stepDone && !reduce ? POP : undefined}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    stepDone
                      ? "bg-emerald-500 text-white"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {stepDone ? "✓" : index + 1}
                </motion.div>
                {!last && (
                  <div
                    className={`mt-1 w-1 flex-1 rounded-full transition-colors ${
                      stepDone ? "bg-emerald-400" : "bg-border"
                    }`}
                  />
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`mb-4 flex-1 rounded-2xl border bg-card p-4 transition-colors ${
                  stepDone ? "border-emerald-400" : "border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl shadow-md ${step.grad}`}
                  >
                    <motion.span
                      aria-hidden="true"
                      className="inline-block"
                      animate={reduce ? undefined : step.anim}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {step.emoji}
                    </motion.span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold leading-tight">{step.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {simple ? step.simple : step.line}
                    </p>
                  </div>
                  {stepDone && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 12 }}
                      className="rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-white"
                    >
                      ⭐ Done
                    </motion.span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {step.items.map((item) => {
                    const checked = done.includes(item.id);
                    return (
                      <motion.button
                        key={item.id}
                        type="button"
                        aria-pressed={checked}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => toggle(item.id)}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition-colors ${
                          checked
                            ? "border-emerald-500 bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200"
                            : "border-border bg-background hover:bg-secondary"
                        }`}
                      >
                        <span aria-hidden="true" className="text-base">
                          {checked ? "✅" : item.icon}
                        </span>
                        {item.short}
                      </motion.button>
                    );
                  })}
                </div>

                <details className="mt-3 text-xs">
                  <summary className="cursor-pointer text-primary">More details</summary>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                    {step.items.map((item) => (
                      <li key={item.id}>{item.full}</li>
                    ))}
                  </ul>
                </details>
              </motion.div>
            </li>
          );
        })}
      </ol>

      {completed > 0 && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => setDone([])}
            className="text-xs text-muted-foreground underline"
          >
            Start again
          </button>
        </div>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-bold">🧮 Try the numbers</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <EmergencyFund />
          <SipCalculator />
        </div>
      </section>

      <p className="text-xs text-muted-foreground">
        This is general education, not personal investment advice. If you are under 18, ask a
        parent or guardian before taking any real step. Check that any broker or fund is
        SEBI-registered, and read the fees before you start.
      </p>
    </div>
  );
}