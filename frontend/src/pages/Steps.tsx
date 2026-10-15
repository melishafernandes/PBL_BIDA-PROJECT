import { useSearchParams } from "react-router-dom";
import FirstSteps from "@/pages/FirstSteps";
import SectorPlan from "@/components/SectorPlan";

export default function Steps() {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") === "plan" ? "plan" : "ready";

  const choose = (t: "ready" | "plan") => {
    const next = new URLSearchParams(params);
    next.set("tab", t);
    setParams(next, { replace: true });
  };

  const tabs: { id: "ready" | "plan"; label: string }[] = [
    { id: "ready", label: "1. Get ready" },
    { id: "plan", label: "2. Act on a sector" },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div role="tablist" className="inline-flex rounded-full border border-border bg-card p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => choose(t.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                tab === t.id
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Part 1 is the same for everyone. Part 2 turns a sector you like into a plan.
        </p>
      </div>

      {tab === "ready" ? <FirstSteps /> : <SectorPlan />}
    </div>
  );
}