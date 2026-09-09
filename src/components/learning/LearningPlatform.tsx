"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode
} from "react";
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
  getNextActivity,
  getStage,
  getStagesForSubject,
  getSubject,
  readPreferences,
  readProfile,
  readProfiles,
  readProgress,
  savePreferences,
  saveProfile,
  type CharacterId,
  type LearningActivity,
  type LearningChildProfile,
  type LearningPreferences,
  type LearningProgress,
  type LearningSubject,
  type LearningSubjectId
} from "@/lib/learning/system";
import styles from "./LearningPlatform.module.css";

function CharacterAvatar({ id, large = false }: { id: CharacterId; large?: boolean }) {
  const common = {
    className: large ? styles.characterBubbleLarge : styles.characterBubble,
    role: "img",
    "aria-label": CHARACTERS[id].name
  } as const;

  if (id === "paca") {
    return (
      <span {...common} style={{ background: "#e8f5ff" }}>
        <svg width="74%" height="74%" viewBox="0 0 80 80" aria-hidden>
          <rect x="14" y="18" width="52" height="44" rx="17" fill="#ffffff" stroke="#4b86d9" strokeWidth="4" />
          <rect x="20" y="24" width="40" height="27" rx="11" fill="#173a5e" />
          <circle cx="32" cy="37" r="4" fill="#6ee7ff" />
          <circle cx="48" cy="37" r="4" fill="#6ee7ff" />
          <path d="M33 44c4 4 10 4 14 0" fill="none" stroke="#6ee7ff" strokeWidth="3" strokeLinecap="round" />
          <path d="M40 18V10" stroke="#4b86d9" strokeWidth="4" strokeLinecap="round" />
          <circle cx="40" cy="8" r="4" fill="#30b4f2" />
          <circle cx="14" cy="37" r="5" fill="#6cb3ff" />
          <circle cx="66" cy="37" r="5" fill="#6cb3ff" />
        </svg>
      </span>
    );
  }

  if (id === "gavi") {
    return (
      <span {...common} style={{ background: "#fff2d7" }}>
        <svg width="76%" height="76%" viewBox="0 0 80 80" aria-hidden>
          <path d="M20 30 16 13l18 11c4-2 8-2 12 0l18-11-4 17c5 6 7 13 7 21 0 14-12 23-27 23S13 65 13 51c0-8 2-15 7-21Z" fill="#f59e0b" />
          <path d="M29 30c4-4 18-4 22 0" fill="#ffc74f" />
          <circle cx="30" cy="43" r="4" fill="#2d2b2a" />
          <circle cx="50" cy="43" r="4" fill="#2d2b2a" />
          <path d="m40 49-5 4h10Z" fill="#c45822" />
          <path d="M40 53c-2 5-8 6-12 3M40 53c2 5 8 6 12 3" fill="none" stroke="#684029" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M23 48H10M23 53H8M57 48h13M57 53h15" stroke="#8a572c" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
    );
  }

  if (id === "naya") {
    return (
      <span {...common} style={{ background: "#ffe5ef" }}>
        <svg width="78%" height="78%" viewBox="0 0 80 80" aria-hidden>
          <path d="M16 59c0-22 7-40 24-40s24 18 24 40Z" fill="#ef6a9e" />
          <circle cx="40" cy="38" r="19" fill="#f5b38d" />
          <path d="M20 38c2-18 9-28 20-28s20 10 20 28c-4-8-10-14-20-14S24 30 20 38Z" fill="#e84b8a" />
          <path d="M25 43c-4 7-5 16-3 25h36c2-9 1-18-3-25-2 12-28 12-30 0Z" fill="#e84b8a" />
          <circle cx="33" cy="38" r="2.5" fill="#3d2c28" />
          <circle cx="47" cy="38" r="2.5" fill="#3d2c28" />
          <path d="M33 48c4 4 10 4 14 0" fill="none" stroke="#9e4b42" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </span>
    );
  }

  const girl = id === "zia";
  return (
    <span {...common} style={{ background: girl ? "#f6e8ff" : "#e8f1ff" }}>
      <svg width="78%" height="78%" viewBox="0 0 80 80" aria-hidden>
        <circle cx="40" cy="39" r="22" fill="#f2b28d" />
        <path
          d={girl ? "M18 38c1-18 10-27 22-27s21 9 22 27c-7-8-14-11-22-11s-15 3-22 11Z" : "M18 35c3-16 12-24 25-24 11 0 18 7 20 18-8-4-13-6-20-5-10 2-14 8-25 11Z"}
          fill="#603d2c"
        />
        {girl ? <><circle cx="18" cy="34" r="7" fill="#6e4633" /><circle cx="62" cy="34" r="7" fill="#6e4633" /></> : null}
        <circle cx="32" cy="40" r="3" fill="#352925" />
        <circle cx="48" cy="40" r="3" fill="#352925" />
        <path d="M33 50c4 4 10 4 14 0" fill="none" stroke="#9e4b42" strokeWidth="2.7" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function CharacterGroup() {
  return (
    <div className={styles.characterCluster} aria-label="Karakter Mainlagi">
      <CharacterAvatar id="naya" />
      <CharacterAvatar id="gian" />
      <CharacterAvatar id="paca" large />
      <CharacterAvatar id="zia" />
      <CharacterAvatar id="gavi" />
    </div>
  );
}

function useLearningProfile(childId: string) {
  const [profile, setProfile] = useState<LearningChildProfile | null>(null);
  useEffect(() => {
    setProfile(readProfile(childId) ?? (childId === DEMO_PROFILE.id ? DEMO_PROFILE : null));
  }, [childId]);
  return profile;
}

function useLearningProgress(childId: string) {
  const [progress, setProgress] = useState<LearningProgress>({ completedActivityIds: [], stars: 0, lastActivityId: null });
  useEffect(() => {
    const update = () => setProgress(readProgress(childId));
    update();
    const onCustom = (event: Event) => {
      const detail = (event as CustomEvent<{ childId?: string }>).detail;
      if (!detail?.childId || detail.childId === childId) update();
    };
    window.addEventListener("mainlagi-learning-progress", onCustom);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("mainlagi-learning-progress", onCustom);
      window.removeEventListener("storage", update);
    };
  }, [childId]);
  return progress;
}

function ChildLoading() {
  return <main className={styles.content}><div className={styles.emptyState}>Menyiapkan ruang belajar...</div></main>;
}

export function ChildShell({ childId, children }: { childId: string; children: ReactNode }) {
  const pathname = usePathname();
  const profile = useLearningProfile(childId);
  const base = `/child/${childId}`;
  const items = [
    { href: `${base}/home`, label: "Home", icon: "🏠" },
    { href: `${base}/learn`, label: "Belajar", icon: "📚" },
    { href: `${base}/games`, label: "Main Gerak", icon: "🎮" },
    { href: `${base}/rewards`, label: "Hadiah", icon: "⭐" }
  ];

  return (
    <div className={styles.childShell}>
      <header className={styles.childHeader}>
        <Link className={styles.brand} href={`${base}/home`}>
          <span className={styles.brandMark}>M</span>
          <span>Mainlagi</span>
        </Link>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link className={styles.parentPill} href="/parent" aria-label="Area orang tua">👨‍👩‍👧</Link>
          <Link className={styles.profilePill} href="/child/select">
            <span>{profile ? CHARACTERS[profile.guide].emoji : "🙂"}</span>
            <span>{profile?.name ?? "Profil"}<small>{profile ? `${profile.age} tahun` : "Pilih anak"}</small></span>
          </Link>
        </div>
      </header>
      {children}
      <nav className={styles.bottomNav} aria-label="Navigasi anak">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link key={item.href} href={item.href} className={`${styles.bottomNavItem} ${active ? styles.bottomNavItemActive : ""}`}>
              <span aria-hidden>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function ChildSelectScreen() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<LearningChildProfile[]>([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState(5);
  const [guide, setGuide] = useState<CharacterId>("paca");

  useEffect(() => setProfiles(readProfiles()), []);

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
        <p className={styles.pageLead}>Profil ini masih prototype lokal di perangkat. Data cloud akan disambungkan setelah model child-profile final.</p>

        <section className={styles.section}>
          <div className={styles.profileGrid}>
            <Link className={styles.profileCard} href={`/child/${DEMO_PROFILE.id}/home`}>
              <CharacterAvatar id={DEMO_PROFILE.guide} />
              <span className={styles.profileCardText}><strong>{DEMO_PROFILE.name} — Demo</strong><span>{DEMO_PROFILE.age} tahun · Mulai cepat tanpa setup</span></span>
              <span aria-hidden>→</span>
            </Link>
            {profiles.map((profile) => (
              <Link className={styles.profileCard} href={`/child/${profile.id}/home`} key={profile.id}>
                <CharacterAvatar id={profile.guide} />
                <span className={styles.profileCardText}><strong>{profile.name}</strong><span>{profile.age} tahun · Guide {CHARACTERS[profile.guide].name}</span></span>
                <span aria-hidden>→</span>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.formCard}>
          <h2 style={{ margin: 0, color: "#24445e" }}>Tambah profil anak</h2>
          <div className={styles.formGroup}>
            <label htmlFor="child-name">Nama panggilan</label>
            <input id="child-name" className={styles.input} value={name} onChange={(event) => setName(event.target.value)} maxLength={24} placeholder="Contoh: Gian" />
          </div>
          <div className={styles.formGroup}>
            <span className={styles.formLabel}>Umur</span>
            <div className={styles.choiceRow}>
              {[3, 4, 5, 6, 7].map((value) => (
                <button type="button" key={value} className={`${styles.choicePill} ${age === value ? styles.choicePillActive : ""}`} onClick={() => setAge(value)}>{value}</button>
              ))}
            </div>
          </div>
          <div className={styles.formGroup}>
            <span className={styles.formLabel}>Teman panduan</span>
            <div className={styles.choiceRow}>
              {(Object.keys(CHARACTERS) as CharacterId[]).map((id) => (
                <button type="button" key={id} className={`${styles.choicePill} ${guide === id ? styles.choicePillActive : ""}`} onClick={() => setGuide(id)} aria-label={CHARACTERS[id].name}>{CHARACTERS[id].emoji} {CHARACTERS[id].name}</button>
              ))}
            </div>
          </div>
          <div className={styles.heroActionRow}>
            <button type="button" className={styles.primaryButton} onClick={createProfile}>Buat profil</button>
            <Link className={styles.secondaryButton} href="/parent">Area orang tua</Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function SubjectScroller({ childId, active }: { childId: string; active?: LearningSubjectId }) {
  return (
    <div className={styles.subjectScroller} aria-label="Area belajar">
      {SUBJECTS.map((subject) => (
        <Link
          key={subject.id}
          href={`/child/${childId}/subject/${subject.id}`}
          className={`${styles.subjectChip} ${active === subject.id ? styles.subjectChipActive : ""}`}
          style={{ "--accent": subject.accent, "--soft": subject.soft } as CSSProperties}
        >
          <span className={styles.subjectChipIcon} aria-hidden>{subject.emoji}</span>
          <span>{subject.shortTitle}</span>
        </Link>
      ))}
    </div>
  );
}

function StageCard({ childId, stageId, progress, subject }: { childId: string; stageId: string; progress: LearningProgress; subject: LearningSubject }) {
  const stage = getStage(stageId)!;
  const activities = getActivitiesForStage(stageId);
  const done = activities.filter((item) => progress.completedActivityIds.includes(item.id)).length;
  const percent = activities.length ? Math.round((done / activities.length) * 100) : 0;
  return (
    <Link href={`/child/${childId}/stage/${stageId}`} className={styles.stageCard} style={{ "--accent": subject.accent, "--soft": subject.soft } as CSSProperties}>
      <span className={styles.stageIcon} aria-hidden>{stage.emoji}</span>
      <h3>{stage.title}</h3>
      <p>{stage.subtitle}</p>
      <span className={styles.stageProgress}>
        <span className={styles.progressTrack}><span className={styles.progressFill} style={{ width: `${percent}%` }} /></span>
        <span>{done}/{activities.length}</span>
      </span>
    </Link>
  );
}

function runtimeLabel(activity: LearningActivity) {
  switch (activity.runtime) {
    case "tap_choice": return "Sentuh";
    case "listen_and_choose": return "Audio + sentuh";
    case "matching": return "Pasangkan";
    case "trace": return "Trace jari";
    case "coloring": return "Mewarnai";
    case "story": return "Cerita";
    case "motion_game": return "Gerak kamera";
  }
}

function ActivityCard({ childId, activity, progress, subject }: { childId: string; activity: LearningActivity; progress: LearningProgress; subject: LearningSubject }) {
  const done = progress.completedActivityIds.includes(activity.id);
  return (
    <Link href={`/child/${childId}/activity/${activity.id}`} className={styles.activityCard} style={{ "--accent": subject.accent, "--soft": subject.soft } as CSSProperties}>
      <span className={styles.activityIcon} aria-hidden>{activity.emoji}</span>
      <h3>{activity.title}</h3>
      <p>{activity.description}</p>
      <span className={styles.activityMeta}>
        <span className={styles.tag}>{runtimeLabel(activity)}</span>
        {activity.motionOptional ? <span className={`${styles.tag} ${styles.tagMotion}`}>Gerak opsional</span> : null}
        {done ? <span className={`${styles.tag} ${styles.tagDone}`}>✓ Selesai</span> : null}
      </span>
    </Link>
  );
}

export function ChildHomeScreen({ childId }: { childId: string }) {
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);
  if (!profile) return <ChildLoading />;
  const next = getNextActivity(profile.age, progress);
  const nextSubject = next ? getSubject(next.subjectId) : undefined;

  return (
    <main className={styles.content}>
      <section className={styles.heroCard}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Halo, {profile.name}! 👋</p>
          <h1>Belajar sebentar, main lagi.</h1>
          <p>Di HP, aktivitas sentuh, audio, trace, dan warna jadi pilihan utama. Main pakai kamera tetap ada kalau kamu mau.</p>
          <div className={styles.heroActionRow}>
            {next ? <Link className={styles.primaryButton} href={`/child/${childId}/activity/${next.id}`}>▶ Lanjut: {next.title}</Link> : null}
            <Link className={styles.secondaryButton} href={`/child/${childId}/learn`}>Lihat semua belajar</Link>
          </div>
        </div>
        <CharacterGroup />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}><h2>Pilih yang mau dipelajari</h2><span className={styles.tag}>⭐ {progress.stars}</span></div>
        <SubjectScroller childId={childId} />
      </section>

      {next && nextSubject ? (
        <section className={styles.section}>
          <div className={styles.sectionHead}><h2>Lanjut belajar</h2></div>
          <div className={styles.cardGrid}>
            <ActivityCard childId={childId} activity={next} progress={progress} subject={nextSubject} />
          </div>
        </section>
      ) : null}

      <section className={styles.section}>
        <div className={styles.infoBanner}><strong>Main Gerak tetap ada.</strong> Kamera bukan syarat untuk belajar inti. Kalau lagi pakai HP di tangan, pilih aktivitas sentuh dulu; game gerak bisa dimainkan saat perangkat bisa ditaruh stabil.</div>
      </section>
    </main>
  );
}

export function LearnLibraryScreen({ childId }: { childId: string }) {
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);
  if (!profile) return <ChildLoading />;
  return (
    <main className={styles.content}>
      <p className={styles.eyebrow}>Library</p>
      <h1 className={styles.pageTitle}>Belajar</h1>
      <p className={styles.pageLead}>Pilih area belajar. Aktivitas utama dirancang nyaman untuk HP dan sentuhan; kamera hanya muncul kalau memang berguna.</p>
      <section className={styles.section}><SubjectScroller childId={childId} /></section>
      <section className={styles.section}>
        <div className={styles.sectionHead}><h2>Semua stage contoh</h2></div>
        <div className={`${styles.cardGrid} ${styles.stageGrid}`}>
          {STAGES.map((stage) => {
            const subject = getSubject(stage.subjectId)!;
            return <StageCard key={stage.id} childId={childId} stageId={stage.id} progress={progress} subject={subject} />;
          })}
        </div>
      </section>
      <section className={styles.section}><div className={styles.infoBanner}><strong>Catatan prototype:</strong> judul dan isi aktivitas di layar ini adalah contoh UI/interaction. Kurikulum final per umur belum diklaim atau dikunci oleh implementasi ini.</div></section>
    </main>
  );
}

export function SubjectScreen({ childId, subjectId }: { childId: string; subjectId: string }) {
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);
  const subject = getSubject(subjectId);
  if (!profile || !subject) return <main className={styles.content}><div className={styles.emptyState}>Area belajar tidak ditemukan.</div></main>;
  const stages = getStagesForSubject(subject.id);
  return (
    <main className={styles.content}>
      <p className={styles.eyebrow}>{subject.emoji} Area belajar</p>
      <h1 className={styles.pageTitle}>{subject.title}</h1>
      <p className={styles.pageLead}>{subject.description}</p>
      <section className={styles.section}><SubjectScroller childId={childId} active={subject.id} /></section>
      <section className={styles.section}>
        <div className={styles.sectionHead}><h2>Stage</h2></div>
        <div className={`${styles.cardGrid} ${styles.stageGrid}`}>
          {stages.map((stage) => <StageCard key={stage.id} childId={childId} stageId={stage.id} progress={progress} subject={subject} />)}
        </div>
      </section>
    </main>
  );
}

export function StageScreen({ childId, stageId }: { childId: string; stageId: string }) {
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);
  const stage = getStage(stageId);
  if (!profile || !stage) return <main className={styles.content}><div className={styles.emptyState}>Stage tidak ditemukan.</div></main>;
  const subject = getSubject(stage.subjectId)!;
  const activities = getActivitiesForStage(stage.id);
  return (
    <main className={styles.content}>
      <Link className={styles.backButton} href={`/child/${childId}/subject/${stage.subjectId}`} aria-label="Kembali">←</Link>
      <div style={{ marginTop: 16 }}>
        <p className={styles.eyebrow}>{subject.title}</p>
        <h1 className={styles.pageTitle}>{stage.emoji} {stage.title}</h1>
        <p className={styles.pageLead}>{stage.subtitle}</p>
      </div>
      <section className={styles.section}>
        <div className={styles.cardGrid}>
          {activities.map((activity) => <ActivityCard key={activity.id} childId={childId} activity={activity} progress={progress} subject={subject} />)}
        </div>
      </section>
      {activities.some((item) => item.motionOptional) ? (
        <section className={styles.section}><div className={styles.motionNotice}><strong>Gerak = pilihan tambahan.</strong> Aktivitas kamera tidak wajib untuk menyelesaikan pengalaman belajar inti di HP.</div></section>
      ) : null}
    </main>
  );
}

function speak(text: string, lang = "id-ID") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function CompletionPanel({ childId, activity, onDone }: { childId: string; activity: LearningActivity; onDone: (value: LearningProgress) => void }) {
  const finish = () => onDone(completeActivity(childId, activity.id));
  return <button type="button" className={styles.primaryButton} onClick={finish}>Selesai · +{activity.stars} ⭐</button>;
}

function ChoiceActivity({ childId, activity, onDone }: { childId: string; activity: LearningActivity; onDone: (value: LearningProgress) => void }) {
  const [feedback, setFeedback] = useState<"good" | "try" | null>(null);
  const choose = (choice: string) => {
    if (choice === activity.correctChoice) {
      setFeedback("good");
      onDone(completeActivity(childId, activity.id));
    } else {
      setFeedback("try");
    }
  };
  return (
    <>
      <h2 className={styles.activityPrompt}>{activity.prompt}</h2>
      {activity.runtime === "listen_and_choose" ? (
        <div style={{ textAlign: "center" }}><button type="button" className={styles.secondaryButton} onClick={() => speak(activity.prompt ?? activity.title, activity.subjectId === "english" ? "en-US" : "id-ID")}>🔊 Putar suara</button></div>
      ) : null}
      <div className={styles.choiceGrid}>
        {(activity.choices ?? []).map((choice) => <button type="button" className={styles.bigChoice} key={choice} onClick={() => choose(choice)}>{choice}</button>)}
      </div>
      {feedback === "good" ? <div className={styles.feedbackGood}>Hebat! ⭐ Aktivitas selesai.</div> : null}
      {feedback === "try" ? <div className={styles.feedbackTry}>Hampir. Coba satu kali lagi ya.</div> : null}
    </>
  );
}

function MatchingActivity({ childId, activity, onDone }: { childId: string; activity: LearningActivity; onDone: (value: LearningProgress) => void }) {
  const items = activity.matchItems ?? [];
  const [selected, setSelected] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [message, setMessage] = useState("Pilih dua kartu yang cocok.");

  const pick = (index: number) => {
    if (matched.includes(index)) return;
    if (selected === null) {
      setSelected(index);
      return;
    }
    if (selected === index) {
      setSelected(null);
      return;
    }
    if (items[selected]?.pair === items[index]?.pair) {
      const next = [...matched, selected, index];
      setMatched(next);
      setSelected(null);
      setMessage("Cocok! Lanjutkan.");
      if (next.length === items.length) onDone(completeActivity(childId, activity.id));
    } else {
      setSelected(null);
      setMessage("Belum cocok. Coba pasangan lain.");
    }
  };

  return (
    <>
      <h2 className={styles.activityPrompt}>{activity.prompt ?? "Pasangkan kartu"}</h2>
      <div className={styles.matchGrid}>
        {items.map((item, index) => (
          <button
            type="button"
            className={`${styles.matchButton} ${selected === index ? styles.matchSelected : ""} ${matched.includes(index) ? styles.matchDone : ""}`}
            onClick={() => pick(index)}
            key={`${item.label}-${index}`}
          >{matched.includes(index) ? "✓ " : ""}{item.label}</button>
        ))}
      </div>
      <div className={matched.length === items.length ? styles.feedbackGood : styles.infoBanner}>{message}</div>
    </>
  );
}

function TraceActivity({ childId, activity, onDone }: { childId: string; activity: LearningActivity; onDone: (value: LearningProgress) => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const [hasStroke, setHasStroke] = useState(false);
  const [done, setDone] = useState(false);

  const point = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (event.clientX - rect.left) * scaleX, y: (event.clientY - rect.top) * scaleY };
  };

  const start = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    canvas.setPointerCapture(event.pointerId);
    const ctx = canvas.getContext("2d");
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
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#31b99e";
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  };

  const end = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    drawingRef.current = false;
    try { event.currentTarget.releasePointerCapture(event.pointerId); } catch {}
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
      <h2 className={styles.activityPrompt}>Telusuri {activity.traceGlyph} dengan jari</h2>
      <div className={styles.traceWrap}>
        <div style={{ position: "relative", width: "min(100%, 380px)" }}>
          <div aria-hidden style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "#dfe8ee", fontSize: 250, fontWeight: 900, pointerEvents: "none", lineHeight: 1 }}>{activity.traceGlyph}</div>
          <canvas ref={canvasRef} width={640} height={640} className={styles.traceCanvas} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end} />
        </div>
        <div className={styles.heroActionRow}>
          <button type="button" className={styles.secondaryButton} onClick={reset}>Ulangi</button>
          <button type="button" className={styles.primaryButton} onClick={finish} disabled={!hasStroke}>Selesai</button>
        </div>
      </div>
      {done ? <div className={styles.feedbackGood}>Bagus! Trace tersimpan sebagai selesai. Penilaian bentuk final belum diklaim pada prototype ini.</div> : null}
    </>
  );
}

