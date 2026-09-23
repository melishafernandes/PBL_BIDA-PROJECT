import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface SectorRanking {
  sector: string;
  score: number;
  probability: number;
  signal: "Strong" | "Moderate" | "Neutral";
  rank: number;
  highlighted?: boolean;
  match_reason?: string | null;
}

const SIGNAL_STYLES: Record<string, { bar: string; badge: string }> = {
  Strong: { bar: "bg-emerald-500", badge: "bg-emerald-500/15 text-emerald-500" },
  Moderate: { bar: "bg-amber-500", badge: "bg-amber-500/15 text-amber-500" },
  Neutral: { bar: "bg-slate-400", badge: "bg-slate-400/15 text-slate-400" },
};

export default function SectorRankCard({ data, index }: { data: SectorRanking; index: number }) {
  const navigate = useNavigate();
  const style = SIGNAL_STYLES[data.signal] ?? SIGNAL_STYLES.Neutral;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={() => navigate(`/sectors/${encodeURIComponent(data.sector)}`)}
      className={`rounded-xl border p-4 cursor-pointer transition-colors ${
        data.highlighted
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:border-primary/50"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-5">#{data.rank}</span>
          <span className="font-medium">{data.sector}</span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${style.badge}`}>
          {data.signal}
        </span>
      </div>

            <div className="flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${data.score}%` }}
            transition={{ duration: 0.6, delay: index * 0.05 + 0.15, ease: "easeOut" }}
            className={`h-full rounded-full ${style.bar}`}
          />
        </div>
        <span className="text-sm font-semibold w-10 text-right">{data.score}</span>
      </div>

      {data.highlighted && data.match_reason && (
        <p className="text-xs text-primary mt-2">✦ {data.match_reason}</p>
      )}
    </motion.div>
  );
}