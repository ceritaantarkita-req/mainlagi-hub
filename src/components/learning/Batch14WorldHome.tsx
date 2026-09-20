/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { getActivity } from "@/lib/learning/system";
import { rankAdaptiveLearningV2 } from "@/lib/learning/adaptive";
import { CharacterGroup, ChildLoading, useLearningProfile, useLearningProgress } from "./LearningCommon";
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
    <section className={styles.continue} aria-labelledby="child-home-title">
      <div className={styles.continueCopy}>
        <p>Hai, {profile.name}! 👋</p>
        <h1 id="child-home-title" className={styles.greeting}>Belajar sambil bermain.</h1>
        <p className={styles.lead}>{next ? `Lanjutkan “${next.title}” atau pilih pelajaran yang kamu suka.` : "Pilih pelajaran yang kamu suka dan mulai bermain."}</p>
        <Link className={styles.primary} href={next ? `/child/${childId}/activity/${next.id}` : "#choose-subject"}>{next ? "Lanjut bermain" : "Pilih pelajaran"}</Link>
      </div>
      <div className={styles.heroCast} aria-hidden><CharacterGroup /></div>
    </section>
    <section id="choose-subject" aria-labelledby="choose-subject-title">
      <h2 id="choose-subject-title" className={styles.sectionTitle}>Pilih yang mau dipelajari</h2>
      <SubjectDirectory childId={childId}/>
    </section>
    <p className={styles.footnote}>Bermain sedikit, menemukan banyak.</p>
  </main>;
}
