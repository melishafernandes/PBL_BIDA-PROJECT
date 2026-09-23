import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getRegime, getSectorRankings } from "@/lib/api";
import RegimeStrip from "@/components/RegimeStrip";
import SectorRankCard from "@/components/SectorRankCard";

export default function Dashboard() {
  const regimeQuery = useQuery({ queryKey: ["regime"], queryFn: getRegime });
  const rankingsQuery = useQuery({ queryKey: ["sectorRankings"], queryFn: getSectorRankings });

  const rankings = rankingsQuery.data?.rankings ?? [];
  const incomeNote = rankingsQuery.data?.income_note;
  const hasHighlights = rankings.some((r: any) => r.highlighted);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Sector Outlook</h1>
            <p className="text-sm text-muted-foreground">
              Macro-driven sector rankings, updated from live market data (refreshed weekly).
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/profile" className="text-sm text-primary underline whitespace-nowrap">
              Edit Profile
            </Link>
            <Link to="/glossary" className="text-sm text-primary underline whitespace-nowrap">
              How this works
            </Link>
          </div>
        </div>

        {regimeQuery.isLoading && (
          <div className="h-20 rounded-xl bg-muted animate-pulse flex items-center justify-center">
            <p className="text-xs text-muted-foreground">Reading current market conditions...</p>
          </div>
        )}
        {regimeQuery.isError && (
          <p className="text-sm text-red-500">Couldn't load market regime data.</p>
        )}
        {regimeQuery.data && <RegimeStrip data={regimeQuery.data} />}

        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Strong = favorable pattern
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Moderate = mildly favorable
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Neutral = no clear pattern
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

        <div className="space-y-3">
          {rankingsQuery.isLoading && (
            <>
              <p className="text-xs text-muted-foreground text-center">
                Fetching live market data and scoring each sector — this can take a moment...
              </p>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
              ))}
            </>
          )}

          {rankingsQuery.isError && (
            <p className="text-sm text-red-500">Couldn't load sector rankings.</p>
          )}

          {rankings.map((sector: any, i: number) => (
            <SectorRankCard key={sector.sector} data={sector} index={i} />
          ))}
        </div>

        <div className="text-center">
          <Link to="/backtest" className="text-sm text-primary underline">
            View Historical Backtest →
          </Link>
        </div>

        <p className="text-xs text-muted-foreground text-center pt-4">
          Past performance does not guarantee future results. Informational only, not personalized financial advice.
        </p>
      </div>
    </div>
  );
}