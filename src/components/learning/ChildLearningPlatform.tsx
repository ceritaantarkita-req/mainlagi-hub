"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { GAME_LIST } from "@/lib/data/games";
import {
  ACTIVITIES,
  CHARACTERS,
  DEMO_PROFILE,
  STAGES,
  SUBJECTS,
  completeActivity,
  getActivitiesForStage,
  getActivity,
  getStage,
  getStagesForSubject,
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
import { CharacterAvatar, CharacterGroup, ChildLoading, useLearningProfile, useLearningProgress } from "./LearningCommon";
import styles from "./LearningPlatform.module.css";

function coreActivities(activities: LearningActivity[]) {
  return activities.filter((activity) => !activity.motionOptional && activity.runtime !== "motion_game");
}

function nextCoreActivity(age: number, progress: LearningProgress) {
  const candidates = ACTIVITIES.filter((activity) => age >= activity.ageMin && age <= activity.ageMax && !activity.motionOptional && activity.runtime !== "motion_game");
  return candidates.find((activity) => !progress.completedActivityIds.includes(activity.id)) ?? candidates[0];
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

function StageCard({ childId, stageId, progress, subject }: { childId: string; stageId: string; progress: LearningProgress; subject: LearningSubject }) {
  const stage = getStage(stageId)!;
  const activities = getActivitiesForStage(stageId);
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
  const labels: Record<LearningActivity["runtime"], string> = { tap_choice: "Sentuh", listen_and_choose: "Audio + sentuh", matching: "Pasangkan", trace: "Trace jari", coloring: "Mewarnai", story: "Cerita", motion_game: "Gerak kamera" };
  return labels[activity.runtime];
}

function ActivityCard({ childId, activity, progress, subject }: { childId: string; activity: LearningActivity; progress: LearningProgress; subject: LearningSubject }) {
  const done = progress.completedActivityIds.includes(activity.id);
  return <Link href={`/child/${childId}/activity/${activity.id}`} className={styles.activityCard} style={{ "--accent": subject.accent, "--soft": subject.soft } as CSSProperties}><span className={styles.activityIcon} aria-hidden>{activity.emoji}</span><h3>{activity.title}</h3><p>{activity.description}</p><span className={styles.activityMeta}><span className={styles.tag}>{runtimeLabel(activity)}</span>{activity.motionOptional ? <span className={`${styles.tag} ${styles.tagMotion}`}>Gerak opsional</span> : null}{done ? <span className={`${styles.tag} ${styles.tagDone}`}>✓ Selesai</span> : null}</span></Link>;
}

export function ChildHomeScreen({ childId }: { childId: string }) {
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);
  if (!profile) return <ChildLoading />;
  const next = nextCoreActivity(profile.age, progress);
  const nextSubject = next ? getSubject(next.subjectId) : undefined;
  return <main className={styles.content}><section className={styles.heroCard}><div className={styles.heroCopy}><p className={styles.eyebrow}>Halo, {profile.name}! 👋</p><h1>Belajar sebentar, main lagi.</h1><p>Di HP, sentuh, audio, trace, dan warna jadi pilihan utama. Kamera tetap ada kalau memang mau.</p><div className={styles.heroActionRow}>{next ? <Link className={styles.primaryButton} href={`/child/${childId}/activity/${next.id}`}>▶ Lanjut: {next.title}</Link> : null}<Link className={styles.secondaryButton} href={`/child/${childId}/learn`}>Lihat semua belajar</Link></div></div><CharacterGroup /></section><section className={styles.section}><div className={styles.sectionHead}><h2>Pilih yang mau dipelajari</h2><span className={styles.tag}>⭐ {progress.stars}</span></div><SubjectScroller childId={childId} /></section>{next && nextSubject ? <section className={styles.section}><div className={styles.sectionHead}><h2>Lanjut belajar</h2></div><div className={styles.cardGrid}><ActivityCard childId={childId} activity={next} progress={progress} subject={nextSubject} /></div></section> : null}<section className={styles.section}><div className={styles.infoBanner}><strong>Main Gerak tetap ada.</strong> Kamera bukan syarat untuk belajar inti. Saat HP masih di tangan, pilih aktivitas sentuh dulu.</div></section></main>;
}

export function LearnLibraryScreen({ childId }: { childId: string }) {
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);
  if (!profile) return <ChildLoading />;
  return <main className={styles.content}><p className={styles.eyebrow}>Library</p><h1 className={styles.pageTitle}>Belajar</h1><p className={styles.pageLead}>Pilih area belajar. Aktivitas inti dibuat touch-first; kamera hanya muncul kalau berguna.</p><section className={styles.section}><SubjectScroller childId={childId} /></section><section className={styles.section}><div className={styles.sectionHead}><h2>Semua stage contoh</h2></div><div className={`${styles.cardGrid} ${styles.stageGrid}`}>{STAGES.map((stage) => { const subject = getSubject(stage.subjectId)!; return <StageCard key={stage.id} childId={childId} stageId={stage.id} progress={progress} subject={subject} />; })}</div></section><section className={styles.section}><div className={styles.infoBanner}><strong>Prototype:</strong> isi aktivitas adalah contoh UX, bukan klaim kurikulum final.</div></section></main>;
}

