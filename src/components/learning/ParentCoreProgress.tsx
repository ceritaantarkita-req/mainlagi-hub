"use client";

import type { CSSProperties } from "react";
import {
  ACTIVITIES,
  CHARACTERS,
  SUBJECTS
} from "@/lib/learning/system";
import { CharacterAvatar, useLearningProfile, useLearningProgress } from "./LearningCommon";
import styles from "./LearningPlatform.module.css";

export function ParentCoreProgressScreen({ childId }: { childId: string }) {
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);

  if (!profile) {
    return <main className={styles.parentMain}><div className={styles.emptyState}>Profil anak tidak ditemukan.</div></main>;
  }

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

      <h2 style={{ color: "#24445e" }}>Progress belajar inti</h2>
      <p className={styles.pageLead}>
        Persentase hanya menghitung aktivitas inti touch/audio/trace/warna dan aktivitas non-motion lain.
        Aktivitas kamera di Main Gerak tetap tercatat sebagai aktivitas tambahan, tetapi tidak menjadi syarat penyelesaian belajar.
      </p>

      <div className={styles.parentGrid}>
        {SUBJECTS.map((subject) => {
          const core = ACTIVITIES.filter((activity) => activity.subjectId === subject.id && activity.runtime !== "motion_game");
          const done = core.filter((activity) => progress.completedActivityIds.includes(activity.id)).length;
          const pct = core.length ? Math.round((done / core.length) * 100) : 0;

          return (
            <div
              className={styles.parentCard}
              key={subject.id}
              style={{ "--accent": subject.accent } as CSSProperties}
            >
              <strong>{subject.emoji} {subject.title}</strong>
              <p>{done} dari {core.length} aktivitas inti selesai</p>
              <div className={styles.stageProgress}>
                <span className={styles.progressTrack}>
                  <span className={styles.progressFill} style={{ width: `${pct}%` }} />
                </span>
                <span>{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>

      <section className={styles.section}>
        <div className={styles.infoBanner}>
          Persentase ini adalah <strong>completion prototype, bukan mastery akademik</strong>. Motion capture tidak dihitung sebagai kewajiban learning path.
        </div>
      </section>
    </main>
  );
}
