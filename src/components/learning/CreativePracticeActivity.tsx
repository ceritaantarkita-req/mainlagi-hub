"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import {
  completeActivity,
  getActivity,
  getStage,
  getSubject,
  readProgress,
  type LearningActivity,
  type LearningProgress
} from "@/lib/learning/system";
import styles from "./LearningPlatform.module.css";

const PALETTE = ["#f59e0b", "#ec6aa5", "#6c7df7", "#1ec9a6", "#ef4444", "#22c55e", "#38bdf8", "#a855f7"];

function useActivityProgress(childId: string) {
  const [progress, setProgress] = useState<LearningProgress>({ completedActivityIds: [], stars: 0, lastActivityId: null });
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setProgress(readProgress(childId)));
    return () => window.cancelAnimationFrame(frame);
  }, [childId]);
  return [progress, setProgress] as const;
}

function DrawingCanvas({ childId, activity, onDone }: { childId: string; activity: LearningActivity; onDone: (value: LearningProgress) => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const [hasStroke, setHasStroke] = useState(false);
  const [done, setDone] = useState(false);

  const point = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (event.currentTarget.width / rect.width),
      y: (event.clientY - rect.top) * (event.currentTarget.height / rect.height)
    };
  };
  const start = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const ctx = event.currentTarget.getContext("2d");
    if (!ctx) return;
    const p = point(event);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    drawingRef.current = true;
    setHasStroke(true);
  };
  const move = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const ctx = event.currentTarget.getContext("2d");
    if (!ctx) return;
    const p = point(event);
    ctx.lineWidth = 16;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#5368d8";
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  };
  const end = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    drawingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const reset = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    setHasStroke(false);
    setDone(false);
  };
  const finish = () => {
    if (!hasStroke) return;
    onDone(completeActivity(childId, activity.id));
    setDone(true);
  };

  return (
    <>
      <h2 className={styles.activityPrompt}>{activity.creativePrompt ?? activity.title}</h2>
      <div className={styles.infoBanner} style={{ textAlign: "center", marginBottom: 12 }}>
        <strong>Contoh panduan:</strong> <span style={{ fontSize: 32 }}>{activity.drawingGuide ?? "✏️"}</span><br />
        <small>Ini latihan kreatif. Mainlagi mencatat completion, bukan menilai bagus-jelek atau akurasi gambar.</small>
      </div>
      <div className={styles.traceWrap}>
        <div style={{ position: "relative", width: "min(100%, 420px)" }}>
          <div aria-hidden style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "#e5e8f4", fontSize: 150, fontWeight: 800, pointerEvents: "none", lineHeight: 1 }}>{activity.drawingGuide}</div>
          <canvas
            ref={canvasRef}
            width={720}
            height={720}
            className={styles.traceCanvas}
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerCancel={end}
            aria-label="Kanvas menggambar"
          />
        </div>
        <div className={styles.heroActionRow}>
          <button type="button" className={styles.secondaryButton} onClick={reset}>Ulangi</button>
          <button type="button" className={styles.primaryButton} onClick={finish} disabled={!hasStroke}>Selesai</button>
        </div>
      </div>
      {done ? <div className={styles.feedbackGood}>Karya selesai ⭐ Completion tersimpan sebagai practice, bukan mastery accuracy.</div> : null}
    </>
  );
}

function ColoringRegions({ childId, activity, onDone }: { childId: string; activity: LearningActivity; onDone: (value: LearningProgress) => void }) {
  const regions = activity.coloringRegions?.length ? activity.coloringRegions : [activity.coloringCharacter ?? activity.emoji];
  const [color, setColor] = useState(PALETTE[0]);
  const [fills, setFills] = useState<Record<number, string>>({});
  const coloredCount = Object.keys(fills).length;
  const finish = () => onDone(completeActivity(childId, activity.id));

  return (
    <>
      <h2 className={styles.activityPrompt}>{activity.creativePrompt ?? activity.title}</h2>
      <div className={styles.infoBanner} style={{ textAlign: "center", marginBottom: 12 }}>
        <strong>{activity.coloringCharacter ?? activity.emoji}</strong><br />
        <small>Pilih warna lalu sentuh bagian-bagian gambar. Tidak ada warna yang dianggap salah.</small>
      </div>
      <div className={styles.choiceGrid} style={{ gridTemplateColumns: "repeat(2, minmax(110px, 1fr))" }}>
        {regions.map((region, index) => (
          <button
            type="button"
            key={`${region}-${index}`}
            className={styles.bigChoice}
            onClick={() => setFills((current) => ({ ...current, [index]: color }))}
            style={{ background: fills[index] ?? "#f4f8fb", minHeight: 108, fontSize: 34 }}
            aria-label={`Warnai bagian ${index + 1}`}
          >
            {region}
          </button>
        ))}
      </div>
      <div className={styles.palette} aria-label="Palet warna">
        {PALETTE.map((item) => (
          <button
            type="button"
            key={item}
            className={styles.colorDot}
            onClick={() => setColor(item)}
            style={{ background: item, outline: color === item ? "3px solid #173a5e" : "none" }}
            aria-label={`Pilih warna ${item}`}
          />
        ))}
      </div>
      <div style={{ textAlign: "center" }}>
        <button type="button" className={styles.primaryButton} onClick={finish} disabled={coloredCount === 0}>Selesai · +{activity.stars} ⭐</button>
      </div>
    </>
  );
}

export function CreativePracticeActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const [progress, setProgress] = useActivityProgress(childId);
  if (!activity || (activity.runtime !== "drawing" && activity.runtime !== "coloring")) {
    return <main className={styles.contentNarrow}><div className={styles.emptyState}>Aktivitas kreatif tidak ditemukan.</div></main>;
  }
  const subject = getSubject(activity.subjectId);
  const stage = getStage(activity.stageId);
  if (!subject || !stage) return <main className={styles.contentNarrow}><div className={styles.emptyState}>Struktur aktivitas tidak ditemukan.</div></main>;
  const done = progress.completedActivityIds.includes(activity.id);

  return (
    <main className={styles.contentNarrow}>
      <section className={styles.activityViewport}>
        <div className={styles.activityTopbar}>
          <Link className={styles.backButton} href={`/child/${childId}/stage/${stage.id}`} aria-label="Kembali">←</Link>
          <span className={styles.tag}>{subject.emoji} {subject.shortTitle}</span>
          <span className={styles.tag}>⭐ {progress.stars}</span>
        </div>
        {activity.runtime === "drawing" ? <DrawingCanvas childId={childId} activity={activity} onDone={setProgress} /> : null}
        {activity.runtime === "coloring" ? <ColoringRegions childId={childId} activity={activity} onDone={setProgress} /> : null}
        {done ? <Link className={styles.secondaryButton} href={`/child/${childId}/stage/${stage.id}`}>← Kembali ke stage</Link> : null}
      </section>
    </main>
  );
}
