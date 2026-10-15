interface Reason {
  text: string;
  helps: boolean;
}

export default function WhyThisScore({ reasons }: { reasons: Reason[] }) {
  if (!reasons || reasons.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-base font-semibold mb-1">Why this score?</h3>
      <p className="text-xs text-muted-foreground mb-3">
        These are the main factors the model weighed. They describe past patterns, not guarantees.
      </p>
      <ul className="space-y-2">
        {reasons.map((r, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className={r.helps ? "text-emerald-500" : "text-red-500"}>
              {r.helps ? "▲" : "▼"}
            </span>
            <span>{r.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}