import { motion, useReducedMotion } from "framer-motion";

export default function Mascot({ className = "w-24 h-24" }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      aria-hidden="true"
      animate={reduce ? undefined : { y: [0, -6, 0] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 120 130" className="w-full h-full">
        <ellipse cx="60" cy="80" rx="36" ry="40" fill="#fbbf24" />
        <ellipse cx="60" cy="97" rx="22" ry="23" fill="#fef3c7" />
        <ellipse cx="25" cy="84" rx="10" ry="24" fill="#f59e0b" transform="rotate(10 25 84)" />
        <ellipse cx="95" cy="84" rx="10" ry="24" fill="#f59e0b" transform="rotate(-10 95 84)" />

        <circle cx="46" cy="66" r="13" fill="#ffffff" />
        <circle cx="74" cy="66" r="13" fill="#ffffff" />
        <circle cx="48" cy="68" r="6" fill="#1e1b4b" />
        <circle cx="72" cy="68" r="6" fill="#1e1b4b" />
        <circle cx="50" cy="65" r="2" fill="#ffffff" />
        <circle cx="74" cy="65" r="2" fill="#ffffff" />

        <motion.circle
          cx="46"
          cy="66"
          r="13"
          fill="#fbbf24"
          initial={{ opacity: 0 }}
          animate={reduce ? undefined : { opacity: [0, 0, 1, 0, 0] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.93, 0.96, 1] }}
        />
        <motion.circle
          cx="74"
          cy="66"
          r="13"
          fill="#fbbf24"
          initial={{ opacity: 0 }}
          animate={reduce ? undefined : { opacity: [0, 0, 1, 0, 0] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.93, 0.96, 1] }}
        />

        <circle cx="32" cy="80" r="5" fill="#fb7185" opacity="0.5" />
        <circle cx="88" cy="80" r="5" fill="#fb7185" opacity="0.5" />
        <polygon points="54,76 66,76 60,87" fill="#f97316" />

        <polygon points="60,14 102,29 60,44 18,29" fill="#312e81" />
        <rect x="42" y="38" width="36" height="10" rx="3" fill="#3730a3" />
        <line x1="98" y1="30" x2="98" y2="46" stroke="#fbbf24" strokeWidth="2" />
        <circle cx="98" cy="48" r="3" fill="#fbbf24" />

        <ellipse cx="48" cy="122" rx="9" ry="4" fill="#f97316" />
        <ellipse cx="72" cy="122" rx="9" ry="4" fill="#f97316" />
      </svg>
    </motion.div>
  );
}