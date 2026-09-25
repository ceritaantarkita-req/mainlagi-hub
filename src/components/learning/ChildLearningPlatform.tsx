/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";

import { GAME_LIST } from "@/lib/data/games";
import {
  CHARACTERS,
  DEMO_PROFILE,
  SUBJECTS,
  completeActivity,
  getActivitiesForStage,
  getActivity,
  getStage,
  getSubject,
  readProfiles,
  readProgress,
  saveProfile,
  type CharacterId,
  type LearningActivity,
  type LearningChildProfile,
  type LearningProgress,
  type LearningSubject,
  type LearningSubjectId
} from "@/lib/learning/system";
import { getLearningPathsForSubject, getLessonsForStage } from "@/lib/learning/curriculum";
import { resolveCharacterPresentation } from "@/lib/learning/characterPresentation";
import { getNextBestLearningRecommendation } from "@/lib/learning/insights";
import { buildMatchingColumns, matchingSeedFromText, nextDistinctMatchingSeed } from "@/lib/learning/matchingLayout";
import { CharacterAvatar, CharacterGroup, ChildLoading, useLearningProfile, useLearningProgress } from "./LearningCommon";
import { useLearningAnalytics } from "./useLearningAnalytics";
import styles from "./LearningPlatform.module.css";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { ActivityCompletion } from "./ActivityCompletion";
import { CharacterLayer } from "./CharacterLayer";

function coreActivities(activities: LearningActivity[]) {
  return activities.filter((activity) => !activity.motionOptional && activity.runtime !== "motion_game");
}

function ageEligible(activity: LearningActivity, age: number) {
  return age >= activity.ageMin && age <= activity.ageMax;
}