function ColoringActivity({ childId, activity, onDone }: { childId: string; activity: LearningActivity; onDone: (value: LearningProgress) => void }) {
  const colors = ["#f59e0b", "#ec6aa5", "#6c7df7", "#1ec9a6", "#ef4444", "#22c55e"];
  const [color, setColor] = useState(colors[0]);
  const [applied, setApplied] = useState(false);
  const emoji = activity.coloringCharacter === "paca" ? "🤖" : "🐱";
  return (
    <>
      <h2 className={styles.activityPrompt}>{activity.title}</h2>
      <div className={styles.colorTarget} onClick={() => setApplied(true)} style={{ background: applied ? color : "#f4f8fb" }} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setApplied(true); }}>{emoji}</div>
      <div className={styles.palette} aria-label="Pilih warna">
        {colors.map((item) => <button type="button" key={item} className={styles.colorDot} onClick={() => setColor(item)} style={{ background: item, outline: color === item ? "3px solid #173a5e" : "none" }} aria-label={`Pilih warna ${item}`} />)}
      </div>
      <div style={{ textAlign: "center" }}>{applied ? <CompletionPanel childId={childId} activity={activity} onDone={onDone} /> : <span className={styles.tag}>Pilih warna lalu sentuh karakter</span>}</div>
    </>
  );
}

