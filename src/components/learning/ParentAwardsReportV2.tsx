"use client";

import { useState } from "react";
import { CHARACTERS, SUBJECTS, getActivity, type LearningSubjectId } from "@/lib/learning/system";
import {
  getCertificateEligibility,
  getNextBestLearningRecommendation,
  getSubjectLearningSummary,
  getSubjectSkillRows
} from "@/lib/learning/insights";
import { buildWeeklyLearningReport } from "@/lib/learning/reporting";
import type { PersistedLearningCertificate } from "@/lib/learning/awardsCloud";
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

function trendText(delta: number): string {
  if (delta > 0) return `+${delta} dibanding 7 hari sebelumnya`;
  if (delta < 0) return `${delta} dibanding 7 hari sebelumnya`;
  return "Sama dengan 7 hari sebelumnya";
}

export function ParentWeeklyReportV2Screen({ childId }: { childId: string }) {
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);
  const analytics = useLearningAnalytics(childId);
  const awards = useLearningAwards(childId);
  const weekly = buildWeeklyLearningReport(analytics);
  const recent = [...analytics.attempts]
    .sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt))
    .slice(0, 8);

  if (!profile) return <main className={styles.parentMain}><ParentChildHeader childId={childId} /></main>;

  return (
    <main className={styles.parentMain}>
      <ParentChildHeader childId={childId} />
      <h2 style={{ color: "#24445e" }}>Laporan belajar mingguan</h2>
      <p className={styles.pageLead}>
        Periode 7 hari terakhir. Ringkasan berasal dari learning attempts dan mastery canonical; bukan diagnosis kecerdasan atau perkembangan anak.
      </p>

      <div className={`${styles.parentGrid} ${styles.parentGridThree}`}>
        <div className={styles.parentCard}>
          <strong>🧪 Aktivitas minggu ini</strong>
          <p>{weekly.attempts} attempt · {weekly.assessedAttempts} assessed · {weekly.practiceAttempts} practice</p>
          <small>{trendText(weekly.attemptDelta)}</small>
        </div>
        <div className={styles.parentCard}>
          <strong>📅 Hari aktif</strong>
          <p>{weekly.activeDays} dari 7 hari</p>
          <small>{weekly.qualifyingEvidence} qualifying evidence terkumpul</small>
        </div>
        <div className={styles.parentCard}>
          <strong>🎯 Akurasi assessed</strong>
          <p>{weekly.averageAccuracy === null ? "Belum ada data" : `${percent(weekly.averageAccuracy)}%`}</p>
          <small>Akurasi bukan label kemampuan; confidence membutuhkan evidence berulang.</small>
        </div>
      </div>

      <section className={styles.section}>
        <h2 style={{ color: "#24445e" }}>Yang terlihat minggu ini</h2>
        <div className={styles.parentGrid}>
          <div className={styles.parentCard}>
            <strong>✨ Kekuatan saat ini</strong>
            <p>{weekly.strongestSkill ? `${weekly.strongestSkill.title} · ${percent(weekly.strongestSkill.score)}%` : "Belum cukup evidence untuk melihat pola."}</p>
          </div>
          <div className={styles.parentCard}>
            <strong>🔁 Bagus untuk diperkuat</strong>
            <p>{weekly.needsPracticeSkill ? `${weekly.needsPracticeSkill.title} · ${percent(weekly.needsPracticeSkill.score)}%` : "Belum ada skill yang perlu ditandai."}</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 style={{ color: "#24445e" }}>Per area + saran berikutnya</h2>
        <div className={styles.parentGrid}>
          {SUBJECTS.map((subject) => {
            const summary = getSubjectLearningSummary(subject.id, progress, analytics);
            const skillRows = getSubjectSkillRows(subject.id, analytics);
            const recommendation = getNextBestLearningRecommendation({
              age: profile.age,
              progress,
              analytics,
              allowMotion: false
            });
            const subjectRecommendation = recommendation?.activity.subjectId === subject.id ? recommendation : undefined;
            const needs = skillRows
              .filter((skill) => skill.level === "exploring" || skill.level === "developing")
              .sort((a, b) => a.score - b.score)[0];
            return (
              <div className={styles.parentCard} key={subject.id}>
                <strong>{subject.emoji} {subject.title}</strong>
                <p>{summary.completedActivities}/{summary.requiredActivities} aktivitas inti · completion {percent(summary.completionRatio)}%</p>
                <p>Evidence {percent(summary.masteryScore)}% · coverage {percent(summary.masteryCoverage)}%</p>
                {needs ? <p>Perlu diperkuat: <strong>{needs.title}</strong></p> : null}
                {subjectRecommendation ? <p><strong>Saran:</strong> {subjectRecommendation.activity.title} — {subjectRecommendation.reasonLabel}</p> : null}
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
              {recent.map((attempt) => (
                <li className={styles.listItem} key={attempt.id}>
                  <span>{getActivity(attempt.activityId)?.title ?? attempt.activityId}<small style={{ display: "block" }}>{new Date(attempt.completedAt).toLocaleString("id-ID")}</small></span>
                  <strong>{attempt.assessed && attempt.accuracy !== null ? `${percent(attempt.accuracy)}% · retry ${attempt.retryCount}` : "practice"}</strong>
                </li>
              ))}
            </ul>
          ) : <p>Belum ada learning attempt.</p>}
        </div>
      </section>

      <section className={styles.section}>
        <h2 style={{ color: "#24445e" }}>Achievement tersimpan</h2>
        {!awards.cloudAvailable ? <div className={styles.infoBanner}>Achievement cloud belum bisa dibaca. Tidak ada badge lokal yang akan diklaim sebagai award server.</div> : null}
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

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&apos;" })[char] ?? char);
}

function safeFilename(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "certificate";
}

function downloadIssuedCertificate(args: { childName: string; subject: string; certificate: PersistedLearningCertificate }) {
  const date = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(args.certificate.issuedAt));
  const child = escapeXml(args.childName);
  const subject = escapeXml(args.subject);
  const criteria = escapeXml(args.certificate.criteriaVersion);
  const certificateId = escapeXml(args.certificate.id);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1100" viewBox="0 0 1600 1100">
  <rect width="1600" height="1100" fill="#fffaf0"/>
  <rect x="45" y="45" width="1510" height="1010" rx="38" fill="none" stroke="#24445e" stroke-width="8"/>
  <rect x="75" y="75" width="1450" height="950" rx="28" fill="none" stroke="#f5b93f" stroke-width="3"/>
  <text x="800" y="190" text-anchor="middle" font-family="Arial, sans-serif" font-size="58" font-weight="700" fill="#24445e">SERTIFIKAT MAINLAGI</text>
  <text x="800" y="280" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" fill="#587187">Diberikan kepada</text>
  <text x="800" y="405" text-anchor="middle" font-family="Arial, sans-serif" font-size="76" font-weight="700" fill="#173a5e">${child}</text>
  <text x="800" y="500" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" fill="#587187">atas completion learning path dan evidence kompetensi yang tersimpan</text>
  <text x="800" y="620" text-anchor="middle" font-family="Arial, sans-serif" font-size="62" font-weight="700" fill="#14a58c">${subject}</text>
  <circle cx="800" cy="810" r="64" fill="#ffd86b"/>
  <text x="800" y="832" text-anchor="middle" font-family="Arial, sans-serif" font-size="60">🏅</text>
  <text x="800" y="925" text-anchor="middle" font-family="Arial, sans-serif" font-size="25" fill="#587187">Diterbitkan ${escapeXml(date)} · ${criteria}</text>
  <text x="800" y="975" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#7b8d9c">Certificate ID ${certificateId}</text>
</svg>`;
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `mainlagi-${safeFilename(args.childName)}-${safeFilename(args.certificate.subjectId)}.svg`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function ParentIssuedCertificatesScreen({ childId }: { childId: string }) {
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);
  const analytics = useLearningAnalytics(childId);
  const awards = useLearningAwards(childId);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  if (!profile) return <main className={styles.parentMain}><ParentChildHeader childId={childId} /></main>;

  const shareCertificate = async (certificate: PersistedLearningCertificate, subjectTitle: string) => {
    const text = `Sertifikat Mainlagi ${subjectTitle} untuk ${profile.name} · ID ${certificate.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `Sertifikat Mainlagi — ${subjectTitle}`, text });
        setShareStatus("Sertifikat berhasil dibagikan.");
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setShareStatus("Ringkasan sertifikat disalin ke clipboard.");
      } else {
        setShareStatus("Fitur bagikan tidak tersedia di perangkat ini. Gunakan tombol Unduh.");
      }
    } catch {
      setShareStatus("Bagikan dibatalkan atau belum tersedia. Sertifikat tetap aman tersimpan.");
    }
  };

  return (
    <main className={styles.parentMain}>
      <ParentChildHeader childId={childId} />
      <h2 style={{ color: "#24445e" }}>Certificate</h2>
      <p className={styles.pageLead}>
        Tombol unduh hanya muncul untuk certificate yang sudah diterbitkan dan tersimpan di Supabase canonical.
      </p>
      {shareStatus ? <div className={styles.infoBanner} role="status" style={{ marginBottom: 14 }}>{shareStatus}</div> : null}
      <div className={styles.parentGrid}>
        {SUBJECTS.map((subject) => {
          const eligibility = getCertificateEligibility(subject.id, progress, analytics);
          const issued = awards.certificates.find((item) => item.subjectId === subject.id && item.criteriaVersion === "subject-v1");
          return (
            <div className={styles.parentCard} key={subject.id}>
              <strong>{subject.emoji} {subject.title}</strong>
              {issued ? (
                <>
                  <p>✅ Diterbitkan {new Date(issued.issuedAt).toLocaleDateString("id-ID")}</p>
                  <small>Criteria {issued.criteriaVersion} · ID {issued.id}</small>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                    <button type="button" className={styles.primaryButton} onClick={() => downloadIssuedCertificate({ childName: profile.name, subject: subject.title, certificate: issued })}>🏅 Unduh</button>
                    <button type="button" className={styles.secondaryButton} onClick={() => void shareCertificate(issued, subject.title)}>Bagikan</button>
                  </div>
                </>
              ) : (
                <>
                  <p>{eligibility.reason}</p>
                  <p>Completion: {eligibility.completionReady ? "✓ siap" : "belum"} · Evidence: {eligibility.masteryReady ? "✓ siap" : "belum"}</p>
                  <span className={styles.tag}>{eligibility.eligible ? "⏳ Menunggu issuance cloud" : "🔒 Belum terbuka"}</span>
                </>
              )}
            </div>
          );
        })}
      </div>
      {!awards.cloudAvailable ? <section className={styles.section}><div className={styles.infoBanner}>Cloud awards belum tersedia. UI tidak akan membuat certificate lokal yang tidak punya row server.</div></section> : null}
    </main>
  );
}
