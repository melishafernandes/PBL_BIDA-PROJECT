import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { getRegime, getSectorRankings } from "@/lib/api";
import RegimeStrip from "@/components/RegimeStrip";
import SectorRankCard from "@/components/SectorRankCard";
import ReadAloud from "@/components/ReadAloud";
import { useSimpleMode } from "@/components/SimpleMode";

const SIMPLE_TEXT =
  "Imagine the stock market is a big school. Each sector is a class, like the Auto class, the Pharma class and the Banking class. We look at how each class did in the past, and what the economy is like today, to see which classes look good. A higher number means better signs. But even the best class can have a bad day, so this is for learning and not for telling you what to buy. Always ask a parent or guardian before using real money.";

const NORMAL_TEXT =
  "The score, from zero to one hundred, shows how favorable the model's historical patterns look for a sector right now. It is not a forecast, and not the chance of making money. The signal groups the score into strong, moderate or neutral. Volatility shows how much a sector's price has swung recently compared with the others. Patterns can change, so use this to learn and research, not as a buy or sell instruction.";

export default function Dashboard() {
  const { simple } = useSimpleMode();
  const reduce = useReducedMotion();
  const regimeQuery = useQuery({ queryKey: ["regime"], queryFn: getRegime });
  const rankingsQuery = useQuery({ queryKey: ["sectorRankings"], queryFn: getSectorRankings });

  const rankings = rankingsQuery.data?.rankings ?? [];
  const incomeNote = rankingsQuery.data?.income_note;
  const hasHighlights = rankings.some((r: any) => r.highlighted);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl p-6 text-white shadow-lg bg-[linear-gradient(135deg,#7c3aed_0%,#db2777_100%)]">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
          Step 7 of 13 · Which sectors look interesting?
        </p>
        <h1 className="mt-1 text-2xl font-extrabold">Sector Outlook 🔭</h1>
        <p className="mt-1 text-sm text-white/90">
          {simple
            ? "Tap a row to learn more. This is for learning, not for telling you what to buy."
            : "Macro-driven sector rankings, updated from live market data (refreshed weekly)."}
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <Link to="/journey/6" className="rounded-full bg-white/15 px-4 py-2 font-medium hover:bg-white/25">
            ← Step 6: Understand the sectors
          </Link>
          <Link to="/journey/8" className="rounded-full bg-white px-4 py-2 font-medium text-pink-700 hover:bg-pink-50">
            Step 8: Study companies →
          </Link>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">
          🌦️ {simple ? "How is the economy feeling?" : "The market mood"}
        </h2>
        {regimeQuery.isLoading && (
          <div className="h-20 rounded-xl bg-muted animate-pulse flex items-center justify-center">
            <p className="text-xs text-muted-foreground">Reading current market conditions...</p>
          </div>
        )}
        {regimeQuery.isError && (
          <p className="text-sm text-red-500">Couldn't load market regime data.</p>
        )}
        {regimeQuery.data && <RegimeStrip data={regimeQuery.data} />}
      </section>

      <section id="sectors" className="space-y-3 scroll-mt-6">
        <h2 className="text-lg font-bold">
          {simple ? "🏫 Which sectors look good?" : "📊 Sector ranking"}
        </h2>

        {simple ? (
          <div className="rounded-xl border border-border bg-secondary/50 px-5 py-4 text-sm space-y-3">
            <p className="font-medium">How to read this, the easy way 🎒</p>
            <p className="text-muted-foreground">{SIMPLE_TEXT}</p>
            <ReadAloud text={SIMPLE_TEXT} />
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-secondary/50 px-5 py-4 text-sm space-y-3">
            <details>
              <summary className="cursor-pointer font-medium">
                How to read this: score, signal and volatility
              </summary>
              <ul className="mt-3 space-y-2 text-muted-foreground list-disc pl-5">
                <li>
                  <span className="font-medium text-foreground">Score (0–100):</span> how
                  favorable the model's historical patterns look for a sector right now. It is not
                  a forecast of returns, and not the chance that you will make money.
                </li>
                <li>
                  <span className="font-medium text-foreground">Signal:</span> a simple grouping
                  of the score. Strong means a favorable pattern, Moderate mildly favorable,
                  Neutral no clear pattern.
                </li>
                <li>
                  <span className="font-medium text-foreground">Volatility:</span> how much a
                  sector's price has swung recently compared with the others. Higher means a
                  bumpier ride, not necessarily a worse one.
                </li>
                <li>
                  The model learns from past data, and patterns can change. Use this to learn and
                  research, not as a buy or sell instruction.
                </li>
              </ul>
            </details>
            <ReadAloud text={NORMAL_TEXT} />
          </div>
        )}

        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="rounded-full px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
            🌟 {simple ? "Looking good = good signs" : "Strong = favorable pattern"}
          </span>
          <span className="rounded-full px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
            🙂 {simple ? "Looking okay = some good signs" : "Moderate = mildly favorable"}
          </span>
          <span className="rounded-full px-3 py-1 bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300">
            😐 {simple ? "Nothing special yet = no clear signs" : "Neutral = no clear pattern"}
          </span>
        </div>

        {incomeNote && (
          <p className="text-xs text-muted-foreground bg-muted rounded-lg px-4 py-3">
            {incomeNote}
          </p>
        )}

        {hasHighlights && (
          <p className="text-sm font-medium">
            ✦ Sectors matching your stated interest are highlighted below.
          </p>
        )}

        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <motion.span
            aria-hidden="true"
            animate={reduce ? undefined : { y: [0, -4, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            👆
          </motion.span>
          Tap any sector to explore it
        </p>

        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          {rankingsQuery.isLoading && (
            <div className="p-4 space-y-3">
              <p className="text-xs text-muted-foreground text-center">
                Fetching live market data and scoring each sector — this can take a moment...
              </p>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          )}

          {rankingsQuery.isError && (
            <p className="text-sm text-red-500 p-4">Couldn't load sector rankings.</p>
          )}

          {rankings.map((sector: any, i: number) => (
            <SectorRankCard key={sector.sector} data={sector} index={i} />
          ))}

          {rankings.length > 0 && (
            <p className="text-[11px] text-muted-foreground px-5 py-3">
              Score and signal come from the model. The small line shows the sector index (or an
              average of its major companies when the index isn't available), daily closes over
              the last 30 days. Companies are major names in each sector, for reference only, not
              recommendations.
            </p>
          )}
        </div>
      </section>

      <p className="text-xs text-muted-foreground text-center pt-2">
        Past performance does not guarantee future results. Informational only, not personalized
        financial advice.
        {simple ? " Ask a parent or guardian before using real money." : ""}
      </p>
    </div>
  );
}