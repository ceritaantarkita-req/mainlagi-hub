import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Tentang Mainlagi" };

export default function AboutPage() {
  return (
    <LegalPage
      title="Tentang Mainlagi"
      updated="5 Oktober 2026"
      sections={[
        {
          heading: "Apa itu Mainlagi",
          body: (
            <>
              <p>
                Mainlagi adalah pengalaman belajar dan bermain untuk anak usia 3–7 tahun.
                Anak bisa belajar, berpetualang, berkreasi, dan bermain dalam satu perjalanan
                yang dirancang sederhana untuk anak dan mudah dipantau orang tua.
              </p>
              <p>
                Mainlagi bukan lagi produk yang hanya berisi permainan kamera. Main Gerak tetap
                tersedia sebagai salah satu pengalaman bermain, sementara perjalanan utama juga
                mencakup aktivitas sentuh, audio, trace, warna, cerita, dan bentuk interaksi belajar
                lain yang sudah didukung produk.
              </p>
            </>
          )
        },
        {
          heading: "Tiga pengalaman utama",
          body: (
            <ul>
              <li><strong>Belajar</strong> — aktivitas stage-based untuk berbagai area belajar.</li>
              <li><strong>Bermain</strong> — termasuk Main Gerak dan permainan interaktif lainnya.</li>
              <li><strong>World</strong> — petualangan dan cerita yang menghubungkan pengalaman Mainlagi.</li>
            </ul>
          )
        },
        {
          heading: "Teman Mainlagi",
          body: (
            <p>
              Naya, Gian, Zia, Paca, dan Gavi adalah lima karakter utama Mainlagi. Mereka dipakai
              secara konsisten untuk membantu pengalaman anak terasa akrab dari satu halaman ke
              halaman lain.
            </p>
          )
        },
        {
          heading: "Akun keluarga dan profil anak",
          body: (
            <p>
              Profil anak dibuat melalui akun keluarga agar progres dan pengaturan
              dapat tersimpan dengan jelas. Tanpa akun, keluarga tetap bisa mencoba Mainlagi
              melalui Gian Demo.
            </p>
          )
        },
        {
          heading: "Untuk orang tua",
          body: (
            <p>
              Area orang tua menyediakan ringkasan keluarga, pengelolaan profil anak, progress,
              laporan, privasi, dan pengaturan. Mode anak dan kontrol orang tua tetap dipisahkan
              agar navigasi anak tetap sederhana.
            </p>
          )
        },
        {
          heading: "Kamera bersifat opsional",
          body: (
            <p>
              Kamera dipakai pada pengalaman Main Gerak tertentu. Perjalanan belajar utama tetap
              dapat digunakan tanpa kamera, sehingga motion gameplay bukan syarat untuk memakai
              Mainlagi.
            </p>
          )
        }
      ]}
    />
  );
}
