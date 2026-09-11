"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { ACTIVITIES, SUBJECTS, type LearningActivity } from "@/lib/learning/system";
import { ChildLoading, useLearningProfile, useLearningProgress } from "./LearningCommon";
import styles from "./world/WorldExperience.module.css";

function eligible(activity: LearningActivity, age: number, completed: string[]) {
  return activity.ageMin <= age && activity.ageMax >= age && !activity.motionOptional && activity.runtime !== "motion_game" && !completed.includes(activity.id);
}

export function Batch14WorldHome({ childId }: { childId: string }) {
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);
  if (!profile) return <ChildLoading />;
  const next = ACTIVITIES.find((activity) => activity.subjectId === "math" && eligible(activity, profile.age, progress.completedActivityIds))
    ?? ACTIVITIES.find((activity) => eligible(activity, profile.age, progress.completedActivityIds));

  return (
    <main className={styles.worldHome}>
      <section className={styles.welcomeScene} aria-labelledby="world-title">
        <span className={`${styles.cloud} ${styles.cloudOne}`} />
        <span className={`${styles.cloud} ${styles.cloudTwo}`} />
        <span className={styles.sun} />
        <div className={styles.welcomeCopy}>
          <h1 id="world-title">Hai, {profile.name}!</h1>
          <p>Hari ini mau belajar, menggambar, atau bermain warna?</p>
          <div className={styles.starCounter} aria-label={`${progress.stars} bintang terkumpul`}><span>★</span>{progress.stars}</div>
        </div>
        <div aria-hidden style={{ position: "absolute", right: "8%", bottom: "8%", fontSize: "clamp(54px, 9vw, 96px)" }}>🤖🐱</div>
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
          {SUBJECTS.map((subject) => (
            <Link
              key={subject.id}
              href={`/child/${childId}/subject/${subject.id}`}
              className={styles.portal}
              style={{ "--portal-accent": subject.accent } as CSSProperties}
            >
              <span className={styles.portalHalo} />
              <span className={styles.portalArt} style={{ display: "grid", placeItems: "center", fontSize: 56 }} aria-hidden>{subject.emoji}</span>
              <span className={styles.portalCopy}><strong>{subject.title}</strong><span>{subject.description}</span></span>
            </Link>
          ))}
          <span className={styles.mapPath} aria-hidden />
        </div>
      </section>
    </main>
  );
}
