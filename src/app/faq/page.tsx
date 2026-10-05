import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "FAQ Mainlagi" };

export default function FaqPage() {
  return (
    <LegalPage
      title="Pertanyaan yang sering diajukan"
      updated="5 Oktober 2026"
      sections={[
        {
          heading: "Apa itu Mainlagi?",
          body: (
            <p>
              Mainlagi adalah pengalaman belajar dan bermain untuk anak usia 3–7 tahun.
              Di dalamnya ada Belajar, Bermain termasuk Main Gerak, dan World atau petualangan.
              Aktivitas dapat memakai sentuhan, audio, trace, warna, cerita, dan bentuk interaksi
              lain yang sesuai dengan aktivitasnya.
            </p>
          )
        },
        {
          heading: "Apakah harus punya akun?",
          body: (
            <p>
              Untuk membuat profil anak sendiri dan menyimpan progres keluarga, orang tua perlu
              daftar atau masuk dengan akun keluarga. Tanpa akun, Gian Demo tetap tersedia untuk
              mencoba Mainlagi.
            </p>
          )
        },
        {
          heading: "Apakah semua aktivitas membutuhkan kamera?",
          body: (
            <p>
              Tidak. Kamera hanya digunakan pada pengalaman Main Gerak tertentu. Perjalanan
              belajar utama tetap dapat digunakan tanpa kamera.
            </p>
          )
        },
        {
          heading: "Bagaimana data kamera digunakan?",
          body: (
            <p>
              Pada Main Gerak, pemrosesan gerakan dirancang berlangsung di perangkat untuk
              kebutuhan interaksi real-time. Kamera bukan syarat untuk memakai area Belajar atau
              World.
            </p>
          )
        },
        {
          heading: "Cocok untuk usia berapa?",
          body: <p>Mainlagi saat ini ditujukan untuk keluarga dengan anak usia 3–7 tahun.</p>
        },
        {
          heading: "Bisa dipakai lebih dari satu anak?",
          body: (
            <p>
              Bisa. Setelah masuk ke akun keluarga, buka Area orang tua lalu bagian Anak untuk
              membuat dan mengelola profil anak secara terpisah.
            </p>
          )
        },
        {
          heading: "Di mana melihat perkembangan anak?",
          body: (
            <p>
              Buka Area orang tua untuk melihat ringkasan keluarga, profil anak, progres, laporan,
              privasi, dan pengaturan.
            </p>
          )
        },
        {
          heading: "Di mana mengatur akun dan keamanan?",
          body: (
            <p>
              Dari Area orang tua, buka Pengaturan lalu Akun keluarga untuk mengelola profil akun,
              keamanan, dan penghapusan akun.
            </p>
          )
        },
        {
          heading: "Apakah Mainlagi berbayar?",
          body: (
            <p>
              Struktur paket dan entitlement dapat berkembang sesuai keputusan produk. Mainlagi
              tidak menjanjikan seluruh konten masa depan selalu gratis. Gian Demo tetap menjadi
              jalur mencoba tanpa akun.
            </p>
          )
        },
        {
          heading: "Bagaimana menghapus akun atau meminta data?",
          body: (
            <p>
              Penghapusan akun tersedia di pengaturan akun keluarga. Untuk permintaan terkait data,
              gunakan halaman permintaan data.
            </p>
          )
        }
      ]}
    />
  );
}
