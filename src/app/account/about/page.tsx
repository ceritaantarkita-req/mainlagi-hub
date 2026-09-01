import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Tentang Mainlagi Hub" };

export default function AccountAboutPage() {
  return (
    <LegalPage
      title="Tentang Mainlagi Hub"
      updated="22 Agustus 2026"
      sections={[
        {
          heading: "Apa itu Mainlagi Hub? (What)",
          body: (
            <>
              <p>
                Mainlagi Hub adalah platform permainan edukasi berbasis gerakan
                tangan dan badan. Anak bermain di depan kamera dan mengontrol
                permainan lewat gerakan tubuh, tanpa perlu remote, joystick,
                atau perangkat tambahan.
              </p>
              <p>
                Saat ini tersedia 10 pengalaman belajar: matematika, menjiplak
                angka dan bentuk, mengenal huruf Hijaiyah, permainan pilihan
                ganda, papan tulis untuk presentasi, serta game tubuh seperti
                menghindar dan berlari menuju target.
              </p>
            </>
          )
        },
        {
          heading: "Mengapa Mainlagi Hub? (Why)",
          body: (
            <>
              <p>
                Banyak waktu anak dihabiskan dengan layar secara pasif — menonton
                atau menggulir tanpa banyak bergerak. Kami ingin mengubah layar
                menjadi <strong>alat bergerak</strong>: belajar sambil bermain,
                dan bermain sambil bergerak.
              </p>
              <p>
                Gerakan membantu koordinasi tangan-mata, konsentrasi, dan
                motorik. Dengan mengaitkan materi belajar ke gerakan, anak tetap
                aktif dan tetap belajar.
              </p>
            </>
          )
        },
        {
          heading: "Siapa yang memakai Mainlagi Hub? (Who)",
          body: (
            <>
              <ul>
                <li><strong>Anak</strong> usia TK hingga SD — pengguna utama permainan.</li>
                <li><strong>Orang tua / wali</strong> — mengawasi, memilih game sesuai umur, mengelola profil pemain.</li>
                <li><strong>Guru &amp; presenter</strong> — memakai papan tulis presentasi tanpa sentuh di kelas.</li>
              </ul>
            </>
          )
        },
        {
          heading: "Di mana Mainlagi Hub digunakan? (Where)",
          body: (
            <>
              <p>
                Di browser modern (disarankan Chrome/Edge) dengan akses kamera
                melalui localhost atau HTTPS. Bisa dibuka di <strong>HP, tablet,
                laptop, dan TV</strong> yang punya browser. Aplikasi Android &amp;
                iOS juga sedang disiapkan.
              </p>
            </>
          )
        },
        {
          heading: "Kapan Mainlagi Hub bisa digunakan? (When)",
          body: (
            <>
              <p>
                Kapan saja — setiap sesi 10–15 menit cukup untuk satu ronde.
                Papan skor direset setiap minggu, dan konten serta rekomendasi
                diperbarui secara berkala.
              </p>
            </>
          )
        },
        {
          heading: "Bagaimana cara kerjanya? (How)",
          body: (
            <>
              <p>
                Kamu mengizinkan kamera, lalu gerakkan tangan atau badan untuk
                mengontrol permainan. Kamera hanya memproses gerakan; tidak ada
                video yang diunggah atau disimpan.
              </p>
              <p>
                Kamu bisa bermain tanpa akun. Akun hanya opsional untuk
                menyimpan progres, mengelola profil pemain, dan mengikuti
                papan skor.
              </p>
            </>
          )
        },
        {
          heading: "Berapa biayanya? (How much)",
          body: (
            <>
              <p>
                Seluruh permainan <strong>gratis</strong> dan bisa dicoba tanpa
                akun. Sebagian halaman berisi <strong>rekomendasi produk</strong>{" "}
                (tautan afiliasi) yang bisa memberi komisi tanpa biaya tambahan
                untukmu — itu salah satu cara kami menjaga platform tetap
                berjalan gratis.
              </p>
            </>
          )
        }
      ]}
    />
  );
}