export function ChildSelectScreen() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<LearningChildProfile[]>([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState(5);
  const [guide, setGuide] = useState<CharacterId>("paca");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setProfiles(readProfiles()));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const createProfile = () => {
    const clean = name.trim();
    if (!clean) return;
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `child-${Date.now()}`;
    const profile: LearningChildProfile = { id, name: clean.slice(0, 24), age, guide, language: "id" };
    saveProfile(profile);
    router.push(`/child/${id}/home`);
  };

  return (
    <main className={styles.surface}>
      <div className={styles.contentNarrow}>
        <p className={styles.eyebrow}>Mainlagi untuk anak</p>
        <h1 className={styles.pageTitle}>Siapa yang mau belajar?</h1>
        <p className={styles.pageLead}>Pilih profil lalu masuk ke pengalaman belajar yang sederhana, visual, dan nyaman di HP.</p>

        <section className={styles.section}>
          <div className={styles.profileGrid}>
            <Link className={styles.profileCard} href={`/child/${DEMO_PROFILE.id}/home`}>
              <CharacterAvatar id={DEMO_PROFILE.guide} />
              <span className={styles.profileCardText}><strong>{DEMO_PROFILE.name} — Demo</strong><span>{DEMO_PROFILE.age} tahun · Mulai cepat tanpa setup</span></span><span aria-hidden>→</span>
            </Link>
            {profiles.map((profile) => (
              <Link className={styles.profileCard} href={`/child/${profile.id}/home`} key={profile.id}>
                <CharacterAvatar id={profile.guide} />
                <span className={styles.profileCardText}><strong>{profile.name}</strong><span>{profile.age} tahun · Guide {CHARACTERS[profile.guide].name}</span></span><span aria-hidden>→</span>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.formCard}>
          <h2 style={{ margin: 0, color: "#24445e" }}>Tambah profil anak</h2>
          <div className={styles.formGroup}><label htmlFor="child-name">Nama panggilan</label><input id="child-name" className={styles.input} value={name} onChange={(event) => setName(event.target.value)} maxLength={24} placeholder="Contoh: Gian" /></div>
          <div className={styles.formGroup}><span className={styles.formLabel}>Umur</span><div className={styles.choiceRow}>{[3, 4, 5, 6, 7].map((value) => <button type="button" key={value} className={`${styles.choicePill} ${age === value ? styles.choicePillActive : ""}`} onClick={() => setAge(value)}>{value}</button>)}</div></div>
          <div className={styles.formGroup}><span className={styles.formLabel}>Teman panduan</span><div className={styles.choiceRow}>{(Object.keys(CHARACTERS) as CharacterId[]).map((id) => <button type="button" key={id} className={`${styles.choicePill} ${guide === id ? styles.choicePillActive : ""}`} onClick={() => setGuide(id)}>{CHARACTERS[id].emoji} {CHARACTERS[id].name}</button>)}</div></div>
          <div className={styles.heroActionRow}><button type="button" className={styles.primaryButton} onClick={createProfile}>Buat profil</button><Link className={styles.secondaryButton} href="/parent">Area orang tua</Link></div>
        </section>
      </div>
    </main>
  );
}

function SubjectScroller({ childId, active }: { childId: string; active?: LearningSubjectId }) {
  return <div className={styles.subjectScroller} aria-label="Area belajar">{SUBJECTS.map((subject) => <Link key={subject.id} href={`/child/${childId}/subject/${subject.id}`} className={`${styles.subjectChip} ${active === subject.id ? styles.subjectChipActive : ""}`} style={{ "--accent": subject.accent, "--soft": subject.soft } as CSSProperties}><span className={styles.subjectChipIcon} aria-hidden>{subject.emoji}</span><span>{subject.shortTitle}</span></Link>)}</div>;
}

function StageCard({ childId, stageId, progress, subject, age }: { childId: string; stageId: string; progress: LearningProgress; subject: LearningSubject; age: number }) {
  const stage = getStage(stageId)!;
  const activities = getActivitiesForStage(stageId).filter((activity) => ageEligible(activity, age));
  const required = coreActivities(activities);
  const requiredDone = required.filter((item) => progress.completedActivityIds.includes(item.id)).length;
  const percent = required.length ? Math.round((requiredDone / required.length) * 100) : 0;
  const optionalMotion = activities.filter((item) => item.motionOptional).length;
  return (
    <Link href={`/child/${childId}/stage/${stageId}`} className={styles.stageCard} style={{ "--accent": subject.accent, "--soft": subject.soft } as CSSProperties}>
      <span className={styles.stageIcon} aria-hidden>{stage.emoji}</span>
      <h3>{stage.title}</h3><p>{stage.subtitle}</p>
      <span className={styles.stageProgress}><span className={styles.progressTrack}><span className={styles.progressFill} style={{ width: `${percent}%` }} /></span><span>{requiredDone}/{required.length}</span></span>
      {optionalMotion ? <span className={`${styles.tag} ${styles.tagMotion}`} style={{ marginTop: 8, alignSelf: "flex-start" }}>+ {optionalMotion} gerak opsional</span> : null}
    </Link>
  );
}

function runtimeLabel(activity: LearningActivity) {
  const labels: Record<LearningActivity["runtime"], string> = { tap_choice: "Sentuh", listen_and_choose: "Audio + sentuh", matching: "Pasangkan", trace: "Trace jari", coloring: "Mewarnai", drawing: "Menggambar", story: "Cerita", motion_game: "Gerak kamera" };
  return labels[activity.runtime];
}

function ActivityCard({ childId, activity, progress, subject }: { childId: string; activity: LearningActivity; progress: LearningProgress; subject: LearningSubject }) {
  const done = progress.completedActivityIds.includes(activity.id);
  return <Link href={`/child/${childId}/activity/${activity.id}`} className={styles.activityCard} style={{ "--accent": subject.accent, "--soft": subject.soft } as CSSProperties}><span className={styles.activityIcon} aria-hidden>{activity.emoji}</span><h3>{activity.title}</h3><p>{activity.description}</p><span className={styles.activityMeta}><span className={styles.tag}>{runtimeLabel(activity)}</span>{activity.motionOptional ? <span className={`${styles.tag} ${styles.tagMotion}`}>Gerak opsional</span> : null}{done ? <span className={`${styles.tag} ${styles.tagDone}`}>✓ Selesai</span> : null}</span></Link>;
}

export function ChildHomeScreen({ childId }: { childId: string }) {
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);
  const analytics = useLearningAnalytics(childId);
  if (!profile) return <ChildLoading />;
  const recommendation = getNextBestLearningRecommendation({ age: profile.age, progress, analytics, allowMotion: false });
  const next = recommendation?.activity;
  const nextSubject = next ? getSubject(next.subjectId) : undefined;
  return <main className={styles.content}><section className={styles.heroCard}><div className={styles.heroCopy}><p className={styles.eyebrow}>Halo, {profile.name}! 👋</p><h1>Belajar sebentar, main lagi.</h1><p>Aktivitas berikut dipilih dari umur, stage yang sudah terbuka, completion, dan evidence mastery. Kamera tetap opsional.</p><div className={styles.heroActionRow}>{next ? <Link className={styles.primaryButton} href={`/child/${childId}/activity/${next.id}`}>▶ Lanjut: {next.title}</Link> : null}<Link className={styles.secondaryButton} href={`/child/${childId}/home#choose-subject`}>Pilih area belajar</Link></div></div><CharacterGroup /></section><section className={styles.section}><div className={styles.sectionHead}><h2>Pilih yang mau dipelajari</h2><span className={styles.tag}>⭐ {progress.stars}</span></div><SubjectScroller childId={childId} /></section>{next && nextSubject ? <section className={styles.section}><div className={styles.sectionHead}><h2>Saran belajar berikutnya</h2></div><div className={styles.infoBanner} style={{ marginBottom: 12 }}><strong>Kenapa ini?</strong> {recommendation.reasonLabel}</div><div className={styles.cardGrid}><ActivityCard childId={childId} activity={next} progress={progress} subject={nextSubject} /></div></section> : null}<section className={styles.section}><div className={styles.infoBanner}><strong>Main Gerak tetap ada.</strong> Kamera bukan syarat untuk belajar inti. Saat HP masih di tangan, pilih aktivitas sentuh dulu.</div></section></main>;
}

export function LearnLibraryScreen({ childId }: { childId: string }) {
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);
  if (!profile) return <ChildLoading />;
  return <main className={styles.content}><p className={styles.eyebrow}>Learning Library</p><h1 className={styles.pageTitle}>Belajar</h1><p className={styles.pageLead}>Struktur Mainlagi sekarang mengikuti Subject → Learning Path → Stage → Lesson → Activity. Aktivitas inti tetap touch-first.</p><section className={styles.section}><SubjectScroller childId={childId} /></section>{SUBJECTS.map((subject) => { const paths = getLearningPathsForSubject(subject.id).filter((path) => profile.age >= path.ageMin && profile.age <= path.ageMax); return paths.map((path) => <section className={styles.section} key={path.id}><div className={styles.sectionHead}><div><p className={styles.eyebrow}>{subject.emoji} {subject.title}</p><h2>{path.title}</h2><p className={styles.pageLead}>{path.description}</p></div></div><div className={`${styles.cardGrid} ${styles.stageGrid}`}>{path.stageIds.map((stageId) => <StageCard key={stageId} childId={childId} stageId={stageId} progress={progress} subject={subject} age={profile.age} />)}</div></section>); })}<section className={styles.section}><div className={styles.infoBanner}><strong>Catatan kurikulum:</strong> struktur ini adalah kurikulum produk Mainlagi dan belum diklaim setara dengan standar sekolah atau kurikulum pihak ketiga.</div></section></main>;
}

