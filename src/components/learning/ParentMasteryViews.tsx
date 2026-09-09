"use client";

import { CHARACTERS, SUBJECTS, getActivity, type LearningSubjectId } from "@/lib/learning/system";
import {
  getCertificateEligibility,
  getLearningAchievements,
  getSubjectLearningSummary,
  getSubjectSkillRows
} from "@/lib/learning/insights";
import { CharacterAvatar, useLearningProfile, useLearningProgress } from "./LearningCommon";
import { useLearningAnalytics } from "./useLearningAnalytics";
import styles from "./LearningPlatform.module.css";

function percent(value: number): number {
  return Math.round(Math.max(0, Math.min(1, value)) * 100);
}

function ParentChildHeader({ childId }: { childId: string }) {
  const profile = useLearningProfile(childId);
  if (!profile) return <div className={styles.emptyState}>Profil anak tidak ditemukan.</div>;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
      <CharacterAvatar id={profile.guide} large />
      <div>
        <p className={styles.eyebrow}>Profil anak</p>
        <h1 className={styles.pageTitle}>{profile.name}</h1>
        <p className={styles.pageLead}>{profile.age} tahun · Guide {CHARACTERS[profile.guide].name}</p>
      </div>
    </div>
  );
}

export function ParentMasteryReportsScreen({ childId }: { childId: string }) {
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);
  const analytics = useLearningAnalytics(childId);
  const achievements = getLearningAchievements(progress, analytics);
  const recent = [...analytics.attempts].reverse().slice(0, 6);

  return (
    <main className={styles.parentMain}>
      <ParentChildHeader childId={childId} />
      {!profile ? null : (
        <>
          <h2 style={{ color: "#24445e" }}>Laporan belajar</h2>
          <p className={styles.pageLead}>
            Ringkasan ini menjelaskan aktivitas dan evidence yang benar-benar tercatat. Ini bukan diagnosis kecerdasan, perkembangan, atau kondisi anak.
          </p>

          <div className={`${styles.parentGrid} ${styles.parentGridThree}`}>
            <div className={styles.parentCard}><strong>🧪 Attempt</strong><p>{analytics.totalAttempts} total · {analytics.assessedAttempts} assessed</p></div>
            <div className={styles.parentCard}><strong>✅ Completion</strong><p>{progress.completedActivityIds.length} aktivitas unik</p></div>
            <div className={styles.parentCard}><strong>⭐ Reward</strong><p>{progress.stars} bintang</p></div>
          </div>

          <section className={styles.section}>
            <h2 style={{ color: "#24445e" }}>Per area belajar</h2>
            <div className={styles.parentGrid}>
              {SUBJECTS.map((subject) => {
                const summary = getSubjectLearningSummary(subject.id, progress, analytics);
                const skillRows = getSubjectSkillRows(subject.id, analytics);
                const practice = skillRows
                  .filter((skill) => skill.level === "exploring" || skill.level === "developing")
                  .slice(0, 2);
                return (
                  <div className={styles.parentCard} key={subject.id}>
                    <strong>{subject.emoji} {subject.title}</strong>
                    <p>{summary.completedActivities}/{summary.requiredActivities} aktivitas inti · completion {percent(summary.completionRatio)}%</p>
                    <p>Evidence score {percent(summary.masteryScore)}% · coverage {percent(summary.masteryCoverage)}%</p>
                    <p>{summary.proficientSkills} skill minimal Mahir · {summary.masteredSkills} Dikuasai</p>
                    {practice.length ? (
                      <p style={{ marginBottom: 0 }}><strong>Bagus untuk dilatih lagi:</strong> {practice.map((item) => item.title).join(", ")}</p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>

          <section className={styles.section}>
            <h2 style={{ color: "#24445e" }}>Aktivitas terbaru</h2>
            <div className={styles.parentCard}>
              {recent.length ? (
                <ul className={styles.list}>
                  {recent.map((attempt) => {
                    const activity = getActivity(attempt.activityId);
                    const result = attempt.assessed && attempt.accuracy !== null
                      ? `${percent(attempt.accuracy)}% evidence input`
                      : "practice / eksplorasi";
                    return (
                      <li className={styles.listItem} key={attempt.id}>
                        <span>{activity?.title ?? attempt.activityId}</span>
                        <strong>{result}</strong>
                      </li>
                    );
                  })}
                </ul>
              ) : <p>Belum ada learning attempt yang tercatat.</p>}
            </div>
          </section>

          <section className={styles.section}>
            <h2 style={{ color: "#24445e" }}>Achievement</h2>
            <div className={styles.parentGrid}>
              {achievements.length ? achievements.map((achievement) => (
                <div className={styles.parentCard} key={achievement.id}>
                  <strong>{achievement.icon} {achievement.title}</strong>
                  <p>{achievement.description}</p>
                </div>
              )) : <div className={styles.parentCard}><p>Achievement akan muncul dari aktivitas nyata, bukan dari label otomatis.</p></div>}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.infoBanner}>
              <strong>Cara membaca laporan:</strong> “Mahir” dan “Dikuasai” membutuhkan evidence berulang. Replay terlalu cepat dan retry berlebihan tidak boleh menaikkan mastery secara palsu.
            </div>
          </section>
        </>
      )}
    </main>
  );
}

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&apos;"
  })[char] ?? char);
}

