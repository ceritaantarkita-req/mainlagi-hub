"use client";

import { buildBatch15ParentReport } from "@/lib/learning/batch15";
import { CHARACTERS, SUBJECTS } from "@/lib/learning/system";
import { CharacterAvatar, useLearningProfile, useLearningProgress } from "./LearningCommon";
import { useLearningAnalytics } from "./useLearningAnalytics";
import { useLearningAwards } from "./useLearningAwards";
import styles from "./LearningPlatform.module.css";

const ACHIEVEMENT_META: Record<string, { title: string; description: string; icon: string }> = {
  "first-attempt": { title: "Langkah Pertama", description: "Menyelesaikan learning attempt pertama.", icon: "🌱" },
  "five-activities": { title: "Penjelajah Belajar", description: "Menyelesaikan lima aktivitas berbeda.", icon: "🧭" },
  "first-proficient": { title: "Mulai Mahir", description: "Mencapai minimal Mahir pada satu skill terukur.", icon: "✨" },
  "first-mastered": { title: "Skill Dikuasai", description: "Mengumpulkan evidence konsisten sampai satu skill Dikuasai.", icon: "🏆" },
  "all-subjects": { title: "Petualang Mainlagi", description: "Mencoba seluruh area belajar Mainlagi.", icon: "🌈" }
};

function percent(value: number): number {
  return Math.round(Math.max(0, Math.min(1, value)) * 100);
}

function trendText(delta: number): string {
  if (delta > 0) return `+${delta} dibanding 7 hari sebelumnya`;
  if (delta < 0) return `${delta} dibanding 7 hari sebelumnya`;
  return "Sama dengan 7 hari sebelumnya";
}

export function ParentBatch15ReportScreen({ childId }: { childId: string }) {
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);
  const analytics = useLearningAnalytics(childId);
  const awards = useLearningAwards(childId);

  if (!profile) {
    return <main className={styles.parentMain}><div className={styles.emptyState}>Profil anak tidak ditemukan.</div></main>;
  }

  const report = buildBatch15ParentReport({
    age: profile.age,
    progress,
    analytics,
    allowMotion: false,
    recentLimit: 6
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

      <h2 style={{ color: "#24445e" }}>Laporan belajar mingguan</h2>
      <p className={styles.pageLead}>
        Ringkasan 7 hari terakhir dari attempts dan mastery canonical. Practice kreatif tetap dilaporkan sebagai partisipasi, bukan nilai kemampuan atau mastery.
      </p>

      <div className={`${styles.parentGrid} ${styles.parentGridThree}`}>
        <div className={styles.parentCard}>
          <strong>🧪 Aktivitas minggu ini</strong>
          <p>{report.attempts} attempt · {report.assessedAttempts} assessed · {report.practiceAttempts} practice</p>
          <small>{trendText(report.attemptDelta)}</small>
        </div>
        <div className={styles.parentCard}>
          <strong>📅 Hari aktif</strong>
          <p>{report.activeDays} dari 7 hari</p>
          <small>{report.qualifyingEvidence} qualifying evidence terukur</small>
        </div>
        <div className={styles.parentCard}>
          <strong>🎯 Akurasi assessed</strong>
          <p>{report.averageAccuracy === null ? "Belum ada data" : `${percent(report.averageAccuracy)}%`}</p>
          <small>Completion-only practice tidak masuk hitungan akurasi.</small>
        </div>
      </div>

      <section className={styles.section}>
        <h2 style={{ color: "#24445e" }}>Pola yang terlihat</h2>
        <div className={styles.parentGrid}>
          <div className={styles.parentCard}>
            <strong>✨ Kekuatan terukur</strong>
            <p>{report.strongestSkill ? `${report.strongestSkill.title} · ${percent(report.strongestSkill.score)}%` : "Belum cukup qualifying evidence."}</p>
          </div>
          <div className={styles.parentCard}>
            <strong>🔁 Bagus untuk diperkuat</strong>
            <p>{report.needsPracticeSkill ? `${report.needsPracticeSkill.title} · ${percent(report.needsPracticeSkill.score)}%` : "Belum ada skill terukur yang perlu ditandai."}</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 style={{ color: "#24445e" }}>Ringkasan 9 area + saran berikutnya</h2>
        <div className={styles.parentGrid}>
          {report.subjects.map((row) => {
            const subject = SUBJECTS.find((item) => item.id === row.subjectId);
            return (
              <div className={styles.parentCard} key={row.subjectId}>
                <strong>{subject?.emoji ?? "📘"} {row.title}</strong>
                <p>Minggu ini: {row.attempts} attempt · {row.assessedAttempts} assessed · {row.practiceAttempts} practice</p>
                <p>Completion inti {row.completion.completedActivities}/{row.completion.requiredActivities} · {percent(row.completion.ratio)}%</p>
                {row.mastery ? (
                  <p>Mastery terukur {percent(row.mastery.score)}% · coverage {percent(row.mastery.coverage)}% · {row.mastery.proficientSkills}/{row.mastery.totalAssessedSkills} minimal Mahir</p>
                ) : (
                  <p><strong>Practice kreatif:</strong> completion dilaporkan, tanpa skor mastery.</p>
                )}
                <p>Stage: {row.stages.ready} siap · {row.stages.inProgress} berjalan · {row.stages.evidenceNeeded} butuh evidence · {row.stages.locked} terkunci</p>
                {row.needsPractice ? <p>Perlu diperkuat: <strong>{row.needsPractice.title}</strong></p> : null}
                {row.recommendation ? <p><strong>Saran:</strong> {row.recommendation.activityTitle} — {row.recommendation.reasonLabel}</p> : <p>Belum ada rekomendasi eligible untuk area ini.</p>}
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.section}>
        <h2 style={{ color: "#24445e" }}>Aktivitas terbaru</h2>
        <div className={styles.parentCard}>
          {report.recentAttempts.length ? (
            <ul className={styles.list}>
              {report.recentAttempts.map((attempt) => (
                <li className={styles.listItem} key={attempt.id}>
                  <span>
                    {attempt.activityTitle}
                    <small style={{ display: "block" }}>{new Date(attempt.completedAt).toLocaleString("id-ID")}</small>
                  </span>
                  <strong>{attempt.assessed && attempt.accuracy !== null ? `${percent(attempt.accuracy)}% · retry ${attempt.retryCount}` : "practice"}</strong>
                </li>
              ))}
            </ul>
          ) : <p>Belum ada learning attempt.</p>}
        </div>
      </section>

      <section className={styles.section}>
        <h2 style={{ color: "#24445e" }}>Achievement tersimpan</h2>
        {!awards.cloudAvailable ? <div className={styles.infoBanner}>Achievement cloud belum bisa dibaca. Tidak ada badge lokal yang diklaim sebagai award server.</div> : null}
        <div className={styles.parentGrid}>
          {awards.achievements.length ? awards.achievements.map((award) => {
            const meta = ACHIEVEMENT_META[award.key] ?? { title: award.key, description: "Achievement Mainlagi", icon: "🏅" };
            return (
              <div className={styles.parentCard} key={award.key}>
                <strong>{meta.icon} {meta.title}</strong>
                <p>{meta.description}</p>
                <small>Diberikan {new Date(award.awardedAt).toLocaleDateString("id-ID")}</small>
              </div>
            );
          }) : <div className={styles.parentCard}><p>Belum ada achievement server-issued.</p></div>}
        </div>
      </section>
    </main>
  );
}
