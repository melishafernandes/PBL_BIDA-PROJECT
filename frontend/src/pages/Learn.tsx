import { Link } from "react-router-dom";

const STEPS = [
  {
    title: "Check the market mood",
    text: "At the top of the Dashboard, the regime box summarizes whether economic growth, inflation and interest rates are rising, falling or steady.",
  },
  {
    title: "See which sectors rank highest",
    text: "A sector is a group of similar companies, like banks or car makers. We rank sectors by how favorable the model's past patterns look right now.",
  },
  {
    title: "Tap a sector to see why",
    text: "Open any sector to see the main factors behind its score, so you understand the reasoning and not just the number.",
  },
];

const CONCEPTS = [
  {
    term: "Sector",
    text: "A group of companies in the same kind of business, such as Auto, Pharma or Banking.",
  },
  {
    term: "Score (0–100)",
    text: "How favorable the model's historical patterns look for a sector right now. Higher means more favorable. It is not a prediction of returns and not the chance of making money.",
  },
  {
    term: "Signal",
    text: "A simple label for the score. Strong means a favorable pattern, Moderate mildly favorable, Neutral no clear pattern.",
  },
  {
    term: "Volatility",
    text: "How much a sector's price has bounced up and down recently, compared with the others. High volatility means a bumpier ride, not necessarily a worse one.",
  },
  {
    term: "Regime",
    text: "A quick summary of the economy's current conditions, based on growth, inflation and interest rates.",
  },
];

const FAQ = [
  {
    q: "Does a high score mean I should buy?",
    a: "No. A high score means the model's past patterns look favorable for that sector. It does not account for your goals, your finances or surprises in the news. Treat it as a starting point for learning and research.",
  },
  {
    q: "Why do the numbers change?",
    a: "The data is refreshed regularly, so scores and rankings can move as conditions change.",
  },
  {
    q: "Can I lose money investing?",
    a: "Yes. All investing involves risk, and you can lose some or all of what you put in. Past patterns do not guarantee future results.",
  },
  {
    q: "Where does the data come from?",
    a: "Public economic data and market prices. The model learns patterns from the past, and patterns can change.",
  },
];

export default function Learn() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Learn the Basics</h1>
        <p className="text-sm text-muted-foreground">
          New to investing? Start here. No jargon, just the essentials.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">How to use InvestIQ in 3 steps</h2>
        <div className="space-y-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="flex gap-4 rounded-xl border border-border bg-card p-4">
              <div className="w-8 h-8 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                {i + 1}
              </div>
              <div>
                <p className="font-medium text-sm">{s.title}</p>
                <p className="text-sm text-muted-foreground">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Words you will see</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {CONCEPTS.map((c) => (
            <div key={c.term} className="rounded-xl border border-border bg-card p-4">
              <p className="font-medium text-sm">{c.term}</p>
              <p className="text-sm text-muted-foreground">{c.text}</p>
            </div>
          ))}
        </div>
        <p className="text-sm">
          Want more terms?{" "}
          <Link to="/glossary" className="text-primary underline">
            Open the full glossary
          </Link>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">What InvestIQ does not do</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          <li>It does not predict the price of any stock.</li>
          <li>It does not tell you what to buy or sell.</li>
          <li>It does not know your full financial situation.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Before you invest</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          <li>Only invest money you can leave untouched for a long time.</li>
          <li>Many beginners build an emergency fund first.</li>
          <li>Spreading money across different sectors can reduce risk.</li>
          <li>If you are unsure, talk to a SEBI-registered investment adviser.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Common questions</h2>
        <div className="space-y-2">
          {FAQ.map((f) => (
            <details key={f.q} className="rounded-xl border border-border bg-card px-4 py-3 text-sm">
              <summary className="cursor-pointer font-medium">{f.q}</summary>
              <p className="mt-2 text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="text-center">
        <Link to="/dashboard" className="text-sm text-primary underline">
          Go to the Dashboard →
        </Link>
      </div>
    </div>
  );
}