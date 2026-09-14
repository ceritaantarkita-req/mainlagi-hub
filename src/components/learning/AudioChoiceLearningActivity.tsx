"use client";

import Link from "next/link";
import { useState } from "react";
import { playTone, speakWithStatus, unlockAudio, type SpeechStartStatus } from "@/lib/audio/feedback";
import { completeActivity, getActivity } from "@/lib/learning/system";
import { useLearningProgress } from "./LearningCommon";
import styles from "./LearningPlatform.module.css";
import { GardenActivityFrame } from "./GardenActivityFrame";

function audioFallback(status: SpeechStartStatus | null): string | null {
  if (status === "muted") return "Suara sedang dimatikan. Petunjuk tetap tersedia sebagai teks di layar.";
  if (status === "unavailable") return "Narasi dengan pelafalan yang sesuai belum tersedia di perangkat ini. Mainlagi tidak akan memakai voice bahasa lain. Gunakan petunjuk teks di layar.";
  if (status === "error") return "Suara belum bisa diputar. Coba lagi atau lanjut menggunakan petunjuk teks.";
  return null;
}

export function AudioChoiceLearningActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const progress = useLearningProgress(childId);
  const [feedback, setFeedback] = useState<"good" | "try" | null>(null);
  const [speechStatus, setSpeechStatus] = useState<SpeechStartStatus | null>(null);

  if (!activity || activity.runtime !== "listen_and_choose") {
    return <main className={styles.contentNarrow}><div className={styles.emptyState}>Aktivitas audio tidak ditemukan.</div></main>;
  }

  const done = progress.completedActivityIds.includes(activity.id);
  const prompt = activity.prompt ?? activity.title;
  const lang = activity.subjectId === "english" ? "en-US" : "id-ID";
  const fallback = audioFallback(speechStatus);

  const hear = () => {
    unlockAudio(lang);
    playTone("tick");
    setSpeechStatus(speakWithStatus(prompt, lang));
  };

  const choose = (choice: string) => {
    unlockAudio();
    if (choice === activity.correctChoice) {
      playTone("correct");
      setFeedback("good");
      if (!done) completeActivity(childId, activity.id);
      else completeActivity(childId, activity.id);
    } else {
      playTone("wrong");
      setFeedback("try");
    }
  };

  return (
    <GardenActivityFrame backHref={`/child/${childId}/subject/${activity.subjectId}`} title={prompt} onHear={hear} hint="Dengarkan, lalu sentuh pilihanmu." spacious={prompt.length<45}>

        {fallback ? (
          <div className={styles.infoBanner} role="status" style={{ marginTop: 14 }}>
            {fallback}
          </div>
        ) : null}

        <div className={styles.choiceGrid} data-choices>
          {(activity.choices ?? []).map((choice) => (
            <button type="button" className={styles.bigChoice} data-short={choice.length<=2} key={choice} onClick={() => choose(choice)}>{choice}</button>
          ))}
        </div>

        {feedback === "good" ? <div className={styles.feedbackGood} role="status">Hebat! Aktivitas selesai.</div> : null}
        {feedback === "try" ? <div className={styles.feedbackTry}>Belum tepat. Dengarkan lagi atau coba pilihan lain ya.</div> : null}
        {done ? <Link className={styles.secondaryButton} href={`/child/${childId}/subject/${activity.subjectId}`}>Pilih permainan lain</Link> : null}
    </GardenActivityFrame>
  );
}
