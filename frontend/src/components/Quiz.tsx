import { useState } from "react";

interface Question {
  q: string;
  options: string[];
  answer: number;
  why: string;
}

const QUESTIONS: Question[] = [
  {
    q: "What is a sector?",
    options: [
      "A single company",
      "A group of companies in a similar kind of business",
      "A type of bank loan",
      "The price of a share",
    ],
    answer: 1,
    why: "Sectors group similar companies together, like Auto, Pharma or Banking.",
  },
  {
    q: "What does a high score in InvestIQ mean?",
    options: [
      "You will definitely make money",
      "The price will go up tomorrow",
      "The model's past patterns look favorable for that sector",
      "You must buy it right now",
    ],
    answer: 2,
    why: "The score shows how favorable past patterns look. It is not a promise or a prediction.",
  },
  {
    q: "What does volatility mean?",
    options: [
      "How big a company is",
      "How much a price bounces up and down",
      "How old a company is",
      "How many people own a share",
    ],
    answer: 1,
    why: "High volatility means a bumpier ride, with bigger ups and downs.",
  },
  {
    q: "Why do people spread money across different sectors?",
    options: [
      "It guarantees higher profit",
      "It is a legal rule",
      "So one bad area does not hurt everything",
      "It makes prices go up",
    ],
    answer: 2,
    why: "Spreading money out is called diversification. It can reduce the damage if one area falls.",
  },
  {
    q: "Which of these does InvestIQ NOT do?",
    options: [
      "Rank sectors",
      "Explain scores in plain words",
      "Predict the exact future price of a stock",
      "Show recent price trend lines",
    ],
    answer: 2,
    why: "InvestIQ is a learning tool. It does not predict exact prices or tell you what to buy.",
  },
  {
    q: "A sector did very well last month. What does that tell you about next month?",
    options: [
      "It will do well again",
      "It will definitely fall",
      "Nothing is guaranteed, it could go either way",
      "It will stay exactly the same",
    ],
    answer: 2,
    why: "Past performance does not guarantee future results.",
  },
];

export default function Quiz() {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUESTIONS[index];

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (index + 1 >= QUESTIONS.length) {
      setDone(true);
    } else {
      setIndex(index + 1);
      setPicked(null);
    }
  };

  const restart = () => {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    const message =
      score >= 5
        ? "Superstar! You understand the basics really well. 🌟"
        : score >= 3
        ? "Nice work! A little more practice and you will be an expert."
        : "Good start! Read the Learn page and try again.";
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center space-y-3">
        <p className="text-4xl font-bold">
          {score} / {QUESTIONS.length}
        </p>
        <p className="text-sm text-muted-foreground">{message}</p>
        <button
          type="button"
          onClick={restart}
          className="rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Question {index + 1} of {QUESTIONS.length}
        </span>
        <span>Score: {score}</span>
      </div>

      <p className="font-semibold">{q.q}</p>

      <div className="space-y-2">
        {q.options.map((opt, i) => {
          let style = "border-border hover:bg-secondary";
          if (picked !== null) {
            if (i === q.answer) {
              style = "border-emerald-500 bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200";
            } else if (i === picked) {
              style = "border-red-400 bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-200";
            } else {
              style = "border-border opacity-60";
            }
          }
          return (
            <button
              key={opt}
              type="button"
              onClick={() => choose(i)}
              disabled={picked !== null}
              className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-colors ${style}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="space-y-3">
          <p className="text-sm">
            <span className="font-medium">{picked === q.answer ? "Correct! " : "Not quite. "}</span>
            <span className="text-muted-foreground">{q.why}</span>
          </p>
          <button
            type="button"
            onClick={next}
            className="rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {index + 1 >= QUESTIONS.length ? "See my score" : "Next question"}
          </button>
        </div>
      )}
    </div>
  );
}