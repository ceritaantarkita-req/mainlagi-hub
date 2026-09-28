/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  ACTIVITIES,
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
import { resolveCharacterPresentation } from "@/lib/learning/characterPresentation";
import { ChildLoading, useLearningProfile, useLearningProgress } from "../LearningCommon";
import {
  ActivityScreen as LegacyActivityScreen,
  StageScreen as LegacyStageScreen,
  SubjectScreen as LegacySubjectScreen
} from "../ChildLearningPlatform";
import styles from "./WorldExperience.module.css";
import { PlayroomShell } from "../Playroom";
import { GardenActivityFrame } from "../GardenActivityFrame";
import garden from "../GardenActivityFrame.module.css";
import learning from "../LearningPlatform.module.css";
import playroom from "../Playroom.module.css";
import { Rocket, PuzzlePiece, Key, LockKey } from "@phosphor-icons/react";

const REWARDS_HERO_CAST = resolveCharacterPresentation({
  context: "home",
  requestedCharacters: ["gavi", "paca"],
  requestedState: "hero",
  allowIdentityFallback: false
}).characters;

const WORLD_META: Record<LearningSubjectId, { name: string; place: string; helper: string }> = {
  bahasa: { name: "Bahasa", place: "Taman Kata", helper: "Huruf, kata & cerita" },
  english: { name: "English", place: "English Space", helper: "Listen, play & speak" },
  math: { name: "Matematika", place: "Kota Angka", helper: "Angka, pola & logika" },
  iqro: { name: "Iqro", place: "Taman Iqro", helper: "Huruf Hijaiyah" },
  letters: { name: "Menulis", place: "Studio Huruf", helper: "Huruf & gerak menulis" },
  logic: { name: "Logika", place: "Pulau Logika", helper: "Cocok, beda & bandingkan" },
  science: { name: "Sains", place: "Taman Sains", helper: "Hewan, tumbuhan & alam" },
  color: { name: "Mewarnai", place: "Studio Warna", helper: "Warna & kreativitas" },
  drawing: { name: "Menggambar", place: "Studio Gambar", helper: "Garis, bentuk & imajinasi" }
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
  if (subject === "letters") {
    return (
      <svg viewBox="0 0 120 96" aria-hidden>
        <rect x="24" y="18" width="72" height="61" rx="16" fill="#f5f0ff" />
        <path d="M43 68 59 29l18 39M49 53h22" stroke="#705bd9" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m85 20 12 12-30 30-16 4 4-16Z" fill="#ffd363" stroke="#6f597b" strokeWidth="3" strokeLinejoin="round" />
      </svg>
    );
  }
  if (subject === "logic") {
    return (
      <svg viewBox="0 0 120 96" aria-hidden>
        <circle cx="43" cy="45" r="22" fill="#fff0ce" stroke="#d97442" strokeWidth="5" />
        <rect x="64" y="27" width="38" height="38" rx="10" fill="#ffe0cf" stroke="#d97442" strokeWidth="5" />
        <path d="M33 45h20M43 35v20M73 46h20" stroke="#714b3e" strokeWidth="5" strokeLinecap="round" />
        <path d="m79 71 7 7 15-17" fill="none" stroke="#4fa76c" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (subject === "science") {
    return (
      <svg viewBox="0 0 120 96" aria-hidden>
        <path d="M55 20v29L35 76h50L65 49V20" fill="#e8fff0" stroke="#39865b" strokeWidth="5" strokeLinejoin="round" />
        <path d="M43 64h34" stroke="#64c98b" strokeWidth="9" strokeLinecap="round" />
        <circle cx="82" cy="29" r="9" fill="#ffd65d" />
        <path d="M27 67c2-16 9-26 21-30-1 14-8 25-21 30Z" fill="#64c98b" />
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
  return <PlayroomShell childId={childId}>{children}</PlayroomShell>;
}

function WorldPortal({ childId, subject }: { childId: string; subject: LearningSubjectId }) {
  const meta = WORLD_META[subject];
  const subjectMeta = getSubject(subject);
  return (
    <Link href={`/child/${childId}/subject/${subject}`} className={`${styles.portal} ${styles[`portal_${subject}`]}`} style={{ "--portal-accent": subjectMeta?.accent } as CSSProperties}>
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
  const isEligible = (activity: LearningActivity) => activity.ageMin <= profile.age && activity.ageMax >= profile.age && !activity.motionOptional && activity.runtime !== "motion_game" && !progress.completedActivityIds.includes(activity.id);
  const next = ACTIVITIES.find((activity) => activity.subjectId === "math" && isEligible(activity)) ?? ACTIVITIES.find(isEligible);

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
          {SUBJECTS.map((subject) => <WorldPortal key={subject.id} childId={childId} subject={subject.id} />)}
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
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);
  if (subjectId !== "math") return <LegacySubjectScreen childId={childId} subjectId={subjectId} />;
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
  const progress = useLearningProgress(childId);
  const stage = getStage(stageId);
  if (!stage || stage.subjectId !== "math") return <LegacyStageScreen childId={childId} stageId={stageId} />;
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

function MathCountActivity({ childId, activity }: { childId: string; activity: LearningActivity }) {
  const [feedback, setFeedback] = useState<"idle" | "wrong" | "correct">("idle");
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
      setFeedback("correct");
      playTone("celebrate");
      speak(alreadyDone ? "Benar! Kamu masih ingat." : "Hebat! Ada tiga apel!", "id-ID", 0.92);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate([30, 30, 70]);
      return;
    }
    setFeedback("wrong");
    playTone("wrong");
    speak("Hmm, coba hitung pelan-pelan lagi.", "id-ID", 0.92);
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(35);
  };

  return (
    <GardenActivityFrame backHref={`/child/${childId}/subject/${activity.subjectId}`} title="Ada berapa apel?" onHear={hearPrompt}>
      <div className={garden.apples} aria-label="Tiga apel">{apples.map(apple=><img key={apple} src="/artwork/garden-apple.webp" width={180} height={180} alt="Apel"/>)}</div>
      <div className={learning.choiceGrid}>
        {(activity.choices ?? []).map(choice=><button key={choice} type="button" className={learning.bigChoice} onClick={()=>choose(choice)} disabled={feedback==="correct"} aria-pressed={feedback==="correct" && choice===activity.correctChoice}>{choice}</button>)}
      </div>
      {feedback==="wrong" ? <p role="status" className={learning.feedbackTry}>Belum tepat. Hitung satu per satu lagi ya.</p> : null}
      {feedback==="correct" ? <div role="status" className={learning.feedbackGood}><h2>Hebat!</h2><p>Kamu menemukan 3 apel.</p><Link className={learning.primaryButton} href={`/child/${childId}/subject/${activity.subjectId}`}>Pilih permainan lain</Link></div> : null}
    </GardenActivityFrame>
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

  return <main className={learning.content}>
    <section className={playroom.continue}>
      <div className={playroom.continueCopy}><p>Koleksi bintang</p><h1 className={learning.pageTitle}>Hebat, {profile.name}!</h1><p>{progress.stars} bintang · {completed} aktivitas selesai</p></div>
      <div className={playroom.companions} aria-hidden data-session14-vector-cast="rewards">
        {REWARDS_HERO_CAST.map((character) => (
          <img
            key={character.id}
            src={character.src}
            alt=""
            width={500}
            height={650}
            data-character-id={character.id}
            data-character-state={character.state}
            data-character-asset-source={character.assetSource}
          />
        ))}
      </div>
    </section>
    <section className={learning.rewardShelf} aria-label="Koleksi hadiah">{rewards.map((reward,index)=>{
      const unlocked=progress.stars>=reward.stars;
      const RewardIcon=[Rocket, Rocket, PuzzlePiece, Key][index];
      return <div key={reward.name} className={learning.rewardItem} data-locked={!unlocked}>{unlocked ? index===0 ? <img src="/artwork/garden-apple.webp" width={56} height={56} alt=""/> : <RewardIcon size={56} weight="duotone" aria-hidden/> : <LockKey size={48} weight="duotone" aria-hidden/>}<strong>{reward.name}</strong><span>{unlocked ? "Terkoleksi" : `${reward.stars} bintang untuk membuka`}</span></div>;
    })}</section>
    <Link className={playroom.primary} href={`/child/${childId}/home`}>Main lagi</Link>
  </main>;
}

export function WorldLearnEntry({ childId }: { childId: string }) {
  return (
    <main className={styles.learnEntry}>
      <div className={styles.learnEntryHead}><h1>Pilih dunia belajar</h1><p>Setiap dunia punya petualangan dan tantangannya sendiri.</p></div>
      <div className={styles.learnWorlds}>{SUBJECTS.map((subject) => <WorldPortal key={subject.id} childId={childId} subject={subject.id} />)}</div>
    </main>
  );
}