export function SubjectScreen({ childId, subjectId }: { childId: string; subjectId: string }) {
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);
  const subject = getSubject(subjectId);
  if (!profile || !subject) return <main className={styles.content}><div className={styles.emptyState}>Area belajar tidak ditemukan.</div></main>;
  return <main className={styles.content}><p className={styles.eyebrow}>{subject.emoji} Area belajar</p><h1 className={styles.pageTitle}>{subject.title}</h1><p className={styles.pageLead}>{subject.description}</p><section className={styles.section}><SubjectScroller childId={childId} active={subject.id} /></section><section className={styles.section}><div className={`${styles.cardGrid} ${styles.stageGrid}`}>{getStagesForSubject(subject.id).map((stage) => <StageCard key={stage.id} childId={childId} stageId={stage.id} progress={progress} subject={subject} />)}</div></section></main>;
}

export function StageScreen({ childId, stageId }: { childId: string; stageId: string }) {
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);
  const stage = getStage(stageId);
  if (!profile || !stage) return <main className={styles.content}><div className={styles.emptyState}>Stage tidak ditemukan.</div></main>;
  const subject = getSubject(stage.subjectId)!;
  const activities = getActivitiesForStage(stage.id);
  const required = coreActivities(activities);
  const optional = activities.filter((item) => item.motionOptional);
  return <main className={styles.content}><Link className={styles.backButton} href={`/child/${childId}/subject/${stage.subjectId}`} aria-label="Kembali">←</Link><div style={{ marginTop: 16 }}><p className={styles.eyebrow}>{subject.title}</p><h1 className={styles.pageTitle}>{stage.emoji} {stage.title}</h1><p className={styles.pageLead}>{stage.subtitle}</p></div><section className={styles.section}><div className={styles.sectionHead}><h2>Aktivitas inti</h2></div><div className={styles.cardGrid}>{required.map((activity) => <ActivityCard key={activity.id} childId={childId} activity={activity} progress={progress} subject={subject} />)}</div></section>{optional.length ? <section className={styles.section}><div className={styles.sectionHead}><h2>Kalau mau main pakai gerakan</h2></div><div className={styles.motionNotice}><strong>Bonus opsional.</strong> Aktivitas di bawah tidak dihitung sebagai syarat completion stage.</div><div className={styles.cardGrid} style={{ marginTop: 12 }}>{optional.map((activity) => <ActivityCard key={activity.id} childId={childId} activity={activity} progress={progress} subject={subject} />)}</div></section> : null}</main>;
}

function speak(text: string, lang = "id-ID") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text); utterance.lang = lang; utterance.rate = 0.85; window.speechSynthesis.cancel(); window.speechSynthesis.speak(utterance);
}