function StoryActivity({ childId, activity, onDone }: { childId: string; activity: LearningActivity; onDone: (value: LearningProgress) => void }) {
  const fullText = (activity.storyLines ?? []).join(" ");
  return (
    <>
      <h2 className={styles.activityPrompt}>{activity.title}</h2>
      <div style={{ textAlign: "center" }}><button type="button" className={styles.secondaryButton} onClick={() => speak(fullText)}>🔊 Dengarkan cerita</button></div>
      <div className={styles.storyCard}>{(activity.storyLines ?? []).map((line) => <p className={styles.storyLine} key={line}>{line}</p>)}</div>
      <div style={{ textAlign: "center" }}><CompletionPanel childId={childId} activity={activity} onDone={onDone} /></div>
    </>
  );
}

function MotionActivity({ childId, activity }: { childId: string; activity: LearningActivity }) {
  return (
    <>
      <h2 className={styles.activityPrompt}>Main pakai gerakan?</h2>
      <div className={styles.motionNotice}>
        <strong>Mode ini opsional.</strong><br />
        Kalau pakai HP, taruh perangkat di tempat stabil dan pastikan tangan/tubuh terlihat. Kalau setup-nya ribet, kembali ke Belajar dan pilih aktivitas sentuh tanpa kamera.
      </div>
      <div className={styles.heroActionRow} style={{ justifyContent: "center" }}>
        {activity.gameSlug ? <Link className={styles.primaryButton} href={`/play/${activity.gameSlug}`}>📷 Buka game gerak</Link> : null}
        <Link className={styles.secondaryButton} href={`/child/${childId}/learn`}>Belajar tanpa kamera</Link>
      </div>
      <p style={{ margin: 0, color: "#71879a", fontSize: 12, textAlign: "center" }}>Game existing tetap memakai runtime MediaPipe saat dibuka.</p>
    </>
  );
}

