// A stronger, more saturated blue than the site accent so the little charts stay readable on the cards.
const BLUE = "#1d93f5";
const GLOW = "#46b4ff";
const RING_TRACK = "#2a3e67";

/** Tiny bar sparkline for a stat card, drawn from real per-month values. */
export function MiniBars({ values }: { values: number[] }) {
  const width = 104;
  const height = 40;
  const max = Math.max(...values, 1);
  const count = values.length;
  const slot = width / count;
  const barWidth = Math.max(3, Math.min(9, slot * 0.6));

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" className="shrink-0">
      {values.map((value, i) => {
        const barHeight = Math.max(2, (value / max) * (height - 2));
        const latest = i === count - 1;
        return (
          <rect
            key={i}
            x={i * slot + (slot - barWidth) / 2}
            y={height - barHeight}
            width={barWidth}
            height={barHeight}
            rx={1.5}
            fill={latest ? GLOW : BLUE}
            fillOpacity={latest ? 1 : 0.28 + 0.62 * (i / Math.max(1, count - 1))}
          />
        );
      })}
    </svg>
  );
}

/** Tiny line sparkline; renders nothing when there is no movement to show. */
export function MiniLine({ values }: { values: number[] }) {
  if (new Set(values).size < 2) return null;
  const width = 104;
  const height = 40;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const step = width / (values.length - 1);
  const points = values.map((value, i) => `${(i * step).toFixed(1)},${(height - 4 - ((value - min) / (max - min)) * (height - 8)).toFixed(1)}`);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" className="shrink-0">
      <polyline points={points.join(" ")} fill="none" stroke={BLUE} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={width} cy={Number(points[points.length - 1].split(",")[1])} r={3} fill={GLOW} />
    </svg>
  );
}

/** Small progress ring, used for the drafts share of all posts. */
export function ProgressRing({ value }: { value: number }) {
  const size = 44;
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = Math.min(1, Math.max(0, value)) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={RING_TRACK} strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={BLUE}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circumference - filled}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}