export function SubjectScreen({ childId, subjectId }: { childId: string; subjectId: string }) {
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);
  const subject = getSubject(subjectId);
  if (!profile || !subject) return <main className={styles.content}><div className={styles.emptyState}>Area belajar tidak ditemukan.</div></main>;
  const paths = getLearningPathsForSubject(subject.id).filter((path) => profile.age >= path.ageMin && profile.age <= path.ageMax);
  return <main className={styles.content}><p className={styles.eyebrow}>{subject.emoji} Area belajar</p><h1 className={styles.pageTitle}>{subject.title}</h1><p className={styles.pageLead}>{subject.description}</p><section className={styles.section}><SubjectScroller childId={childId} active={subject.id} /></section>{paths.map((path) => <section className={styles.section} key={path.id}><p className={styles.eyebrow}>Learning path</p><h2>{path.title}</h2><p className={styles.pageLead}>{path.description}</p><div className={`${styles.cardGrid} ${styles.stageGrid}`}>{path.stageIds.map((stageId) => <StageCard key={stageId} childId={childId} stageId={stageId} progress={progress} subject={subject} age={profile.age} />)}</div></section>)}</main>;
}

export function StageScreen({ childId, stageId }: { childId: string; stageId: string }) {
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);
  const stage = getStage(stageId);
  if (!profile || !stage) return <main className={styles.content}><div className={styles.emptyState}>Stage tidak ditemukan.</div></main>;
  const subject = getSubject(stage.subjectId)!;
  const activities = getActivitiesForStage(stage.id).filter((activity) => ageEligible(activity, profile.age));
  const activityMap = new Map(activities.map((activity) => [activity.id, activity]));
  const lessons = getLessonsForStage(stage.id).filter((lesson) => profile.age >= lesson.ageMin && profile.age <= lesson.ageMax);
  const optional = activities.filter((item) => item.motionOptional);
  return <main className={styles.content}><Link className={styles.backButton} href={`/child/${childId}/subject/${stage.subjectId}`} aria-label="Kembali">←</Link><div style={{ marginTop: 16 }}><p className={styles.eyebrow}>{subject.title}</p><h1 className={styles.pageTitle}>{stage.emoji} {stage.title}</h1><p className={styles.pageLead}>{stage.subtitle}</p></div>{lessons.map((lesson) => { const lessonActivities = lesson.activityIds.map((id) => activityMap.get(id)).filter((item): item is LearningActivity => Boolean(item && !item.motionOptional && item.runtime !== "motion_game")); if (!lessonActivities.length) return null; return <section className={styles.section} key={lesson.id}><div className={styles.sectionHead}><div><p className={styles.eyebrow}>Lesson</p><h2>{lesson.title}</h2><p className={styles.pageLead}>{lesson.objective}</p></div></div><div className={styles.cardGrid}>{lessonActivities.map((activity) => <ActivityCard key={activity.id} childId={childId} activity={activity} progress={progress} subject={subject} />)}</div></section>; })}{optional.length ? <section className={styles.section}><div className={styles.sectionHead}><h2>Kalau mau main pakai gerakan</h2></div><div className={styles.motionNotice}><strong>Bonus opsional.</strong> Aktivitas di bawah tidak dihitung sebagai syarat completion stage.</div><div className={styles.cardGrid} style={{ marginTop: 12 }}>{optional.map((activity) => <ActivityCard key={activity.id} childId={childId} activity={activity} progress={progress} subject={subject} />)}</div></section> : null}</main>;
}


