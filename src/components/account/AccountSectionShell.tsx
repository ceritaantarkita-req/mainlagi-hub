import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./AccountSectionShell.module.css";

export function AccountSectionShell({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <main className={styles.page} data-mainlagi-account-section>
      <div className={styles.shell}>
        <Link className={styles.back} href="/account">
          ← Kembali ke akun
        </Link>

        <header className={styles.header}>
          <p className={styles.eyebrow}>Area orang tua</p>
          <h1>{title}</h1>
          {description ? <p className={styles.description}>{description}</p> : null}
        </header>

        <section className={styles.panel} data-mainlagi-account-section-panel>
          {children}
        </section>
      </div>
    </main>
  );
}
