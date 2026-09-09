"use client";

import type { CSSProperties } from "react";
import { CHARACTERS, SUBJECTS } from "@/lib/learning/system";
import {
  getNextBestLearningRecommendation,
  getSubjectLearningSummary,
  getSubjectSkillRows
} from "@/lib/learning/insights";
import { CharacterAvatar, useLearningProfile, useLearningProgress } from "./LearningCommon";
import { useLearningAnalytics } from "./useLearningAnalytics";
import styles from "./LearningPlatform.module.css";

function percent(value: number): number {
  return Math.round(Math.max(0, Math.min(1, value)) * 100);
}

export function ParentCoreProgressScreen({ childId }: { childId: string }) {
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);
  const analytics = useLearningAnalytics(childId);

  if (!profile) {
    return <main className={styles.parentMain}><div className={styles.emptyState}>Profil anak tidak ditemukan.</div></main>;
  }

  const recommendation = getNextBestLearningRecommendation({
    age: profile.age,
    progress,
    analytics,
    allowMotion: false
  });

  return (
    <main className={styles.parentMain}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
        <CharacterAvatar id={profile.guide} large />
        <div>
          <p className={styles.eyebrow}>Profil anak</p>
          <h1 className={styles.pageTitle}>{profile.name}</h1>
          <p className={styles.pageLead}>{profile.age} tahun · Guide {CHARACTERS[profile.guide].name}</p>
        </div>
      </div>

      <div className={styles.parentGrid}>
        <div className={styles.parentCard}>
          <strong>🧪 Learning attempts</strong>
          <p>{analytics.totalAttempts} percobaan tercatat · {analytics.assessedAttempts} assessed · {analytics.practiceAttempts} practice</p>
          <small>{analytics.lastAttemptAt ? `Attempt terakhir ${new Date(analytics.lastAttemptAt).toLocaleDateString("id-ID")}` : "Belum ada attempt"}</small>
        </div>
        <div className={styles.parentCard}>
          <strong>⭐ Reward</strong>
          <p>{progress.stars} bintang · {progress.completedActivityIds.length} aktivitas unik selesai</p>
        </div>
        <div className={styles.parentCard}>
          <strong>🎯 Saran berikutnya</strong>
          {recommendation ? (
            <>
              <p><strong>{recommendation.activity.title}</strong></p>
              <p>{recommendation.reasonLabel}</p>
              {recommendation.targetSkillTitle ? <small>Target skill: {recommendation.targetSkillTitle}</small> : null}
            </>
          ) : <p>Belum ada rekomendasi yang sesuai umur dan stage aktif.</p>}
        </div>
      </div>

      <section className={styles.section}>
        <h2 style={{ color: "#24445e" }}>Progress & mastery per area</h2>
        <p className={styles.pageLead}>
          Completion menunjukkan aktivitas yang sudah selesai. Mastery memakai evidence berulang dari aktivitas assessed;
          aktivitas kreatif/practice tidak dipaksa menjadi nilai akademik.
        </p>

        <div className={styles.parentGrid}>
          {SUBJECTS.map((subject) => {
            const summary = getSubjectLearningSummary(subject.id, progress, analytics);
            const skills = getSubjectSkillRows(subject.id, analytics);
            const completionPct = percent(summary.completionRatio);
            const masteryPct = percent(summary.masteryScore);
            const assessedRows = skills.filter((skill) => skill.level !== "not_started");
            const sortedStarted = [...assessedRows].sort((a, b) => a.score - b.score);
            const needsPractice = sortedStarted[0];
            const strongest = sortedStarted.at(-1);

            return (
              <div
                className={styles.parentCard}
                key={subject.id}
                style={{ "--accent": subject.accent } as CSSProperties}
              >
                <strong>{subject.emoji} {subject.title}</strong>
                <p>{summary.completedActivities} dari {summary.requiredActivities} aktivitas inti selesai</p>
                <div className={styles.stageProgress}>
                  <span className={styles.progressTrack}>
                    <span className={styles.progressFill} style={{ width: `${completionPct}%` }} />
                  </span>
                  <span>{completionPct}%</span>
                </div>

                <p style={{ marginTop: 14, marginBottom: 6 }}>
                  Skor evidence: <strong>{masteryPct}%</strong> · coverage {percent(summary.masteryCoverage)}%
                </p>
                <p style={{ marginTop: 0 }}>
                  {summary.proficientSkills}/{summary.totalSkills} skill minimal Mahir · {summary.masteredSkills} Dikuasai
                </p>

                {needsPractice ? <p style={{ marginBottom: 4 }}>🔁 Perlu diperkuat: <strong>{needsPractice.title}</strong></p> : null}
                {strongest && strongest.id !== needsPractice?.id ? <p style={{ marginTop: 0 }}>✨ Kekuatan saat ini: <strong>{strongest.title}</strong></p> : null}

                {assessedRows.length ? (
                  <ul className={styles.list} style={{ marginTop: 12 }}>
                    {assessedRows.map((skill) => (
                      <li className={styles.listItem} key={skill.id}>
                        <span>{skill.title}</span>
                        <strong>{skill.levelLabel} · {percent(skill.score)}%</strong>
                      </li>
                    ))}
                  </ul>
                ) : <p style={{ marginTop: 12 }}>Belum ada evidence assessed pada area ini.</p>}
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.infoBanner}>
          <strong>Mastery bukan label kecerdasan.</strong> Satu jawaban sempurna tidak cukup untuk “Dikuasai”.
          Sistem membutuhkan evidence konsisten dari beberapa attempt; hint, retry berlebihan, dan replay terlalu cepat dibatasi agar tidak menghasilkan false mastery.
        </div>
      </section>
    </main>
  );
}
