"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  ACTIVITIES,
  CHARACTERS,
  SUBJECTS,
  completeActivity,
  getActivitiesForStage,
  getActivity,
  getStage,
  getStagesForSubject,
  getSubject,
  type LearningActivity,
  type LearningProgress,
  type LearningSubjectId
} from "@/lib/learning/system";
import { playTone, speak, unlockAudio } from "@/lib/audio/feedback";
import { ChildLoading, useLearningProfile, useLearningProgress } from "../LearningCommon";
import {
  ActivityScreen as LegacyActivityScreen,
  StageScreen as LegacyStageScreen,
  SubjectScreen as LegacySubjectScreen
} from "../ChildLearningPlatform";
import styles from "./WorldExperience.module.css";

const WORLD_META: Record<LearningSubjectId, { name: string; place: string; helper: string }> = {
  bahasa: { name: "Bahasa", place: "Taman Kata", helper: "Huruf, kata & cerita" },
  english: { name: "English", place: "English Space", helper: "Listen, play & speak" },
  math: { name: "Matematika", place: "Kota Angka", helper: "Angka, pola & logika" },
  iqro: { name: "Iqro", place: "Taman Iqro", helper: "Huruf Hijaiyah" },
  color: { name: "Mewarnai", place: "Studio Warna", helper: "Warna & kreativitas" }
};

function coreActivities(stageId: string) {
  return getActivitiesForStage(stageId).filter((activity) => !activity.motionOptional && activity.runtime !== "motion_game");
}

function isStageComplete(stageId: string, progress: LearningProgress) {
  const required = coreActivities(stageId);
  return required.length > 0 && required.every((activity) => progress.completedActivityIds.includes(activity.id));
}