function ChoiceActivity({ childId, activity, onDone }: { childId: string; activity: LearningActivity; onDone: (value: LearningProgress) => void }) {
  const [feedback, setFeedback] = useState<"good" | "try" | null>(null);
  const choose = (choice: string) => { if (choice === activity.correctChoice) { setFeedback("good"); onDone(completeActivity(childId, activity.id)); } else setFeedback("try"); };
  return <><h2 className={styles.activityPrompt}>{activity.prompt}</h2>{activity.runtime === "listen_and_choose" ? <div style={{ textAlign: "center" }}><button type="button" className={styles.secondaryButton} onClick={() => speak(activity.prompt ?? activity.title, activity.subjectId === "english" ? "en-US" : "id-ID")}>🔊 Putar suara</button></div> : null}<div className={styles.choiceGrid}>{(activity.choices ?? []).map((choice) => <button type="button" className={styles.bigChoice} key={choice} onClick={() => choose(choice)}>{choice}</button>)}</div>{feedback === "good" ? <div className={styles.feedbackGood}>Hebat! ⭐ Aktivitas selesai.</div> : null}{feedback === "try" ? <div className={styles.feedbackTry}>Hampir. Coba satu kali lagi ya.</div> : null}</>;
}

function MatchingActivity({ childId, activity, onDone }: { childId: string; activity: LearningActivity; onDone: (value: LearningProgress) => void }) {
  const items = activity.matchItems ?? []; const [selected, setSelected] = useState<number | null>(null); const [matched, setMatched] = useState<number[]>([]); const [message, setMessage] = useState("Pilih dua kartu yang cocok.");
  const pick = (index: number) => { if (matched.includes(index)) return; if (selected === null) { setSelected(index); return; } if (selected === index) { setSelected(null); return; } if (items[selected]?.pair === items[index]?.pair) { const next = [...matched, selected, index]; setMatched(next); setSelected(null); setMessage("Cocok! Lanjutkan."); if (next.length === items.length) onDone(completeActivity(childId, activity.id)); } else { setSelected(null); setMessage("Belum cocok. Coba pasangan lain."); } };
  return <><h2 className={styles.activityPrompt}>{activity.prompt ?? "Pasangkan kartu"}</h2><div className={styles.matchGrid}>{items.map((item, index) => <button type="button" className={`${styles.matchButton} ${selected === index ? styles.matchSelected : ""} ${matched.includes(index) ? styles.matchDone : ""}`} onClick={() => pick(index)} key={`${item.label}-${index}`}>{matched.includes(index) ? "✓ " : ""}{item.label}</button>)}</div><div className={matched.length === items.length ? styles.feedbackGood : styles.infoBanner}>{message}</div></>;
}

function TraceActivity({ childId, activity, onDone }: { childId: string; activity: LearningActivity; onDone: (value: LearningProgress) => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null); const drawingRef = useRef(false); const [hasStroke, setHasStroke] = useState(false); const [done, setDone] = useState(false);
  const point = (event: ReactPointerEvent<HTMLCanvasElement>) => { const rect = event.currentTarget.getBoundingClientRect(); return { x: (event.clientX - rect.left) * (event.currentTarget.width / rect.width), y: (event.clientY - rect.top) * (event.currentTarget.height / rect.height) }; };
  const start = (event: ReactPointerEvent<HTMLCanvasElement>) => { event.currentTarget.setPointerCapture(event.pointerId); const ctx = event.currentTarget.getContext("2d"); if (!ctx) return; const p = point(event); ctx.beginPath(); ctx.moveTo(p.x, p.y); drawingRef.current = true; setHasStroke(true); };
  const move = (event: ReactPointerEvent<HTMLCanvasElement>) => { if (!drawingRef.current) return; const ctx = event.currentTarget.getContext("2d"); if (!ctx) return; const p = point(event); ctx.lineWidth = 18; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "#31b99e"; ctx.lineTo(p.x, p.y); ctx.stroke(); };
  const end = (event: ReactPointerEvent<HTMLCanvasElement>) => { drawingRef.current = false; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); };
  const reset = () => { const canvas = canvasRef.current; if (!canvas) return; canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height); setHasStroke(false); setDone(false); };
  const finish = () => { if (!hasStroke) return; onDone(completeActivity(childId, activity.id)); setDone(true); };
  return <><h2 className={styles.activityPrompt}>Telusuri {activity.traceGlyph} dengan jari</h2><div className={styles.traceWrap}><div style={{ position: "relative", width: "min(100%, 380px)" }}><div aria-hidden style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "#dfe8ee", fontSize: 250, fontWeight: 900, pointerEvents: "none", lineHeight: 1 }}>{activity.traceGlyph}</div><canvas ref={canvasRef} width={640} height={640} className={styles.traceCanvas} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end} /></div><div className={styles.heroActionRow}><button type="button" className={styles.secondaryButton} onClick={reset}>Ulangi</button><button type="button" className={styles.primaryButton} onClick={finish} disabled={!hasStroke}>Selesai</button></div></div>{done ? <div className={styles.feedbackGood}>Bagus! Prototype mencatat completion, bukan akurasi bentuk final.</div> : null}</>;
}

