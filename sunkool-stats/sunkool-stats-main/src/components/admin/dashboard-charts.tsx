"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import type { MonthPoint } from "@/lib/blog/analytics";

const ELECTRIC = "#58a7e8";
const GLOW = "#7dd3ff";
const DEEP = "#2f6ea8";
const AXIS_TEXT = "#8a93a0";

const MARGIN = { top: 14, right: 12, bottom: 30, left: 42 };
const numberFormat = new Intl.NumberFormat("en-IN");
const compactFormat = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

function useChartSize(desktopHeight = 310) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(560);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.max(260, Math.round(entry.contentRect.width)));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, width, height: width < 440 ? 250 : desktopHeight };
}

/** Picks a tidy axis maximum and step so gridlines land on round numbers. */
function niceScale(max: number, integer: boolean) {
  if (max <= 0) return { top: 4, step: 1 };
  let step = (max * 1.05) / 4;
  const exponent = 10 ** Math.floor(Math.log10(step));
  const fraction = step / exponent;
  step = (fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10) * exponent;
  if (integer) step = Math.max(1, Math.ceil(step));
  return { top: Math.ceil((max * 1.02) / step) * step, step };
}

/** Monotone cubic curve so the line never dips below or overshoots its data. */
function monotonePath(points: { x: number; y: number }[]) {
  const n = points.length;
  if (n === 0) return "";
  if (n === 1) return `M${points[0].x},${points[0].y}`;

  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = points[i + 1].x - points[i].x;
    slope[i] = (points[i + 1].y - points[i].y) / dx[i];
  }
  const tangent: number[] = new Array(n);
  tangent[0] = slope[0];
  tangent[n - 1] = slope[n - 2];
  for (let i = 1; i < n - 1; i++) {
    tangent[i] = slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2;
  }
  for (let i = 0; i < n - 1; i++) {
    if (slope[i] === 0) {
      tangent[i] = 0;
      tangent[i + 1] = 0;
      continue;
    }
    const a = tangent[i] / slope[i];
    const b = tangent[i + 1] / slope[i];
    const s = a * a + b * b;
    if (s > 9) {
      const k = 3 / Math.sqrt(s);
      tangent[i] = k * a * slope[i];
      tangent[i + 1] = k * b * slope[i];
    }
  }

  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i];
    d += ` C${points[i].x + h / 3},${points[i].y + (tangent[i] * h) / 3} ${points[i + 1].x - h / 3},${points[i + 1].y - (tangent[i + 1] * h) / 3} ${points[i + 1].x},${points[i + 1].y}`;
  }
  return d;
}

/** A bar with rounded top corners only. */
function barPath(x: number, y: number, width: number, height: number) {
  if (height <= 0) return "";
  const r = Math.min(5, width / 2, height);
  return `M${x},${y + height} V${y + r} Q${x},${y} ${x + r},${y} H${x + width - r} Q${x + width},${y} ${x + width},${y + r} V${y + height} Z`;
}

function ChartTooltip({ left, width, children }: { left: number; width: number; children: ReactNode }) {
  const tooltipWidth = 168;
  // Sit beside the hovered month (on whichever side has room) so the tooltip
  // never covers the bar or point being inspected.
  const gap = 34;
  const x = left < width / 2 ? left + gap : left - tooltipWidth - gap;
  return (
    <div
      className="pointer-events-none absolute top-2 z-10 rounded-xl border border-white/10 bg-carbon-3/95 px-3 py-2.5 text-xs shadow-2xl backdrop-blur"
      style={{ left: Math.min(Math.max(x, 4), width - tooltipWidth - 4), width: tooltipWidth }}
    >
      {children}
    </div>
  );
}

function TooltipRow({ color, label, value }: { color?: string; label: string; value: string }) {
  return (
    <div className="mt-1 flex items-center justify-between gap-3">
      <span className="flex items-center gap-1.5 text-fog">
        {color && <span className="h-2 w-2 rounded-sm" style={{ background: color }} />}
        {label}
      </span>
      <span className="font-medium text-white tabular-nums">{value}</span>
    </div>
  );
}