function ChoiceActivity({ childId, activity, onDone }: { childId: string; activity: LearningActivity; onDone: (value: LearningProgress) => void }) {
  const [feedback, setFeedback] = useState<"good" | "try" | null>(null);
  const choose = (choice: string) => { if (choice === activity.correctChoice) { setFeedback("good"); onDone(completeActivity(childId, activity.id)); } else setFeedback("try"); };
  return <><h1 className={styles.activityPrompt}>{activity.title.startsWith("Cari huruf") ? activity.title : activity.prompt}</h1>
    <div className={styles.choiceGrid} data-choices>{(activity.choices ?? []).map(choice=><button type="button" className={styles.bigChoice} data-short={choice.length<=2} key={choice} onClick={()=>choose(choice)}>{choice}</button>)}</div>
    {feedback==="good" ? <div className={styles.feedbackGood} role="status">Hebat! Aktivitas selesai.</div> : null}
    {feedback==="try" ? <div className={styles.feedbackTry} role="status">Belum tepat. Coba pilihan lain ya.</div> : null}
    <p className={styles.playHint}>Sentuh pilihanmu.</p>
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null); const drawingRef = useRef(false); const [hasStroke, setHasStroke] = useState(false); const [done, setDone] = useState(false);
  const point = (event: ReactPointerEvent<HTMLCanvasElement>) => { const rect = event.currentTarget.getBoundingClientRect(); return { x: (event.clientX - rect.left) * (event.currentTarget.width / rect.width), y: (event.clientY - rect.top) * (event.currentTarget.height / rect.height) }; };
  const start = (event: ReactPointerEvent<HTMLCanvasElement>) => { event.currentTarget.setPointerCapture(event.pointerId); const ctx = event.currentTarget.getContext("2d"); if (!ctx) return; const p = point(event); ctx.beginPath(); ctx.moveTo(p.x, p.y); drawingRef.current = true; setHasStroke(true); };
  const move = (event: ReactPointerEvent<HTMLCanvasElement>) => { if (!drawingRef.current) return; const ctx = event.currentTarget.getContext("2d"); if (!ctx) return; const p = point(event); ctx.lineWidth = 24; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "#168b78"; ctx.lineTo(p.x, p.y); ctx.stroke(); };
  const end = (event: ReactPointerEvent<HTMLCanvasElement>) => { drawingRef.current = false; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); };
  const reset = () => { const canvas = canvasRef.current; if (!canvas) return; canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height); setHasStroke(false); setDone(false); };
  const finish = () => { if (!hasStroke) return; onDone(completeActivity(childId, activity.id)); setDone(true); };
  return <><h1 className={styles.activityPrompt}>Telusuri {activity.traceGlyph} dengan jari</h1><div className={styles.traceWrap}><div className={styles.traceBoard}><div aria-hidden className={styles.traceGuide}>{activity.traceGlyph}</div><canvas ref={canvasRef} width={640} height={640} className={styles.traceCanvas} aria-label={`Area menulis huruf ${activity.traceGlyph}`} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end} /></div><div className={styles.heroActionRow}><button type="button" className={styles.secondaryButton} onClick={reset}>Ulangi</button><button type="button" className={styles.primaryButton} onClick={finish} disabled={!hasStroke}>Selesai</button></div></div>{done ? <div className={styles.feedbackGood}>Bagus! Latihan menulismu selesai.</div> : null}</>;
}

