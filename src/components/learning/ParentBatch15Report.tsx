"use client";

import { Books, Cards, Check, Sparkle, Trophy } from "@phosphor-icons/react";
import { buildBatch15ParentReport } from "@/lib/learning/batch15";
import { CHARACTERS, SUBJECTS } from "@/lib/learning/system";
import { CharacterAvatar, useLearningProfile, useLearningProgress } from "./LearningCommon";
import { LearningSymbol } from "./LearningSymbol";
import { useLearningAnalyticsState } from "./useLearningAnalytics";
import { LearningAnalyticsStatus } from "./LearningAnalyticsStatus";
import { useLearningAwards } from "./useLearningAwards";
import styles from "./LearningPlatform.module.css";
import reportStyles from "./ParentReport.module.css";

const ACHIEVEMENT_META: Record<string, { title: string; description: string; icon: string }> = {
  "first-attempt": { title: "Langkah Pertama", description: "Menyelesaikan kegiatan belajar pertama.", icon: "🌱" },
  "five-activities": { title: "Penjelajah Belajar", description: "Menyelesaikan lima aktivitas berbeda.", icon: "🧭" },
  "first-proficient": { title: "Mulai Mahir", description: "Mencapai minimal Mahir pada satu keterampilan terukur.", icon: "✨" },
  "first-mastered": { title: "Keterampilan Dikuasai", description: "Menunjukkan hasil yang konsisten sampai satu keterampilan berstatus Dikuasai.", icon: "🏆" },
  "all-subjects": { title: "Petualang Mainlagi", description: "Mencoba seluruh area belajar Mainlagi.", icon: "🌈" }
};

function percent(value: number): number {
  return Math.round(Math.max(0, Math.min(1, value)) * 100);
}

function trendText(delta: number): string {
  if (delta > 0) return `${delta} kegiatan lebih banyak dari 7 hari sebelumnya.`;
  if (delta < 0) return `${Math.abs(delta)} kegiatan lebih sedikit dari 7 hari sebelumnya.`;
  return "Jumlah kegiatan sama dengan 7 hari sebelumnya.";
}

