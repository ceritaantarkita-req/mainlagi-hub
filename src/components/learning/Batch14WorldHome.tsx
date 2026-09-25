"use client";

import Link from "next/link";
import { getActivity, type CharacterId } from "@/lib/learning/system";
import { rankAdaptiveLearningV2 } from "@/lib/learning/adaptive";
import { resolveCharacterEnsemble } from "@/lib/learning/characterPresentation";
import { MONEY_WORLD_STAGES } from "@/lib/learning/world/moneyWorld";
import { MONEY_WORLD_PILOT_AGE_BAND } from "@/lib/learning/world/moneyWorldPresentation";
import { CharacterLayer } from "./CharacterLayer";
import { ChildLoading, useLearningProfile, useLearningProgress } from "./LearningCommon";
import { useLearningAnalytics } from "./useLearningAnalytics";
import { SubjectDirectory } from "./Playroom";
import { useMoneyWorldProgress } from "./world-v2/useMoneyWorldProgress";
import styles from "./Playroom.module.css";

const HOME_CAST: readonly CharacterId[] = ["naya", "gian", "paca", "zia", "gavi"];

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
  const homePresentation = resolveCharacterEnsemble({
    context: "home",
    requestedCharacters: HOME_CAST,
    requestedState: "hero",
    allowIdentityFallback: false
  });

  const worldEligible =
    profile.age >= MONEY_WORLD_PILOT_AGE_BAND.minAge &&
    profile.age <= MONEY_WORLD_PILOT_AGE_BAND.maxAge;
  const completedWorldStages = worldState.progress.completedStageIds.length;
  const worldComplete = worldState.ready && completedWorldStages === MONEY_WORLD_STAGES.length;
  const worldStarted = completedWorldStages > 0 || Boolean(worldState.progress.currentStageId);
  const worldStatus = !worldState.ready
    ? "Menyiapkan progres petualangan…"
    : worldComplete
      ? "8/8 Stage selesai · boleh dimainkan lagi"
      : worldStarted
        ? `${completedWorldStages}/8 Stage selesai · lanjutkan perjalananmu`
        : "Petualangan cerita dan tantangan bersama Gavi + Paca";
  const worldAction = worldComplete
    ? "Main lagi"
    : worldStarted
      ? "Lanjut Petualangan"
      : "Mulai Petualangan Uang";

  return (
    <main className={styles.page}>
      <section className={styles.continue} aria-labelledby="child-home-title">
        <div className={styles.continueCopy} data-mainlagi-home-copy>
          <p>Hai, {profile.name}! 👋</p>
          <h1 id="child-home-title" className={styles.greeting}>Belajar, berpetualang, lalu main lagi.</h1>
          <p className={styles.lead}>
            {next
              ? `Lanjutkan “${next.title}” atau pilih pengalaman Mainlagi yang kamu mau.`
              : "Pilih Belajar, Petualangan, atau Bermain sesuai yang kamu mau."}
          </p>
          <Link
            className={styles.primary}
            href={next ? `/child/${childId}/activity/${next.id}` : "#mainlagi-experiences"}
          >
            {next ? "Lanjut belajar" : "Pilih pengalaman"}
          </Link>
        </div>
        <div className={styles.heroCast} data-mainlagi-home-cast aria-hidden>
          <CharacterLayer
            characters={homePresentation.characters}
            variant="ensemble"
            className={styles.homeCharacterEnsemble}
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
            <p className={styles.experienceEyebrow}>Satu Mainlagi</p>
            <h2 id="mainlagi-experiences-title" className={styles.sectionTitle}>Mau ke mana sekarang?</h2>
          </div>
          <span>{progress.stars} ★ terkumpul</span>
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
              <strong>{next ? next.title : "Pilih pelajaran"}</strong>
              <span>{next ? "Rekomendasi belajar berikutnya" : "9 area belajar touch-first"}</span>
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
                <strong>{worldAction}</strong>
                <span>{worldStatus}</span>
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
                <strong>Petualangan Uang</strong>
                <span>Saat ini untuk umur {MONEY_WORLD_PILOT_AGE_BAND.label} tahun.</span>
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
              <span>10 permainan gerak · kamera tetap opsional untuk belajar inti</span>
            </span>
            <b aria-hidden>→</b>
          </Link>
        </div>
      </section>

      <section id="choose-subject" aria-labelledby="choose-subject-title">
        <h2 id="choose-subject-title" className={styles.sectionTitle}>Pilih yang mau dipelajari</h2>
        <SubjectDirectory childId={childId} />
      </section>
      <p className={styles.footnote}>Bermain sedikit, menemukan banyak.</p>
    </main>
  );
}
