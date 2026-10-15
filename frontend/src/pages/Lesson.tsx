// REPLACE: frontend/src/pages/Lesson.tsx
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronDown, TriangleAlert } from "lucide-react";
import Mascot from "@/components/Mascot";
import ReadAloud from "@/components/ReadAloud";
import { useSimpleMode } from "@/components/SimpleMode";
import { WIDGETS } from "@/components/journey/Widgets";
import { Panel, STEP_ICONS } from "@/components/ui-kit";
import { STEPS, useJourneyProgress } from "@/lib/journey";
import type { Card, Check } from "@/lib/journey";

function CheckBox({ check }: { check: Check }) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <Panel title="Check yourself">
      <p className="mb-3 text-sm font-medium">{check.q}</p>
      <div className="space-y-2">
        {check.options.map((opt, i) => {
          let style = "border-border hover:bg-secondary";
          if (picked !== null) {
            if (i === check.answer) style = "border-emerald-500 bg-emerald-500/10";
            else if (i === picked) style = "border-red-400 bg-red-500/10";
            else style = "border-border opacity-50";
          }
          return (
            <button
              key={opt}
              type="button"
              disabled={picked !== null}
              onClick={() => setPicked(i)}
              className={`w-full rounded-lg border px-4 py-2.5 text-left text-sm transition-colors ${style}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <p className="mt-3 text-sm">
          <span className="font-semibold">{picked === check.answer ? "Correct. " : "Not quite. "}</span>
          <span className="text-muted-foreground">{check.why}</span>
        </p>
      )}
    </Panel>
  );
}

function IdeaRow({ card, open, onToggle }: { card: Card; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-border last:border-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-3 py-3 text-left"
      >
        <span className="text-xl" aria-hidden="true">{card.icon}</span>
        <span className="flex-1">
          <span className="block text-sm font-semibold">{card.title}</span>
          {card.risk && (
            <span className="text-[11px] tracking-widest text-amber-500" aria-label={`Risk ${card.risk} of 5`}>
              {"●".repeat(card.risk)}
              {"○".repeat(5 - card.risk)}
            </span>
          )}
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden pb-3 pl-8 text-sm text-muted-foreground"
          >
            {card.text}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Lesson() {
  const { step } = useParams();
  const n = Number(step);
  const info = STEPS.find((s) => s.n === n);
  const navigate = useNavigate();
  const { simple } = useSimpleMode();
  const reduce = useReducedMotion();
  const { done, mark } = useJourneyProgress();
  const [open, setOpen] = useState<number[]>([0]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setOpen([0]);
  }, [n]);

  if (!info) return <Navigate to="/dashboard" replace />;

  const prev = STEPS.find((s) => s.n === n - 1);
  const next = STEPS.find((s) => s.n === n + 1);
  const Widget = info.widget ? WIDGETS[info.widget] : null;
  const Icon = STEP_ICONS[n];
  const toggle = (i: number) => setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));

  const finish = () => {
    mark(n);
    navigate(next ? `/journey/${next.n}` : "/dashboard");
  };

  const readText = `${info.title}. ${info.question} ${simple ? info.simple : info.intro} ${info.cards
    .map((c) => `${c.title}. ${c.text}`)
    .join(" ")}`;

  return (
    <motion.div
      className="space-y-5"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <header className="rounded-2xl border border-border border-t-4 border-t-primary bg-card p-6">
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3 w-3" /> Journey map
        </Link>
        <div className="mt-3 flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary">
            <Icon className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">
              Step {info.n} of {STEPS.length}
            </p>
            <h1 className="text-2xl font-bold tracking-tight">{info.title}</h1>
            <p className="text-sm text-muted-foreground">{info.question}</p>
          </div>
        </div>
        <div className="mt-4 flex gap-1" aria-hidden="true">
          {STEPS.map((s) => (
            <span
              key={s.n}
              className={`h-1.5 flex-1 rounded-full ${
                s.n === n ? "bg-primary" : done.includes(s.n) ? "bg-primary/50" : "bg-muted"
              }`}
            />
          ))}
        </div>
        <div className="mt-4">
          <ReadAloud text={readText} label="Read this step aloud" />
        </div>
      </header>

      {simple ? (
        <div className="flex items-start gap-3">
          <Mascot className="h-14 w-14 shrink-0" />
          <p className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium">{info.simple}</p>
        </div>
      ) : (
        <details className="rounded-xl border border-border bg-card px-4 py-3 text-sm">
          <summary className="cursor-pointer font-medium">Why this matters</summary>
          <p className="mt-2 text-muted-foreground">{info.intro}</p>
        </details>
      )}

      <div className={`grid items-start gap-5 ${Widget ? "lg:grid-cols-2" : ""}`}>
        <div className="space-y-5">
          <Panel>
            <div className="flex items-center gap-4">
              <div className="flex gap-2 text-3xl" aria-hidden="true">
                {info.analogy.emojis.map((e, i) => (
                  <span key={e + i}>{e}</span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{info.analogy.caption}</p>
            </div>
          </Panel>

          <Panel
            title="Key ideas"
            action={
              <button
                type="button"
                onClick={() => setOpen(open.length === info.cards.length ? [] : info.cards.map((_, i) => i))}
                className="text-xs text-primary underline"
              >
                {open.length === info.cards.length ? "Collapse all" : "Expand all"}
              </button>
            }
          >
            {info.cards.map((c, i) => (
              <IdeaRow key={c.title} card={c} open={open.includes(i)} onToggle={() => toggle(i)} />
            ))}
          </Panel>

          {info.walk && (
            <Panel title="What the day looks like">
              <ol className="list-none space-y-2">
                {info.walk.map((w, i) => (
                  <li key={w.text} className="flex items-center gap-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold">
                      {i + 1}
                    </span>
                    {w.text}
                  </li>
                ))}
              </ol>
            </Panel>
          )}
        </div>

        {Widget && (
          <div className="lg:sticky lg:top-6">
            <Widget />
          </div>
        )}
      </div>

      {info.warn && (
        <p className="flex items-start gap-2 rounded-xl border border-amber-400/60 bg-amber-500/10 p-3 text-sm">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          {info.warn}
        </p>
      )}

      <CheckBox key={n} check={info.check} />

      {info.links && (
        <div className="flex flex-wrap gap-2">
          {info.links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-2 text-sm hover:bg-secondary"
            >
              {l.label} <ArrowRight className="h-3 w-3" />
            </Link>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        {prev ? (
          <Link to={`/journey/${prev.n}`} className="text-sm text-muted-foreground hover:text-foreground">
            ← Step {prev.n}
          </Link>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={finish}
          className="inline-flex items-center gap-1 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          {next ? `Mark done, go to step ${next.n}` : "Finish the journey"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {info.n >= 7 && (
        <p className="text-xs text-muted-foreground">
          General education, not personal investment advice. If you are under 18, ask a parent or guardian before
          taking any real step. Investments can lose money.
        </p>
      )}
    </motion.div>
  );
}