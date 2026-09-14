"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { completeActivity, getActivity } from "@/lib/learning/system";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { isMemoryPairActivity } from "@/lib/learning/gameplayPresentation";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import styles from "./MemoryMatchActivity.module.css";

function stableShuffle<T>(values: readonly T[], seedText: string): T[] {
  let seed = 2166136261;
  for (const char of seedText) seed = Math.imul(seed ^ char.charCodeAt(0), 16777619) >>> 0;
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const target = seed % (index + 1);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function MemoryMatchActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const cards = useMemo(() => stableShuffle((activity?.matchItems ?? []).map((item, sourceIndex) => ({ ...item, sourceIndex })), activityId), [activity?.matchItems, activityId]);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const [message, setMessage] = useState("Buka dua kartu dan cari huruf besar-kecil yang sama.");
  const [done, setDone] = useState(false);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);

  if (!activity || !isMemoryPairActivity(activity)) return null;

  const reveal = (cardIndex: number) => {
    if (done || locked || matched.includes(cardIndex) || open.includes(cardIndex)) return;
    const nextOpen = [...open, cardIndex];
    setOpen(nextOpen);
    if (nextOpen.length < 2) return setMessage("Sekarang buka satu kartu lagi.");
    const [firstIndex, secondIndex] = nextOpen;
    if (cards[firstIndex].pair === cards[secondIndex].pair) {
      const nextMatched = [...matched, firstIndex, secondIndex];
      setMatched(nextMatched);
      setOpen([]);
      if (nextMatched.length === cards.length) {
        const pairCount = Math.max(1, cards.length / 2);
        const incorrectCount = incorrectRef.current;
        const accuracy = pairCount / (pairCount + incorrectCount);
        const assessed = spec?.assessment === "assessed";
        emitLearningRuntimeMeasurement({
          childId,
          activityId: activity.id,
          outcome: {
            status: "completed",
            assessed,
            accuracy: assessed ? accuracy : undefined,
            score: assessed ? accuracy : undefined,
            correctCount: assessed ? pairCount : undefined,
            incorrectCount: assessed ? incorrectCount : undefined,
            retryCount: assessed ? retryRef.current : undefined,
            inputMode: activity.preferredMobile,
            metadata: { source: "memory-pairs-runtime", evidenceFidelity: assessed ? "matching_memory_interaction" : "completion_only" }
          }
        });
        completeActivity(childId, activity.id);
        setDone(true);
        setMessage("Semua pasangan ketemu!");
      } else setMessage("Cocok! Cari pasangan berikutnya.");
      return;
    }
    incorrectRef.current += 1;
    retryRef.current += 1;
    setLocked(true);
    setMessage("Belum pasangan. Ingat posisinya, lalu coba lagi.");
    window.setTimeout(() => { setOpen([]); setLocked(false); }, 650);
  };

  return <GardenActivityFrame backHref={`/child/${childId}/subject/${activity.subjectId}`} title={activity.title} narration={activity.prompt ?? activity.title} lang="id-ID" spacious>
    <section className={styles.scene} data-memory-match>
      <div className={styles.promptCard}><span aria-hidden>🧠</span><div><h1>{activity.prompt ?? activity.title}</h1><p>Ingat posisi kartunya. Temukan pasangan huruf besar dan kecil.</p></div></div>
      <div className={`${styles.board} ${cards.length===4?styles.boardFour:""}`} role="group" aria-label="Papan kartu memori">{cards.map((card, index) => { const visible=open.includes(index)||matched.includes(index); const isMatched=matched.includes(index); return <button key={`${card.label}-${card.sourceIndex}`} type="button" className={`${styles.card} ${visible?styles.cardOpen:""} ${isMatched?styles.cardMatched:""}`} aria-label={visible?`Kartu ${card.label}${isMatched?", sudah cocok":""}`:`Kartu tertutup ${index+1}`} aria-pressed={visible} disabled={isMatched||done} onClick={()=>reveal(index)}>{visible?card.label:"?"}</button>; })}</div>
      <div className={`${styles.status} ${done?styles.statusDone:""}`} role="status" aria-live="polite">{done?"⭐":"💡"} {message}</div>
      {done?<Link className={styles.nextLink} href={`/child/${childId}/subject/${activity.subjectId}`}>Pilih permainan lain</Link>:null}
    </section>
  </GardenActivityFrame>;
}
