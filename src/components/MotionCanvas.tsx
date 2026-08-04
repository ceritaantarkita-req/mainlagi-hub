"use client";

import { useMemo, useRef, useState } from "react";
import type { Point, PlayerId } from "@/engine/types";

interface MotionCanvasProps {
  player: PlayerId;
  label: string;
  accent: "blue" | "pink";
  points: Point[];
  target?: Point[];
  message: string;
  digits: number[];
  expectedDigits: number;
  inputEnabled: boolean;
  onPointerPath: (player: PlayerId, points: Point[]) => void;
  onClear: (player: PlayerId) => void;
}

function polyline(points: readonly Point[]): string {
  return points.map((point) => `${point.x * 1000},${point.y * 700}`).join(" ");
}

export function MotionCanvas({
  player,
  label,
  accent,
  points,
  target,
  message,
  digits,
  expectedDigits,
  inputEnabled,
  onPointerPath,
  onClear
}: MotionCanvasProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [pointerPoints, setPointerPoints] = useState<Point[]>([]);
  const displayedPoints = pointerPoints.length > 0 ? pointerPoints : points;
  const slots = useMemo(
    () => Array.from({ length: expectedDigits }, (_, index) => digits[index] ?? null),
    [digits, expectedDigits]
  );

  const pointFromEvent = (clientX: number, clientY: number): Point | null => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)),
      t: performance.now()
    };
  };

  return (
    <section className={`motion-panel motion-panel--${accent}`} aria-label={`Area ${label}`}>
      <header className="motion-panel__header">
        <div>
          <span className="player-chip">{player === "A" ? "🧒" : "👩"}</span>
          <strong>{label}</strong>
        </div>
        <div className="answer-slots" aria-label="Digit jawaban">
          {slots.map((digit, index) => (
            <span key={index} className={digit === null ? "answer-slot" : "answer-slot is-filled"}>
              {digit ?? "?"}
            </span>
          ))}
        </div>
      </header>

      <svg
        ref={svgRef}
        className="motion-drawing"
        viewBox="0 0 1000 700"
        preserveAspectRatio="none"
        onPointerDown={(event: React.PointerEvent<SVGSVGElement>) => {
          if (!inputEnabled) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          const point = pointFromEvent(event.clientX, event.clientY);
          if (point) setPointerPoints([point]);
        }}
        onPointerMove={(event: React.PointerEvent<SVGSVGElement>) => {
          if (!inputEnabled || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
          const point = pointFromEvent(event.clientX, event.clientY);
          if (point) setPointerPoints((current) => [...current.slice(-239), point]);
        }}
        onPointerUp={(event: React.PointerEvent<SVGSVGElement>) => {
          if (!inputEnabled) return;
          event.currentTarget.releasePointerCapture(event.pointerId);
          if (pointerPoints.length >= 4) onPointerPath(player, pointerPoints);
          setPointerPoints([]);
        }}
      >
        {target && (
          <polyline className="target-path" points={polyline(target)} vectorEffect="non-scaling-stroke" />
        )}
        {displayedPoints.length > 1 && (
          <polyline className="finger-path" points={polyline(displayedPoints)} vectorEffect="non-scaling-stroke" />
        )}
      </svg>

      <footer className="motion-panel__footer">
        <span>{message}</span>
        <button type="button" className="tiny-button" onClick={() => onClear(player)}>
          Hapus
        </button>
      </footer>
    </section>
  );
}
