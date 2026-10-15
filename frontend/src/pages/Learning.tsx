// NEW FILE: frontend/src/pages/Learning.tsx
import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LabelList,
} from "recharts";
import { Download, GraduationCap, Trash2, TrendingUp, Users, ListChecks, Plus } from "lucide-react";
import { PageHeader, Panel, Ring, Stat } from "@/components/ui-kit";
import { STEPS, loadDone } from "@/lib/journey";

interface Participant {
  id: number;
  name: string;
  pre: number;
  post: number;
  steps: number;
}

const KEY = "investiq_study";
const AXIS = { fontSize: 11, fill: "#64748b" };
const GRID = { strokeDasharray: "3 3", stroke: "#94a3b8", opacity: 0.3 };
const PRE = "#94a3b8";
const POST = "#6366f1";

function useStudy() {
  const [rows, setRows] = useState<Participant[]>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(rows));
    } catch {
      // storage unavailable
    }
  }, [rows]);
  return [rows, setRows] as const;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, Math.round(v) || 0));

const QUIZ: { q: string; options: string[]; answer: string }[] = [
  { q: "Why can money kept idle for many years lose value?", options: ["A. Banks charge a hidden fee", "B. Prices usually rise, so it buys less", "C. Notes wear out"], answer: "B" },
  { q: "What is a share?", options: ["A. A loan to a company", "B. A small part of ownership in a company", "C. A type of bank account"], answer: "B" },
  { q: "Which usually has the biggest ups and downs?", options: ["A. Savings account", "B. Fixed deposit", "C. Stocks"], answer: "C" },
  { q: "What is profit?", options: ["A. All money a company earns", "B. Money earned minus money spent", "C. The price of one share"], answer: "B" },
  { q: "What is a sector?", options: ["A. A group of companies in similar business", "B. One single company", "C. A kind of loan"], answer: "A" },
  { q: "What does diversification mean?", options: ["A. Putting all money in the best stock", "B. Spreading money across many investments", "C. Selling when prices fall"], answer: "B" },
  { q: "What does a SIP do?", options: ["A. Guarantees a profit", "B. Invests a fixed amount at regular intervals", "C. Closes your account"], answer: "B" },
  { q: "Which money is NOT suited for risky investments?", options: ["A. Money you need soon", "B. Spare money", "C. Money not needed for many years"], answer: "A" },
  { q: "What should come before investing?", options: ["A. Borrowing to invest", "B. An emergency fund and clearing costly debt", "C. Skipping identity checks"], answer: "B" },
  { q: "Someone promises guaranteed high returns. What is this?", options: ["A. A great opportunity", "B. A common scam warning sign", "C. Normal for stocks"], answer: "B" },
];

