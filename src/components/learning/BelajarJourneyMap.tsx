"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { buildBelajarJourneyMap, type BelajarJourneyMapStage } from "@/lib/learning/journeyMap";
import { getActivitiesForStage, getStage, type LearningProgress, type LearningSubjectId } from "@/lib/learning/system";
import type { LearningAnalyticsSnapshot } from "@/lib/learning/attempts";
import styles from "./BelajarJourneyMap.module.css";

type Props = {
  subjectId: LearningSubjectId;
  childId: string;
  age: number;
  progress: LearningProgress;
  analytics: LearningAnalyticsSnapshot;
  qaUnlockAll?: boolean;
};

function stageStateLabel(stage: BelajarJourneyMapStage) {
  if (stage.completed) return "Selesai";
  if (stage.current) return "Sedang dipelajari";
  if (stage.locked) return "Terkunci";
  return "Terbuka";
}

export function BelajarJourneyMap({ subjectId, childId, age, progress, analytics, qaUnlockAll = false }: Props) {
  const model = useMemo(
    () => buildBelajarJourneyMap({ childId, subjectId, progress, analytics }),
    [childId, subjectId, progress, analytics]
  );
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedStageId) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedStageId(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedStageId]);

  if (!model) return null;

  const selected = selectedStageId ? model.stages.find((stage) => stage.id === selectedStageId) ?? null : null;
  const selectedCanonical = selected ? getStage(selected.id) : null;
  const stageActivities = selected
    ? getActivitiesForStage(selected.id).filter((activity) => age >= activity.ageMin && age <= activity.ageMax)
    : [];
  const recommendedActivity =
    stageActivities.find((activity) => !progress.completedActivityIds.includes(activity.id) && !activity.motionOptional) ??
    stageActivities.find((activity) => !activity.motionOptional) ??
    stageActivities[0] ??
    null;
  const currentStage = model.stages.find((stage) => stage.current) ?? model.stages.find((stage) => !stage.locked) ?? model.stages[0];
  const mapTitleId = `${model.subjectId}-map-title`;
  const detailTitleId = `${model.subjectId}-stage-detail-title`;

  return (
    <main
      className={styles.page}
      data-belajar-journey-map="v1"
      data-journey-subject={model.subjectId}
      data-english-journey-map={model.subjectId === "english" ? "v1" : undefined}
    >
      <section className={styles.hero} aria-labelledby={mapTitleId}>
        <div>
          <p className={styles.eyebrow}>Belajar · {model.subjectShortTitle}</p>
          <h1 id={mapTitleId}>{model.subjectTitle}</h1>
          <p>{model.subjectDescription}</p>
        </div>
        <div className={styles.progressCard} aria-label={model.completedStageCount + " dari " + model.totalStageCount + " stage selesai"}>
          <strong>{model.completedStageCount}/{model.totalStageCount}</strong>
          <span>Stage selesai</span>
        </div>
      </section>

      {currentStage ? (
        <section className={styles.resume} data-journey-resume>
          <div><span>Lanjut dari sini</span><strong>{currentStage.title}</strong></div>
          <button type="button" onClick={() => setSelectedStageId(currentStage.id)} aria-label={"Buka " + currentStage.title}>Lanjut belajar</button>
        </section>
      ) : null}

      <section className={styles.mapShell} aria-label={"Peta perjalanan " + model.subjectTitle}>
        <div className={styles.mapTrack} data-journey-map-track>
          {model.stages.map((stage, index) => {
            const locked = stage.locked && !qaUnlockAll;
            return (
              <div className={styles.stageRow} data-side={index % 2 === 0 ? "start" : "end"} key={stage.id}>
                <div className={styles.connector} aria-hidden />
                <button
                  type="button"
                  className={styles.stageNode}
                  data-state={qaUnlockAll && stage.locked ? "open" : stage.presentationState}
                  data-journey-stage={stage.id}
                  disabled={locked}
                  aria-current={stage.current ? "step" : undefined}
                  onClick={() => setSelectedStageId(stage.id)}
                >
                  <span className={styles.stageNumber}>{stage.order}</span>
                  <span className={styles.stageEmoji} aria-hidden>{stage.emoji}</span>
                  <span className={styles.stageCopy}>
                    <strong>{stage.title}</strong>
                    <small>{qaUnlockAll && stage.locked ? "QA terbuka" : stageStateLabel(stage)}</small>
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <details
        className={styles.browseAll}
        data-journey-browse-all
        data-english-browse-all={model.subjectId === "english" ? "" : undefined}
        open={qaUnlockAll}
      >
        <summary>Lihat semua aktivitas {model.subjectTitle}</summary>
        <div className={styles.browseGroups}>
          {model.stages.map((stage) => {
            const stageAccessible = qaUnlockAll || !stage.locked;
            return (
              <section key={stage.id}>
                <h2>{stage.title}</h2>
                <ul>
                  {getActivitiesForStage(stage.id).map((activity) => {
                    const ageEligible = age >= activity.ageMin && age <= activity.ageMax;
                    const playable = stageAccessible && ageEligible;
                    return (
                      <li key={activity.id} data-activity-id={activity.id}>
                        {playable ? (
                          <Link href={"/child/" + encodeURIComponent(childId) + "/activity/" + encodeURIComponent(activity.id)}>{activity.title}</Link>
                        ) : (
                          <span className={styles.browseUnavailable} aria-disabled="true">
                            {activity.title}
                            <small>{stageAccessible ? "Belum sesuai usia" : "Stage terkunci"}</small>
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </details>

      {selected && selectedCanonical ? (
        <div className={styles.detailBackdrop} data-stage-detail-open onClick={() => setSelectedStageId(null)}>
          <section className={styles.stageDetail} role="dialog" aria-modal="true" aria-labelledby={detailTitleId} onClick={(event) => event.stopPropagation()}>
            <div className={styles.detailHandle} aria-hidden />
            <div className={styles.detailHead}>
              <div>
                <p>Stage {selected.order} · {stageStateLabel(selected)}</p>
                <h2 id={detailTitleId}>{selected.title}</h2>
                <span>{selected.subtitle}</span>
              </div>
              <button type="button" className={styles.closeButton} onClick={() => setSelectedStageId(null)} aria-label="Tutup detail stage">×</button>
            </div>
            <div className={styles.readiness}>
              <strong>{selected.completedCount}/{selected.requiredCount} langkah utama selesai</strong>
              <progress max={Math.max(selected.requiredCount, 1)} value={Math.min(selected.completedCount, Math.max(selected.requiredCount, 1))} />
              <small>{selected.reason}</small>
            </div>
            <div className={styles.activityList} data-stage-text-activity-list>
              <h3>Aktivitas di stage ini</h3>
              <ul>
                {stageActivities.map((activity) => (
                  <li key={activity.id}>
                    <Link href={"/child/" + encodeURIComponent(childId) + "/activity/" + encodeURIComponent(activity.id)}>
                      <span>{activity.title}</span>
                      <small>{progress.completedActivityIds.includes(activity.id) ? "Selesai" : activity.motionOptional ? "Bonus gerak" : "Belum selesai"}</small>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {recommendedActivity ? (
              <Link className={styles.continueButton} data-stage-continue href={"/child/" + encodeURIComponent(childId) + "/activity/" + encodeURIComponent(recommendedActivity.id)}>Lanjut belajar</Link>
            ) : (
              <Link className={styles.continueButton} href={selected.href}>Buka stage</Link>
            )}
          </section>
        </div>
      ) : null}
    </main>
  );
}
