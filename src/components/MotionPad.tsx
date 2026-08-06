/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { appendPoint, beginStroke, emptyGlyph, endStroke, submitGlyph, usableStrokes } from "@/lib/engine/stroke";
import type { GlyphInput, PlayerId, Point, Stroke } from "@/lib/engine/types";
import type { TrackedHand } from "@/lib/vision/types";

interface MotionPadProps {
  player: PlayerId;
  playerCount: 1 | 2;
  hand?: TrackedHand;
  enabled: boolean;
  target?: readonly Point[];
  label?: string;
  hint?: string;
  onSubmit(strokes: Stroke[]): void;
}

function pointsAttribute(points: readonly Point[]) { return points.map((point) => `${point.x*1000},${point.y*650}`).join(" "); }

export function MotionPad({ player, playerCount, hand, enabled, target, label = `Player ${player}`, hint = "Pinch untuk menulis · telapak terbuka untuk submit", onSubmit }: MotionPadProps) {
  const [glyph, setGlyph] = useState<GlyphInput>(emptyGlyph);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pointerRef = useRef<number | null>(null);
  const cameraDrawingRef = useRef(false);
  const openStartedRef = useRef<number | null>(null);
  const fistStartedRef = useRef<number | null>(null);
  const lastSubmitRef = useRef(0);
  const liveGlyphRef = useRef(glyph);
  useEffect(() => { liveGlyphRef.current = glyph; }, [glyph]);

  const clear = () => { const fresh = emptyGlyph(); liveGlyphRef.current = fresh; setGlyph(fresh); cameraDrawingRef.current = false; openStartedRef.current = null; fistStartedRef.current = null; };
  const submit = () => { const strokes = usableStrokes(liveGlyphRef.current); if (!enabled || !strokes.length) return; const now = performance.now(); if (now - lastSubmitRef.current < 500) return; lastSubmitRef.current = now; liveGlyphRef.current = submitGlyph(liveGlyphRef.current, now); onSubmit(strokes); clear(); };

  useEffect(() => {
    if (!enabled || !hand) { cameraDrawingRef.current = false; return; }
    const now = performance.now();
    const localX = playerCount === 1 ? hand.point.x : player === "A" ? hand.point.x / .5 : (hand.point.x - .5) / .5;
    const point = { x: Math.max(0, Math.min(1, localX)), y: Math.max(0, Math.min(1, hand.point.y)), t: now };
    if (hand.gesture === "pinch") {
      openStartedRef.current = null; fistStartedRef.current = null;
      if (!cameraDrawingRef.current) { cameraDrawingRef.current = true; setGlyph((current) => { const next = beginStroke(current, point, now); liveGlyphRef.current = next; return next; }); }
      else setGlyph((current) => { const next = appendPoint(current, point, now); liveGlyphRef.current = next; return next; });
    } else if (cameraDrawingRef.current) {
      cameraDrawingRef.current = false; setGlyph((current) => { const next = endStroke(current, now); liveGlyphRef.current = next; return next; });
    }
    if (hand.gesture === "open") { openStartedRef.current ??= now; if (now - (openStartedRef.current ?? now) > 650) { openStartedRef.current = now + 1200; submit(); } } else openStartedRef.current = null;
    if (hand.gesture === "fist") { fistStartedRef.current ??= now; if (now - (fistStartedRef.current ?? now) > 650) { fistStartedRef.current = now + 1200; clear(); } } else fistStartedRef.current = null;
  }, [enabled, hand, player, playerCount]);

  const eventPoint = (clientX: number, clientY: number): Point | null => { const rect = svgRef.current?.getBoundingClientRect(); if (!rect?.width || !rect.height) return null; return { x: Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)), y: Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)), t: performance.now() }; };
  const rendered = useMemo(() => glyph.strokes.filter((stroke) => stroke.points.length).map((stroke) => ({ ...stroke, points: stroke.points })), [glyph.strokes]);

  return <section className="motion-pad" style={{ "--player": player === "A" ? "#4AA7FF" : "#FF65AD" } as React.CSSProperties}>
    <header><div><span>{player}</span><strong>{label}</strong></div><em>{hand ? `${hand.gesture} · ${Math.round(hand.confidence*100)}%` : "mouse / touch"}</em></header>
    <svg ref={svgRef} viewBox="0 0 1000 650" preserveAspectRatio="none" className="motion-pad__canvas"
      onPointerDown={(event) => { if (!enabled || pointerRef.current !== null) return; const point = eventPoint(event.clientX,event.clientY); if (!point) return; event.currentTarget.setPointerCapture(event.pointerId); pointerRef.current = event.pointerId; const now = performance.now(); setGlyph((current) => { const next = beginStroke(current, point, now); liveGlyphRef.current = next; return next; }); }}
      onPointerMove={(event) => { if (!enabled || pointerRef.current !== event.pointerId) return; const point = eventPoint(event.clientX,event.clientY); if (!point) return; const now = performance.now(); setGlyph((current) => { const next = appendPoint(current, point, now); liveGlyphRef.current = next; return next; }); }}
      onPointerUp={(event) => { if (pointerRef.current !== event.pointerId) return; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); pointerRef.current = null; const now = performance.now(); setGlyph((current) => { const next = endStroke(current, now); liveGlyphRef.current = next; return next; }); }}
      onPointerCancel={(event) => { if (pointerRef.current === event.pointerId) pointerRef.current = null; }}>
      {target?.length ? <polyline className="motion-target" points={pointsAttribute(target)} vectorEffect="non-scaling-stroke" /> : null}
      {rendered.map((stroke) => <polyline key={stroke.id} className="motion-ink" points={pointsAttribute(stroke.points)} vectorEffect="non-scaling-stroke" />)}
    </svg>
    <footer><span>{hint}</span><div><button type="button" onClick={clear}>Hapus</button><button type="button" className="submit" onClick={submit}>Kirim</button></div></footer>
  </section>;
}