function safeFilename(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "certificate";
}

function downloadCertificateSvg(args: { childName: string; subject: string; subjectId: LearningSubjectId }) {
  const date = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date());
  const child = escapeXml(args.childName);
  const subject = escapeXml(args.subject);
  const safeDate = escapeXml(date);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1100" viewBox="0 0 1600 1100">
  <rect width="1600" height="1100" fill="#fffaf0"/>
  <rect x="45" y="45" width="1510" height="1010" rx="38" fill="none" stroke="#24445e" stroke-width="8"/>
  <rect x="75" y="75" width="1450" height="950" rx="28" fill="none" stroke="#f5b93f" stroke-width="3"/>
  <text x="800" y="190" text-anchor="middle" font-family="Arial, sans-serif" font-size="58" font-weight="700" fill="#24445e">SERTIFIKAT MAINLAGI</text>
  <text x="800" y="280" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" fill="#587187">Diberikan kepada</text>
  <text x="800" y="405" text-anchor="middle" font-family="Arial, sans-serif" font-size="76" font-weight="700" fill="#173a5e">${child}</text>
  <text x="800" y="500" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" fill="#587187">atas penyelesaian learning path dan evidence kompetensi</text>
  <text x="800" y="620" text-anchor="middle" font-family="Arial, sans-serif" font-size="62" font-weight="700" fill="#14a58c">${subject}</text>
  <text x="800" y="725" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#587187">Completion terpenuhi dan seluruh skill assessed minimal mencapai level Mahir.</text>
  <circle cx="800" cy="835" r="64" fill="#ffd86b"/>
  <text x="800" y="858" text-anchor="middle" font-family="Arial, sans-serif" font-size="60">🏅</text>
  <text x="800" y="960" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" fill="#587187">${safeDate} · Criteria v1 · Mainlagi</text>
</svg>`;
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `mainlagi-${safeFilename(args.childName)}-${safeFilename(args.subjectId)}.svg`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function ParentMasteryCertificatesScreen({ childId }: { childId: string }) {
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);
  const analytics = useLearningAnalytics(childId);

  return (
    <main className={styles.parentMain}>
      <ParentChildHeader childId={childId} />
      {!profile ? null : (
        <>
          <h2 style={{ color: "#24445e" }}>Certificate</h2>
          <p className={styles.pageLead}>
            Sertifikat hanya terbuka setelah aktivitas inti selesai dan seluruh skill assessed pada area tersebut minimal mencapai level Mahir.
          </p>
          <div className={styles.parentGrid}>
            {SUBJECTS.map((subject) => {
              const eligibility = getCertificateEligibility(subject.id, progress, analytics);
              return (
                <div className={styles.parentCard} key={subject.id}>
                  <strong>{subject.emoji} {subject.title}</strong>
                  <p>{eligibility.reason}</p>
                  <p>Completion: {eligibility.completionReady ? "✓ siap" : "belum"} · Evidence: {eligibility.masteryReady ? "✓ siap" : "belum"}</p>
                  {eligibility.eligible ? (
                    <button
                      type="button"
                      className={styles.primaryButton}
                      onClick={() => downloadCertificateSvg({ childName: profile.name, subject: subject.title, subjectId: subject.id })}
                    >
                      🏅 Unduh sertifikat
                    </button>
                  ) : <span className={styles.tag}>🔒 Belum terbuka</span>}
                </div>
              );
            })}
          </div>
          <section className={styles.section}>
            <div className={styles.infoBanner}>
              File diunduh sebagai <strong>SVG berkualitas tinggi</strong> agar ringan, tajam saat dicetak, dan bisa disimpan menjadi PDF melalui menu Print sistem tanpa menambah library PDF ke mode anak.
            </div>
          </section>
        </>
      )}
    </main>
  );
}
