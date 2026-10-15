// REPLACE: frontend/src/components/PipelineDiagram.tsx
import { Fragment, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export interface Stage {
  icon: LucideIcon;
  title: string;
  short: string;
  details: string[];
}

export default function PipelineDiagram({ stages }: { stages: Stage[] }) {
  const [active, setActive] = useState(0);
  const Active = stages[active].icon;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-stretch">
        {stages.map((s, i) => {
          const Icon = s.icon;
          const on = active === i;
          return (
            <Fragment key={s.title}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={on}
                className={`flex flex-1 flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-colors ${
                  on ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-secondary"
                }`}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    on ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold leading-tight">{s.title}</span>
                <span className="text-[11px] text-muted-foreground">{s.short}</span>
              </button>
              {i < stages.length - 1 && (
                <>
                  <ChevronRight className="hidden h-4 w-4 shrink-0 self-center text-muted-foreground md:block" />
                  <ChevronDown className="h-4 w-4 self-center text-muted-foreground md:hidden" />
                </>
              )}
            </Fragment>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="rounded-xl border border-border bg-secondary/40 p-4"
        >
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Active className="h-4 w-4" /> {stages[active].title}
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {stages[active].details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}