function ColoringActivity({ childId, activity, onDone }: { childId: string; activity: LearningActivity; onDone: (value: LearningProgress) => void }) {
  const colors = ["#f59e0b", "#ec6aa5", "#6c7df7", "#1ec9a6", "#ef4444", "#22c55e"]; const [color, setColor] = useState(colors[0]); const [applied, setApplied] = useState(false); const emoji = activity.coloringCharacter === "paca" ? "🤖" : "🐱";
  return <><h1 className={styles.activityPrompt}>{activity.title}</h1><button type="button" className={styles.colorTarget} onClick={() => setApplied(true)} style={{ background: applied ? color : "#f4f8fb", border: 0, width: "100%" }}>{emoji}</button><div className={styles.palette}>{colors.map((item) => <button type="button" key={item} className={styles.colorDot} onClick={() => setColor(item)} style={{ background: item, outline: color === item ? "3px solid #173a5e" : "none" }} aria-label={`Pilih warna ${item}`} />)}</div><div style={{ textAlign: "center" }}>{applied ? <button type="button" className={styles.primaryButton} onClick={() => onDone(completeActivity(childId, activity.id))}>Selesai · +{activity.stars} ⭐</button> : <span className={styles.tag}>Pilih warna lalu sentuh karakter</span>}</div></>;
}

function StoryActivity({ childId, activity, onDone }: { childId: string; activity: LearningActivity; onDone: (value: LearningProgress) => void }) {

  return <><h1 className={styles.activityPrompt}>{activity.title}</h1><div className={styles.storyCard}>{(activity.storyLines ?? []).map((line) => <p className={styles.storyLine} key={line}>{line}</p>)}</div><div style={{ textAlign: "center" }}><button type="button" className={styles.primaryButton} onClick={() => onDone(completeActivity(childId, activity.id))}>Selesai · +{activity.stars} ⭐</button></div></>;
}

function MotionActivity({ childId, activity }: { childId: string; activity: LearningActivity }) {
  return <><h1 className={styles.activityPrompt}>Main pakai gerakan?</h1><div className={styles.motionNotice}><strong>Mode ini opsional.</strong><br />Kalau pakai HP, taruh perangkat di tempat stabil dan pastikan tangan/tubuh terlihat. Kalau setup ribet, kembali ke Beranda dan pilih aktivitas sentuh.</div><div className={styles.heroActionRow} style={{ justifyContent: "center" }}>{activity.gameSlug ? <Link className={styles.primaryButton} href={`/play/${activity.gameSlug}`}>📷 Buka game gerak</Link> : null}<Link className={styles.secondaryButton} href={`/child/${childId}/home#choose-subject`}>Belajar tanpa kamera</Link></div></>;
}

