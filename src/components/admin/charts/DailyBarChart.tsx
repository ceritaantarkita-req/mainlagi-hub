"use client";

import { useMemo, useState } from "react";
import type { DailyPoint } from "@/lib/admin/metrics";

const WIDTH = 600;
const HEIGHT = 160;
const PAD_TOP = 12;
const PAD_BOTTOM = 22;
const BAR_RADIUS = 4;

function roundedTopBarPath(x: number, y: number, w: number, h: number, r: number): string {
  const radius = Math.min(r, w / 2, h);
  if (h <= 0) return "";
  if (radius <= 0) return `M${x},${y + h} L${x},${y} L${x + w},${y} L${x + w},${y + h} Z`;
  return [
    `M${x},${y + h}`,
    `L${x},${y + radius}`,
    `Q${x},${y} ${x + radius},${y}`,
    `L${x + w - radius},${y}`,
    `Q${x + w},${y} ${x + w},${y + radius}`,
    `L${x + w},${y + h}`,
    "Z"
  ].join(" ");
}

export function DailyBarChart({
  title,
  subtitle,
  data,
  color = "var(--brand)",
  emptyMessage
}: {
  title: string;
  subtitle?: string;
  data: DailyPoint[];
  color?: string;
  emptyMessage: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = useMemo(() => Math.max(1, ...data.map((d) => d.value)), [data]);
  const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data]);

  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const n = data.length || 1;
  const slot = WIDTH / n;
  const barWidth = Math.max(6, slot * 0.56);

  const labelEvery = data.length > 10 ? 3 : data.length > 6 ? 2 : 1;

  return (
    <div className="admin-chart-card">
      <div className="admin-chart-card__head">
        <h3>{title}</h3>
        {subtitle && <span>{subtitle}</span>}
      </div>
      {total === 0 ? (
        <div className="admin-chart-empty" style={{ height: HEIGHT }}>
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="admin-chart-svg-wrap">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            preserveAspectRatio="none"
            role="img"
            aria-label={`${title}: ${total} total dalam ${data.length} hari terakhir`}
          >
            <line
              x1={0}
              y1={HEIGHT - PAD_BOTTOM}
              x2={WIDTH}
              y2={HEIGHT - PAD_BOTTOM}
              stroke="var(--line)"
              strokeWidth={1}
            />
            {data.map((d, i) => {
              const h = (d.value / max) * plotHeight;
              const x = i * slot + (slot - barWidth) / 2;
              const y = HEIGHT - PAD_BOTTOM - h;
              const showLabel = i % labelEvery === 0 || i === data.length - 1;
              return (
                <g key={d.key}>
                  {/* Wider invisible hit target so a thin bar is still easy to hover/tap. */}
                  <rect
                    x={i * slot}
                    y={0}
                    width={slot}
                    height={HEIGHT - PAD_BOTTOM}
                    fill="transparent"
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover((v) => (v === i ? null : v))}
                  />
                  {d.value > 0 && (
                    <path
                      d={roundedTopBarPath(x, y, barWidth, h, BAR_RADIUS)}
                      fill={color}
                      opacity={hover === null || hover === i ? 1 : 0.45}
                    />
                  )}
                  {showLabel && (
                    <text
                      x={i * slot + slot / 2}
                      y={HEIGHT - 6}
                      textAnchor="middle"
                      fontSize="10"
                      fill="var(--muted)"
                    >
                      {d.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          {hover !== null && (
            <div
              className="chart-tooltip"
              style={{ left: `${((hover + 0.5) / n) * 100}%` }}
            >
              <strong>{data[hover].value}</strong>
              <span>{data[hover].label}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
