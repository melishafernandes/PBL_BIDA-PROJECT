import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Sparkline from "@/components/Sparkline";
import { useSimpleMode, SIGNAL_LABEL, RISK_LABEL } from "@/components/SimpleMode";
import { sectorEmoji } from "@/lib/sectorEmoji";

interface SectorRanking {
  sector: string;
  score: number;
  probability: number;
  signal: "Strong" | "Moderate" | "Neutral";
  rank: number;
  highlighted?: boolean;
  match_reason?: string | null;
  companies?: string[];
  sparkline?: number[];
  risk?: "Low" | "Medium" | "High" | null;
}

const SIGNAL_EMOJI = { Strong: "🌟", Moderate: "🙂", Neutral: "😐" } as const;

const SIGNAL_STYLES: Record<string, { edge: string; pill: string; bar: string }> = {
  Strong: {
    edge: "border-l-emerald-500",
    pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    bar: "bg-emerald-500",
  },
  Moderate: {
    edge: "border-l-amber-500",
    pill: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    bar: "bg-amber-500",
  },
  Neutral: {
    edge: "border-l-slate-300 dark:border-l-slate-600",
    pill: "bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300",
    bar: "bg-slate-400",
  },
};

export default function SectorRankCard({ data, index }: { data: SectorRanking; index: number }) {
  const navigate = useNavigate();
  const { simple } = useSimpleMode();
  const mode = simple ? "simple" : "normal";
  const style = SIGNAL_STYLES[data.signal] ?? SIGNAL_STYLES.Neutral;

  const spark = data.sparkline ?? [];
  const trendUp = spark.length > 1 ? spark[spark.length - 1] >= spark[0] : true;
  const companies = data.companies?.join(", ");
  const label = SIGNAL_LABEL[mode][data.signal];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      onClick={() => navigate(`/sectors/${encodeURIComponent(data.sector)}`)}
      className={`group flex items-center gap-3 px-4 py-3 border-b border-border border-l-4 cursor-pointer transition-colors ${style.edge} ${
        data.highlighted ? "bg-primary/5" : "hover:bg-secondary/60"
      }`}
    >
      <span
        aria-hidden="true"
        className="w-11 h-11 shrink-0 rounded-xl bg-secondary flex items-center justify-center text-2xl transition-transform group-hover:scale-110 group-hover:-rotate-6"
      >
        {sectorEmoji(data.sector)}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold truncate">
          <span className="text-xs text-muted-foreground mr-1.5">#{data.rank}</span>
          {data.sector}
        </p>
        {companies && <p className="text-xs text-muted-foreground truncate">{companies}</p>}
        {data.risk && (
          <span
            title="Compared with the other sectors, based on how much its price has swung recently. Higher is bumpier, not necessarily worse."
            className="inline-block mt-1 text-[11px] text-muted-foreground border border-border rounded-full px-2 py-0.5"
          >
            {RISK_LABEL[mode][data.risk]}
          </span>
        )}
        {data.highlighted && data.match_reason && (
          <p className="text-xs text-primary mt-0.5">✦ {data.match_reason}</p>
        )}
      </div>

      <Sparkline values={spark} up={trendUp} className="w-24 h-8 hidden sm:block" />

      <div className="w-36 shrink-0 text-right">
        <p className="text-lg font-bold leading-none">{data.score}</p>
        <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${style.bar}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(0, Math.min(100, data.score))}%` }}
            transition={{ duration: 0.8, delay: index * 0.04 + 0.2, ease: "easeOut" }}
          />
        </div>
        <span
          className={`inline-block mt-1.5 whitespace-nowrap text-[11px] font-medium rounded-full px-2 py-0.5 ${style.pill}`}
        >
          {simple ? label : `${SIGNAL_EMOJI[data.signal]} ${label}`}
        </span>
      </div>

      <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
    </motion.div>
  );
}