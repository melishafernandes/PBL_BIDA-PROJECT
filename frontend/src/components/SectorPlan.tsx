import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { Check } from "lucide-react";
import { getSectorRankings } from "@/lib/api";
import { getSectorInfo, PLATFORMS } from "@/lib/sectorGuide";
import { useSimpleMode, SIGNAL_LABEL, RISK_LABEL } from "@/components/SimpleMode";

const STORAGE_KEY = "investiq_plan_done";

const SIGNAL_PILL: Record<string, string> = {
  Strong: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  Moderate: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  Neutral: "bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300",
};

interface PlanStep {
  id: string;
  title: string;
  simple: string;
  items: { id: string; text: string }[];
}

function buildSteps(sector: string): PlanStep[] {
  return [
    {
      id: "a",
      title: `Understand ${sector}`,
      simple: `Learn what ${sector} companies do and what can go wrong.`,
      items: [
        { id: "a1", text: `I can say in one sentence what ${sector} companies do.` },
        { id: "a2", text: `I know two things that move ${sector} and two risks (see the cards above).` },
        { id: "a3", text: "I understand that a Strong signal is a pattern, not a promise." },
      ],
    },
    {
      id: "b",
      title: "Check your basics first",
      simple: "Make sure you are ready before any money goes in.",
      items: [
        { id: "b1", text: "I have no high-interest debt, such as credit card dues." },
        { id: "b2", text: "I have a small emergency fund set aside." },
        { id: "b3", text: "This money is not needed for daily or college expenses." },
      ],
    },
    {
      id: "c",
      title: `Decide how to invest in ${sector}`,
      simple: "Choose between spreading your money out or focusing on one sector.",
      items: [
        { id: "c1", text: "I compared the three ways to invest shown below." },
        {
          id: "c2",
          text: `I decided how much, if any, to put in one sector. It is an amount I could lose without hurting my plans.`,
        },
      ],
    },
    {
      id: "d",
      title: "Choose a platform and verify it",
      simple: "Pick a place to invest and check it is real and registered.",
      items: [
        { id: "d1", text: "I checked the platform's registration on SEBI's website." },
        { id: "d2", text: "I read the fees: account charges, brokerage and the fund's yearly fee." },
        { id: "d3", text: "If I am under 18, my parent or guardian will open and operate the account." },
      ],
    },
    {
      id: "e",
      title: "Start small and stay steady",
      simple: "Begin with a little, write down your reason, and check in now and then.",
      items: [
        { id: "e1", text: "I will start with a small amount, or a small monthly SIP." },
        {
          id: "e2",
          text: `I wrote down why I chose ${sector} and what would change my mind.`,
        },
        { id: "e3", text: "I will review every few months, not every day." },
      ],
    },
  ];
}

function buildWays(sector: string) {
  return [
    {
      title: "Broad market index fund",
      level: "Spreads risk the most",
      badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
      text: `Holds many companies across many sectors, so ${sector} is only one part. It is the simplest way to start, and many beginner guides begin here.`,
    },
    {
      title: `${sector} sector fund or ETF`,
      level: "More concentrated",
      badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
      text: `Holds companies from ${sector} only, so you feel more of its ups and downs. Whether one exists for ${sector} varies, so check what it holds and its yearly fee (the expense ratio).`,
    },
    {
      title: `Individual ${sector} stocks`,
      level: "Highest risk and effort",
      badge: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
      text: "You pick companies yourself, like the names listed above. One company can fall even when the whole sector does well. You need a demat account and time to research.",
    },
  ];
}

