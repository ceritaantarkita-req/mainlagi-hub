"use client";

import { useMemo, useState } from "react";
import type { RankedItem } from "@/lib/admin/metrics";

export function RankedBars({
  title,
  subtitle,
  items,
  color = "var(--brand)",
  emptyMessage
}: {
  title: string;
  subtitle?: string;
  items: RankedItem[];
  color?: string;
  emptyMessage: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = useMemo(() => Math.max(1, ...items.map((i) => i.value)), [items]);

  return (
    <div className="admin-chart-card">
      <div className="admin-chart-card__head">
        <h3>{title}</h3>
        {subtitle && <span>{subtitle}</span>}
      </div>
      {items.length === 0 ? (
        <div className="admin-chart-empty">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <ul className="ranked-bars">
          {items.map((item, i) => (
            <li
              key={`${item.label}-${i}`}
              className="ranked-bar"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover((v) => (v === i ? null : v))}
            >
              <div className="ranked-bar__row">
                <span className="ranked-bar__label">{item.label}</span>
                <strong className="ranked-bar__value">{item.value}</strong>
              </div>
              <div className="ranked-bar__track">
                <div
                  className="ranked-bar__fill"
                  style={{
                    width: `${Math.max(4, (item.value / max) * 100)}%`,
                    background: color,
                    opacity: hover === null || hover === i ? 1 : 0.55
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