export function ActivityScreen({ childId, activityId }: { childId: string; activityId: string }) {
  const profile = useLearningProfile(childId); const activity = getActivity(activityId); const [progress, setProgress] = useState<LearningProgress>({ completedActivityIds: [], stars: 0, lastActivityId: null });
  useEffect(() => { const frame = window.requestAnimationFrame(() => setProgress(readProgress(childId))); return () => window.cancelAnimationFrame(frame); }, [childId]);
  if (!profile || !activity) return <main className={styles.contentNarrow}><div className={styles.emptyState}>Aktivitas tidak ditemukan.</div></main>;
  const done = progress.completedActivityIds.includes(activity.id);
  return <GardenActivityFrame backHref={`/child/${childId}/subject/${activity.subjectId}`} narration={activity.runtime === "story" ? (activity.storyLines ?? []).join(" ") : activity.prompt ?? activity.title} lang={activity.subjectId === "english" ? "en-US" : "id-ID"} spacious={activity.runtime === "tap_choice" && (activity.prompt?.length ?? 0)<45}>
    {activity.runtime === "tap_choice" || activity.runtime === "listen_and_choose" ? <ChoiceActivity childId={childId} activity={activity} onDone={setProgress} /> : null}
    {activity.runtime === "matching" ? <MatchingActivity key={activity.id} childId={childId} activity={activity} onDone={setProgress} /> : null}
    {activity.runtime === "trace" ? <TraceActivity childId={childId} activity={activity} onDone={setProgress} /> : null}
    {activity.runtime === "coloring" ? <ColoringActivity childId={childId} activity={activity} onDone={setProgress} /> : null}
    {activity.runtime === "story" ? <StoryActivity childId={childId} activity={activity} onDone={setProgress} /> : null}
    {activity.runtime === "motion_game" ? <MotionActivity childId={childId} activity={activity} /> : null}
    {done && activity.runtime !== "motion_game" && activity.runtime !== "matching" ? <Link className={styles.secondaryButton} href={`/child/${childId}/subject/${activity.subjectId}`}>Pilih permainan lain</Link> : null}
  </GardenActivityFrame>;
}

export function GamesScreen({ childId }: { childId: string }) {
  const profile = useLearningProfile(childId);
  if (!profile) return <ChildLoading />;

  const presentation = resolveCharacterPresentation({
    context: "play_entry",
    requestedCharacters: ["gavi", "paca"],
    allowIdentityFallback: false
  });

  return (
    <main className={styles.content}>
      <section className={styles.motionHero} data-mainlagi-play-entry>
        <div className={styles.motionHeroCopy}>
          <p className={styles.eyebrow}>Bermain · Main Gerak</p>
          <h1 className={styles.pageTitle}>Ayo bergerak, {profile.name}!</h1>
          <p className={styles.pageLead}>10 permainan gerak. Siapkan ruang yang aman dan main bersama pendamping.</p>
        </div>
        <div className={styles.motionHeroCharacters} aria-hidden>
          <CharacterLayer characters={presentation.characters} className={styles.motionCharacterLayer} />
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.motionNotice}>
          <strong>Tips HP:</strong> taruh HP di tempat stabil, beri jarak, dan gunakan landscape bila perlu. Kalau HP masih di tangan, pilih <Link href={`/child/${childId}/home#choose-subject`}>Belajar tanpa kamera</Link>.
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.cardGrid}>
          {GAME_LIST.map((game) => (
            <Link className={styles.gameCard} href={`/play/${game.slug}`} key={game.slug}>
              <img className={styles.gameArtwork} src={`/artwork/${game.slug}.webp`} alt="" width={500} height={360}/>
              <h3>{game.shortTitle}</h3>
              <p>{game.description}</p>
              <span className={styles.gameCardFooter}>
                <span className={`${styles.tag} ${styles.tagMotion}`}>
                  {game.visionMode === "pose" ? "Gerak badan" : game.visionMode === "hybrid" ? "Gerak hybrid" : "Gerak tangan"}
                </span>
                <span aria-hidden>→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export function RewardsScreen({ childId }: { childId: string }) {
  const profile = useLearningProfile(childId); const progress = useLearningProgress(childId); if (!profile) return <ChildLoading />;
  return <main className={styles.contentNarrow}><section className={styles.rewardHero}><CharacterAvatar id="gavi" large /><div className={styles.rewardStars}>⭐</div><strong>{progress.stars} bintang</strong><span>{progress.completedActivityIds.length} aktivitas selesai</span></section><section className={styles.section}><div className={styles.infoBanner}><strong>Hadiah tanpa tekanan.</strong> Tidak ada streak yang menghukum anak, dan bintang bukan nilai kecerdasan.</div></section><div className={styles.heroActionRow}><Link className={styles.primaryButton} href={`/child/${childId}/home#choose-subject`}>Cari aktivitas berikutnya</Link></div></main>;
}