export default function SectorPlan() {
  const { simple } = useSimpleMode();
  const mode = simple ? "simple" : "normal";
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["sectorRankings"],
    queryFn: getSectorRankings,
  });
  const rankings: any[] = data?.rankings ?? [];

  const [done, setDone] = useState<Record<string, string[]>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
    } catch {
      // storage unavailable, ignore
    }
  }, [done]);

  const wanted = (searchParams.get("sector") ?? "").toLowerCase();
  const selected: any =
    rankings.find((r) => r.sector.toLowerCase() === wanted) ?? rankings[0];
  const selKey: string = selected ? selected.sector.toLowerCase() : "";

  const pick = (name: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("sector", name);
    setSearchParams(next, { replace: true });
  };

  const toggle = (id: string) =>
    setDone((d) => {
      const current = d[selKey] ?? [];
      const updated = current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id];
      return { ...d, [selKey]: updated };
    });

  if (isLoading) {
    return <div className="h-48 rounded-2xl bg-muted animate-pulse" />;
  }
  if (isError || !selected) {
    return (
      <p className="text-sm text-red-500">
        Couldn't load the sectors right now. Please try again in a moment.
      </p>
    );
  }

  const name: string = selected.sector;
  const info = getSectorInfo(name);
  const steps = buildSteps(name);
  const ways = buildWays(name);
  const mine = done[selKey] ?? [];
  const allIds = steps.flatMap((s) => s.items.map((i) => i.id));
  const completed = allIds.filter((id) => mine.includes(id)).length;
  const percent = Math.round((completed / allIds.length) * 100);
  const companies: string[] = selected.companies ?? [];

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">1. Pick a sector you are curious about</h2>
        <div className="flex flex-wrap gap-2">
          {rankings.map((r) => {
            const active = r.sector === name;
            return (
              <button
                key={r.sector}
                type="button"
                onClick={() => pick(r.sector)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:bg-secondary"
                }`}
              >
                {r.sector}
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl p-6 text-white shadow-lg bg-[linear-gradient(135deg,#0d9488_0%,#4f46e5_100%)] space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-2xl font-bold">{name}</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs">
              Rank #{selected.rank} · Score {selected.score}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                SIGNAL_PILL[selected.signal] ?? SIGNAL_PILL.Neutral
              }`}
            >
              {SIGNAL_LABEL[mode][selected.signal as "Strong" | "Moderate" | "Neutral"]}
            </span>
            {selected.risk && (
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs">
                {RISK_LABEL[mode][selected.risk as "Low" | "Medium" | "High"]}
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-white/90">{info.about}</p>
        {companies.length > 0 && (
          <p className="text-xs text-white/80">
            Well-known companies (for reference, not recommendations): {companies.join(", ")}
          </p>
        )}
        <p className="text-xs text-white/80">
          The score is a pattern signal, not a promise. It ranks sectors, not funds or individual
          companies.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-2">What moves {name}</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            {info.drivers.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-2">What can go wrong</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            {info.risks.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">2. Your step-by-step plan for {name}</h2>
          <p className="text-xs text-muted-foreground">
            Tick each box as you go. Your progress is saved on this device.{" "}
            <Link to="/steps?tab=ready" className="text-primary underline">
              Need the basics first?
            </Link>
          </p>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>
                {completed} of {allIds.length} done
              </span>
              <span>{percent}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>

        {steps.map((step, index) => {
          const stepDone = step.items.every((i) => mine.includes(i.id));
          return (
            <div key={step.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start gap-3">
                <span
                  className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-sm font-semibold ${
                    stepDone
                      ? "bg-emerald-500 text-white"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {stepDone ? <Check className="w-4 h-4" /> : index + 1}
                </span>
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  {simple && <p className="text-sm text-primary mt-0.5">{step.simple}</p>}
                </div>
              </div>
              <div className="mt-3 space-y-1">
                {step.items.map((item) => {
                  const checked = mine.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="checkbox"
                      aria-checked={checked}
                      onClick={() => toggle(item.id)}
                      className="w-full flex items-start gap-3 rounded-lg px-3 py-2 text-left hover:bg-secondary/70 transition-colors"
                    >
                      <span
                        className={`mt-0.5 w-5 h-5 shrink-0 rounded border flex items-center justify-center ${
                          checked
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-border bg-background"
                        }`}
                      >
                        {checked && <Check className="w-3.5 h-3.5" />}
                      </span>
                      <span
                        className={`text-sm ${
                          checked ? "text-muted-foreground line-through" : ""
                        }`}
                      >
                        {item.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">3. Three ways to invest in a sector</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {ways.map((w) => (
            <div key={w.title} className="rounded-2xl border border-border bg-card p-5 space-y-2">
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${w.badge}`}>
                {w.level}
              </span>
              <h3 className="font-semibold text-sm">{w.title}</h3>
              <p className="text-sm text-muted-foreground">{w.text}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground">
          Putting all your money in one sector is riskier than spreading it out. InvestIQ scores
          sectors only. It does not rate any fund or company.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">4. Where can you invest?</h2>
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4 text-sm">
          <div>
            <p className="font-medium mb-1">Three common routes</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Mutual fund apps or websites, for SIPs in funds.</li>
              <li>Stockbroker apps, for shares and ETFs. These need a demat account.</li>
              <li>A fund house's own website, for investing directly in its funds.</li>
            </ul>
          </div>

          <div>
            <p className="font-medium mb-1">Names that often appear in beginner guides</p>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <span key={p} className="rounded-full border border-border px-3 py-1 text-xs">
                  {p}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              This is not a ranking or a recommendation. Features and fees change, so check each
              one yourself.
            </p>
          </div>

          <div>
            <p className="font-medium mb-1">How to check a platform is genuine</p>
            <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
              <li>
                Open{" "}
                <a
                  href="https://www.sebi.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline"
                >
                  sebi.gov.in
                </a>
                .
              </li>
              <li>Go to Intermediaries / Market Infrastructure Institutions, then Recognised Intermediaries.</li>
              <li>Search the company's registered name. Stock brokers show a registration number starting with INZ.</li>
              <li>Stay away from anyone promising guaranteed or very high returns.</li>
              <li>
                Read the fees before you sign up. Mutual funds often come as "direct" plans (lower
                yearly fee, you choose yourself) and "regular" plans (sold through a distributor,
                higher yearly fee).
              </li>
            </ol>
            <p className="text-[11px] text-muted-foreground mt-2">
              More beginner material:{" "}
              <a
                href="https://investor.sebi.gov.in"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline"
              >
                investor.sebi.gov.in
              </a>
            </p>
          </div>
        </div>
      </section>

      <p className="text-xs text-muted-foreground">
        This is general education, not personal investment advice, and InvestIQ is not a financial
        adviser. If you are under 18, ask a parent or guardian before taking any real step.
        Investments can lose money.
      </p>
    </div>
  );
}