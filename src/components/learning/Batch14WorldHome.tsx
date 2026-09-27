"use client";

import Image from "next/image";
import Link from "next/link";
import { getActivity } from "@/lib/learning/system";
import { rankAdaptiveLearningV2 } from "@/lib/learning/adaptive";
import { ChildLoading, useLearningProfile } from "./LearningCommon";
import { useLearningAnalytics } from "./useLearningAnalytics";
import { SubjectDirectory } from "./Playroom";
import { CORE_SURFACE_THUMBNAILS } from "@/lib/learning/coreThumbnailRegistry";
import styles from "./Playroom.module.css";

export function Batch14WorldHome({ childId }: { childId: string }) {
  const profile = useLearningProfile(childId);
  const analytics = useLearningAnalytics(childId);

  if (!profile) return <ChildLoading />;

  const ranked = rankAdaptiveLearningV2({
    age: profile.age,
    progress: undefined,
    analytics,
    allowMotion: false
  });
  const next = ranked[0] ? getActivity(ranked[0].id) : undefined;

  return (
    <main className={styles.page}>
      <section className={styles.continue} aria-labelledby="child-home-title">
        <div className={styles.continueCopy} data-mainlagi-home-copy>
          <p>Hai, {profile.name}! 👋</p>
          <h1 id="child-home-title" className={styles.greeting}>Mau belajar apa hari ini?</h1>
          <p className={styles.lead}>
            {next
              ? `Lanjut “${next.title}” atau pilih pelajaran lain.`
              : "Pilih pelajaran yang kamu suka."}
          </p>
          <Link
            className={styles.primary}
            href={next ? `/child/${childId}/activity/${next.id}` : "#choose-subject"}
          >
            {next ? "Lanjut belajar" : "Pilih pelajaran"}
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

      <section id="choose-subject" aria-labelledby="choose-subject-title">
        <h2 id="choose-subject-title" className={styles.sectionTitle}>Pilih pelajaran</h2>
        <SubjectDirectory childId={childId} />
      </section>
    </main>
  );
}
