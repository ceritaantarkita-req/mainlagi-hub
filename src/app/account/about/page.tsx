import type { Metadata } from "next";
import Link from "next/link";
import { Icon, type IconName } from "@/components/Icon";

export const metadata: Metadata = { title: "Tentang Mainlagi Hub" };

const EXPERIENCES = [
  "Matematika",
  "Menjiplak Angka & Bentuk",
  "Huruf Hijaiyah",
  "Pilihan Ganda",
  "Papan Tulis Presentasi",
  "Game Gerak Tubuh"
];

const AUDIENCE: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "account",
    title: "Anak",
    text: "Usia TK hingga SD — pengguna utama semua permainan."
  },
  {
    icon: "eye",
    title: "Orang tua / wali",
    text: "Mengawasi, memilih game sesuai umur, dan mengelola profil pemain."
  },
  {
    icon: "doc",
    title: "Guru & presenter",
    text: "Memakai papan tulis presentasi tanpa sentuh di depan kelas."
  }
];

const INFO: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "globe",
    title: "Di mana bisa dimainkan?",
    text: "Di browser modern (disarankan Chrome/Edge) lewat HP, tablet, laptop, atau TV yang punya kamera. Aplikasi Android & iOS sedang disiapkan."
  },
  {
    icon: "activity",
    title: "Berapa lama satu sesi?",
    text: "Sekitar 10–15 menit untuk satu ronde. Papan skor direset tiap minggu, dan game baru ditambah secara berkala."
  },
  {
    icon: "camera",
    title: "Bagaimana cara mainnya?",
    text: "Izinkan kamera, lalu gerakkan tangan atau badan untuk mengontrol permainan — tanpa remote, joystick, atau alat tambahan."
  },
  {
    icon: "check",
    title: "Apakah butuh akun?",
    text: "Tidak. Semua game bisa dimainkan tanpa akun. Akun hanya opsional, untuk menyimpan progres dan mengikuti papan skor."
  }
];

export default function AccountAboutPage() {
  return (
    <div className="fun-home">
      <section className="page-shell fun-section about-hero">
        <h1>Tentang Mainlagi Hub</h1>
        <p className="about-hero__updated">Terakhir diperbarui: 2 September 2026</p>

        <p className="about-lede">
          Mainlagi Hub mengubah layar dari sesuatu yang <em>ditonton</em>{" "}
          jadi sesuatu yang <strong>digerakkan</strong> — 10 permainan
          edukasi yang dikendalikan langsung lewat gerakan tangan dan badan
          anak di depan kamera.
        </p>

        <div className="about-facts">
          <span className="fun-pill"><Icon name="games" size={14} /> 10 Permainan</span>
          <span className="fun-pill"><Icon name="activity" size={14} /> Gerak Tangan &amp; Badan</span>
          <span className="fun-pill"><Icon name="camera" size={14} /> Cukup 1 Kamera</span>
        </div>

        <div className="about-tags" aria-label="Daftar permainan">
          {EXPERIENCES.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        <blockquote className="about-quote">
          Kami percaya belajar paling nempel kalau terasa seperti bermain:
          aktif, seru, dan bisa dilakukan bersama keluarga di rumah — bukan
          duduk diam menatap layar.
        </blockquote>

        <h2>Untuk siapa Mainlagi Hub?</h2>
        <div className="about-cards">
          {AUDIENCE.map((item) => (
            <div className="about-card" key={item.title}>
              <span className="about-card__icon" aria-hidden>
                <Icon name={item.icon} size={22} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>

        <h2>Yang sering ditanya</h2>
        <div className="about-grid">
          {INFO.map((item) => (
            <div className="about-grid__item" key={item.title}>
              <h3>
                <Icon name={item.icon} size={16} /> {item.title}
              </h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>

        <p className="about-footnote">
          Semua permainan <strong>gratis</strong> dan bisa dicoba tanpa akun.
          Sebagian halaman berisi rekomendasi produk (tautan afiliasi) yang
          bisa memberi komisi tanpa biaya tambahan untukmu — salah satu cara
          kami menjaga Mainlagi Hub tetap gratis. Video kamera diproses
          langsung di perangkat dan tidak pernah diunggah atau disimpan. Ada
          pertanyaan lain? Lihat <Link href="/faq">halaman FAQ</Link>.
        </p>

        <p className="legal-page__back">
          <Link href="/account">← Kembali ke akun</Link>
        </p>
      </section>
    </div>
  );
}
