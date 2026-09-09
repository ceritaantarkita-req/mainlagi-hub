"use client";

import Link from "next/link";
import { useState } from "react";
import { playTone, speakWithStatus, unlockAudio, type SpeechStartStatus } from "@/lib/audio/feedback";
import { completeActivity, getActivity } from "@/lib/learning/system";
import { useLearningProgress } from "./LearningCommon";
import styles from "./LearningPlatform.module.css";

function audioFallback(status: SpeechStartStatus | null): string | null {
  if (status === "muted") return "Suara sedang dimatikan. Petunjuk tetap tersedia sebagai teks di layar.";
  if (status === "unavailable") return "Perangkat atau browser ini tidak menyediakan suara otomatis. Gunakan petunjuk teks di layar.";
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
    unlockAudio();
    playTone("tick");
    setSpeechStatus(speakWithStatus(prompt, lang, 0.88));
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
    <main className={styles.contentNarrow}>
      <section className={styles.activityViewport}>
        <div className={styles.activityTopbar}>
          <Link className={styles.backButton} href={`/child/${childId}/stage/${activity.stageId}`} aria-label="Kembali">←</Link>
          <span className={styles.tag}>🔊 Listening</span>
          <span className={styles.tag}>⭐ {progress.stars}</span>
        </div>

        <h1 className={styles.activityPrompt}>{prompt}</h1>
        <div style={{ textAlign: "center" }}>
          <button type="button" className={styles.secondaryButton} onClick={hear}>🔊 Putar suara</button>
        </div>

        {fallback ? (
          <div className={styles.infoBanner} role="status" style={{ marginTop: 14 }}>
            <strong>Audio fallback:</strong> {fallback}<br />
            <span>Petunjuk: <strong>{prompt}</strong></span>
          </div>
        ) : null}

        <div className={styles.choiceGrid}>
          {(activity.choices ?? []).map((choice) => (
            <button type="button" className={styles.bigChoice} key={choice} onClick={() => choose(choice)}>{choice}</button>
          ))}
        </div>

        {feedback === "good" ? <div className={styles.feedbackGood}>Hebat! ⭐ Aktivitas selesai.</div> : null}
        {feedback === "try" ? <div className={styles.feedbackTry}>Belum tepat. Dengarkan lagi atau coba pilihan lain ya.</div> : null}
        {done ? <Link className={styles.secondaryButton} href={`/child/${childId}/stage/${activity.stageId}`}>← Kembali ke stage</Link> : null}
      </section>
    </main>
  );
}
