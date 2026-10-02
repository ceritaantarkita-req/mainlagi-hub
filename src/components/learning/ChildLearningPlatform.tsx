/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

import { GameArtwork } from "@/components/GameArtwork";
import { GAME_LIST } from "@/lib/data/games";
import { CORE_SURFACE_THUMBNAILS } from "@/lib/learning/coreThumbnailRegistry";
import {
  completeActivity,
  getActivity,
  type LearningActivity,
  type LearningProgress,
} from "@/lib/learning/system";
import { buildMatchingColumns, matchingSeedFromText, nextDistinctMatchingSeed } from "@/lib/learning/matchingLayout";
import { ChildLoading, useLearningProfile } from "./LearningCommon";
import styles from "./LearningPlatform.module.css";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { ActivityCompletion } from "./ActivityCompletion";

function ChoiceActivity({ childId, activity, onDone }: { childId: string; activity: LearningActivity; onDone: (value: LearningProgress) => void }) {
  const [feedback, setFeedback] = useState<"good" | "try" | null>(null);

  const choose = (choice: string) => {
    if (choice === activity.correctChoice) {
      onDone(completeActivity(childId, activity.id));
      setFeedback("good");
      return;
    }
    setFeedback("try");
  };

  const retry = () => setFeedback(null);

  return <>
    <h1 className={styles.activityPrompt}>{activity.title.startsWith("Cari huruf") ? activity.title : activity.prompt}</h1>
    <div className={styles.choiceGrid} data-choices>
      {(activity.choices ?? []).map((choice) => (
        <button
          type="button"
          className={styles.bigChoice}
          data-short={choice.length <= 2}
          key={choice}
          disabled={feedback === "good"}
          onClick={() => choose(choice)}
        >
          {choice}
        </button>
      ))}
    </div>
    {feedback === "try" ? <div className={styles.feedbackTry} role="status">Belum tepat. Coba pilihan lain ya.</div> : null}
    <p className={styles.playHint}>Sentuh pilihanmu.</p>
    {feedback === "good" ? <ActivityCompletion childId={childId} activity={activity} onTryAgain={retry} /> : null}
  </>;
}

function MatchingActivity({ childId, activity, onDone }: { childId: string; activity: LearningActivity; onDone: (value: LearningProgress) => void }) {
  const items = useMemo(() => activity.matchItems ?? [], [activity.matchItems]);
  const [seed, setSeed] = useState(() => matchingSeedFromText(`${childId}:${activity.id}`));
  const [selected, setSelected] = useState<{ id: string; side: "left" | "right" } | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState("Pilih satu kartu di kiri, lalu cari pasangannya di kanan.");

  const layout = useMemo(() => buildMatchingColumns(items, seed), [items, seed]);
  const cards = useMemo(() => [...layout.left, ...layout.right], [layout]);

  const pick = (id: string, side: "left" | "right") => {
    if (matched.includes(id) || completed) return;
    if (selected === null) {
      setSelected({ id, side });
      return;
    }
    if (selected.id === id) {
      setSelected(null);
      return;
    }
    if (selected.side === side) return;

    const first = cards.find((card) => card.id === selected.id);
    const second = cards.find((card) => card.id === id);
    if (!first || !second) {
      setSelected(null);
      return;
    }

    if (first.pair === second.pair) {
      const next = [...matched, first.id, second.id];
      setMatched(next);
      setSelected(null);
      if (next.length === items.length) {
        setCompleted(true);
        setMessage("Semua pasangan cocok!");
        onDone(completeActivity(childId, activity.id));
      } else {
        setMessage("Cocok! Cari pasangan berikutnya.");
      }
      return;
    }

    setSelected(null);
    setMessage("Belum cocok. Coba pasangan lain.");
  };

  const retry = () => {
    setSelected(null);
    setMatched([]);
    setCompleted(false);
    setMessage("Susunannya berubah. Cari pasangan baru.");
    setSeed((current) => nextDistinctMatchingSeed(items, current ?? 1));
  };

  const renderColumn = (side: "left" | "right", column: typeof layout.left) => (
    <div className={styles.matchColumn} data-match-column={side}>
      {column.map((item) => {
        const isSelected = selected?.id === item.id;
        const isMatched = matched.includes(item.id);
        const wrongSideLocked = selected !== null && selected.side === side && !isSelected;
        return (
          <button
            type="button"
            data-match-card
            data-source-index={item.sourceIndex}
            className={`${styles.matchButton} ${isSelected ? styles.matchSelected : ""} ${isMatched ? styles.matchDone : ""}`}
            aria-pressed={isSelected}
            disabled={isMatched || completed || wrongSideLocked}
            onClick={() => pick(item.id, side)}
            key={item.id}
          >
            {isMatched ? "✓ " : ""}{item.label}
          </button>
        );
      })}
    </div>
  );

  return <>
    <h1 className={styles.activityPrompt}>{activity.prompt ?? "Pasangkan kartu"}</h1>
    <p className={styles.matchHint}>{layout.left.length} pasangan · kiri ↔ kanan</p>
    <div className={styles.matchGrid} data-visible-matching data-pair-count={layout.left.length}>
      {renderColumn("left", layout.left)}
      {renderColumn("right", layout.right)}
    </div>
    <div role="status" className={completed ? styles.feedbackGood : styles.infoBanner}>{message}</div>
    {completed ? <ActivityCompletion childId={childId} activity={activity} onTryAgain={retry} /> : null}
  </>;
}

