"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import {
  SUBJECTS,
  getActivitiesForStage,
  getStage,
  getSubject,
  type LearningActivity,
  type LearningProgress,
  type LearningSubject,
  type LearningSubjectId
} from "@/lib/learning/system";
import { getLearningPathsForSubject, getLessonsForStage } from "@/lib/learning/curriculum";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { getSubjectStageReadiness, type StageReadinessRow } from "@/lib/learning/insights";
import { rankAdaptiveLearningV2 } from "@/lib/learning/adaptive";
import { ChildLoading, useLearningProfile, useLearningProgress } from "./LearningCommon";
import { useLearningAnalytics } from "./useLearningAnalytics";
import styles from "./LearningPlatform.module.css";
import stageStyles from "./StagePath.module.css";
import { LearningSymbol } from "./LearningSymbol";
import { BelajarJourneyMap } from "./BelajarJourneyMap";



function ageEligible(activity: LearningActivity, age: number) {
  return age >= activity.ageMin && age <= activity.ageMax;
}

function readinessTone(status: StageReadinessRow["status"]) {
  switch (status) {
    case "locked": return "Belum terbuka";
    case "in_progress": return "Sedang dimainkan";
    case "evidence_needed": return "Ayo latihan lagi";
    case "ready": return "✓ Siap lanjut";
  }
}

function runtimeLabel(activity: LearningActivity) {
  const labels: Record<LearningActivity["runtime"], string> = {
    tap_choice: "Sentuh",
    listen_and_choose: "Audio + sentuh",
    matching: "Pasangkan",
    trace: "Trace jari",
    coloring: "Mewarnai",
    drawing: "Menggambar",
    story: "Cerita",
    motion_game: "Gerak kamera"
  };
  return labels[activity.runtime];
}

function ActivityCard({
  childId,
  activity,
  progress,
  subject,
  recommended = false,
  stagePresentation = false
}: {
  childId: string;
  activity: LearningActivity;
  progress: LearningProgress;
  subject: LearningSubject;
  recommended?: boolean;
  stagePresentation?: boolean;
}) {
  const done = progress.completedActivityIds.includes(activity.id);
  const spec = getActivityLearningSpec(activity.id);
  const stageClassName = stagePresentation
    ? `${stageStyles.stageActivityCard}${recommended ? ` ${stageStyles.recommendedCard}` : ""}`
    : "";
  return (
    <Link
      href={`/child/${childId}/activity/${activity.id}`}
      className={`${styles.activityCard}${stageClassName ? ` ${stageClassName}` : ""}`}
      style={{ "--accent": subject.accent, "--soft": subject.soft } as CSSProperties}
      data-stage-activity-card={stagePresentation ? "true" : undefined}
      data-stage-recommended={stagePresentation && recommended ? "true" : undefined}
    >
      <span className={styles.activityIcon} aria-hidden><LearningSymbol name={activity.runtime}/></span>
      <h3>{activity.title}</h3>
      <p>{activity.description}</p>
      <span className={styles.activityMeta}>
        <span className={styles.tag}>{runtimeLabel(activity)}</span>
        {spec?.requiredForStage ? <span className={styles.tag}>Langkah utama</span> : null}
        {spec?.assessment === "assessed" && !spec.requiredForStage ? <span className={styles.tag}>Latihan</span> : null}
        {activity.motionOptional ? <span className={`${styles.tag} ${styles.tagMotion}`}>Gerak opsional</span> : null}
        {recommended ? <span className={styles.tag}>Coba berikutnya</span> : null}
        {done ? <span className={`${styles.tag} ${styles.tagDone}`}>✓ Selesai</span> : null}
      </span>
    </Link>
  );
}

function getStageForActivity(activityId: string): string | null {
  for (const subject of SUBJECTS) {
    const paths = getLearningPathsForSubject(subject.id);
    for (const path of paths) {
      for (const stageId of path.stageIds) {
        if (getActivitiesForStage(stageId).some((activity) => activity.id === activityId)) return stageId;
      }
    }
  }
  return null;
}

export function SubjectScreen({ childId, subjectId, qaUnlockAll = false }: { childId: string; subjectId: string; qaUnlockAll?: boolean }) {
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);
  const analytics = useLearningAnalytics(childId);
  const subject = getSubject(subjectId);
  if (!profile || !subject) return <main className={styles.content}><div className={styles.emptyState}>Area belajar tidak ditemukan.</div></main>;

  return (
    <BelajarJourneyMap
      subjectId={subject.id}
      childId={childId}
      age={profile.age}
      progress={progress}
      analytics={analytics}
      qaUnlockAll={qaUnlockAll}
    />
  );
}