function ColoringActivity({ childId, activity, onDone }: { childId: string; activity: LearningActivity; onDone: (value: LearningProgress) => void }) {
  const colors = ["#f59e0b", "#ec6aa5", "#6c7df7", "#1ec9a6", "#ef4444", "#22c55e"]; const [color, setColor] = useState(colors[0]); const [applied, setApplied] = useState(false); const emoji = activity.coloringCharacter === "paca" ? "🤖" : "🐱";
  return <><h2 className={styles.activityPrompt}>{activity.title}</h2><button type="button" className={styles.colorTarget} onClick={() => setApplied(true)} style={{ background: applied ? color : "#f4f8fb", border: 0, width: "100%" }}>{emoji}</button><div className={styles.palette}>{colors.map((item) => <button type="button" key={item} className={styles.colorDot} onClick={() => setColor(item)} style={{ background: item, outline: color === item ? "3px solid #173a5e" : "none" }} aria-label={`Pilih warna ${item}`} />)}</div><div style={{ textAlign: "center" }}>{applied ? <button type="button" className={styles.primaryButton} onClick={() => onDone(completeActivity(childId, activity.id))}>Selesai · +{activity.stars} ⭐</button> : <span className={styles.tag}>Pilih warna lalu sentuh karakter</span>}</div></>;
}

function StoryActivity({ childId, activity, onDone }: { childId: string; activity: LearningActivity; onDone: (value: LearningProgress) => void }) {
  const fullText = (activity.storyLines ?? []).join(" ");
  return <><h2 className={styles.activityPrompt}>{activity.title}</h2><div style={{ textAlign: "center" }}><button type="button" className={styles.secondaryButton} onClick={() => speak(fullText)}>🔊 Dengarkan cerita</button></div><div className={styles.storyCard}>{(activity.storyLines ?? []).map((line) => <p className={styles.storyLine} key={line}>{line}</p>)}</div><div style={{ textAlign: "center" }}><button type="button" className={styles.primaryButton} onClick={() => onDone(completeActivity(childId, activity.id))}>Selesai · +{activity.stars} ⭐</button></div></>;
}

function MotionActivity({ childId, activity }: { childId: string; activity: LearningActivity }) {
  return <><h2 className={styles.activityPrompt}>Main pakai gerakan?</h2><div className={styles.motionNotice}><strong>Mode ini opsional.</strong><br />Kalau pakai HP, taruh perangkat di tempat stabil dan pastikan tangan/tubuh terlihat. Kalau setup ribet, kembali ke Belajar dan pilih aktivitas sentuh.</div><div className={styles.heroActionRow} style={{ justifyContent: "center" }}>{activity.gameSlug ? <Link className={styles.primaryButton} href={`/play/${activity.gameSlug}`}>📷 Buka game gerak</Link> : null}<Link className={styles.secondaryButton} href={`/child/${childId}/learn`}>Belajar tanpa kamera</Link></div></>;
}