export function ParentBatch15ReportScreen({ childId }: { childId: string }) {
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);
  const analyticsState = useLearningAnalyticsState(childId);
  const { analytics } = analyticsState;
  const awards = useLearningAwards(childId);

  if (!analyticsState.ready) return <LearningAnalyticsStatus {...analyticsState} />;

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
      <div className={reportStyles.profileHeader}>
        <CharacterAvatar id={profile.guide} large />
        <div>
          <p className={styles.eyebrow}>Profil anak</p>
          <h1 className={styles.pageTitle}>{profile.name}</h1>
          <p className={styles.pageLead}>{profile.age} tahun · Guide {CHARACTERS[profile.guide].name}</p>
        </div>
      </div>

      <div data-mainlagi-parent-report-primary>
        <section className={reportStyles.reportHero} aria-labelledby="weekly-report-title">
          <div className={reportStyles.heroCopy}>
            <p className={styles.eyebrow}>7 hari terakhir</p>
            <h2 id="weekly-report-title">Gambaran belajar minggu ini</h2>
            <p>
              Ringkasan ini menunjukkan kegiatan yang tercatat, pola yang mulai terlihat, dan saran langkah berikutnya. Latihan kreatif tetap dihitung sebagai kegiatan, tetapi tidak diubah menjadi nilai kemampuan.
            </p>
          </div>

          <div className={reportStyles.summaryGrid}>
            <article className={reportStyles.metricCard}>
              <div className={reportStyles.metricHeader}>
                <span className={reportStyles.metricIcon} aria-hidden><Books size={24} weight="duotone" /></span>
                <span>Kegiatan belajar</span>
              </div>
              <div className={reportStyles.metricValueRow}>
                <strong className={reportStyles.metricValue}>{report.attempts}</strong>
                <span className={reportStyles.metricUnit}>kegiatan tercatat</span>
              </div>
              <p className={reportStyles.metricMeta}>{trendText(report.attemptDelta)}</p>
              <p className={reportStyles.metricMeta}>{report.assessedAttempts} dengan jawaban terukur · {report.practiceAttempts} latihan kreatif.</p>
            </article>

            <article className={reportStyles.metricCard}>
              <div className={reportStyles.metricHeader}>
                <span className={reportStyles.metricIcon} aria-hidden><Check size={24} weight="bold" /></span>
                <span>Hari aktif</span>
              </div>
              <div className={reportStyles.metricValueRow}>
                <strong className={reportStyles.metricValue}>{report.activeDays}</strong>
                <span className={reportStyles.metricUnit}>dari 7 hari</span>
              </div>
              <p className={reportStyles.metricMeta}>{report.qualifyingEvidence} hasil terukur bisa dipakai untuk membaca kemajuan.</p>
            </article>

            <article className={reportStyles.metricCard}>
              <div className={reportStyles.metricHeader}>
                <span className={reportStyles.metricIcon} aria-hidden><Sparkle size={24} weight="duotone" /></span>
                <span>Ketepatan jawaban</span>
              </div>
              <div className={reportStyles.metricValueRow}>
                <strong className={reportStyles.metricValue}>{report.averageAccuracy === null ? "—" : `${percent(report.averageAccuracy)}%`}</strong>
                <span className={reportStyles.metricUnit}>{report.averageAccuracy === null ? "belum cukup data" : "rata-rata"}</span>
              </div>
              <p className={reportStyles.metricMeta}>Dihitung hanya dari kegiatan yang memang menilai jawaban benar atau salah.</p>
            </article>
          </div>
        </section>

        <section className={reportStyles.reportSection} aria-labelledby="patterns-title">
          <div className={reportStyles.sectionHeader}>
            <h2 id="patterns-title">Yang mulai terlihat</h2>
            <p>Pola ini berasal dari kegiatan yang sudah tercatat dan bukan diagnosis tentang kemampuan atau perkembangan anak.</p>
          </div>
          <div className={reportStyles.patternGrid}>
            <article className={reportStyles.patternCard}>
              <span className={reportStyles.patternIcon} aria-hidden><Sparkle size={26} weight="duotone" /></span>
              <div className={reportStyles.patternCopy}>
                <strong>Paling konsisten sejauh ini</strong>
                <p>{report.strongestSkill ? `${report.strongestSkill.title} · ${percent(report.strongestSkill.score)}% hasil terukur` : "Belum cukup hasil terukur untuk membuat ringkasan."}</p>
              </div>
            </article>
            <article className={reportStyles.patternCard}>
              <span className={reportStyles.patternIcon} aria-hidden><Books size={26} weight="duotone" /></span>
              <div className={reportStyles.patternCopy}>
                <strong>Bagus untuk lebih sering dilatih</strong>
                <p>{report.needsPracticeSkill ? `${report.needsPracticeSkill.title} · ${percent(report.needsPracticeSkill.score)}% hasil terukur` : "Belum ada keterampilan terukur yang perlu ditandai."}</p>
              </div>
            </article>
          </div>
        </section>

        <section className={reportStyles.reportSection} aria-labelledby="subjects-title">
          <div className={reportStyles.sectionHeader}>
            <h2 id="subjects-title">Per area belajar</h2>
            <p>Lihat apa yang sudah selesai, apa yang masih perlu dilatih, dan aktivitas yang bisa dicoba berikutnya.</p>
          </div>

          <div className={reportStyles.subjectPanel}>
            {report.subjects.map((row) => {
              const subject = SUBJECTS.find((item) => item.id === row.subjectId);
              const completionPercent = percent(row.completion.ratio);
              return (
                <article className={reportStyles.subjectRow} key={row.subjectId}>
                  <div className={reportStyles.subjectHeading}>
                    <span className={reportStyles.subjectIcon} aria-hidden><LearningSymbol name={row.subjectId} size={28} /></span>
                    <div className={reportStyles.subjectTitle}>
                      <h3>{subject?.title ?? row.title}</h3>
                      <p>{row.attempts} kegiatan minggu ini</p>
                    </div>
                  </div>

                  <div className={reportStyles.subjectProgress}>
                    <div className={reportStyles.progressLabel}>
                      <span>Aktivitas inti selesai</span>
                      <strong>{row.completion.completedActivities}/{row.completion.requiredActivities} · {completionPercent}%</strong>
                    </div>
                    <div className={reportStyles.progressTrack} aria-label={`${row.title} ${completionPercent}% aktivitas inti selesai`}>
                      <span className={reportStyles.progressFill} style={{ width: `${completionPercent}%` }} />
                    </div>
                  </div>

                  {row.mastery ? (
                    <p className={reportStyles.subjectSummary}>
                      <strong>Kemampuan yang sudah terukur:</strong> {percent(row.mastery.score)}% · {row.mastery.proficientSkills}/{row.mastery.totalAssessedSkills} keterampilan minimal Mahir.
                    </p>
                  ) : (
                    <p className={reportStyles.subjectSummary}>
                      <strong>Area kreatif:</strong> kemajuan dilihat dari aktivitas selesai, bukan skor kemampuan.
                    </p>
                  )}

                  {row.needsPractice ? <p className={reportStyles.subjectSupport}>Perlu lebih sering dilatih: <strong>{row.needsPractice.title}</strong></p> : null}

                  {row.recommendation ? (
                    <div className={reportStyles.recommendation}>
                      <Sparkle size={22} weight="duotone" aria-hidden />
                      <p><strong>Coba berikutnya</strong>{row.recommendation.activityTitle} — {row.recommendation.reasonLabel}</p>
                    </div>
                  ) : (
                    <p className={reportStyles.subjectSupport}>Belum ada saran aktivitas baru untuk area ini.</p>
                  )}

                  <details className={reportStyles.details} data-mainlagi-parent-report-diagnostic>
                    <summary>Detail cara laporan dihitung</summary>
                    <div className={reportStyles.diagnosticGrid}>
                      <p><span>Attempt</span><strong>{row.attempts}</strong></p>
                      <p><span>Assessed</span><strong>{row.assessedAttempts}</strong></p>
                      <p><span>Practice</span><strong>{row.practiceAttempts}</strong></p>
                      <p><span>Completion inti</span><strong>{row.completion.completedActivities}/{row.completion.requiredActivities} · {completionPercent}%</strong></p>
                      {row.mastery ? <>
                        <p><span>Mastery terukur</span><strong>{percent(row.mastery.score)}%</strong></p>
                        <p><span>Coverage</span><strong>{percent(row.mastery.coverage)}%</strong></p>
                        <p><span>Minimal Mahir</span><strong>{row.mastery.proficientSkills}/{row.mastery.totalAssessedSkills}</strong></p>
                      </> : <p><span>Mastery</span><strong>Tidak dihitung untuk practice kreatif</strong></p>}
                      <p><span>Stage</span><strong>{row.stages.ready} siap · {row.stages.inProgress} berjalan · {row.stages.evidenceNeeded} butuh evidence · {row.stages.locked} terkunci</strong></p>
                    </div>
                  </details>
                </article>
              );
            })}
          </div>
        </section>

        <section className={reportStyles.reportSection} aria-labelledby="recent-title">
          <div className={reportStyles.sectionHeader}>
            <div className={reportStyles.sectionTitleRow}>
              <span className={reportStyles.sectionIcon} aria-hidden><Cards size={22} weight="duotone" /></span>
              <h2 id="recent-title">Kegiatan terbaru</h2>
            </div>
          </div>
          <div className={reportStyles.recentPanel}>
            {report.recentAttempts.length ? (
              <ul className={reportStyles.recentList}>
                {report.recentAttempts.map((attempt) => (
                  <li className={reportStyles.recentItem} key={attempt.id}>
                    <span className={reportStyles.recentCopy}>
                      <strong>{attempt.activityTitle}</strong>
                      <small>{new Date(attempt.completedAt).toLocaleString("id-ID")}</small>
                    </span>
                    <span className={reportStyles.recentResult}>
                      {attempt.assessed && attempt.accuracy !== null ? `${percent(attempt.accuracy)}% tepat · ${attempt.retryCount} kali mengulang` : "Latihan kreatif"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : <div className={reportStyles.subjectRow}><p className={reportStyles.emptyText}>Belum ada kegiatan yang tercatat.</p></div>}
          </div>
        </section>

        <section className={reportStyles.reportSection} aria-labelledby="achievements-title">
          <div className={reportStyles.sectionHeader}>
            <div className={reportStyles.sectionTitleRow}>
              <span className={reportStyles.sectionIcon} aria-hidden><Trophy size={22} weight="duotone" /></span>
              <h2 id="achievements-title">Pencapaian</h2>
            </div>
            <p>Badge yang benar-benar tersimpan untuk profil ini.</p>
          </div>
          {!awards.cloudAvailable ? <div className={reportStyles.awardNotice}>Pencapaian tersimpan di cloud belum bisa dibaca. Mainlagi tidak menampilkan badge lokal seolah-olah sudah tersimpan di server.</div> : null}
          <div className={reportStyles.awardGrid}>
            {awards.achievements.length ? awards.achievements.map((award) => {
              const meta = ACHIEVEMENT_META[award.key] ?? { title: award.key, description: "Pencapaian Mainlagi", icon: "🏅" };
              return (
                <article className={reportStyles.awardCard} key={award.key}>
                  <strong>{meta.icon} {meta.title}</strong>
                  <p>{meta.description}</p>
                  <small>Diberikan {new Date(award.awardedAt).toLocaleDateString("id-ID")}</small>
                </article>
              );
            }) : <article className={reportStyles.awardCard}><p className={reportStyles.emptyText}>Belum ada pencapaian tersimpan dari server.</p></article>}
          </div>
        </section>
      </div>
    </main>
  );
}
