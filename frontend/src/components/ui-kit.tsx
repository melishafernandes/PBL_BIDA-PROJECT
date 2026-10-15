// NEW FILE: frontend/src/components/ui-kit.tsx
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Coins,
  Layers,
  LineChart,
  Store,
  LayoutGrid,
  CloudSun,
  Trophy,
  Search,
  Scale,
  Route,
  Backpack,
  Rocket,
  Sprout,
} from "lucide-react";

/** One icon per journey step (replaces the emoji tiles). */
export const STEP_ICONS: Record<number, LucideIcon> = {
  1: Coins,
  2: Layers,
  3: LineChart,
  4: Store,
  5: LayoutGrid,
  6: CloudSun,
  7: Trophy,
  8: Search,
  9: Scale,
  10: Route,
  11: Backpack,
  12: Rocket,
  13: Sprout,
};

export function PageHeader(props: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  left?: ReactNode;
}) {
  return (
    <header className="rounded-2xl border border-border border-t-4 border-t-primary bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {props.left}
          <div>
            {props.eyebrow && (
              <p className="text-xs font-medium text-muted-foreground">{props.eyebrow}</p>
            )}
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{props.title}</h1>
            {props.subtitle && (
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">{props.subtitle}</p>
            )}
          </div>
        </div>
        {props.actions}
      </div>
    </header>
  );
}

export function Panel(props: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-border bg-card p-5 ${props.className ?? ""}`}>
      {(props.title || props.action) && (
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            {props.title && <h2 className="text-sm font-semibold">{props.title}</h2>}
            {props.subtitle && <p className="text-xs text-muted-foreground">{props.subtitle}</p>}
          </div>
          {props.action}
        </div>
      )}
      {props.children}
    </section>
  );
}

export function Stat(props: { label: string; icon: LucideIcon; children: ReactNode }) {
  const Icon = props.icon;
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between text-muted-foreground">
        <p className="text-xs font-medium">{props.label}</p>
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-2 text-2xl font-bold tracking-tight">{props.children}</div>
    </div>
  );
}

export function Ring({ percent, size = 72 }: { percent: number; size?: number }) {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={8} className="stroke-muted" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - percent / 100)}
          className="stroke-primary transition-all duration-700"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
        {percent}%
      </span>
    </div>
  );
}