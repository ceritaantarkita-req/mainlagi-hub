"use client";

import Link from "next/link";
import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { completeActivity, getActivity } from "@/lib/learning/system";
import { playTone, speak, unlockAudio } from "@/lib/audio/feedback";
import { useLearningProgress } from "../LearningCommon";
import styles from "./MathTraceWorldActivity.module.css";

const CHECKPOINTS = [
  { x: 76, y: 17 },
  { x: 61, y: 17 },
  { x: 46, y: 17 },
  { x: 32, y: 19 },
  { x: 31, y: 33 },
  { x: 31, y: 47 },
  { x: 44, y: 45 },
  { x: 59, y: 46 },
  { x: 69, y: 54 },
  { x: 71, y: 66 },
  { x: 65, y: 77 },
  { x: 53, y: 83 },
  { x: 39, y: 82 },
  { x: 29, y: 75 }
] as const;

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function MiniPaca({ celebrate = false }: { celebrate?: boolean }) {
  return (
    <div className={`${styles.paca} ${celebrate ? styles.pacaCelebrate : ""}`} role="img" aria-label={celebrate ? "Paca merayakan" : "Paca membantu"}>
      <span className={styles.antenna} />
      <span className={styles.head}><span className={styles.face}><i /><i /><b /></span></span>
      <span className={styles.body}>M</span>
      <span className={styles.armLeft} />
      <span className={styles.armRight} />
    </div>
  );
}

export function MathTraceWorldActivity({ childId }: { childId: string }) {
  const activity = getActivity("math-trace-5-touch")!;
  const progress = useLearningProgress(childId);
  const alreadyDone = progress.completedActivityIds.includes(activity.id);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const drawingRef = useRef(false);
  const completedRef = useRef(false);
  const [checkpoint, setCheckpoint] = useState(0);
  const [points, setPoints] = useState<Array<{ x: number; y: number }>>([]);
  const [message, setMessage] = useState("Mulai dari bintang kuning.");
  const [complete, setComplete] = useState(false);

  const pointFromEvent = (event: ReactPointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100
    };
  };

  const reset = () => {
    drawingRef.current = false;
    completedRef.current = false;
    setCheckpoint(0);
    setPoints([]);
    setComplete(false);
    setMessage("Mulai dari bintang kuning.");
  };

  const finishTrace = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    drawingRef.current = false;
    completeActivity(childId, activity.id);
    setComplete(true);
    setMessage("Angka 5 selesai!");
    playTone("celebrate");
    speak(alreadyDone ? "Bagus! Kamu masih ingat cara menulis angka lima." : "Hebat! Kamu berhasil menelusuri angka lima.", "id-ID", 0.9);
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate([25, 35, 70]);
  };

  const advanceCheckpoint = (point: { x: number; y: number }, current: number) => {
    let next = current;
    while (next < CHECKPOINTS.length && distance(point, CHECKPOINTS[next]) <= 15) next += 1;
    if (next !== current) {
      setCheckpoint(next);
      if (next >= CHECKPOINTS.length) finishTrace();
      else setMessage(next < 5 ? "Bagus, ikuti garis ke bawah." : next < 9 ? "Sekarang putar ke kanan." : "Sedikit lagi!");
    }
  };

  const start = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (complete) return;
    unlockAudio();
    const point = pointFromEvent(event);
    const target = CHECKPOINTS[Math.min(checkpoint, CHECKPOINTS.length - 1)];
    if (checkpoint === 0 && distance(point, target) > 18) {
      playTone("wrong");
      setMessage("Mulai dari bintang kuning dulu ya.");
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    drawingRef.current = true;
    if (checkpoint === 0) setPoints([point]);
    else setPoints((current) => [...current, point]);
    advanceCheckpoint(point, checkpoint);
  };

  const move = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!drawingRef.current || complete) return;
    const point = pointFromEvent(event);
    setPoints((current) => {
      const last = current[current.length - 1];
      if (last && distance(last, point) < 1.3) return current;
      return [...current, point];
    });
    advanceCheckpoint(point, checkpoint);
  };

  const end = (event: ReactPointerEvent<SVGSVGElement>) => {
    drawingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (!complete && checkpoint > 0) setMessage("Lanjut dari titik bercahaya.");
  };

  const hearPrompt = () => {
    unlockAudio();
    playTone("tick");
    speak("Mulai dari bintang. Ikuti garis angka lima dengan jarimu sampai selesai.", "id-ID", 0.88);
  };

  const nextPoint = CHECKPOINTS[Math.min(checkpoint, CHECKPOINTS.length - 1)];
  const progressPercent = Math.round((checkpoint / CHECKPOINTS.length) * 100);
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href={`/child/${childId}/stage/${activity.stageId}`} className={styles.close} aria-label="Keluar aktivitas">×</Link>
        <div className={styles.progress} aria-label={`${progressPercent}% trace selesai`}><span><i style={{ width: `${progressPercent}%` }} /></span><small>2 dari 2</small></div>
        <div className={styles.stars}>★ {progress.stars}</div>
      </header>

      <section className={styles.scene}>
        <div className={styles.guideRow}>
          <div className={styles.pacaWrap}><MiniPaca celebrate={complete} /></div>
          <button type="button" className={styles.prompt} onClick={hearPrompt}>
            <span className={styles.audio}>♪</span>
            <span><strong>Telusuri angka 5</strong><small>Sentuh untuk dengar</small></span>
          </button>
        </div>

        <div className={styles.traceCard}>
          <div className={styles.traceTop}><span>Ikuti garisnya</span><button type="button" onClick={reset}>Ulangi</button></div>
          <svg
            ref={svgRef}
            viewBox="0 0 100 100"
            className={styles.traceBoard}
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerCancel={end}
            aria-label="Area untuk menelusuri angka lima"
          >
            <path className={styles.guideShadow} d="M76 17 H32 V47 C43 43 59 44 67 51 C78 62 70 82 54 85 C42 88 31 83 27 75" />
            <path className={styles.guideDash} d="M76 17 H32 V47 C43 43 59 44 67 51 C78 62 70 82 54 85 C42 88 31 83 27 75" />
            <polyline className={styles.userStroke} points={polyline} />
            {!complete ? <circle className={styles.nextDot} cx={nextPoint.x} cy={nextPoint.y} r="4.8" /> : null}
            <text className={styles.startStar} x="77" y="13">★</text>
          </svg>
          <div className={`${styles.message} ${complete ? styles.messageDone : ""}`}>{complete ? "✓ " : ""}{message}</div>
        </div>
      </section>

      {complete ? (
        <div className={styles.celebration} role="dialog" aria-modal="true" aria-label="Trace selesai">
          <div className={styles.sparkles} aria-hidden><i /><i /><i /><i /><i /><i /></div>
          <div className={styles.celebrationCard}>
            <div className={styles.celebratePaca}><MiniPaca celebrate /></div>
            <div className={styles.bigFive}>5</div>
            <h1>Keren!</h1>
            <p>Kamu mengikuti bentuk angka lima sampai selesai.</p>
            <div className={styles.reward}>+{alreadyDone ? 0 : activity.stars} ★</div>
            <Link className={styles.continue} href={`/child/${childId}/stage/${activity.stageId}`}>Buka jalur berikutnya <span>→</span></Link>
          </div>
        </div>
      ) : null}
    </main>
  );
}
