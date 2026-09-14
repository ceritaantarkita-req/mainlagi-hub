/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Cards,
  Check,
  Headphones,
  LockKey,
  Path,
  PencilLine,
  Play,
  PersonSimpleRun,
  Sparkle
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { speakWithStatus, unlockAudio } from "@/lib/audio/feedback";
import type { LearningActivity, LearningProgress, LearningSubject } from "@/lib/learning/system";
import styles from "./ActivityGallery.module.css";
import { drawingGuide } from "@/lib/learning/drawingGuides";

type StageJourneyItem = {
  stageId: string;
  title: string;
  status: "locked" | "in_progress" | "evidence_needed" | "ready";
  completedCount: number;
  requiredCount: number;
};

function ActivityPreview({ activity }: { activity: LearningActivity }) {
  if (activity.runtime === "coloring" || drawingGuide(activity.id)) {
    return <img src={`/artwork/activity-previews/${activity.id}.webp`} width={480} height={360} alt="" loading="lazy" />;
  }
  const values = activity.runtime === "matching"
    ? (activity.matchItems ?? []).slice(0, 4).map((item) => item.label)
    : activity.choices?.slice(0, 3) ?? [];
  const shortValues = values.every((value) => value.length <= 12);
  if (values.length && shortValues) {
    return <div className={styles.taskPreview} data-kind={activity.runtime} aria-hidden>{values.map((value, i) => <span key={i}>{value}</span>)}</div>;
  }
  if (activity.traceGlyph) return <div className={styles.tracePreview} aria-hidden>{activity.traceGlyph}</div>;
  const PreviewIcon = activity.runtime === "drawing"
    ? PencilLine
    : activity.runtime === "story"
      ? Cards
      : activity.runtime === "motion_game"
        ? PersonSimpleRun
        : activity.runtime === "matching"
          ? Cards
          : activity.runtime === "listen_and_choose"
            ? Headphones
            : Play;
  return (
    <div className={styles.picturePreview} aria-hidden>
      <img src={`/artwork/${activity.subjectId === "math" ? "garden-apple" : activity.runtime === "story" ? "garden-gavi" : "garden-paca"}.webp`} width={180} height={180} alt="" loading="lazy" />
      <PreviewIcon size={42} weight="duotone" />
    </div>
  );
}

function stageStatusLabel(stage: StageJourneyItem) {
  if (stage.status === "locked") return "Belum terbuka";
  if (stage.status === "ready") return "Siap lanjut";
  if (stage.status === "evidence_needed") return "Latihan lagi";
  return `${stage.completedCount}/${stage.requiredCount} langkah`;
}

