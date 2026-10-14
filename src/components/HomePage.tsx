/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useProfileCollection } from "@/components/learning/CloudProfileScreens";
import { readActiveChild, childDestination } from "@/lib/learning/entry";
import { SubjectDirectory } from "@/components/learning/Playroom";
import { resolveCharacterEnsemble } from "@/lib/learning/characterPresentation";
import styles from "./PublicHome.module.css";

const PUBLIC_HERO_CAST = resolveCharacterEnsemble({
  context: "home",
  requestedCharacters: ["naya", "gian", "paca", "zia", "gavi"],
  requestedState: "hero",
  allowIdentityFallback: false
}).characters;

export function HomePage() {
  const collection = useProfileCollection();
  const router = useRouter();

  useEffect(() => {
    if (collection.loading || collection.error) return;
    const id = readActiveChild();
    if (id && collection.profiles.some((profile) => profile.id === id)) {
      router.replace(childDestination(id));
    }
  }, [collection.loading, collection.error, collection.profiles, router]);

  return (
    <main className={styles.page} data-mainlagi-public-family-entry>
      <section className={styles.hero} aria-labelledby="public-home-title">
        <div className={styles.heroCopy}>
          <p className={styles.hello}>Hai! 👋</p>
          <h1 id="public-home-title">Belajar sambil main!</h1>
          <p className={styles.lead}>
            Petualangan seru untuk anak usia 3–7 tahun.
          </p>
          <div className={styles.actions}>
            <Link
              href="/child/select?continue=1"
              className={styles.primary}
              data-mainlagi-public-child-cta
            >
              Ayo mulai
            </Link>
            <Link
              href="/parent"
              className={styles.secondary}
              data-mainlagi-public-parent-cta
            >
              Untuk orang tua
            </Link>
          </div>
        </div>

        <div
          className={styles.heroMedia}
          data-mainlagi-public-home-hero
          data-session14-vector-cast="public-home"
          aria-hidden
        >
          <div className={styles.heroCast}>
            {PUBLIC_HERO_CAST.map((character) => (
              <img
                key={character.id}
                src={character.src}
                alt=""
                width={260}
                height={360}
                draggable={false}
                data-character-id={character.id}
                data-character-state={character.state}
                data-character-asset-source={character.assetSource}
              />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.experienceSection} aria-labelledby="public-experiences-title">
        <div className={styles.sectionHead}>
          <h2 id="public-experiences-title">Mau main apa?</h2>
        </div>
        <div className={styles.experienceGrid}>
          <Link className={styles.experienceCard} href="/child/select?continue=1">
            <span className={styles.experienceIcon} aria-hidden>📚</span>
            <span><strong>Belajar</strong></span>
            <b aria-hidden>→</b>
          </Link>
          <Link className={styles.experienceCard} href="/child/select?continue=1">
            <span className={styles.experienceIcon} aria-hidden>🗺️</span>
            <span><strong>Petualangan</strong></span>
            <b aria-hidden>→</b>
          </Link>
          <Link className={styles.experienceCard} href="/games">
            <span className={styles.experienceIcon} aria-hidden>🎮</span>
            <span><strong>Main Gerak</strong></span>
            <b aria-hidden>→</b>
          </Link>
        </div>
      </section>

      <section className={styles.subjectSection} aria-labelledby="subjects">
        <div className={styles.sectionHead}>
          <h2 id="subjects">Pilih pelajaran</h2>
        </div>
        <SubjectDirectory />
      </section>

      <section className={styles.parentSection} aria-labelledby="parent-home-title">
        <div>
          <p className={styles.eyebrow}>Untuk orang tua</p>
          <h2 id="parent-home-title">Lihat progres anak</h2>
          <p>
            Profil, laporan, dan sertifikat di satu tempat. Kamera opsional di Main Gerak.
          </p>
        </div>
        <Link href="/parent" className={styles.secondary}>Lihat laporan →</Link>
      </section>

    </main>
  );
}
