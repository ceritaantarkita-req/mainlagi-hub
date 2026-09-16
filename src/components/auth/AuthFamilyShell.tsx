/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./AuthFamilyShell.module.css";

export function AuthFamilyShell({ children }: { children: ReactNode }) {
  return (
    <main className={styles.page} data-mainlagi-auth-family-shell>
      <div className={styles.layout}>
        <section className={styles.context} aria-labelledby="auth-family-context-title" data-mainlagi-auth-context>
          <Link className={styles.brand} href="/" aria-label="Mainlagi beranda">
            <img src="/artwork/garden-wordmark.webp" alt="Mainlagi" width={600} height={220} />
          </Link>
          <p className={styles.eyebrow}>Area orang tua</p>
          <h2 id="auth-family-context-title">Satu tempat untuk akun dan profil keluarga.</h2>
          <p>
            Masuk untuk menyimpan progres dan mengelola pemain. Anak tetap bisa mulai bermain tanpa akun keluarga.
          </p>
          <ul className={styles.facts}>
            <li><span className={styles.factMark} aria-hidden>✓</span>Profil anak tetap terpisah</li>
            <li><span className={styles.factMark} aria-hidden>✓</span>Pengaturan keluarga ada di area orang tua</li>
            <li><span className={styles.factMark} aria-hidden>✓</span>Main Gerak dengan kamera tetap opsional</li>
          </ul>
          <div className={styles.art} aria-hidden>
            <img src="/artwork/garden-gavi.webp" alt="" width={500} height={650} />
            <img src="/artwork/garden-paca.webp" alt="" width={500} height={650} />
          </div>
        </section>

        <section className={styles.panel} data-mainlagi-auth-panel>
          <Link className={styles.backLink} href="/">← Kembali ke beranda</Link>
          {children}
        </section>
      </div>
    </main>
  );
}

export function AuthFamilyStatus({
  title,
  message,
  actionHref = "/",
  actionLabel = "Kembali"
}: {
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className={styles.statusCard} data-mainlagi-auth-status>
      <h1 className={styles.statusTitle}>{title}</h1>
      <p className={styles.statusMessage}>{message}</p>
      <Link className={styles.statusButton} href={actionHref}>{actionLabel}</Link>
    </div>
  );
}