function Frame({
  series,
  scale,
  chartWidth,
  chartHeight,
  emptyMessage,
  hovered,
  onHover,
  children,
  format,
}: {
  series: MonthPoint[];
  scale: { top: number; step: number };
  chartWidth: number;
  chartHeight: number;
  emptyMessage?: string;
  hovered: number | null;
  onHover: (index: number | null) => void;
  children: (geometry: { band: number; innerW: number; innerH: number; yFor: (value: number) => number }) => ReactNode;
  format: (value: number) => string;
}) {
  const innerW = chartWidth - MARGIN.left - MARGIN.right;
  const innerH = chartHeight - MARGIN.top - MARGIN.bottom;
  const band = innerW / series.length;
  const yFor = (value: number) => MARGIN.top + innerH - (value / scale.top) * innerH;
  const ticks: number[] = [];
  for (let value = 0; value <= scale.top + 0.0001; value += scale.step) ticks.push(value);
  const labelEvery = Math.ceil(54 / band);

  return (
    <svg width={chartWidth} height={chartHeight} className="block overflow-visible" aria-hidden="true">
      {ticks.map((tick) => (
        <g key={tick}>
          <line
            x1={MARGIN.left}
            x2={chartWidth - MARGIN.right}
            y1={yFor(tick)}
            y2={yFor(tick)}
            stroke="white"
            strokeOpacity={tick === 0 ? 0.16 : 0.06}
            strokeDasharray={tick === 0 ? undefined : "3 5"}
          />
          <text x={MARGIN.left - 8} y={yFor(tick) + 4} textAnchor="end" fontSize="11" fill={AXIS_TEXT}>
            {format(tick)}
          </text>
        </g>
      ))}

      {series.map((point, i) => (
        <g key={point.key}>
          {hovered === i && (
            <rect x={MARGIN.left + band * i + 2} y={MARGIN.top} width={band - 4} height={innerH} rx={8} fill={ELECTRIC} fillOpacity={0.07} />
          )}
          {(series.length - 1 - i) % labelEvery === 0 && (
            <text
              x={MARGIN.left + band * (i + 0.5)}
              y={chartHeight - 9}
              textAnchor="middle"
              fontSize="11"
              fill={hovered === i ? "white" : AXIS_TEXT}
            >
              {point.label}
            </text>
          )}
        </g>
      ))}

      {children({ band, innerW, innerH, yFor })}

      {emptyMessage && (
        <text x={MARGIN.left + innerW / 2} y={MARGIN.top + innerH / 2} textAnchor="middle" fontSize="13" fill={AXIS_TEXT}>
          {emptyMessage}
        </text>
      )}

      {series.map((point, i) => (
        <rect
          key={`hit-${point.key}`}
          x={MARGIN.left + band * i}
          y={0}
          width={band}
          height={chartHeight}
          fill="transparent"
          style={{ touchAction: "pan-y" }}
          onPointerEnter={() => onHover(i)}
          onPointerMove={() => onHover(i)}
          onPointerDown={() => onHover(i)}
          onPointerLeave={(event) => {
            if (event.pointerType === "mouse") onHover(null);
          }}
        />
      ))}
    </svg>
  );
}

