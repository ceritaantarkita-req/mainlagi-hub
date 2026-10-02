/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import {
  completeActivity,
  getActivity,
  type LearningActivity,
} from "@/lib/learning/system";
import { playTone, speak, unlockAudio } from "@/lib/audio/feedback";
import { resolveCharacterPresentation } from "@/lib/learning/characterPresentation";
import { ChildLoading, useLearningProfile, useLearningProgress } from "../LearningCommon";
import { ActivityScreen as LegacyActivityScreen } from "../ChildLearningPlatform";
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

export function WorldChildShell({ childId, children }: { childId: string; children: ReactNode }) {
  return <PlayroomShell childId={childId}>{children}</PlayroomShell>;
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