export function ActivityScreen({ childId, activityId }: { childId: string; activityId: string }) {
  const profile = useLearningProfile(childId);
  const activity = getActivity(activityId);
  const [progress, setProgress] = useState<LearningProgress>({ completedActivityIds: [], stars: 0, lastActivityId: null });
  if (!profile || !activity) return <main className={styles.contentNarrow}><div className={styles.emptyState}>Aktivitas tidak ditemukan.</div></main>;
  const subject = getSubject(activity.subjectId)!;
  const stage = getStage(activity.stageId)!;
  const done = progress.completedActivityIds.includes(activity.id);

  useEffect(() => setProgress(readProgress(childId)), [childId]);

  return (
    <main className={styles.contentNarrow}>
      <section className={styles.activityViewport}>
        <div className={styles.activityTopbar}>
          <Link className={styles.backButton} href={`/child/${childId}/stage/${stage.id}`} aria-label="Kembali">←</Link>
          <span className={styles.tag}>{subject.emoji} {subject.shortTitle}</span>
          <span className={styles.tag}>⭐ {progress.stars}</span>
        </div>
        {activity.runtime === "tap_choice" || activity.runtime === "listen_and_choose" ? <ChoiceActivity childId={childId} activity={activity} onDone={setProgress} /> : null}
        {activity.runtime === "matching" ? <MatchingActivity childId={childId} activity={activity} onDone={setProgress} /> : null}
        {activity.runtime === "trace" ? <TraceActivity childId={childId} activity={activity} onDone={setProgress} /> : null}
        {activity.runtime === "coloring" ? <ColoringActivity childId={childId} activity={activity} onDone={setProgress} /> : null}
        {activity.runtime === "story" ? <StoryActivity childId={childId} activity={activity} onDone={setProgress} /> : null}
        {activity.runtime === "motion_game" ? <MotionActivity childId={childId} activity={activity} /> : null}
        {done && activity.runtime !== "motion_game" ? <Link className={styles.secondaryButton} href={`/child/${childId}/stage/${stage.id}`}>← Kembali ke stage</Link> : null}
      </section>
    </main>
  );
}

