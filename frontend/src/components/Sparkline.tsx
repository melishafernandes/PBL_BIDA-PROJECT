export default function Sparkline({
  values,
  up,
  className = "w-28 h-8",
}: {
  values: number[];
  up: boolean;
  className?: string;
}) {
  if (values.length < 2) return <div className={className} />;

  const w = 100;
  const h = 32;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={className}>
      <polyline
        points={points}
        fill="none"
        stroke={up ? "#10b981" : "#ef4444"}
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}