function TraceActivity({ childId, activity, onDone }: { childId: string; activity: LearningActivity; onDone: (value: LearningProgress) => void }) {
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
    ctx.lineWidth = 24;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#168b78";
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

  return <>
    <h1 className={styles.activityPrompt}>Telusuri {activity.traceGlyph} dengan jari</h1>
    <div className={styles.traceWrap}>
      <div className={styles.traceBoard}>
        <div aria-hidden className={styles.traceGuide}>{activity.traceGlyph}</div>
        <canvas
          ref={canvasRef}
          width={640}
          height={640}
          className={styles.traceCanvas}
          aria-label={`Area menulis huruf ${activity.traceGlyph}`}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
        />
      </div>
      <div className={styles.heroActionRow}>
        <button type="button" className={styles.secondaryButton} onClick={reset}>Ulangi</button>
        <button type="button" className={styles.primaryButton} onClick={finish} disabled={!hasStroke}>Selesai</button>
      </div>
    </div>
    {done ? <ActivityCompletion childId={childId} activity={activity} onTryAgain={reset} /> : null}
  </>;
}

function ColoringActivity({ childId, activity, onDone }: { childId: string; activity: LearningActivity; onDone: (value: LearningProgress) => void }) {
  const colors = ["#f59e0b", "#ec6aa5", "#6c7df7", "#1ec9a6", "#ef4444", "#22c55e"];
  const [color, setColor] = useState(colors[0]);
  const [applied, setApplied] = useState(false);
  const [done, setDone] = useState(false);
  const emoji = activity.coloringCharacter === "paca" ? "🤖" : "🐱";

  const finish = () => {
    onDone(completeActivity(childId, activity.id));
    setDone(true);
  };

  const retry = () => {
    setApplied(false);
    setDone(false);
  };

  return <>
    <h1 className={styles.activityPrompt}>{activity.title}</h1>
    <button
      type="button"
      className={styles.colorTarget}
      onClick={() => setApplied(true)}
      style={{ background: applied ? color : "#f4f8fb", border: 0, width: "100%" }}
    >
      {emoji}
    </button>
    <div className={styles.palette}>
      {colors.map((item) => (
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
      {applied
        ? <button type="button" className={styles.primaryButton} onClick={finish}>Selesai · +{activity.stars} ⭐</button>
        : <span className={styles.tag}>Pilih warna lalu sentuh karakter</span>}
    </div>
    {done ? <ActivityCompletion childId={childId} activity={activity} onTryAgain={retry} /> : null}
  </>;
}

function StoryActivity({ childId, activity, onDone }: { childId: string; activity: LearningActivity; onDone: (value: LearningProgress) => void }) {
  const [done, setDone] = useState(false);

  const finish = () => {
    onDone(completeActivity(childId, activity.id));
    setDone(true);
  };

  const retry = () => setDone(false);

  return <>
    <h1 className={styles.activityPrompt}>{activity.title}</h1>
    <div className={styles.storyCard}>
      {(activity.storyLines ?? []).map((line) => <p className={styles.storyLine} key={line}>{line}</p>)}
    </div>
    <div style={{ textAlign: "center" }}>
      <button type="button" className={styles.primaryButton} onClick={finish}>Selesai · +{activity.stars} ⭐</button>
    </div>
    {done ? <ActivityCompletion childId={childId} activity={activity} onTryAgain={retry} /> : null}
  </>;
}

function MotionActivity({ childId, activity }: { childId: string; activity: LearningActivity }) {
  return <><h1 className={styles.activityPrompt}>Main pakai gerakan?</h1><div className={styles.motionNotice}><strong>Mode ini opsional.</strong><br />Kalau pakai HP, taruh perangkat di tempat stabil dan pastikan tangan/tubuh terlihat. Kalau setup ribet, kembali ke Beranda dan pilih aktivitas sentuh.</div><div className={styles.heroActionRow} style={{ justifyContent: "center" }}>{activity.gameSlug ? <Link className={styles.primaryButton} href={`/play/${activity.gameSlug}`}>📷 Buka game gerak</Link> : null}<Link className={styles.secondaryButton} href={`/child/${childId}/home#choose-subject`}>Belajar tanpa kamera</Link></div></>;
}

export function ActivityScreen({ childId, activityId }: { childId: string; activityId: string }) {
  const profile = useLearningProfile(childId);
  const activity = getActivity(activityId);
  const [, setProgress] = useState<LearningProgress>({ completedActivityIds: [], stars: 0, lastActivityId: null });

  if (!profile || !activity) {
    return <main className={styles.contentNarrow}><div className={styles.emptyState}>Aktivitas tidak ditemukan.</div></main>;
  }

  return <GardenActivityFrame backHref={`/child/${childId}/subject/${activity.subjectId}`} narration={activity.runtime === "story" ? (activity.storyLines ?? []).join(" ") : activity.prompt ?? activity.title} lang={activity.subjectId === "english" ? "en-US" : "id-ID"} spacious={activity.runtime === "tap_choice" && (activity.prompt?.length ?? 0) < 45}>
    {activity.runtime === "tap_choice" || activity.runtime === "listen_and_choose" ? <ChoiceActivity childId={childId} activity={activity} onDone={setProgress} /> : null}
    {activity.runtime === "matching" ? <MatchingActivity key={activity.id} childId={childId} activity={activity} onDone={setProgress} /> : null}
    {activity.runtime === "trace" ? <TraceActivity childId={childId} activity={activity} onDone={setProgress} /> : null}
    {activity.runtime === "coloring" ? <ColoringActivity childId={childId} activity={activity} onDone={setProgress} /> : null}
    {activity.runtime === "story" ? <StoryActivity childId={childId} activity={activity} onDone={setProgress} /> : null}
    {activity.runtime === "motion_game" ? <MotionActivity childId={childId} activity={activity} /> : null}
  </GardenActivityFrame>;
}

export function GamesScreen({ childId }: { childId: string }) {
  const profile = useLearningProfile(childId);
  if (!profile) return <ChildLoading />;

  return (
    <main className={styles.content}>
      <section
        className={styles.motionHero}
        data-mainlagi-play-entry
        data-core-thumbnail-surface="main-gerak-header"
        aria-label={`Main Gerak untuk ${profile.name}`}
      >
        <img
          className={styles.motionHeaderImage}
          src={CORE_SURFACE_THUMBNAILS.mainGerakHeader}
          alt="Main Gerak"
          width={1200}
          height={900}
        />
      </section>
      <section className={styles.section}>
        <div className={styles.motionNotice}>
          <strong>Tips HP:</strong> taruh HP di tempat stabil, beri jarak, dan gunakan landscape bila perlu. Kalau HP masih di tangan, pilih <Link href={`/child/${childId}/home#choose-subject`}>Belajar tanpa kamera</Link>.
        </div>
      </section>
      <section className={styles.section}>
        <div className={`${styles.cardGrid} ${styles.coreGameGrid}`} data-core-thumbnail-grid="games">
          {GAME_LIST.map((game) => (
            <Link
              className={`${styles.gameCard} ${styles.coreGameCard}`}
              href={`/play/${game.slug}`}
              key={game.slug}
              data-core-thumbnail-card="game"
              data-core-thumbnail-id={game.slug}
            >
              <span className={styles.coreGameArtwork} aria-hidden>
                <GameArtwork slug={game.slug} />
              </span>
              <h3>{game.shortTitle}</h3>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