function DataTable({ caption, series, columns }: { caption: string; series: MonthPoint[]; columns: { header: string; value: (point: MonthPoint) => number }[] }) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">Month</th>
          {columns.map((column) => (
            <th key={column.header} scope="col">{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {series.map((point) => (
          <tr key={point.key}>
            <th scope="row">{point.fullLabel}</th>
            {columns.map((column) => (
              <td key={column.header}>{column.value(point)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function PostGrowthChart({ series }: { series: MonthPoint[] }) {
  const id = useId().replace(/:/g, "");
  const { ref, width, height } = useChartSize();
  const [hovered, setHovered] = useState<number | null>(null);
  const maxTotal = Math.max(0, ...series.map((point) => point.total));
  const scale = niceScale(maxTotal, true);
  const band = (width - MARGIN.left - MARGIN.right) / series.length;
  const point = hovered !== null ? series[hovered] : null;

  return (
    <div ref={ref} className="relative w-full">
      <Frame
        series={series}
        scale={scale}
        chartWidth={width}
        chartHeight={height}
        emptyMessage={maxTotal === 0 ? "No posts yet" : undefined}
        hovered={hovered}
        onHover={setHovered}
        format={(value) => String(value)}
      >
        {({ band: bandWidth, innerH, yFor }) => {
          const barWidth = Math.max(6, Math.min(22, bandWidth * 0.3));
          const gap = Math.max(3, Math.min(6, bandWidth * 0.06));
          return (
            <>
              <defs>
                <linearGradient id={`${id}-total`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={DEEP} stopOpacity={0.95} />
                  <stop offset="100%" stopColor={DEEP} stopOpacity={0.35} />
                </linearGradient>
                <linearGradient id={`${id}-published`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={GLOW} />
                  <stop offset="100%" stopColor={ELECTRIC} stopOpacity={0.75} />
                </linearGradient>
              </defs>
              {series.map((item, i) => {
                const center = MARGIN.left + bandWidth * (i + 0.5);
                const totalHeight = MARGIN.top + innerH - yFor(item.total);
                const publishedHeight = MARGIN.top + innerH - yFor(item.published);
                const dim = hovered !== null && hovered !== i;
                const showLabel = bandWidth >= 34 && item.total > 0;
                return (
                  <g key={item.key} opacity={dim ? 0.55 : 1} style={{ transition: "opacity 150ms" }}>
                    <path d={barPath(center - gap / 2 - barWidth, yFor(item.total), barWidth, totalHeight)} fill={`url(#${id}-total)`} />
                    <path d={barPath(center + gap / 2, yFor(item.published), barWidth, publishedHeight)} fill={`url(#${id}-published)`} />
                    {showLabel && (
                      <text x={center} y={yFor(Math.max(item.total, item.published)) - 7} textAnchor="middle" fontSize="11" fontWeight={600} fill="#d6ebff">
                        {item.total}
                      </text>
                    )}
                  </g>
                );
              })}
            </>
          );
        }}
      </Frame>

      {point && (
        <ChartTooltip left={MARGIN.left + band * ((hovered ?? 0) + 0.5)} width={width}>
          <p className="font-medium text-white">{point.fullLabel}</p>
          <TooltipRow color={DEEP} label="Total posts" value={String(point.total)} />
          <TooltipRow color={ELECTRIC} label="Published" value={String(point.published)} />
          <TooltipRow label="New this month" value={`+${point.added}`} />
        </ChartTooltip>
      )}

      <DataTable
        caption="Post growth by month"
        series={series}
        columns={[
          { header: "Total posts", value: (item) => item.total },
          { header: "Published posts", value: (item) => item.published },
        ]}
      />
    </div>
  );
}

export function ViewsTrendChart({ series }: { series: MonthPoint[] }) {
  const id = useId().replace(/:/g, "");
  const { ref, width, height } = useChartSize(340);
  const [hovered, setHovered] = useState<number | null>(null);
  // Like the reference, the latest month stays highlighted until you hover another.
  const active = hovered ?? series.length - 1;
  const maxViews = Math.max(0, ...series.map((point) => point.views));
  const hasPosts = series.some((point) => point.total > 0);
  const scale = niceScale(maxViews, true);
  const band = (width - MARGIN.left - MARGIN.right) / series.length;
  // The pinned latest-month tooltip would cover the curve on narrow phones, so it only shows there on hover.
  const point = maxViews > 0 && (hovered !== null || width >= 520) ? series[active] : null;

  return (
    <div ref={ref} className="relative w-full">
      <Frame
        series={series}
        scale={scale}
        chartWidth={width}
        chartHeight={height}
        emptyMessage={maxViews === 0 ? (hasPosts ? "No views recorded yet" : "No posts yet") : undefined}
        hovered={hovered}
        onHover={setHovered}
        format={(value) => compactFormat.format(value)}
      >
        {({ band: bandWidth, innerH, yFor }) => {
          const points = series.map((item, i) => ({ x: MARGIN.left + bandWidth * (i + 0.5), y: yFor(item.views) }));
          const line = monotonePath(points);
          const baseline = MARGIN.top + innerH;
          const area = points.length > 1 ? `${line} L${points[points.length - 1].x},${baseline} L${points[0].x},${baseline} Z` : "";
          return (
            <>
              <defs>
                <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ELECTRIC} stopOpacity={0.42} />
                  <stop offset="100%" stopColor={ELECTRIC} stopOpacity={0} />
                </linearGradient>
              </defs>
              {area && <path d={area} fill={`url(#${id}-area)`} />}
              <path
                d={line}
                fill="none"
                stroke={ELECTRIC}
                strokeWidth={2.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: "drop-shadow(0 4px 8px rgba(88,167,232,0.35))" }}
              />
              {hovered !== null && (
                <line x1={points[hovered].x} x2={points[hovered].x} y1={MARGIN.top} y2={baseline} stroke={ELECTRIC} strokeOpacity={0.4} strokeDasharray="3 4" />
              )}
              {points.map((p, i) => (
                <circle
                  key={series[i].key}
                  cx={p.x}
                  cy={p.y}
                  r={active === i ? 6 : 4}
                  fill={active === i ? GLOW : "var(--color-carbon-2)"}
                  stroke={active === i ? "white" : ELECTRIC}
                  strokeWidth={2}
                  style={{ transition: "r 120ms", filter: active === i ? "drop-shadow(0 0 8px rgba(125,211,255,0.9))" : undefined }}
                />
              ))}
            </>
          );
        }}
      </Frame>

      {point && (
        <ChartTooltip left={MARGIN.left + band * (active + 0.5)} width={width}>
          <p className="font-medium text-white">{point.fullLabel}</p>
          <TooltipRow color={ELECTRIC} label="Views" value={numberFormat.format(point.views)} />
        </ChartTooltip>
      )}

      <DataTable caption="Views by publish month" series={series} columns={[{ header: "Views", value: (item) => item.views }]} />
    </div>
  );
}