function WorldGlyph({ subject }: { subject: LearningSubjectId }) {
  if (subject === "math") {
    return (
      <svg viewBox="0 0 120 96" aria-hidden>
        <path d="M20 78V37l20-15 20 15v41Z" fill="#ffcf56" />
        <path d="M60 78V28l19-14 20 14v50Z" fill="#ff9f68" />
        <path d="M14 78h92" stroke="#704a35" strokeWidth="6" strokeLinecap="round" />
        <rect x="33" y="50" width="13" height="28" rx="6" fill="#fff5d8" />
        <rect x="72" y="43" width="14" height="14" rx="4" fill="#dff5ff" />
        <circle cx="95" cy="17" r="9" fill="#fff" opacity=".9" />
      </svg>
    );
  }
  if (subject === "bahasa") {
    return (
      <svg viewBox="0 0 120 96" aria-hidden>
        <path d="M17 77c8-24 20-36 43-36s35 12 43 36Z" fill="#8fdc7d" />
        <rect x="55" y="28" width="10" height="43" rx="5" fill="#8d5a3b" />
        <circle cx="60" cy="28" r="24" fill="#53c977" />
        <circle cx="45" cy="31" r="15" fill="#67d889" />
        <circle cx="75" cy="32" r="15" fill="#67d889" />
        <text x="60" y="39" textAnchor="middle" fontSize="26" fontWeight="900" fill="#fff">A</text>
      </svg>
    );
  }
  if (subject === "english") {
    return (
      <svg viewBox="0 0 120 96" aria-hidden>
        <ellipse cx="60" cy="73" rx="42" ry="12" fill="#7659c8" opacity=".24" />
        <path d="M54 73c-9-18-7-35 7-51 16 9 25 24 21 40l-12-7-4 18Z" fill="#795ee8" />
        <circle cx="66" cy="35" r="9" fill="#d9f5ff" />
        <path d="m54 58-17 8 12 7Z" fill="#ff8e65" />
        <path d="M67 73c1 8-2 14-8 19M73 71c7 5 10 11 9 19" stroke="#ffc83d" strokeWidth="5" strokeLinecap="round" />
      </svg>
    );
  }
  if (subject === "iqro") {
    return (
      <svg viewBox="0 0 120 96" aria-hidden>
        <path d="M18 78h84" stroke="#54785c" strokeWidth="6" strokeLinecap="round" />
        <path d="M36 76V46c10-18 38-18 48 0v30Z" fill="#55b98b" />
        <path d="M47 76V50c6-10 20-10 26 0v26Z" fill="#fff3c8" />
        <path d="M62 20c-8 2-12 9-10 16 2 8 11 12 19 8-6 8-18 10-26 4-9-7-10-20-3-29 6-8 15-10 20-8Z" fill="#ffd760" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 96" aria-hidden>
      <path d="M25 72c8-34 25-51 51-51 11 0 20 3 27 8-7 8-12 15-14 23-4 15 4 21 14 25-19 8-55 10-78-5Z" fill="#ff8eb8" />
      <circle cx="56" cy="43" r="8" fill="#ffd659" />
      <circle cx="75" cy="34" r="8" fill="#6bd8ff" />
      <circle cx="80" cy="57" r="8" fill="#79d48c" />
      <path d="M21 74h76" stroke="#7e5570" strokeWidth="6" strokeLinecap="round" />
      <path d="m39 22 7 16 16 7-16 7-7 16-7-16-16-7 16-7Z" fill="#fff" opacity=".85" />
    </svg>
  );
}

function Paca({ mood = "happy" }: { mood?: "happy" | "think" | "celebrate" }) {
  return (
    <div className={`${styles.paca} ${styles[`paca_${mood}`]}`} aria-label={`Paca ${mood}`} role="img">
      <span className={styles.pacaAntenna} />
      <span className={styles.pacaHead}>
        <span className={styles.pacaFace}><i /><i /><b /></span>
      </span>
      <span className={styles.pacaBody}>M</span>
      <span className={styles.pacaArmLeft} />
      <span className={styles.pacaArmRight} />
    </div>
  );
}

function Gavi({ mood = "happy" }: { mood?: "happy" | "oops" | "celebrate" }) {
  return (
    <div className={`${styles.gavi} ${styles[`gavi_${mood}`]}`} role="img" aria-label={`Gavi ${mood}`}>
      <span className={styles.gaviTail} />
      <span className={styles.gaviEarLeft} />
      <span className={styles.gaviEarRight} />
      <span className={styles.gaviHead}><i /><i /><b /></span>
      <span className={styles.gaviBody} />
    </div>
  );
}

export function WorldChildShell({ childId, children }: { childId: string; children: ReactNode }) {
  const pathname = usePathname();
  const profile = useLearningProfile(childId);
  const base = `/child/${childId}`;
  const inLearning = pathname.includes("/subject/") || pathname.includes("/stage/") || pathname.includes("/activity/") || pathname === `${base}/learn`;
  const items = [
    { href: `${base}/home`, label: "Dunia", icon: "⌂", active: pathname === `${base}/home` || pathname === base },
    { href: `${base}/learn`, label: "Belajar", icon: "✦", active: inLearning },
    { href: `${base}/games`, label: "Gerak", icon: "◉", active: pathname.startsWith(`${base}/games`) },
    { href: `${base}/rewards`, label: "Hadiah", icon: "★", active: pathname.startsWith(`${base}/rewards`) }
  ];

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <Link href={`${base}/home`} className={styles.logo} aria-label="Mainlagi World">
          <span className={styles.logoMark}>M</span>
          <span>Mainlagi</span>
        </Link>
        <div className={styles.topActions}>
          <Link href="/parent" className={styles.parentGate} aria-label="Area orang tua">Orang tua</Link>
          <Link href="/child/select" className={styles.profileButton} aria-label="Ganti profil anak">
            <span className={styles.profileDot}>{profile ? CHARACTERS[profile.guide].emoji : "🙂"}</span>
            <span>{profile?.name ?? "Profil"}</span>
          </Link>
        </div>
      </header>
      {children}
      <nav className={styles.dock} aria-label="Navigasi anak">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className={`${styles.dockItem} ${item.active ? styles.dockItemActive : ""}`} aria-current={item.active ? "page" : undefined}>
            <span className={styles.dockIcon} aria-hidden>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

function WorldPortal({ childId, subject }: { childId: string; subject: LearningSubjectId }) {
  const meta = WORLD_META[subject];
  return (
    <Link href={`/child/${childId}/subject/${subject}`} className={`${styles.portal} ${styles[`portal_${subject}`]}`}>
      <span className={styles.portalHalo} />
      <span className={styles.portalArt}><WorldGlyph subject={subject} /></span>
      <span className={styles.portalCopy}><strong>{meta.place}</strong><span>{meta.helper}</span></span>
    </Link>
  );
}

export function MainlagiWorldHome({ childId }: { childId: string }) {
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);
  if (!profile) return <ChildLoading />;
  const next = ACTIVITIES.find((activity) => activity.ageMin <= profile.age && activity.ageMax >= profile.age && !activity.motionOptional && !progress.completedActivityIds.includes(activity.id));

  const sayHello = () => {
    unlockAudio();
    playTone("start");
    speak(`Hai ${profile.name}! Hari ini kita mau main apa?`, "id-ID", 0.95);
  };

  return (
    <main className={styles.worldHome}>
      <section className={styles.welcomeScene} aria-labelledby="world-title">
        <span className={`${styles.cloud} ${styles.cloudOne}`} />
        <span className={`${styles.cloud} ${styles.cloudTwo}`} />
        <span className={styles.sun} />
        <div className={styles.welcomeCopy}>
          <h1 id="world-title">Hai, {profile.name}!</h1>
          <button type="button" className={styles.speechButton} onClick={sayHello}>
            <span className={styles.soundDisc}>♪</span>
            <span>Hari ini mau petualangan ke mana?</span>
          </button>
          <div className={styles.starCounter} aria-label={`${progress.stars} bintang terkumpul`}><span>★</span>{progress.stars}</div>
        </div>
        <div className={styles.welcomePaca}><Paca /></div>
        <div className={styles.welcomeGavi}><Gavi /></div>
      </section>

      {next ? (
        <Link href={`/child/${childId}/activity/${next.id}`} className={styles.questRibbon}>
          <span className={styles.questSpark}>✦</span>
          <span><small>Lanjut petualangan</small><strong>{next.title}</strong></span>
          <span className={styles.questArrow}>→</span>
        </Link>
      ) : null}

      <section className={styles.worldSection} aria-labelledby="choose-world">
        <div className={styles.worldTitleRow}>
          <h2 id="choose-world">Pilih duniamu</h2>
          <span>Sentuh tempat yang kamu suka</span>
        </div>
        <div className={styles.worldMap}>
          <WorldPortal childId={childId} subject="bahasa" />
          <WorldPortal childId={childId} subject="english" />
          <WorldPortal childId={childId} subject="math" />
          <WorldPortal childId={childId} subject="iqro" />
          <WorldPortal childId={childId} subject="color" />
          <span className={styles.mapPath} aria-hidden />
        </div>
      </section>
    </main>
  );
}

function StageNode({ childId, stageId, index, progress, locked }: { childId: string; stageId: string; index: number; progress: LearningProgress; locked: boolean }) {
  const stage = getStage(stageId);
  if (!stage) return null;
  const completed = isStageComplete(stage.id, progress);
  const required = coreActivities(stage.id);
  const done = required.filter((activity) => progress.completedActivityIds.includes(activity.id)).length;
  const body = (
    <>
      <span className={styles.stageNumber}>{locked ? "🔒" : completed ? "✓" : index + 1}</span>
      <span className={styles.stageNodeCopy}><strong>{stage.title}</strong><span>{locked ? "Selesaikan petualangan sebelumnya" : `${done}/${required.length} tantangan selesai`}</span></span>
      <span className={styles.stageNodeReward}>{completed ? "★★★" : "★"}</span>
    </>
  );
  if (locked) return <div className={`${styles.stageNode} ${styles.stageNodeLocked}`}>{body}</div>;
  return <Link href={`/child/${childId}/stage/${stage.id}`} className={`${styles.stageNode} ${completed ? styles.stageNodeDone : ""}`}>{body}</Link>;
}

export function WorldSubjectScreen({ childId, subjectId }: { childId: string; subjectId: string }) {
  if (subjectId !== "math") return <LegacySubjectScreen childId={childId} subjectId={subjectId} />;
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);
  if (!profile) return <ChildLoading />;
  const subject = getSubject("math")!;
  const stages = getStagesForSubject("math");
  const firstComplete = stages[0] ? isStageComplete(stages[0].id, progress) : false;

  return (
    <main className={styles.mathWorld}>
      <section className={styles.mathHero}>
        <Link href={`/child/${childId}/home`} className={styles.roundBack} aria-label="Kembali ke dunia utama">←</Link>
        <div className={styles.mathHeroCopy}>
          <span className={styles.worldName}>KOTA ANGKA</span>
          <h1>Petualangan Matematika</h1>
          <p>Bantu Paca menyalakan lampu di seluruh kota dengan menyelesaikan tantangan angka.</p>
        </div>
        <div className={styles.mathSkyline} aria-hidden>
          <span /><span /><span /><span /><span />
        </div>
        <div className={styles.mathPaca}><Paca mood="think" /></div>
      </section>

      <section className={styles.pathSection} aria-labelledby="math-path-title">
        <div className={styles.pathHeading}>
          <div><h2 id="math-path-title">Jalur petualangan</h2><p>{subject.description}</p></div>
          <div className={styles.pathStars}><span>★</span>{progress.stars}</div>
        </div>
        <div className={styles.stagePath}>
          <span className={styles.pathRail} aria-hidden />
          {stages.map((stage, index) => <StageNode key={stage.id} childId={childId} stageId={stage.id} index={index} progress={progress} locked={index > 0 && !firstComplete} />)}
          <div className={styles.finishNode}><span>🏰</span><strong>Menara Logika</strong><small>Segera hadir</small></div>
        </div>
      </section>
    </main>
  );
}

