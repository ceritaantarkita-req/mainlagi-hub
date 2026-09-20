"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  audioStatus,
  playTone,
  speakPrompt,
  unlockAudio,
  warmAudio,
  type SpeechStartStatus
} from "@/lib/audio/feedback";
import {
  ACTIVITY_AUDIO_ENTRY_LATENCY_EVENT,
  observeActivityEntrySpeech,
  type ActivityAudioEntryLatencyDetail
} from "@/lib/audio/activityEntry";
import { completeActivity, getActivity } from "@/lib/learning/system";
import { useLearningProgress } from "./LearningCommon";
import styles from "./LearningPlatform.module.css";
import { GardenActivityFrame } from "./GardenActivityFrame";

function audioFallback(status: SpeechStartStatus | null): string | null {
  if (status === "muted") return "Suara sedang dimatikan. Nyalakan suara untuk aktivitas dengar, atau pilih permainan lain.";
  if (status === "unavailable") return "Narasi dengan pelafalan yang sesuai belum tersedia di perangkat ini. Mainlagi tidak akan menampilkan target audio sebagai jawaban teks. Pilih permainan lain dulu.";
  if (status === "error") return "Suara belum bisa diputar. Coba tombol suara lagi atau pilih permainan lain.";
  return null;
}

export function AudioChoiceLearningActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const progress = useLearningProgress(childId);
  const [feedback, setFeedback] = useState<"good" | "try" | null>(null);
  const [speechStatus, setSpeechStatus] = useState<SpeechStartStatus | null>(null);
  const autoAttemptedRef = useRef(false);

  const spokenPrompt = activity?.audioPrompt ?? activity?.prompt ?? activity?.title ?? "";
  const lang = activity?.subjectId === "english" ? "en-US" : "id-ID";

  useEffect(() => {
    const onEntryLatency = (event: Event) => {
      const detail = (event as CustomEvent<ActivityAudioEntryLatencyDetail>).detail;
      if (!activity || detail.activityId !== activity.id) return;
      setSpeechStatus(detail.status);
    };
    window.addEventListener(ACTIVITY_AUDIO_ENTRY_LATENCY_EVENT, onEntryLatency);
    return () => window.removeEventListener(ACTIVITY_AUDIO_ENTRY_LATENCY_EVENT, onEntryLatency);
  }, [activity]);

  useEffect(() => {
    autoAttemptedRef.current = false;
    if (!activity || activity.runtime !== "listen_and_choose") return;

    let cancelled = false;
    const startEntryNarration = () => {
      if (cancelled || autoAttemptedRef.current || !audioStatus().unlocked || audioStatus().muted) return;
      autoAttemptedRef.current = true;
      setSpeechStatus(null);
      observeActivityEntrySpeech({
        activityId: activity.id,
        lang,
        textLength: spokenPrompt.trim().length,
        request: () => speakPrompt(spokenPrompt, {
          lang,
          key: `activity-entry:${activity.id}`
        })
      });
    };

    const timer = window.setTimeout(startEntryNarration, 0);
    const afterGesture = () => {
      warmAudio(lang);
      startEntryNarration();
    };
    window.addEventListener("pointerdown", afterGesture, { once: true, capture: true });
    window.addEventListener("keydown", afterGesture, { once: true, capture: true });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", afterGesture, { capture: true });
      window.removeEventListener("keydown", afterGesture, { capture: true });
    };
  }, [activity, lang, spokenPrompt]);

  if (!activity || activity.runtime !== "listen_and_choose") {
    return <main className={styles.contentNarrow}><div className={styles.emptyState}>Aktivitas audio tidak ditemukan.</div></main>;
  }

  const done = progress.completedActivityIds.includes(activity.id);
  const visiblePrompt = activity.prompt ?? (activity.subjectId === "english" ? "Listen, then choose the best answer." : "Dengarkan, lalu pilih jawaban yang paling sesuai.");
  const fallback = audioFallback(speechStatus);
  const heardPrompt = speechStatus === "spoken";

  const hear = () => {
    autoAttemptedRef.current = true;
    unlockAudio(lang);
    playTone("tick");
    setFeedback(null);
    setSpeechStatus(null);
    observeActivityEntrySpeech({
      activityId: activity.id,
      lang,
      textLength: spokenPrompt.trim().length,
      request: () => speakPrompt(spokenPrompt, {
        lang,
        key: `activity-replay:${activity.id}`,
        interrupt: true,
        dedupeMs: 0
      })
    });
  };

  const choose = (choice: string) => {
    if (!heardPrompt) return;
    unlockAudio();
    if (choice === activity.correctChoice) {
      playTone("correct");
      setFeedback("good");
      completeActivity(childId, activity.id);
    } else {
      playTone("wrong");
      setFeedback("try");
    }
  };

  return (
    <GardenActivityFrame backHref={`/child/${childId}/subject/${activity.subjectId}`} title={visiblePrompt} onHear={hear} hint="Tekan tombol suara, dengarkan, lalu sentuh pilihanmu." spacious={visiblePrompt.length<45}>

        {fallback ? (
          <div className={styles.infoBanner} role="status" style={{ marginTop: 14 }}>
            <p style={{ margin: 0 }}>{fallback}</p>
            <Link className={styles.secondaryButton} href={`/child/${childId}/subject/${activity.subjectId}`} style={{ marginTop: 10 }}>Pilih permainan lain</Link>
          </div>
        ) : !heardPrompt ? (
          <div className={styles.infoBanner} role="status" style={{ marginTop: 14 }}>
            Menyiapkan suara. Kamu juga bisa tekan tombol Dengar.
          </div>
        ) : null}

        <div className={styles.choiceGrid} data-choices>
          {(activity.choices ?? []).map((choice) => (
            <button type="button" className={styles.bigChoice} data-short={choice.length<=2} key={choice} onClick={() => choose(choice)} disabled={!heardPrompt}>{choice}</button>
          ))}
        </div>

        {feedback === "good" ? <div className={styles.feedbackGood} role="status">Hebat! Aktivitas selesai.</div> : null}
        {feedback === "try" ? <div className={styles.feedbackTry}>Belum tepat. Dengarkan lagi atau coba pilihan lain ya.</div> : null}
        {done ? <Link className={styles.secondaryButton} href={`/child/${childId}/subject/${activity.subjectId}`}>Pilih permainan lain</Link> : null}
    </GardenActivityFrame>
  );
}
