"use client";

import Link from "next/link";

const ADMIN_CONTACT = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";

function YouTubeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.42A2.5 2.5 0 0 0 2.42 7.19 26 26 0 0 0 2 12a26 26 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.42-4.81ZM10 15V9l5.2 3Z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.32 5.56a4.5 4.5 0 0 1-2.9-4.06H13v12.9a2.32 2.32 0 1 1-2.32-2.32c.26 0 .51.04.74.12V10.8a5.9 5.9 0 0 0-.74-.05 5.34 5.34 0 1 0 5.34 5.34V9.86a7.9 7.9 0 0 0 4.05 1.09v-4.3c-.35 0-.7-.04-1.04-.12l-.01 0Z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-grid">
        <div>
          <strong>Mainlagi Hub</strong>
          <p>Motion Learning Hub untuk belajar, bergerak, dan bermain bersama.</p>
          <nav className="footer-legal" aria-label="Tautan legal">
            <Link href="/account/about">Tentang</Link>
            <Link href="/privacy">Privasi</Link>
            <Link href="/terms">Syarat</Link>
            <Link href="/cookie-policy">Cookie</Link>
            <Link href="/faq">FAQ</Link>
          </nav>
        </div>
        <div>
          <a href={`mailto:${ADMIN_CONTACT}`}>{ADMIN_CONTACT}</a>
          <div className="social-links">
            <a href="https://www.youtube.com/@mainlagi_id" aria-label="YouTube">
              <YouTubeIcon />
            </a>
            <a href="https://www.tiktok.com/@di.toko" aria-label="TikTok">
              <TikTokIcon />
            </a>
          </div>
        </div>
        <span>Video kamera diproses di browser dan tidak disimpan oleh aplikasi.</span>
      </div>
    </footer>
  );
}
