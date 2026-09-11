"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { getActivitiesForStage, getStage, getSubject, type LearningActivity } from "@/lib/learning/system";
import { getLessonsForStage } from "@/lib/learning/curriculum";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { ChildLoading, useLearningProfile, useLearningProgress } from "./LearningCommon";
import styles from "./LearningPlatform.module.css";

function DrawingActivityCard({ childId, activity, done, accent, soft }: { childId: string; activity: LearningActivity; done: boolean; accent: string; soft: string }) {
  const spec = getActivityLearningSpec(activity.id);
  return (
    <Link href={`/child/${childId}/activity/${activity.id}`} className={styles.activityCard} style={{ "--accent": accent, "--soft": soft } as CSSProperties}>
      <span className={styles.activityIcon} aria-hidden>{activity.emoji}</span>
      <h3>{activity.title}</h3>
      <p>{activity.description}</p>
      <span className={styles.activityMeta}>
        <span className={styles.tag}>✏️ Menggambar</span>
        <span className={styles.tag}>Practice kreatif</span>
        {spec?.requiredForStage ? <span className={styles.tag}>Inti</span> : null}
        {done ? <span className={`${styles.tag} ${styles.tagDone}`}>✓ Selesai</span> : null}
      </span>
    </Link>
  );
}

export function DrawingStageScreen({ childId, stageId }: { childId: string; stageId: string }) {
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);
  const stage = getStage(stageId);
  if (!profile || !stage) return <ChildLoading />;
  if (stage.subjectId !== "drawing") return <main className={styles.content}><div className={styles.emptyState}>Stage menggambar tidak ditemukan.</div></main>;
  const subject = getSubject("drawing")!;
  const activities = getActivitiesForStage(stage.id).filter((activity) => profile.age >= activity.ageMin && profile.age <= activity.ageMax);
  const activityMap = new Map(activities.map((activity) => [activity.id, activity]));
  const lessons = getLessonsForStage(stage.id).filter((lesson) => profile.age >= lesson.ageMin && profile.age <= lesson.ageMax);

  return (
    <main className={styles.content}>
      <Link className={styles.backButton} href={`/child/${childId}/subject/drawing`} aria-label="Kembali">←</Link>
      <div style={{ marginTop: 16 }}>
        <p className={styles.eyebrow}>{subject.emoji} {subject.title}</p>
        <h1 className={styles.pageTitle}>{stage.title}</h1>
        <p className={styles.pageLead}>{stage.subtitle}</p>
      </div>
      <section className={styles.section}>
        <div className={styles.infoBanner}>
          <strong>Creative practice.</strong> Aktivitas menggambar di sini menyimpan completion saja. Tidak ada skor bagus-jelek dan tidak dipakai sebagai bukti mastery akurasi gambar.
        </div>
      </section>
      {lessons.map((lesson) => {
        const items = lesson.activityIds.map((id) => activityMap.get(id)).filter((item): item is LearningActivity => Boolean(item));
        if (!items.length) return null;
        return (
          <section className={styles.section} key={lesson.id}>
            <div className={styles.sectionHead}>
              <div><p className={styles.eyebrow}>Lesson</p><h2>{lesson.title}</h2><p className={styles.pageLead}>{lesson.objective}</p></div>
            </div>
            <div className={styles.cardGrid}>
              {items.map((activity) => (
                <DrawingActivityCard
                  key={activity.id}
                  childId={childId}
                  activity={activity}
                  done={progress.completedActivityIds.includes(activity.id)}
                  accent={subject.accent}
                  soft={subject.soft}
                />
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
