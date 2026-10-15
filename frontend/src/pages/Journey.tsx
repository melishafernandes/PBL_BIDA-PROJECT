// REPLACE: frontend/src/pages/Journey.tsx
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { PageHeader, Panel, Ring, STEP_ICONS } from "@/components/ui-kit";
import { PHASES, STEPS, plantStage, useJourneyProgress } from "@/lib/journey";

export default function Journey() {
  const reduce = useReducedMotion();
  const { done, reset } = useJourneyProgress();
  const percent = Math.round((done.length / STEPS.length) * 100);
  const stage = plantStage(percent);
  const next = STEPS.find((s) => !done.includes(s.n));

  return (
    <motion.div
      className="space-y-6"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <PageHeader
        eyebrow="Beginner journey"
        title="Learn investing in 13 steps"
        subtitle={`${done.length} of ${STEPS.length} steps done. ${stage.label}`}
        left={<Ring percent={percent} />}
        actions={
          next ? (
            <Link
              to={`/journey/${next.n}`}
              className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              {done.length === 0 ? "Start step 1" : `Continue with step ${next.n}`}
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className="rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold">
              All steps complete
            </span>
          )
        }
      />

      {PHASES.map((phase) => {
        const steps = STEPS.filter((s) => s.phase === phase.id);
        return (
          <Panel key={phase.id} title={`Phase ${phase.id}: ${phase.title}`} subtitle={phase.sub}>
            <ol className="relative list-none">
              {steps.map((s, i) => {
                const isDone = done.includes(s.n);
                const isNext = next?.n === s.n;
                const Icon = STEP_ICONS[s.n];
                const last = i === steps.length - 1;
                return (
                  <li key={s.n} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          isDone
                            ? "bg-primary text-primary-foreground"
                            : isNext
                            ? "border-2 border-primary text-primary"
                            : "border border-border text-muted-foreground"
                        }`}
                      >
                        {isDone ? <Check className="h-4 w-4" /> : s.n}
                      </span>
                      {!last && <span className={`w-px flex-1 ${isDone ? "bg-primary" : "bg-border"}`} />}
                    </div>

                    <Link
                      to={`/journey/${s.n}`}
                      className={`group mb-2 flex flex-1 items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-secondary ${
                        isNext ? "bg-secondary" : ""
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-foreground" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold leading-tight">{s.title}</span>
                        <span className="block truncate text-xs text-muted-foreground">{s.question}</span>
                      </span>
                      {isNext && (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
                          Next
                        </span>
                      )}
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </li>
                );
              })}
            </ol>
          </Panel>
        );
      })}

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <p>For learning only. InvestIQ does not give personal investment advice.</p>
        {done.length > 0 && (
          <button type="button" onClick={reset} className="underline">
            Restart journey
          </button>
        )}
      </div>
    </motion.div>
  );
}