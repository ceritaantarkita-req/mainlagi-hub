/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { getActivity } from "@/lib/learning/system";
import { rankAdaptiveLearningV2 } from "@/lib/learning/adaptive";
import { ChildLoading, useLearningProfile, useLearningProgress } from "./LearningCommon";
import { useLearningAnalytics } from "./useLearningAnalytics";
import { SubjectDirectory } from "./Playroom";
import styles from "./Playroom.module.css";

export function Batch14WorldHome({ childId }: { childId: string }) {
  const profile=useLearningProfile(childId);
  const progress=useLearningProgress(childId);
  const analytics=useLearningAnalytics(childId);
  if(!profile) return <ChildLoading/>;
  const ranked=rankAdaptiveLearningV2({age:profile.age,progress,analytics,allowMotion:false});
  const next=ranked[0] ? getActivity(ranked[0].id) : undefined;
  return <main className={styles.page}>
    <h1 className={styles.greeting}>Hai, {profile.name}.</h1>
    <p className={styles.lead}>Mau main apa hari ini?</p>
    <section className={styles.continue} aria-label="Lanjut bermain">
      <div className={styles.continueCopy}>
        <p>{next ? "Lanjut bermain" : "Temukan permainanmu"}</p>
        <h2>{next?.title ?? "Ayo jelajahi bersama."}</h2>
        <Link className={styles.primary} href={next ? `/child/${childId}/activity/${next.id}` : `#choose-subject`}>{next ? "Mulai bermain" : "Pilih kesukaan"}</Link>
      </div>
      <div className={styles.companions} aria-hidden><img src="/artwork/garden-gavi.webp" alt="" width={500} height={650}/><img src="/artwork/garden-paca.webp" alt="" width={500} height={650}/></div>
    </section>
    <section aria-labelledby="choose-subject"><h2 id="choose-subject" className={styles.sectionTitle}>Pilih kesukaanmu</h2><SubjectDirectory childId={childId}/></section>
    <p className={styles.footnote}>Bermain sedikit, menemukan banyak.</p>
  </main>;
}
