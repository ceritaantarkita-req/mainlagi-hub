"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import {
  SUBJECTS,
  ACTIVITIES,
  getActivitiesForStage,
  getStage,
  getSubject,
  type LearningActivity,
  type LearningProgress,
  type LearningSubject,
  type LearningSubjectId
} from "@/lib/learning/system";
import { getLearningPathsForSubject, getLessonsForStage } from "@/lib/learning/curriculum";
import { getActivityLearningSpec, getLearningSkill } from "@/lib/learning/catalog";
import { getSubjectStageReadiness, type StageReadinessRow } from "@/lib/learning/insights";
import { adaptiveReasonLabel, rankAdaptiveLearningV2 } from "@/lib/learning/adaptive";
import { CharacterGroup, ChildLoading, useLearningProfile, useLearningProgress } from "./LearningCommon";
import { useLearningAnalytics } from "./useLearningAnalytics";
import styles from "./LearningPlatform.module.css";
import { SubjectDirectory } from "./Playroom";
import { LearningSymbol } from "./LearningSymbol";
import { ActivityGallery } from "./ActivityGallery";

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
  recommended = false
}: {
  childId: string;
  activity: LearningActivity;
  progress: LearningProgress;
  subject: LearningSubject;
  recommended?: boolean;
}) {
  const done = progress.completedActivityIds.includes(activity.id);
  const spec = getActivityLearningSpec(activity.id);
  return (
    <Link
      href={`/child/${childId}/activity/${activity.id}`}
      className={styles.activityCard}
      style={{ "--accent": subject.accent, "--soft": subject.soft } as CSSProperties}
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

function adaptiveTop(args: {
  age: number;
  progress: LearningProgress;
  analytics: ReturnType<typeof useLearningAnalytics>;
  subjectId?: LearningSubjectId;
}) {
  const ranked = rankAdaptiveLearningV2({
    age: args.age,
    progress: args.progress,
    analytics: args.analytics,
    allowMotion: false,
    subjectId: args.subjectId
  });
  const top = ranked[0];
  if (!top) return null;
  const activity = getActivitiesForStage(getStageForActivity(top.id) ?? "").find((item) => item.id === top.id);
  if (!activity) return null;
  const skill = top.targetSkillId ? getLearningSkill(top.targetSkillId) : undefined;
  return {
    ...top,
    activity,
    reasonLabel: adaptiveReasonLabel(top.reason, skill?.title ?? null),
    targetSkillTitle: skill?.title ?? null
  };
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

export function ChildHomeScreen({ childId }: { childId: string }) {
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);
  const analytics = useLearningAnalytics(childId);
  if (!profile) return <ChildLoading />;

  const recommendation = adaptiveTop({ age: profile.age, progress, analytics });
  const nextSubject = recommendation ? getSubject(recommendation.activity.subjectId) : undefined;

  return (
    <main className={styles.content}>
      <section className={styles.heroCard}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Halo, {profile.name}! 👋</p>
          <h1>Belajar sebentar, main lagi.</h1>
          <p>Mainlagi menyiapkan permainan berikutnya dari perjalanan dan latihan terbaru. Kamera tetap opsional.</p>
          <div className={styles.heroActionRow}>
            {recommendation ? <Link className={styles.primaryButton} href={`/child/${childId}/activity/${recommendation.activity.id}`}>▶ Lanjut: {recommendation.activity.title}</Link> : null}
            <Link className={styles.secondaryButton} href={`#choose-subject`}>Pilih area belajar</Link>
          </div>
        </div>
        <CharacterGroup />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}><h2>Pilih yang mau dipelajari</h2><span className={styles.tag}>⭐ {progress.stars}</span></div>
        <SubjectDirectory childId={childId} />
      </section>

      {recommendation && nextSubject ? (
        <section className={styles.section}>
          <div className={styles.sectionHead}><h2>Saran belajar berikutnya</h2></div>
          <div className={styles.infoBanner} style={{ marginBottom: 12 }}>
            <strong>Kenapa ini?</strong> {recommendation.reasonLabel}
            {recommendation.targetSkillTitle ? <><br /><small>Target: {recommendation.targetSkillTitle}</small></> : null}
          </div>
          <div className={styles.cardGrid}>
            <ActivityCard childId={childId} activity={recommendation.activity} progress={progress} subject={nextSubject} recommended />
          </div>
        </section>
      ) : null}

      <section className={styles.section}>
        <div className={styles.infoBanner}><strong>Main Gerak tetap ada.</strong> Kamera bukan syarat untuk learning path utama.</div>
      </section>
    </main>
  );
}

export function SubjectScreen({ childId, subjectId }: { childId: string; subjectId: string }) {
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);
  const analytics = useLearningAnalytics(childId);
  const subject = getSubject(subjectId);
  if (!profile || !subject) return <main className={styles.content}><div className={styles.emptyState}>Area belajar tidak ditemukan.</div></main>;

  const readiness = getSubjectStageReadiness(subject.id, progress, analytics);
  const totalActivities = ACTIVITIES.filter((activity) => activity.subjectId === subject.id);
  const openStageIds = new Set(readiness.filter((row) => row.status !== "locked").map((row) => row.stageId));
  return <ActivityGallery childId={childId} subject={subject} activities={totalActivities} progress={progress} openStageIds={openStageIds} age={profile.age}/>;
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
    <main className={styles.content}>
      <Link className={styles.backButton} href={`/child/${childId}/subject/${stage.subjectId}`} aria-label="Kembali">←</Link>
      <div style={{ marginTop: 16 }}>
        <p className={styles.eyebrow}>{subject.title}</p>
        <h1 className={styles.pageTitle}>{stage.title}</h1>
        <p className={styles.pageLead}>{stage.subtitle}</p>
      </div>

      {readiness ? (
        <section className={styles.section}>
          <div className={styles.infoBanner}>
            <strong>{readinessTone(readiness.status)}</strong> · {readiness.completedCount}/{readiness.requiredCount} langkah utama selesai.
          </div>
        </section>
      ) : null}

      {lessons.map((lesson) => {
        const lessonActivities = lesson.activityIds
          .map((id) => activityMap.get(id))
          .filter((item): item is LearningActivity => Boolean(item && !item.motionOptional && item.runtime !== "motion_game"));
        if (!lessonActivities.length) return null;
        const doneCount = lessonActivities.filter((item) => progress.completedActivityIds.includes(item.id)).length;
        return (
          <section className={styles.section} key={lesson.id}>
            <div className={styles.sectionHead}>
              <div>
                <h2>{lesson.title}</h2>
                <p className={styles.pageLead}>{lesson.objective}</p>
              </div>
              <span className={styles.tag}>{doneCount}/{lessonActivities.length} selesai</span>
            </div>
            <div className={styles.cardGrid}>
              {lessonActivities.map((activity) => (
                <ActivityCard key={activity.id} childId={childId} activity={activity} progress={progress} subject={subject} recommended={activity.id === recommendedId} />
              ))}
            </div>
          </section>
        );
      })}

      {optional.length ? (
        <section className={styles.section}>
          <div className={styles.sectionHead}><h2>Kalau mau main pakai gerakan</h2></div>
          <div className={styles.motionNotice}><strong>Bonus opsional.</strong> Kamu tetap bisa lanjut belajar tanpa kamera.</div>
          <div className={styles.cardGrid} style={{ marginTop: 12 }}>
            {optional.map((activity) => <ActivityCard key={activity.id} childId={childId} activity={activity} progress={progress} subject={subject} />)}
          </div>
        </section>
      ) : null}
    </main>
  );
}
