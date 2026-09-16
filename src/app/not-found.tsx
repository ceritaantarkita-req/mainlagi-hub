import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.page} data-mainlagi-system-state="not-found">
      <section className={styles.card}>
        <p className={styles.eyebrow}>404</p>
        <h1>Halaman tidak ditemukan</h1>
        <p>Game atau halaman yang dicari tidak tersedia.</p>
        <Link className={styles.action} href="/" data-mainlagi-system-state-cta>
          Kembali ke beranda
        </Link>
      </section>
    </main>
  );
}
