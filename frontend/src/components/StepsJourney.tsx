import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import Mascot from "@/components/Mascot";
import { useSimpleMode } from "@/components/SimpleMode";

const scrollToSectors = () =>
  document.getElementById("sectors")?.scrollIntoView({ behavior: "smooth", block: "start" });

const STEPS = [
  {
    n: 1,
    emoji: "📚",
    title: "Learn",
    hint: "2-minute basics",
    simpleHint: "Learn the words",
    to: "/learn",
    grad: "bg-[linear-gradient(135deg,#38bdf8_0%,#6366f1_100%)]",
    anim: { rotate: [-8, 8, -8] },
    duration: 2.4,
  },
  {
    n: 2,
    emoji: "🎯",
    title: "Pick a sector",
    hint: "See what looks good",
    simpleHint: "Find a good area",
    to: null,
    grad: "bg-[linear-gradient(135deg,#f472b6_0%,#a855f7_100%)]",
    anim: { scale: [1, 1.18, 1] },
    duration: 1.8,
  },
  {
    n: 3,
    emoji: "🌱",
    title: "Start small",
    hint: "Grow step by step",
    simpleHint: "Grow a little at a time",
    to: "/steps",
    grad: "bg-[linear-gradient(135deg,#34d399_0%,#0d9488_100%)]",
    anim: { scale: [0.85, 1.15, 0.85], y: [2, -4, 2] },
    duration: 2.6,
  },
];

export default function StepsJourney() {
  const { simple } = useSimpleMode();
  const reduce = useReducedMotion();

  const cards = STEPS.map((s, i) => {
    const inner = (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15 + i * 0.15 }}
        whileHover={reduce ? undefined : { y: -6, scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="relative h-full rounded-2xl bg-white p-4 text-slate-800 shadow-lg"
      >
        <span className="absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
          {s.n}
        </span>
        <div className="flex flex-col items-center text-center gap-2 pt-2">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl text-4xl shadow-md ${s.grad}`}
          >
            <motion.span
              aria-hidden="true"
              animate={reduce ? undefined : s.anim}
              transition={{ duration: s.duration, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block"
            >
              {s.emoji}
            </motion.span>
          </div>
          <p className="text-base font-bold leading-tight">{s.title}</p>
          <p className="text-xs text-slate-500">{simple ? s.simpleHint : s.hint}</p>
          <span className="text-lg text-indigo-500">→</span>
        </div>
      </motion.div>
    );

    return s.to ? (
      <Link key={s.n} to={s.to} className="block h-full" aria-label={s.title}>
        {inner}
      </Link>
    ) : (
      <button
        key={s.n}
        type="button"
        onClick={scrollToSectors}
        className="block h-full w-full text-left"
        aria-label={s.title}
      >
        {inner}
      </button>
    );
  });

  const row: React.ReactNode[] = [];
  cards.forEach((card, i) => {
    row.push(card);
    if (i < cards.length - 1) {
      row.push(
        <motion.span
          key={`arrow-${i}`}
          aria-hidden="true"
          className="hidden md:flex items-center justify-center text-3xl text-white/80"
          animate={reduce ? undefined : { x: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        >
          ➜
        </motion.span>
      );
    }
  });

  return (
    <section className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-xl bg-[linear-gradient(135deg,#4f46e5_0%,#7c3aed_55%,#db2777_100%)]">
      {["🪙", "✨", "📈"].map((emoji, i) => (
        <motion.span
          key={emoji}
          aria-hidden="true"
          className="pointer-events-none absolute text-3xl opacity-30"
          style={{ top: `${12 + i * 24}%`, right: `${6 + i * 9}%` }}
          animate={reduce ? undefined : { y: [0, -12, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
        >
          {emoji}
        </motion.span>
      ))}

      <div className="relative flex items-center gap-4 mb-6">
        <Mascot className="w-24 h-24 shrink-0" />
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Welcome to InvestIQ!</h1>
          <p className="mt-2 inline-block rounded-2xl bg-white/95 px-4 py-2 text-sm font-medium text-slate-800 shadow">
            {simple ? "Hi, I'm Iqi! Let's learn about money together." : "Hi, I'm Iqi! Start here. It takes 3 easy steps."}
          </p>
        </div>
      </div>

      <div className="relative grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch">
        {row}
      </div>

      <p className="relative mt-4 text-xs text-white/80">
        For learning only. Not advice on what to buy.
      </p>
    </section>
  );
}