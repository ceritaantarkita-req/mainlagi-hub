/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useProfileCollection } from "@/components/learning/CloudProfileScreens";
import { readActiveChild, childDestination } from "@/lib/learning/entry";
import { SubjectDirectory } from "@/components/learning/Playroom";
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
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Untuk keluarga dengan anak usia 3–7 tahun</p>
          <h1>Belajar lewat bermain, dengan langkah yang jelas.</h1>
          <p className={styles.lead}>
            Mainlagi menyiapkan aktivitas sentuh, dengar, trace, warna, cerita, dan permainan gerak.
            Main Gerak dengan kamera bersifat opsional; perjalanan belajar utama tetap bisa dimainkan tanpa kamera.
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
          <ul className={styles.facts} aria-label="Ringkasan Mainlagi">
            <li>9 area belajar</li>
            <li>Profil anak terpisah</li>
            <li>Kamera opsional</li>
          </ul>
        </div>
        <div className={styles.heroArt} aria-hidden>
          <img src="/artwork/garden-gavi.webp" alt="" width={500} height={650} />
          <img src="/artwork/garden-paca.webp" alt="" width={500} height={650} />
        </div>
      </section>

      <section className={styles.paths} aria-labelledby="family-path-title">
        <div className={styles.sectionHead}>
          <h2 id="family-path-title">Pilih jalur yang kamu butuhkan</h2>
          <p>Anak bisa langsung memilih profil dan bermain. Orang tua punya area terpisah untuk akun dan pengaturan keluarga.</p>
        </div>
        <div className={styles.pathGrid}>
          <Link href="/child/select?continue=1" className={styles.pathCard}>
            <span className={styles.pathIcon} aria-hidden>★</span>
            <span className={styles.pathCopy}>
              <strong>Untuk anak</strong>
              <span>Pilih profil, lanjutkan perjalanan belajar, atau mulai dari area yang disukai.</span>
            </span>
            <span className={styles.pathArrow} aria-hidden>→</span>
          </Link>
          <Link href="/account" className={styles.pathCard}>
            <span className={styles.pathIcon} aria-hidden>✓</span>
            <span className={styles.pathCopy}>
              <strong>Untuk orang tua</strong>
              <span>Masuk atau buat akun keluarga, lalu kelola pemain dan preferensi dari area orang tua.</span>
            </span>
            <span className={styles.pathArrow} aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <section className={styles.subjectSection} aria-labelledby="subjects">
        <div className={styles.sectionHead}>
          <h2 id="subjects">Kenali area belajarnya</h2>
          <p>Pilih area untuk menyiapkan profil anak dan melihat permainan yang tersedia.</p>
        </div>
        <div className={styles.subjectFrame}>
          <SubjectDirectory />
        </div>
        <p className={styles.note}>Kalau perangkat ini sudah punya profil anak aktif, Mainlagi tetap melanjutkan profil tersebut secara otomatis.</p>
      </section>
    </main>
  );
}