export function GamesScreen({ childId }: { childId: string }) {
  const profile = useLearningProfile(childId);
  if (!profile) return <ChildLoading />;
  return (
    <main className={styles.content}>
      <p className={styles.eyebrow}>Main Gerak</p>
      <h1 className={styles.pageTitle}>10 game tetap ada 🎮</h1>
      <p className={styles.pageLead}>Ini ruang khusus game kamera Mainlagi. Tidak wajib untuk mengikuti learning path utama.</p>
      <section className={styles.section}><div className={styles.motionNotice}><strong>Tips HP:</strong> taruh HP di tempat stabil, beri jarak, dan gunakan landscape bila game membutuhkannya. Kalau lagi memegang HP, pilih <Link href={`/child/${childId}/learn`}>Belajar tanpa kamera</Link>.</div></section>
      <section className={styles.section}>
        <div className={styles.cardGrid}>
          {GAME_LIST.map((game) => (
            <Link className={styles.gameCard} href={`/play/${game.slug}`} key={game.slug}>
              <span className={styles.gameIcon} aria-hidden>{game.visionMode === "pose" ? "🏃" : "✋"}</span>
              <h3>{game.shortTitle}</h3>
              <p>{game.description}</p>
              <span className={styles.gameCardFooter}><span className={`${styles.tag} ${styles.tagMotion}`}>{game.visionMode === "pose" ? "Gerak badan" : game.visionMode === "hybrid" ? "Gerak hybrid" : "Gerak tangan"}</span><span aria-hidden>→</span></span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export function RewardsScreen({ childId }: { childId: string }) {
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);
  if (!profile) return <ChildLoading />;
  return (
    <main className={styles.contentNarrow}>
      <section className={styles.rewardHero}>
        <CharacterAvatar id="gavi" large />
        <div className={styles.rewardStars}>⭐</div>
        <strong>{progress.stars} bintang</strong>
        <span>{progress.completedActivityIds.length} aktivitas selesai</span>
      </section>
      <section className={styles.section}>
        <div className={styles.infoBanner}><strong>Hadiah tanpa tekanan.</strong> Prototype ini tidak memakai streak yang menghukum anak. Bintang menunjukkan aktivitas yang sudah dicoba/diselesaikan, bukan nilai kecerdasan.</div>
      </section>
      <div className={styles.heroActionRow}><Link className={styles.primaryButton} href={`/child/${childId}/learn`}>Cari aktivitas berikutnya</Link></div>
    </main>
  );
}

const PARENT_NAV = [
  { href: "/parent", label: "Overview", icon: "🏠" },
  { href: "/parent/children", label: "Anak", icon: "👧" },
  { href: "/parent/privacy", label: "Privacy & AI", icon: "🛡️" },
  { href: "/parent/plan", label: "Plan", icon: "✨" },
  { href: "/parent/settings", label: "Settings", icon: "⚙️" }
];

export function ParentShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className={styles.parentSurface}>
      <div className={styles.parentLayout}>
        <aside className={styles.parentSidebar}>
          <Link className={styles.parentBrand} href="/"><span className={styles.brandMark}>M</span><span>Mainlagi Parent</span></Link>
          {PARENT_NAV.map((item) => {
            const active = item.href === "/parent" ? pathname === "/parent" : pathname.startsWith(item.href);
            return <Link key={item.href} href={item.href} className={`${styles.parentNavItem} ${active ? styles.parentNavItemActive : ""}`}><span>{item.icon}</span><span>{item.label}</span></Link>;
          })}
          <Link href="/child/select" className={styles.parentNavItem}><span>🧸</span><span>Mode anak</span></Link>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}

function useAllProfiles() {
  const [profiles, setProfiles] = useState<LearningChildProfile[]>([DEMO_PROFILE]);
  useEffect(() => setProfiles([DEMO_PROFILE, ...readProfiles().filter((item) => item.id !== DEMO_PROFILE.id)]), []);
  return profiles;
}

export function ParentOverviewScreen() {
  const profiles = useAllProfiles();
  const metrics = profiles.map((profile) => ({ profile, progress: readProgress(profile.id) }));
  const totalStars = metrics.reduce((sum, item) => sum + item.progress.stars, 0);
  const totalDone = metrics.reduce((sum, item) => sum + item.progress.completedActivityIds.length, 0);
  return (
    <main className={styles.parentMain}>
      <p className={styles.eyebrow}>Area orang tua</p>
      <h1 className={styles.pageTitle}>Ringkasan belajar</h1>
      <p className={styles.pageLead}>Data di layar prototype ini masih local-first. Tidak ada klaim diagnosis atau mastery otomatis dari skor game.</p>
      <section className={`${styles.parentGrid} ${styles.parentGridThree}`} style={{ marginTop: 24 }}>
        <div className={styles.parentCard}><div className={styles.metric}><strong>{profiles.length}</strong><span>profil anak</span></div></div>
        <div className={styles.parentCard}><div className={styles.metric}><strong>{totalDone}</strong><span>aktivitas selesai</span></div></div>
        <div className={styles.parentCard}><div className={styles.metric}><strong>{totalStars}</strong><span>bintang terkumpul</span></div></div>
      </section>
      <section className={styles.section}>
        <div className={styles.sectionHead}><h2>Anak</h2><Link className={styles.textButton} href="/parent/children">Lihat semua</Link></div>
        <div className={styles.parentGrid}>
          {profiles.map((profile) => {
            const progress = readProgress(profile.id);
            return <Link href={`/parent/children/${profile.id}`} className={styles.parentCard} key={profile.id} style={{ textDecoration: "none", color: "inherit" }}><div style={{ display: "flex", gap: 12, alignItems: "center" }}><CharacterAvatar id={profile.guide} /><div><strong style={{ color: "#24445e" }}>{profile.name}</strong><p>{profile.age} tahun · {progress.completedActivityIds.length} aktivitas · ⭐ {progress.stars}</p></div></div></Link>;
          })}
        </div>
      </section>
      <section className={styles.section}><div className={styles.infoBanner}><strong>Parent gate:</strong> UI sudah dipisah dari mode anak, tetapi autentikasi/pin parent final belum diimplementasikan pada prototype ini dan harus dihubungkan ke auth production.</div></section>
    </main>
  );
}

export function ParentChildrenScreen() {
  const profiles = useAllProfiles();
  return (
    <main className={styles.parentMain}>
      <p className={styles.eyebrow}>Profiles</p><h1 className={styles.pageTitle}>Anak</h1>
      <p className={styles.pageLead}>Kelola konteks belajar per anak. Profile cloud dan kontrol wali akan diintegrasikan sesudah model data production ditetapkan.</p>
      <section className={styles.section}><div className={styles.parentGrid}>{profiles.map((profile) => <Link href={`/parent/children/${profile.id}`} className={styles.parentCard} style={{ textDecoration: "none", color: "inherit" }} key={profile.id}><div style={{ display: "flex", gap: 12, alignItems: "center" }}><CharacterAvatar id={profile.guide} /><div><strong style={{ color: "#24445e" }}>{profile.name}</strong><p>{profile.age} tahun · Guide {CHARACTERS[profile.guide].name}</p></div></div></Link>)}</div></section>
      <div className={styles.heroActionRow}><Link className={styles.primaryButton} href="/child/select">Tambah / pilih profil</Link></div>
    </main>
  );
}

function ParentChildHeader({ childId }: { childId: string }) {
  const profile = readProfile(childId) ?? (childId === DEMO_PROFILE.id ? DEMO_PROFILE : undefined);
  if (!profile) return null;
  return <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}><CharacterAvatar id={profile.guide} large /><div><p className={styles.eyebrow}>Profil anak</p><h1 className={styles.pageTitle}>{profile.name}</h1><p className={styles.pageLead}>{profile.age} tahun · Guide {CHARACTERS[profile.guide].name}</p></div></div>;
}

export function ParentChildScreen({ childId }: { childId: string }) {
  const progress = readProgress(childId);
  return (
    <main className={styles.parentMain}>
      <ParentChildHeader childId={childId} />
      <div className={`${styles.parentGrid} ${styles.parentGridThree}`}>
        <Link className={styles.parentCard} href={`/parent/children/${childId}/progress`} style={{ textDecoration: "none", color: "inherit" }}><strong>📈 Progress</strong><p>{progress.completedActivityIds.length} aktivitas selesai · ⭐ {progress.stars}</p></Link>
        <Link className={styles.parentCard} href={`/parent/children/${childId}/reports`} style={{ textDecoration: "none", color: "inherit" }}><strong>📝 Report</strong><p>Ringkasan event belajar yang dapat dijelaskan.</p></Link>
        <Link className={styles.parentCard} href={`/parent/children/${childId}/certificates`} style={{ textDecoration: "none", color: "inherit" }}><strong>🏅 Certificate</strong><p>Kriteria sertifikat masih keputusan produk terbuka.</p></Link>
      </div>
      <div className={styles.heroActionRow}><Link className={styles.secondaryButton} href={`/child/${childId}/home`}>Buka mode anak</Link></div>
    </main>
  );
}

export function ParentProgressScreen({ childId }: { childId: string }) {
  const progress = readProgress(childId);
  return (
    <main className={styles.parentMain}>
      <ParentChildHeader childId={childId} />
      <h2 style={{ color: "#24445e" }}>Progress per area</h2>
      <div className={styles.parentGrid}>
        {SUBJECTS.map((subject) => {
          const all = ACTIVITIES.filter((activity) => activity.subjectId === subject.id);
          const done = all.filter((activity) => progress.completedActivityIds.includes(activity.id)).length;
          const pct = all.length ? Math.round((done / all.length) * 100) : 0;
          return <div className={styles.parentCard} key={subject.id} style={{ "--accent": subject.accent } as CSSProperties}><strong>{subject.emoji} {subject.title}</strong><p>{done} dari {all.length} aktivitas contoh selesai</p><div className={styles.stageProgress}><span className={styles.progressTrack}><span className={styles.progressFill} style={{ width: `${pct}%` }} /></span><span>{pct}%</span></div></div>;
        })}
      </div>
      <section className={styles.section}><div className={styles.infoBanner}>Persentase di atas adalah completion pada registry prototype, <strong>bukan mastery akademik</strong>.</div></section>
    </main>
  );
}

export function ParentReportsScreen({ childId }: { childId: string }) {
  const progress = readProgress(childId);
  const completed = progress.completedActivityIds.map((id) => getActivity(id)).filter((item): item is LearningActivity => Boolean(item));
  const runtimeCounts = completed.reduce<Record<string, number>>((acc, activity) => { acc[activity.runtime] = (acc[activity.runtime] ?? 0) + 1; return acc; }, {});
  return (
    <main className={styles.parentMain}>
      <ParentChildHeader childId={childId} />
      <h2 style={{ color: "#24445e" }}>Report yang bisa dijelaskan</h2>
      <div className={styles.parentCard}>
        <ul className={styles.list}>
          <li className={styles.listItem}><span>Aktivitas selesai</span><strong>{completed.length}</strong></li>
          <li className={styles.listItem}><span>Bintang terkumpul</span><strong>{progress.stars}</strong></li>
          <li className={styles.listItem}><span>Aktivitas sentuh/trace/warna</span><strong>{completed.filter((item) => item.runtime !== "motion_game").length}</strong></li>
          <li className={styles.listItem}><span>Aktivitas motion</span><strong>{runtimeCounts.motion_game ?? 0}</strong></li>
        </ul>
      </div>
      <section className={styles.section}><div className={styles.infoBanner}><strong>Tidak ada judgment AI.</strong> Report ini hanya merangkum event yang benar-benar tercatat. “Kuat/lemah/mastered” belum ditampilkan sampai evidence rule kurikulum disetujui.</div></section>
    </main>
  );
}

export function ParentCertificatesScreen({ childId }: { childId: string }) {
  return (
    <main className={styles.parentMain}>
      <ParentChildHeader childId={childId} />
      <div className={styles.certificatePlaceholder}><div><div style={{ fontSize: 60 }}>🏅</div><h2 style={{ color: "#24445e" }}>Certificate system siap sebagai slot UI</h2><p>Kriteria certificate belum diputuskan. Prototype sengaja tidak mengarang syarat kelulusan.</p></div></div>
    </main>
  );
}

export function ParentPrivacyScreen() {
  const [prefs, setPrefs] = useState<LearningPreferences>({ allowMotionRecommendations: false, allowAiFeatures: false, reducedMotion: false, language: "id" });
  useEffect(() => setPrefs(readPreferences()), []);
  const update = (patch: Partial<LearningPreferences>) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    savePreferences(next);
  };
  return (
    <main className={styles.parentMain}>
      <p className={styles.eyebrow}>Kontrol orang tua</p><h1 className={styles.pageTitle}>Privacy & AI</h1>
      <p className={styles.pageLead}>Motion dan AI bukan syarat belajar. Default prototype dibuat konservatif: rekomendasi motion OFF, AI OFF.</p>
      <section className={styles.section}><div className={styles.parentCard}>
        <div className={styles.toggleRow}><div className={styles.toggleText}><strong>Rekomendasikan aktivitas gerak</strong><small>Jika OFF, Main Gerak tetap bisa dibuka manual.</small></div><button type="button" aria-pressed={prefs.allowMotionRecommendations} className={`${styles.switch} ${prefs.allowMotionRecommendations ? styles.switchOn : ""}`} onClick={() => update({ allowMotionRecommendations: !prefs.allowMotionRecommendations })} /></div>
        <div className={styles.toggleRow}><div className={styles.toggleText}><strong>Izinkan fitur AI/OCR online</strong><small>UI preference saja. Runtime OpenRouter belum diaktifkan pada prototype learning shell.</small></div><button type="button" aria-pressed={prefs.allowAiFeatures} className={`${styles.switch} ${prefs.allowAiFeatures ? styles.switchOn : ""}`} onClick={() => update({ allowAiFeatures: !prefs.allowAiFeatures })} /></div>
        <div className={styles.toggleRow}><div className={styles.toggleText}><strong>Kurangi animasi</strong><small>Untuk anak yang lebih nyaman dengan UI yang tenang.</small></div><button type="button" aria-pressed={prefs.reducedMotion} className={`${styles.switch} ${prefs.reducedMotion ? styles.switchOn : ""}`} onClick={() => update({ reducedMotion: !prefs.reducedMotion })} /></div>
      </div></section>
      <section className={styles.section}><div className={styles.infoBanner}><strong>Camera distinction:</strong> motion = video lokal real-time untuk game; OCR kelak = capture singkat area jawaban. Sistem tidak boleh mengirim continuous child camera stream ke OpenRouter.</div></section>
    </main>
  );
}

export function ParentPlanScreen() {
  return (
    <main className={styles.parentMain}>
      <p className={styles.eyebrow}>Open source + paid</p><h1 className={styles.pageTitle}>Plan</h1>
      <div className={styles.parentGrid} style={{ marginTop: 24 }}>
        <div className={styles.parentCard}><span className={styles.tag}>Current direction</span><h2 style={{ color: "#24445e" }}>Community / Core</h2><p>Core app, activity framework, selected example content, dan motion runtime dapat hidup di open-source codebase sesuai lisensi repo.</p></div>
        <div className={styles.parentCard}><span className={styles.tag}>Planned</span><h2 style={{ color: "#24445e" }}>Mainlagi Premium</h2><p>Premium curriculum/audio, hosted cloud, advanced reports, school capabilities, managed AI, dan support dapat menjadi commercial offering.</p></div>
      </div>
      <section className={styles.section}><div className={styles.infoBanner}>Harga, entitlement, dan paywall <strong>belum</strong> diimplementasikan karena belum ada keputusan produk final. UI ini hanya menunjukkan boundary konsep.</div></section>
    </main>
  );
}

export function ParentSettingsScreen() {
  const [prefs, setPrefs] = useState<LearningPreferences>({ allowMotionRecommendations: false, allowAiFeatures: false, reducedMotion: false, language: "id" });
  useEffect(() => setPrefs(readPreferences()), []);
  const setLanguage = (language: "id" | "en") => {
    const next = { ...prefs, language };
    setPrefs(next);
    savePreferences(next);
  };
  return (
    <main className={styles.parentMain}>
      <p className={styles.eyebrow}>Preferences</p><h1 className={styles.pageTitle}>Settings</h1>
      <section className={styles.formCard}>
        <span className={styles.formLabel}>Bahasa antarmuka prototype</span>
        <div className={styles.choiceRow}><button type="button" className={`${styles.choicePill} ${prefs.language === "id" ? styles.choicePillActive : ""}`} onClick={() => setLanguage("id")}>Bahasa Indonesia</button><button type="button" className={`${styles.choicePill} ${prefs.language === "en" ? styles.choicePillActive : ""}`} onClick={() => setLanguage("en")}>English</button></div>
        <p style={{ color: "#71879a", fontSize: 13, lineHeight: 1.6 }}>Preference tersimpan lokal. Full localization seluruh string belum diklaim selesai.</p>
      </section>
      <section className={styles.section}><div className={styles.infoBanner}>Settings teknis, OpenRouter API key, billing, atau admin CMS tidak ditampilkan ke mode anak.</div></section>
    </main>
  );
}
