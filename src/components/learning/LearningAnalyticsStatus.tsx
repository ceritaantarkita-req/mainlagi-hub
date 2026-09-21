"use client";

import styles from "./LearningPlatform.module.css";

export function LearningAnalyticsStatus({ status, retry }: {
  status: "loading" | "ready" | "unavailable";
  retry: () => void;
}) {
  return <main className={styles.parentMain}>
    <section className={styles.emptyState} role="status" aria-live="polite">
      {status === "unavailable" ? <>
        <h2>Laporan belajar belum tersedia</h2>
        <p>Data belajar belum berhasil dimuat. Periksa koneksi lalu coba lagi.</p>
        <button className={styles.secondaryButton} onClick={retry}>Coba lagi</button>
      </> : <p>Memuat data belajar…</p>}
    </section>
  </main>;
}
