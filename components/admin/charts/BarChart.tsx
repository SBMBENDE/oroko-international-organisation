interface BarChartProps {
  data: { label: string; count: number }[];
  color?: string;
  valueFormatter?: (n: number) => string;
}

/** Minimal dependency-free bar chart — avoids pulling in a charting library for simple admin visualizations. */
export function BarChart({ data, color = "var(--oroko-gold)", valueFormatter }: BarChartProps) {
  const max = Math.max(1, ...data.map((d) => d.count));

  if (data.every((d) => d.count === 0)) {
    return <p className="text-sm text-muted-foreground py-8 text-center">No data yet.</p>;
  }

  return (
    <div className="flex items-end gap-2 h-40">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1.5 min-w-0 group">
          <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            {valueFormatter ? valueFormatter(d.count) : d.count}
          </span>
          <div className="w-full flex items-end h-full">
            <div
              className="w-full rounded-t-sm transition-all"
              style={{
                height: `${Math.max(2, (d.count / max) * 100)}%`,
                backgroundColor: color,
              }}
              title={`${d.label}: ${valueFormatter ? valueFormatter(d.count) : d.count}`}
            />
          </div>
          <span className="text-[10px] text-muted-foreground truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