export function ActivityGallery({
  childId,
  subject,
  activities,
  progress,
  openStageIds,
  age,
  stageJourney,
  recommendedActivityId
}: {
  childId: string;
  subject: LearningSubject;
  activities: LearningActivity[];
  progress: LearningProgress;
  openStageIds: Set<string>;
  age: number;
  stageJourney: StageJourneyItem[];
  recommendedActivityId?: string | null;
}) {
  const [notice, setNotice] = useState<string | null>(null);
  const noticeRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (notice && !noticeRef.current?.open) noticeRef.current?.showModal();
  }, [notice]);

  const isPlayable = (activity: LearningActivity) => openStageIds.has(activity.stageId) && age >= activity.ageMin && age <= activity.ageMax;
  const playableActivities = activities.filter(isPlayable);
  const unavailableActivities = activities.filter((activity) => !isPlayable(activity));
  const recommendedActivity = playableActivities.find((activity) => activity.id === recommendedActivityId) ?? playableActivities[0] ?? null;
  const toneById = new Map(activities.map((activity, index) => [activity.id, index % 5]));

  const renderActivity = (activity: LearningActivity) => {
    const unlocked = openStageIds.has(activity.stageId);
    const eligible = age >= activity.ageMin && age <= activity.ageMax;
    const playable = unlocked && eligible;
    const done = progress.completedActivityIds.includes(activity.id);
    const recommended = playable && activity.id === recommendedActivity?.id;
    const content = <>
      <div className={styles.thumbnail} data-tone={toneById.get(activity.id) ?? 0}>
        <ActivityPreview activity={activity} />
        {recommended ? <span className={styles.recommendedFlag}><Sparkle size={15} weight="fill" /> Mulai di sini</span> : null}
        <span className={styles.playBadge}>
          {!playable ? <LockKey size={19} weight="fill" /> : done ? <Check size={20} weight="bold" /> : <Play size={18} weight="fill" />}
        </span>
      </div>
      <h2>{activity.title}</h2>
    </>;

    return (
      <article className={styles.item} key={activity.id} data-activity-id={activity.id}>
        {playable ? (
          <Link
            className={styles.card}
            href={`/child/${childId}/activity/${activity.id}`}
            aria-label={`${activity.title}${recommended ? ", rekomendasi berikutnya" : ""}${done ? ", sudah dimainkan" : ""}`}
          >
            {content}
          </Link>
        ) : (
          <button
            type="button"
            className={styles.card}
            aria-label={`${activity.title}, ${unlocked ? "untuk usia lain" : "belum terbuka"}`}
            onClick={() => {
              const text = unlocked
                ? `Permainan ini disiapkan untuk usia ${activity.ageMin}–${activity.ageMax} tahun.`
                : "Permainan ini ada di perjalanan berikutnya. Pilih tahap yang sudah terbuka dulu, ya.";
              setNotice(text);
              unlockAudio();
              speakWithStatus(text);
            }}
          >
            {content}
          </button>
        )}
      </article>
    );
  };

  return (
    <main className={styles.page}>
      <Link className={styles.back} href={`/child/${childId}/home#choose-subject`}><ArrowLeft size={24} weight="bold" aria-hidden />Beranda</Link>

      <header className={styles.heading}>
        <div>
          <h1>{subject.id === "english" ? "Bahasa Inggris" : subject.title}</h1>
          <p>Lanjutkan perjalananmu, lalu pilih permainan yang sudah terbuka.</p>
        </div>
        <span aria-label={`${activities.length} aktivitas`}>{activities.length} permainan</span>
      </header>

      <dialog ref={noticeRef} className={styles.notice} aria-labelledby="activity-availability-title" onClose={() => setNotice(null)}>
        <h2 id="activity-availability-title">Ikuti perjalanan belajarmu</h2>
        <p>{notice}</p>
        <button type="button" onClick={() => noticeRef.current?.close()}>Oke, pilih lagi</button>
      </dialog>

      {recommendedActivity ? (
        <Link className={styles.continueCard} href={`/child/${childId}/activity/${recommendedActivity.id}`} data-recommended-activity>
          <span className={styles.continueIcon}><Sparkle size={24} weight="fill" aria-hidden /></span>
          <span>
            <small>Disarankan berikutnya</small>
            <strong>{recommendedActivity.title}</strong>
            <span>Mulai permainan</span>
          </span>
          <Play size={24} weight="fill" aria-hidden />
        </Link>
      ) : null}

      {stageJourney.length ? (
        <section className={styles.journeySection} aria-labelledby="stage-journey-title">
          <div className={styles.sectionTitle}>
            <span className={styles.sectionIcon}><Path size={22} weight="duotone" aria-hidden /></span>
            <div>
              <h2 id="stage-journey-title">Perjalanan belajar</h2>
              <p>Pilih tahap untuk melihat langkah belajarnya.</p>
            </div>
          </div>
          <nav className={styles.stageJourney} aria-label={`Tahap ${subject.title}`}>
            {stageJourney.map((stage, index) => {
              const body = <>
                <span className={styles.stageNumber}>{index + 1}</span>
                <span className={styles.stageCopy}><strong>{stage.title}</strong><small>{stageStatusLabel(stage)}</small></span>
                {stage.status === "locked" ? <LockKey size={18} weight="fill" aria-hidden /> : <Play size={17} weight="fill" aria-hidden />}
              </>;
              return stage.status === "locked" ? (
                <span className={styles.stageCard} data-status="locked" key={stage.stageId} aria-label={`${stage.title}, belum terbuka`}>{body}</span>
              ) : (
                <Link className={styles.stageCard} data-status={stage.status} key={stage.stageId} href={`/child/${childId}/stage/${stage.stageId}`}>{body}</Link>
              );
            })}
          </nav>
        </section>
      ) : null}

      <section className={styles.activitySection} data-activity-gallery>
        <div className={styles.sectionHead}>
          <div>
            <h2>Bisa dimainkan sekarang</h2>
            <p>{playableActivities.length} permainan sesuai perjalanan dan usia saat ini.</p>
          </div>
        </div>

        {playableActivities.length ? (
          <div className={styles.grid} data-playable-activity-gallery aria-label={`Aktivitas ${subject.title} yang bisa dimainkan sekarang`}>
            {playableActivities.map(renderActivity)}
          </div>
        ) : (
          <div className={styles.emptyState}>Belum ada permainan yang terbuka untuk usia ini. Kembali ke Beranda untuk melihat saran belajar.</div>
        )}

        {unavailableActivities.length ? (
          <details className={styles.browseAll}>
            <summary>Lihat semua {activities.length} permainan <span>({unavailableActivities.length} lainnya)</span></summary>
            <p className={styles.browseHint}>Permainan bertanda kunci akan terbuka mengikuti perjalanan belajar atau rentang usia.</p>
            <div className={styles.grid} data-all-activity-gallery aria-label={`Aktivitas ${subject.title} lainnya`}>
              {unavailableActivities.map(renderActivity)}
            </div>
          </details>
        ) : null}
      </section>
    </main>
  );
}
