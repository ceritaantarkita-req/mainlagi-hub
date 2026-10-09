"use client";

import Image from "next/image";
import Link from "next/link";
import { getActivity } from "@/lib/learning/system";
import { rankAdaptiveLearningV2 } from "@/lib/learning/adaptive";
import { MONEY_WORLD_STAGES } from "@/lib/learning/world/moneyWorld";
import { MONEY_WORLD_PILOT_AGE_BAND } from "@/lib/learning/world/moneyWorldPresentation";
import { ChildLoading, useLearningProfile, useLearningProgress } from "./LearningCommon";
import { useLearningAnalytics } from "./useLearningAnalytics";
import { SubjectDirectory } from "./Playroom";
import { CORE_SURFACE_THUMBNAILS } from "@/lib/learning/coreThumbnailRegistry";
import { useMoneyWorldProgress } from "./world-v2/useMoneyWorldProgress";
import styles from "./Playroom.module.css";


export function Batch14WorldHome({ childId }: { childId: string }) {
  const profile = useLearningProfile(childId);
  const progress = useLearningProgress(childId);
  const analytics = useLearningAnalytics(childId);
  const worldState = useMoneyWorldProgress(childId);

  if (!profile) return <ChildLoading />;

  const ranked = rankAdaptiveLearningV2({
    age: profile.age,
    progress,
    analytics,
    allowMotion: false
  });
  const next = ranked[0] ? getActivity(ranked[0].id) : undefined;
  const worldEligible =
    profile.age >= MONEY_WORLD_PILOT_AGE_BAND.minAge &&
    profile.age <= MONEY_WORLD_PILOT_AGE_BAND.maxAge;
  const completedWorldStages = worldState.progress.completedStageIds.length;
  const worldComplete = worldState.ready && completedWorldStages === MONEY_WORLD_STAGES.length;
  const worldStarted = completedWorldStages > 0 || Boolean(worldState.progress.currentStageId);
  const worldAction = worldComplete
    ? "Main lagi"
    : worldStarted
      ? "Lanjut Petualangan"
      : "Mulai Petualangan Uang";

  return (
    <main className={`${styles.page} ${styles.childVisualHome}`} data-child-home-visual="wave1">
      <section className={styles.continue} aria-labelledby="child-home-title">
        <div className={styles.continueCopy} data-mainlagi-home-copy>
          <div className={styles.homeHelloRow}>
            <h1 id="child-home-title" className={styles.greeting}>Hai, {profile.name}! 👋</h1>
            <span className={styles.homeStars} aria-label={`${progress.stars} bintang terkumpul`}>⭐ {progress.stars}</span>
          </div>
          <p className={styles.homeCallout}>{next ? "Yuk, lanjut petualanganmu!" : "Yuk, pilih keseruanmu!"}</p>
          {next ? (
            <p className={styles.homeNextTitle} aria-label={`Aktivitas berikutnya: ${next.title}`}>
              <span aria-hidden>✏️</span> {next.title}
            </p>
          ) : null}
          <Link
            className={styles.primary}
            href={next ? `/child/${childId}/activity/${next.id}` : "#mainlagi-experiences"}
          >
            <span aria-hidden>▶</span> {next ? "Lanjut main" : "Pilih permainan"}
          </Link>
        </div>
        <div className={styles.homeHeroMedia} data-mainlagi-home-hero aria-hidden>
          <Image
            className={styles.homeHeroImage}
            src={CORE_SURFACE_THUMBNAILS.childHomeHero}
            alt=""
            width={1200}
            height={900}
            sizes="(max-width: 760px) 100vw, 520px"
            priority
            draggable={false}
          />
        </div>
      </section>

      <section
        id="mainlagi-experiences"
        className={styles.experienceSection}
        aria-labelledby="mainlagi-experiences-title"
      >
        <div className={styles.experienceHeading}>
          <div>
            <h2 id="mainlagi-experiences-title" className={styles.sectionTitle}>Mau main apa?</h2>
          </div>
        </div>

        <div className={styles.experienceGrid}>
          <Link
            className={styles.experienceCard}
            href={next ? `/child/${childId}/activity/${next.id}` : "#choose-subject"}
            data-mainlagi-domain-card="belajar"
          >
            <span className={styles.experienceIcon} aria-hidden>📚</span>
            <span>
              <small>Belajar</small>
              <strong>{next ? "Yuk belajar!" : "Pilih pelajaran"}</strong>
            </span>
            <b aria-hidden>→</b>
          </Link>

          {worldEligible ? (
            <Link
              className={styles.experienceCard}
              href={`/child/${childId}/worlds`}
              data-mainlagi-domain-card="world"
              data-mainlagi-home-world-state={worldComplete ? "complete" : worldStarted ? "started" : "new"}
            >
              <span className={styles.experienceIcon} aria-hidden>🗺️</span>
              <span>
                <small>World</small>
                <strong>{worldStarted ? worldAction : "Ayo jelajah!"}</strong>
              </span>
              <b aria-hidden>→</b>
            </Link>
          ) : (
            <div
              className={`${styles.experienceCard} ${styles.experienceCardDisabled}`}
              data-mainlagi-domain-card="world"
              data-mainlagi-home-world-state="age-gated"
              aria-disabled="true"
            >
              <span className={styles.experienceIcon} aria-hidden>🗺️</span>
              <span>
                <small>World</small>
                <strong>Belum tersedia</strong>
                <span>Untuk usia {MONEY_WORLD_PILOT_AGE_BAND.label} tahun</span>
              </span>
              <b aria-hidden>•</b>
            </div>
          )}

          <Link
            className={styles.experienceCard}
            href={`/child/${childId}/games`}
            data-mainlagi-domain-card="bermain"
          >
            <span className={styles.experienceIcon} aria-hidden>🎮</span>
            <span>
              <small>Bermain</small>
              <strong>Main Gerak</strong>
            </span>
            <b aria-hidden>→</b>
          </Link>
        </div>
      </section>

      <section id="choose-subject" aria-labelledby="choose-subject-title">
        <h2 id="choose-subject-title" className={styles.sectionTitle}>Pilih pelajaranmu</h2>
        <SubjectDirectory childId={childId} />
      </section>
    </main>
  );
}
