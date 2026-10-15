import { motion } from "framer-motion";

export default function Confetti() {
  const pieces = ["🎉", "✨", "🌟", "🎊"];
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2" aria-hidden="true">
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl"
          initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
          animate={{
            opacity: 0,
            x: (i - 7.5) * 22,
            y: -90 - (i % 4) * 25,
            scale: 1.2,
            rotate: (i % 2 === 0 ? 1 : -1) * 120,
          }}
          transition={{ duration: 1.6, delay: i * 0.05, ease: "easeOut" }}
        >
          {pieces[i % pieces.length]}
        </motion.span>
      ))}
    </div>
  );
}