export function StageScreen({ childId, stageId }: { childId: string; stageId: string }) {
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);
  const analytics = useLearningAnalytics(childId);
  const stage = getStage(stageId);
  if (!profile || !stage) return <main className={styles.content}><div className={styles.emptyState}>Stage tidak ditemukan.</div></main>;

  const subject = getSubject(stage.subjectId)!;
  const activities = getActivitiesForStage(stage.id).filter((activity) => ageEligible(activity, profile.age));
  const activityMap = new Map(activities.map((activity) => [activity.id, activity]));
  const lessons = getLessonsForStage(stage.id).filter((lesson) => profile.age >= lesson.ageMin && profile.age <= lesson.ageMax);
  const optional = activities.filter((item) => item.motionOptional);
  const readiness = getSubjectStageReadiness(subject.id, progress, analytics).find((row) => row.stageId === stage.id);
  const ranked = rankAdaptiveLearningV2({ age: profile.age, progress, analytics, allowMotion: false, subjectId: subject.id });
  const recommendedId = ranked.find((item) => getStageForActivity(item.id) === stage.id)?.id ?? null;

  return (
    <main className={`${styles.content} ${stageStyles.stagePage}`} data-mainlagi-stage-screen>
      <section className={stageStyles.stageHero} aria-labelledby="stage-title">
        <div className={stageStyles.stageIdentity}>
          <span className={stageStyles.stageSymbol} aria-hidden><LearningSymbol name={subject.id} size={32} /></span>
          <div>
            <p className={styles.eyebrow}>{subject.title}</p>
            <h1 className={styles.pageTitle} id="stage-title">{stage.title}</h1>
            <p className={styles.pageLead}>{stage.subtitle}</p>
          </div>
        </div>

        {readiness ? (
          <div className={stageStyles.readinessCard} data-stage-readiness data-status={readiness.status}>
            <div className={stageStyles.readinessTopline}>
              <strong>{readinessTone(readiness.status)}</strong>
              <span>{readiness.completedCount}/{readiness.requiredCount} langkah utama</span>
            </div>
            <progress
              className={stageStyles.readinessProgress}
              max={Math.max(readiness.requiredCount, 1)}
              value={Math.min(readiness.completedCount, Math.max(readiness.requiredCount, 1))}
              aria-label={`${readiness.completedCount} dari ${readiness.requiredCount} langkah utama selesai`}
            />
            <p>Selesaikan langkah utama di tahap ini. Latihan tambahan tetap bisa dimainkan tanpa mengubah syarat lanjut.</p>
          </div>
        ) : null}
      </section>

      {lessons.map((lesson, lessonIndex) => {
        const lessonActivities = lesson.activityIds
          .map((id) => activityMap.get(id))
          .filter((item): item is LearningActivity => Boolean(item && !item.motionOptional && item.runtime !== "motion_game"));
        if (!lessonActivities.length) return null;
        const doneCount = lessonActivities.filter((item) => progress.completedActivityIds.includes(item.id)).length;
        return (
          <section className={`${styles.section} ${stageStyles.lessonSection}`} key={lesson.id} data-stage-lesson>
            <div className={stageStyles.lessonHeader}>
              <div className={stageStyles.lessonCopy}>
                <span className={stageStyles.lessonKicker}>Langkah {lessonIndex + 1}</span>
                <h2>{lesson.title}</h2>
                <p>{lesson.objective}</p>
              </div>
              <span className={stageStyles.lessonProgress}>{doneCount}/{lessonActivities.length} selesai</span>
            </div>
            <div className={stageStyles.lessonGrid} data-stage-lesson-grid>
              {lessonActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  childId={childId}
                  activity={activity}
                  progress={progress}
                  subject={subject}
                  recommended={activity.id === recommendedId}
                  stagePresentation
                />
              ))}
            </div>
          </section>
        );
      })}

      {optional.length ? (
        <section className={`${styles.section} ${stageStyles.optionalSection}`}>
          <div className={styles.sectionHead}><h2>Kalau mau main pakai gerakan</h2></div>
          <div className={styles.motionNotice}><strong>Bonus opsional.</strong> Kamu tetap bisa lanjut belajar tanpa kamera.</div>
          <div className={`${stageStyles.lessonGrid} ${stageStyles.optionalGrid}`}>
            {optional.map((activity) => <ActivityCard key={activity.id} childId={childId} activity={activity} progress={progress} subject={subject} stagePresentation />)}
          </div>
        </section>
      ) : null}
    </main>
  );
}