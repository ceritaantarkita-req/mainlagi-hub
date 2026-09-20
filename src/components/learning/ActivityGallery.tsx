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
import convergence from "./StageGalleryConvergence.module.css";
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
      <span className={styles.activityEmoji}>{activity.emoji}</span>
      <span className={styles.previewIcon}><PreviewIcon size={34} weight="duotone" /></span>
    </div>
  );
}

function stageStatusLabel(stage: StageJourneyItem, qaUnlockAll: boolean) {
  if (qaUnlockAll) return "QA terbuka";
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
  recommendedActivityId,
  qaUnlockAll = false
}: {
  childId: string;
  subject: LearningSubject;
  activities: LearningActivity[];
  progress: LearningProgress;
  openStageIds: Set<string>;
  age: number;
  stageJourney: StageJourneyItem[];
  recommendedActivityId?: string | null;
  qaUnlockAll?: boolean;
}) {
  const [notice, setNotice] = useState<string | null>(null);
  const noticeRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (notice && !noticeRef.current?.open) noticeRef.current?.showModal();
  }, [notice]);

  const isPlayable = (activity: LearningActivity) =>
    qaUnlockAll || (openStageIds.has(activity.stageId) && age >= activity.ageMin && age <= activity.ageMax);

  const playableActivities = activities.filter(isPlayable);
  const unavailableActivities = activities.filter((activity) => !isPlayable(activity));
  const recommendedActivity = playableActivities.find((activity) => activity.id === recommendedActivityId) ?? playableActivities[0] ?? null;
  const toneById = new Map(activities.map((activity, index) => [activity.id, index % 5]));
  const stageMeta = new Map(stageJourney.map((stage, index) => [stage.stageId, { ...stage, index }]));

  const groupByStage = (items: LearningActivity[]) => {
    const grouped = new Map<string, LearningActivity[]>();
    for (const activity of items) {
      const list = grouped.get(activity.stageId) ?? [];
      list.push(activity);
      grouped.set(activity.stageId, list);
    }
    return [...grouped.entries()]
      .map(([stageId, stageActivities]) => ({
        stageId,
        title: stageMeta.get(stageId)?.title ?? "Permainan lainnya",
        index: stageMeta.get(stageId)?.index ?? Number.MAX_SAFE_INTEGER,
        activities: stageActivities
      }))
      .sort((a, b) => a.index - b.index || a.title.localeCompare(b.title));
  };

  const playableGroups = groupByStage(playableActivities);
  const unavailableGroups = groupByStage(unavailableActivities);

  const renderActivity = (activity: LearningActivity) => {
    const unlocked = qaUnlockAll || openStageIds.has(activity.stageId);
    const eligible = qaUnlockAll || (age >= activity.ageMin && age <= activity.ageMax);
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

  const renderGroups = (groups: ReturnType<typeof groupByStage>) => (
    <div className={styles.groupList}>
      {groups.map((group) => (
        <section className={styles.activityGroup} key={group.stageId} data-activity-stage-group={group.stageId}>
          <div className={styles.groupHead}>
            <h3>{group.title}</h3>
            <span>{group.activities.length} permainan</span>
          </div>
          <div className={styles.grid}>
            {group.activities.map(renderActivity)}
          </div>
        </section>
      ))}
    </div>
  );

  return (
    <main className={styles.page}>
      <Link className={styles.back} href={`/child/${childId}/home#choose-subject`}><ArrowLeft size={24} weight="bold" aria-hidden />Belajar</Link>

      <header className={styles.heading}>
        <div>
          <h1>{subject.id === "english" ? "Bahasa Inggris" : subject.title}</h1>
          <p>Pilih tahap, lalu mainkan aktivitas yang sedang terbuka.</p>
        </div>
        <span aria-label={`${activities.length} aktivitas`}>{activities.length} permainan</span>
      </header>

      {qaUnlockAll ? (
        <div className={styles.qaBanner} data-qa-unlock-all role="status">
          QA unlock-all aktif untuk demo lokal. Progression produk tidak diubah.
        </div>
      ) : null}

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
          <nav className={`${styles.stageJourney} ${convergence.stageJourney}`} aria-label={`Tahap ${subject.title}`} data-stage-journey>
            {stageJourney.map((stage, index) => {
              const body = <>
                <span className={styles.stageNumber}>{index + 1}</span>
                <span className={styles.stageCopy}><strong>{stage.title}</strong><small>{stageStatusLabel(stage, qaUnlockAll)}</small></span>
                {stage.status === "locked" && !qaUnlockAll ? <LockKey size={18} weight="fill" aria-hidden /> : <Play size={17} weight="fill" aria-hidden />}
              </>;
              return stage.status === "locked" && !qaUnlockAll ? (
                <span className={`${styles.stageCard} ${convergence.stageCard}`} data-status="locked" data-stage-journey-item key={stage.stageId} aria-label={`${stage.title}, belum terbuka`}>{body}</span>
              ) : (
                <Link className={`${styles.stageCard} ${convergence.stageCard}`} data-status={qaUnlockAll ? "qa-open" : stage.status} data-stage-journey-item key={stage.stageId} href={`/child/${childId}/stage/${stage.stageId}`}>{body}</Link>
              );
            })}
          </nav>
        </section>
      ) : null}

      <section className={styles.activitySection} data-activity-gallery>
        <div className={styles.sectionHead}>
          <div>
            <h2>{qaUnlockAll ? "Semua permainan untuk QA" : "Bisa dimainkan sekarang"}</h2>
            <p>{qaUnlockAll ? "Seluruh katalog dibuka hanya untuk inspeksi demo lokal." : `${playableActivities.length} permainan sesuai perjalanan dan usia saat ini.`}</p>
          </div>
        </div>

        {playableActivities.length ? (
          <div data-playable-activity-gallery aria-label={`Aktivitas ${subject.title} yang bisa dimainkan sekarang`}>
            {renderGroups(playableGroups)}
          </div>
        ) : (
          <div className={styles.emptyState}>Belum ada permainan yang terbuka untuk usia ini. Kembali ke Belajar untuk melihat saran berikutnya.</div>
        )}

        {unavailableActivities.length ? (
          <details className={styles.browseAll}>
            <summary>Lihat semua {activities.length} permainan <span>({unavailableActivities.length} lainnya)</span></summary>
            <p className={styles.browseHint}>Permainan bertanda kunci akan terbuka mengikuti perjalanan belajar atau rentang usia.</p>
            <div data-all-activity-gallery aria-label={`Aktivitas ${subject.title} lainnya`}>
              {renderGroups(unavailableGroups)}
            </div>
          </details>
        ) : null}
      </section>
    </main>
  );
}
