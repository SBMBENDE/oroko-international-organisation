interface LineChartProps {
  data: { label: string; count: number }[];
  color?: string;
}

/** Minimal dependency-free line chart built with SVG polylines. */
export function LineChart({ data, color = "var(--oroko-green)" }: LineChartProps) {
  if (data.every((d) => d.count === 0)) {
    return <p className="text-sm text-muted-foreground py-8 text-center">No data yet.</p>;
  }

  const width = 100;
  const height = 100;
  const max = Math.max(1, ...data.map((d) => d.count));
  const stepX = data.length > 1 ? width / (data.length - 1) : 0;

  const points = data
    .map((d, i) => `${i * stepX},${height - (d.count / max) * (height - 10)}`)
    .join(" ");

  return (
    <div className="space-y-2">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-32">
        <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        {data.map((d, i) => (
          <circle key={d.label} cx={i * stepX} cy={height - (d.count / max) * (height - 10)} r="1.5" fill={color} />
        ))}
      </svg>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        {data.map((d) => (
          <span key={d.label} className="flex-1 text-center truncate">{d.label}</span>
        ))}
      </div>
    </div>
  );
}