export function ActivityScreen({ childId, activityId }: { childId: string; activityId: string }) {
  const profile = useLearningProfile(childId); const activity = getActivity(activityId); const [progress, setProgress] = useState<LearningProgress>({ completedActivityIds: [], stars: 0, lastActivityId: null });
  useEffect(() => { const frame = window.requestAnimationFrame(() => setProgress(readProgress(childId))); return () => window.cancelAnimationFrame(frame); }, [childId]);
  if (!profile || !activity) return <main className={styles.contentNarrow}><div className={styles.emptyState}>Aktivitas tidak ditemukan.</div></main>;
  const subject = getSubject(activity.subjectId)!; const stage = getStage(activity.stageId)!; const done = progress.completedActivityIds.includes(activity.id);
  return <main className={styles.contentNarrow}><section className={styles.activityViewport}><div className={styles.activityTopbar}><Link className={styles.backButton} href={`/child/${childId}/stage/${stage.id}`} aria-label="Kembali">←</Link><span className={styles.tag}>{subject.emoji} {subject.shortTitle}</span><span className={styles.tag}>⭐ {progress.stars}</span></div>{activity.runtime === "tap_choice" || activity.runtime === "listen_and_choose" ? <ChoiceActivity childId={childId} activity={activity} onDone={setProgress} /> : null}{activity.runtime === "matching" ? <MatchingActivity childId={childId} activity={activity} onDone={setProgress} /> : null}{activity.runtime === "trace" ? <TraceActivity childId={childId} activity={activity} onDone={setProgress} /> : null}{activity.runtime === "coloring" ? <ColoringActivity childId={childId} activity={activity} onDone={setProgress} /> : null}{activity.runtime === "story" ? <StoryActivity childId={childId} activity={activity} onDone={setProgress} /> : null}{activity.runtime === "motion_game" ? <MotionActivity childId={childId} activity={activity} /> : null}{done && activity.runtime !== "motion_game" ? <Link className={styles.secondaryButton} href={`/child/${childId}/stage/${stage.id}`}>← Kembali ke stage</Link> : null}</section></main>;
}

export function GamesScreen({ childId }: { childId: string }) {
  const profile = useLearningProfile(childId); if (!profile) return <ChildLoading />;
  return <main className={styles.content}><p className={styles.eyebrow}>Main Gerak</p><h1 className={styles.pageTitle}>10 game tetap ada 🎮</h1><p className={styles.pageLead}>Ruang khusus game kamera Mainlagi. Tidak wajib untuk learning path utama.</p><section className={styles.section}><div className={styles.motionNotice}><strong>Tips HP:</strong> taruh HP di tempat stabil, beri jarak, dan gunakan landscape bila perlu. Kalau HP masih di tangan, pilih <Link href={`/child/${childId}/learn`}>Belajar tanpa kamera</Link>.</div></section><section className={styles.section}><div className={styles.cardGrid}>{GAME_LIST.map((game) => <Link className={styles.gameCard} href={`/play/${game.slug}`} key={game.slug}><span className={styles.gameIcon} aria-hidden>{game.visionMode === "pose" ? "🏃" : "✋"}</span><h3>{game.shortTitle}</h3><p>{game.description}</p><span className={styles.gameCardFooter}><span className={`${styles.tag} ${styles.tagMotion}`}>{game.visionMode === "pose" ? "Gerak badan" : game.visionMode === "hybrid" ? "Gerak hybrid" : "Gerak tangan"}</span><span aria-hidden>→</span></span></Link>)}</div></section></main>;
}

export function RewardsScreen({ childId }: { childId: string }) {
  const profile = useLearningProfile(childId); const progress = useLearningProgress(childId); if (!profile) return <ChildLoading />;
  return <main className={styles.contentNarrow}><section className={styles.rewardHero}><CharacterAvatar id="gavi" large /><div className={styles.rewardStars}>⭐</div><strong>{progress.stars} bintang</strong><span>{progress.completedActivityIds.length} aktivitas selesai</span></section><section className={styles.section}><div className={styles.infoBanner}><strong>Hadiah tanpa tekanan.</strong> Tidak ada streak yang menghukum anak, dan bintang bukan nilai kecerdasan.</div></section><div className={styles.heroActionRow}><Link className={styles.primaryButton} href={`/child/${childId}/learn`}>Cari aktivitas berikutnya</Link></div></main>;
}
