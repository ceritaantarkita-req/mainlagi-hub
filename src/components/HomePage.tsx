/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useProfileCollection } from "@/components/learning/CloudProfileScreens";
import { readActiveChild, childDestination } from "@/lib/learning/entry";
import { SubjectDirectory } from "@/components/learning/Playroom";
import { CORE_SURFACE_THUMBNAILS } from "@/lib/learning/coreThumbnailRegistry";
import styles from "./PublicHome.module.css";

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
          <h1 id="public-home-title">Belajar, berpetualang, lalu main lagi.</h1>
          <p className={styles.lead}>
            Mainlagi menemani anak usia 3–7 tahun belajar sambil bermain.
          </p>
          <div className={styles.actions}>
            <Link
              href="/child/select?continue=1"
              className={styles.primary}
              data-mainlagi-public-child-cta
            >
              Mulai untuk anak
            </Link>
            <Link
              href="/account"
              className={styles.secondary}
              data-mainlagi-public-parent-cta
            >
              Area orang tua
            </Link>
          </div>
        </div>

        <div className={styles.heroMedia} data-mainlagi-public-home-hero aria-hidden>
          <Image
            className={styles.heroImage}
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

      <section className={styles.experienceSection} aria-labelledby="public-experiences-title">
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Satu Mainlagi</p>
          <h2 id="public-experiences-title">Mau mulai dari mana?</h2>
          <p>Pilih pengalaman dulu. Setelah profil anak dipilih, Mainlagi akan melanjutkan perjalanan yang sesuai.</p>
        </div>

        <div className={styles.experienceGrid}>
          <Link className={styles.experienceCard} href="/child/select?continue=1">
            <span className={styles.experienceIcon} aria-hidden>📚</span>
            <span>
              <small>Belajar</small>
              <strong>Pilih pelajaran</strong>
              <span>Bahasa, matematika, Iqro, sains, logika, kreativitas, dan lainnya.</span>
            </span>
            <b aria-hidden>→</b>
          </Link>

          <Link className={styles.experienceCard} href="/child/select?continue=1">
            <span className={styles.experienceIcon} aria-hidden>🗺️</span>
            <span>
              <small>World</small>
              <strong>Mulai berpetualang</strong>
              <span>Cerita dan tantangan yang menyatu dengan pengalaman belajar Mainlagi.</span>
            </span>
            <b aria-hidden>→</b>
          </Link>

          <Link className={styles.experienceCard} href="/games">
            <span className={styles.experienceIcon} aria-hidden>🎮</span>
            <span>
              <small>Bermain</small>
              <strong>Main Gerak</strong>
              <span>Permainan gerak yang bisa dimainkan bersama keluarga.</span>
            </span>
            <b aria-hidden>→</b>
          </Link>
        </div>
      </section>

      <section className={styles.subjectSection} aria-labelledby="subjects">
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Belajar</p>
          <h2 id="subjects">Pilih yang mau dipelajari</h2>
          <p>Pilih area belajar untuk menyiapkan profil anak dan melihat aktivitas yang tersedia.</p>
        </div>
        <SubjectDirectory />
      </section>

      <section className={styles.parentSection} aria-labelledby="parent-home-title">
        <div>
          <p className={styles.eyebrow}>Untuk orang tua</p>
          <h2 id="parent-home-title">Anak bermain. Orang tua tetap tahu perkembangannya.</h2>
          <p>
            Mainlagi menyiapkan profil anak, progres, laporan, dan sertifikat. Main Gerak dengan
            kamera bersifat opsional; perjalanan belajar utama tetap bisa dimainkan tanpa kamera.
          </p>
        </div>
        <Link href="/account" className={styles.secondary}>Buka area orang tua</Link>
      </section>

      <p className={styles.footnote}>
        Kalau perangkat ini sudah punya profil anak aktif, Mainlagi akan melanjutkan profil tersebut secara otomatis.
      </p>
    </main>
  );
}