export function WorldStageScreen({ childId, stageId }: { childId: string; stageId: string }) {
  const stage = getStage(stageId);
  if (!stage || stage.subjectId !== "math") return <LegacyStageScreen childId={childId} stageId={stageId} />;
  const progress = useLearningProgress(childId);
  const activities = coreActivities(stage.id);
  const optional = getActivitiesForStage(stage.id).filter((activity) => activity.motionOptional);

  return (
    <main className={styles.stageAdventure}>
      <section className={styles.stageHero}>
        <Link href={`/child/${childId}/subject/math`} className={styles.roundBack} aria-label="Kembali ke Kota Angka">←</Link>
        <div><span>TANTANGAN {stage.id === "math-angka" ? "01" : "02"}</span><h1>{stage.title}</h1><p>{stage.id === "math-angka" ? "Nyalakan tiga lampu kota dengan hitung, pilih, dan telusuri angka." : "Temukan pola yang hilang dan buka gerbang berikutnya."}</p></div>
        <div className={styles.stageMascot}><Gavi /></div>
      </section>
      <section className={styles.challengeTrail}>
        {activities.map((activity, index) => {
          const done = progress.completedActivityIds.includes(activity.id);
          const previousDone = index === 0 || progress.completedActivityIds.includes(activities[index - 1].id);
          const locked = !previousDone;
          const content = (
            <>
              <span className={styles.challengeOrb}>{done ? "✓" : locked ? "🔒" : activity.emoji}</span>
              <span className={styles.challengeCopy}><small>Tantangan {index + 1}</small><strong>{activity.title}</strong><span>{done ? "Sudah selesai — boleh main lagi" : locked ? "Buka setelah tantangan sebelumnya" : activity.description}</span></span>
              <span className={styles.challengeStars}>{done ? `+${activity.stars} ★` : "→"}</span>
            </>
          );
          return locked ? <div key={activity.id} className={`${styles.challengeStep} ${styles.challengeStepLocked}`}>{content}</div> : <Link key={activity.id} href={`/child/${childId}/activity/${activity.id}`} className={`${styles.challengeStep} ${done ? styles.challengeStepDone : ""}`}>{content}</Link>;
        })}
      </section>
      {optional.length ? <Link href={`/child/${childId}/games`} className={styles.motionBonus}><span>◉</span><span><strong>Bonus Main Gerak</strong><small>Mode kamera tetap opsional</small></span><span>→</span></Link> : null}
    </main>
  );
}