export default function Learning() {
  const [rows, setRows] = useStudy();
  const [form, setForm] = useState({ name: "", pre: "", post: "", steps: "" });
  const mine = loadDone().length;
  const minePct = Math.round((mine / STEPS.length) * 100);

  const stats = useMemo(() => {
    const n = rows.length;
    if (n === 0) return null;
    const avgPre = rows.reduce((s, r) => s + r.pre, 0) / n;
    const avgPost = rows.reduce((s, r) => s + r.post, 0) / n;
    const improved = rows.filter((r) => r.post > r.pre).length;
    const gains = rows.filter((r) => r.pre < 10).map((r) => (r.post - r.pre) / (10 - r.pre));
    const normGain = gains.length ? gains.reduce((a, b) => a + b, 0) / gains.length : null;
    const completed = rows.filter((r) => r.steps >= STEPS.length).length;
    return { n, avgPre, avgPost, improved, normGain, completed };
  }, [rows]);

  const funnel = STEPS.map((s) => ({
    step: `Step ${s.n}`,
    reached: rows.filter((r) => r.steps >= s.n).length,
  }));

  const add = () => {
    if (!form.name.trim()) return;
    setRows((r) => [
      ...r,
      {
        id: Date.now(),
        name: form.name.trim(),
        pre: clamp(Number(form.pre), 0, 10),
        post: clamp(Number(form.post), 0, 10),
        steps: clamp(Number(form.steps), 0, STEPS.length),
      },
    ]);
    setForm({ name: "", pre: "", post: "", steps: "" });
  };

  const exportCsv = () => {
    const lines = ["Participant,PreScore,PostScore,Gain,StepsCompleted"].concat(
      rows.map((r) => `"${r.name.replace(/"/g, '""')}",${r.pre},${r.post},${r.post - r.pre},${r.steps}`)
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "investiq_learning_study.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const field = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm";

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Project-based learning"
        title="Learning Analytics"
        subtitle="Did the journey help beginners learn? Record each tester's before-and-after quiz scores and see the results."
        left={<Ring percent={minePct} />}
        actions={
          rows.length > 0 ? (
            <button
              type="button"
              onClick={exportCsv}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              <Download className="h-4 w-4" /> Download CSV
            </button>
          ) : undefined
        }
      />

      <p className="rounded-lg border border-border bg-card p-3 text-xs text-muted-foreground">
        Your own journey progress is {mine} of {STEPS.length} steps (the ring above). Study results below are stored in this
        browser only, so enter them on the one device you will present from, and download the CSV as a backup.
      </p>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Participants" icon={Users}>
          {stats?.n ?? 0}
        </Stat>
        <Stat label="Average gain" icon={TrendingUp}>
          {stats ? `${stats.avgPost - stats.avgPre >= 0 ? "+" : ""}${(stats.avgPost - stats.avgPre).toFixed(1)}` : "–"}
          <span className="ml-1 text-sm font-medium text-muted-foreground">/ 10</span>
        </Stat>
        <Stat label="Improved" icon={GraduationCap}>
          {stats ? `${Math.round((stats.improved / stats.n) * 100)}%` : "–"}
        </Stat>
        <Stat label="Finished all steps" icon={ListChecks}>
          {stats ? `${stats.completed} of ${stats.n}` : "–"}
        </Stat>
      </section>

      <Panel title="Add a participant" subtitle="Scores are out of 10. Use a nickname, not a real name.">
        <div className="grid gap-3 sm:grid-cols-5">
          <input className={`${field} sm:col-span-2`} placeholder="Nickname" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className={field} type="number" min={0} max={10} placeholder="Pre score" value={form.pre} onChange={(e) => setForm({ ...form, pre: e.target.value })} />
          <input className={field} type="number" min={0} max={10} placeholder="Post score" value={form.post} onChange={(e) => setForm({ ...form, post: e.target.value })} />
          <input className={field} type="number" min={0} max={STEPS.length} placeholder="Steps done" value={form.steps} onChange={(e) => setForm({ ...form, steps: e.target.value })} />
        </div>
        <button
          type="button"
          onClick={add}
          className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </Panel>

      {stats ? (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title="Before vs after" subtitle="Quiz score per participant (out of 10).">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={rows} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                  <CartesianGrid {...GRID} vertical={false} />
                  <XAxis dataKey="name" tick={AXIS} />
                  <YAxis domain={[0, 10]} tick={AXIS} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="pre" name="Before" fill={PRE} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="post" name="After" fill={POST} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <p className="mt-2 text-xs text-muted-foreground">
                Average before {stats.avgPre.toFixed(1)}, after {stats.avgPost.toFixed(1)}.
                {stats.normGain !== null && ` Average normalised gain ${(stats.normGain * 100).toFixed(0)}% of the possible improvement.`}
              </p>
            </Panel>

            <Panel title="Completion funnel" subtitle="How many participants reached each step.">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={funnel} layout="vertical" margin={{ left: 4, right: 30 }}>
                  <CartesianGrid {...GRID} horizontal={false} />
                  <XAxis type="number" allowDecimals={false} domain={[0, stats.n]} tick={AXIS} />
                  <YAxis type="category" dataKey="step" width={55} tick={AXIS} interval={0} />
                  <Tooltip />
                  <Bar dataKey="reached" name="Reached" fill={POST} radius={[0, 3, 3, 0]}>
                    <LabelList dataKey="reached" position="right" style={{ fontSize: 11, fill: "#64748b" }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
          </div>

          <Panel title="Participants">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-2 py-2 font-medium">Nickname</th>
                    <th className="px-2 py-2 font-medium">Before</th>
                    <th className="px-2 py-2 font-medium">After</th>
                    <th className="px-2 py-2 font-medium">Gain</th>
                    <th className="px-2 py-2 font-medium">Steps</th>
                    <th className="px-2 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b border-border/60">
                      <td className="px-2 py-2 font-medium">{r.name}</td>
                      <td className="px-2 py-2">{r.pre}</td>
                      <td className="px-2 py-2">{r.post}</td>
                      <td className={`px-2 py-2 font-medium ${r.post - r.pre >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                        {r.post - r.pre >= 0 ? "+" : ""}
                        {r.post - r.pre}
                      </td>
                      <td className="px-2 py-2">{r.steps}/{STEPS.length}</td>
                      <td className="px-2 py-2 text-right">
                        <button
                          type="button"
                          aria-label={`Remove ${r.name}`}
                          onClick={() => setRows((all) => all.filter((x) => x.id !== r.id))}
                          className="text-muted-foreground hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              With a small group these results are indicative, not statistically conclusive. Say so when you present.
            </p>
          </Panel>
        </>
      ) : (
        <Panel>
          <p className="text-sm text-muted-foreground">
            No participants yet. Run the quiz below with each tester before and after they use the journey, then add their
            scores above. Charts appear as soon as you add the first person.
          </p>
        </Panel>
      )}

      <Panel title="Study kit: the 10-question quiz" subtitle="Give the same quiz before and after the journey. Score 1 point per correct answer.">
        <ol className="list-decimal space-y-3 pl-5 text-sm">
          {QUIZ.map((q) => (
            <li key={q.q}>
              <p className="font-medium">{q.q}</p>
              <ul className="mt-1 list-none space-y-0.5 text-muted-foreground">
                {q.options.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <details className="mt-4 rounded-lg border border-border px-3 py-2 text-sm">
          <summary className="cursor-pointer font-medium">Answer key (hide from testers)</summary>
          <p className="mt-2 text-muted-foreground">{QUIZ.map((q, i) => `${i + 1}${q.answer}`).join("  ·  ")}</p>
        </details>
      </Panel>
    </div>
  );
}