function Confetti() {
  return <div className={styles.confetti} aria-hidden>{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ "--i": index } as CSSProperties} />)}</div>;
}

function MathCountActivity({ childId, activity }: { childId: string; activity: LearningActivity }) {
  const [feedback, setFeedback] = useState<"idle" | "wrong" | "correct">("idle");
  const [wrongChoice, setWrongChoice] = useState<string | null>(null);
  const progress = useLearningProgress(childId);
  const alreadyDone = progress.completedActivityIds.includes(activity.id);

  const apples = useMemo(() => ["apel-1", "apel-2", "apel-3"], []);

  const hearPrompt = () => {
    unlockAudio();
    playTone("tick");
    speak("Ayo hitung apelnya. Ada berapa apel?", "id-ID", 0.9);
  };

  const choose = (choice: string) => {
    unlockAudio();
    if (choice === activity.correctChoice) {
      completeActivity(childId, activity.id);
      setWrongChoice(null);
      setFeedback("correct");
      playTone("celebrate");
      speak(alreadyDone ? "Benar! Kamu masih ingat." : "Hebat! Ada tiga apel!", "id-ID", 0.92);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate([30, 30, 70]);
      return;
    }
    setWrongChoice(choice);
    setFeedback("wrong");
    playTone("wrong");
    speak("Hmm, coba hitung pelan-pelan lagi.", "id-ID", 0.92);
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(35);
  };

  return (
    <main className={styles.activityGame}>
      <div className={styles.activitySky} aria-hidden><span /><span /><span /></div>
      <header className={styles.activityHeader}>
        <Link href={`/child/${childId}/stage/${activity.stageId}`} className={styles.roundBack} aria-label="Keluar aktivitas">×</Link>
        <div className={styles.activityProgress}><span><i /></span><small>1 dari 2</small></div>
        <div className={styles.activityStar}>★ {progress.stars}</div>
      </header>

      <section className={styles.activityStage}>
        <div className={styles.activityGuide}>
          <div className={styles.activityPaca}><Paca mood={feedback === "correct" ? "celebrate" : feedback === "wrong" ? "think" : "happy"} /></div>
          <button type="button" className={styles.promptBubble} onClick={hearPrompt}>
            <span className={styles.promptAudio}>♪</span>
            <span><strong>Ayo hitung apelnya!</strong><small>Sentuh untuk dengar</small></span>
          </button>
        </div>

        <div className={styles.applePlayground} aria-label="Tiga apel">
          {apples.map((apple, index) => <div key={apple} className={styles.apple} style={{ "--apple-index": index } as CSSProperties}><i /><b /></div>)}
          <span className={styles.grassPatch} />
        </div>

        <div className={styles.answerArea}>
          <h1>Ada berapa apel?</h1>
          <div className={styles.answerChoices}>
            {(activity.choices ?? []).map((choice) => (
              <button key={choice} type="button" onClick={() => choose(choice)} className={`${styles.answerButton} ${wrongChoice === choice ? styles.answerWrong : ""} ${feedback === "correct" && choice === activity.correctChoice ? styles.answerCorrect : ""}`} disabled={feedback === "correct"}>
                {choice}
              </button>
            ))}
          </div>
          {feedback === "wrong" ? <div className={styles.characterFeedback}><Gavi mood="oops" /><span><strong>Hampir!</strong> Hitung satu per satu lagi ya.</span></div> : null}
        </div>
      </section>

      {feedback === "correct" ? (
        <div className={styles.celebration} role="dialog" aria-modal="true" aria-label="Aktivitas selesai">
          <Confetti />
          <div className={styles.celebrationPanel}>
            <div className={styles.celebrateCharacters}><Paca mood="celebrate" /><Gavi mood="celebrate" /></div>
            <div className={styles.bigStar}>★</div>
            <h2>Hebat!</h2>
            <p>Kamu menemukan <strong>3 apel</strong>.</p>
            <div className={styles.rewardLine}>+{alreadyDone ? 0 : activity.stars} bintang</div>
            <Link href={`/child/${childId}/stage/${activity.stageId}`} className={styles.continueButton}>Lanjut petualangan <span>→</span></Link>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export function WorldActivityScreen({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  if (activity?.id === "math-count-3") return <MathCountActivity childId={childId} activity={activity} />;
  return <LegacyActivityScreen childId={childId} activityId={activityId} />;
}

export function WorldRewardsScreen({ childId }: { childId: string }) {
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);
  if (!profile) return <ChildLoading />;
  const completed = progress.completedActivityIds.length;
  const rewards = [
    { stars: 2, icon: "🍎", name: "Apel Pintar" },
    { stars: 5, icon: "🚀", name: "Roket Mini" },
    { stars: 8, icon: "🧩", name: "Puzzle Paca" },
    { stars: 12, icon: "🏰", name: "Kunci Kota" }
  ];

  return (
    <main className={styles.rewardWorld}>
      <section className={styles.rewardHero}>
        <div><h1>Koleksi {profile.name}</h1><p>Setiap tantangan membuka kejutan baru.</p></div>
        <div className={styles.rewardTotal}><span>★</span><strong>{progress.stars}</strong><small>bintang</small></div>
        <div className={styles.rewardPaca}><Paca mood="celebrate" /></div>
      </section>
      <section className={styles.rewardShelf} aria-label="Koleksi hadiah">
        {rewards.map((reward) => {
          const unlocked = progress.stars >= reward.stars;
          return <div key={reward.name} className={`${styles.rewardToy} ${unlocked ? styles.rewardToyUnlocked : ""}`}><span className={styles.rewardToyIcon}>{unlocked ? reward.icon : "?"}</span><strong>{unlocked ? reward.name : `${reward.stars} ★`}</strong><small>{unlocked ? "Terkoleksi" : "Belum terbuka"}</small></div>;
        })}
      </section>
      <div className={styles.rewardFooter}><span>{completed} aktivitas selesai</span><Link href={`/child/${childId}/home`}>Main lagi →</Link></div>
    </main>
  );
}

export function WorldLearnEntry({ childId }: { childId: string }) {
  return (
    <main className={styles.learnEntry}>
      <div className={styles.learnEntryHead}><h1>Pilih dunia belajar</h1><p>Setiap dunia punya petualangan dan tantangannya sendiri.</p></div>
      <div className={styles.learnWorlds}>{SUBJECTS.map((subject) => <WorldPortal key={subject.id} childId={childId} subject={subject.id} />)}</div>
    </main>
  );
}
