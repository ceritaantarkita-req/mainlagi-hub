import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "FAQ" };

export default function FaqPage() {
  return (
    <LegalPage
      title="Pertanyaan yang sering diajukan"
      updated="2 September 2026"
      sections={[
        {
          heading: "Apa itu Mainlagi Hub?",
          body: (
            <p>
              Platform permainan edukasi yang dikendalikan lewat gerakan
              tangan dan badan di depan kamera — tanpa remote, joystick, atau
              alat tambahan lain. Ada 10 permainan: matematika, menjiplak
              angka &amp; bentuk, huruf Hijaiyah, pilihan ganda, papan tulis
              presentasi, dan beberapa game gerak tubuh.
            </p>
          )
        },
        {
          heading: "Apakah perlu akun untuk bermain?",
          body: <p>Tidak. Kamu bisa bermain semua game tanpa akun. Akun hanya opsional, untuk menyimpan progres, mengelola beberapa profil pemain, dan mengikuti papan skor.</p>
        },
        {
          heading: "Apakah video dari kamera direkam atau diunggah?",
          body: <p>Tidak. Video diproses langsung di perangkatmu (on-device) untuk mendeteksi gerakan, dan tidak pernah disimpan atau diunggah ke server mana pun.</p>
        },
        {
          heading: "Perangkat dan browser apa yang didukung?",
          body: <p>Browser modern (disarankan Chrome atau Edge terbaru) dengan akses kamera melalui localhost atau HTTPS. Bisa dibuka di HP, tablet, laptop, maupun TV yang punya browser dan kamera.</p>
        },
        {
          heading: "Bagaimana jika kamera tidak tersedia atau bermasalah?",
          body: <p>Sebagian game menyediakan mode mouse atau keyboard sebagai alternatif, jadi tetap bisa dimainkan meski kamera tidak bisa dipakai.</p>
        },
        {
          heading: "Cocok untuk usia berapa?",
          body: <p>Secara umum untuk anak usia TK sampai SD. Setiap game menampilkan rentang usia yang disarankan di kartunya masing-masing.</p>
        },
        {
          heading: "Bagaimana cara kerja papan skor (leaderboard)?",
          body: <p>Setiap game punya papan skor sendiri. Setelah satu ronde selesai, kamu bisa menuliskan nama untuk masuk papan skor. Peringkat direset setiap minggu.</p>
        },
        {
          heading: "Bisa dipakai lebih dari satu anak dalam satu akun?",
          body: <p>Bisa. Buka {`/account/players`} untuk menambah dan mengelola profil pemain, sehingga progres dan skor tiap anak terpisah.</p>
        },
        {
          heading: "Di mana mengatur tampilan atau preferensi lain?",
          body: <p>Buka {`/account/preferences`} untuk pengaturan seperti tema terang/gelap dan preferensi lainnya.</p>
        },
        {
          heading: "Apakah Mainlagi Hub berbayar?",
          body: <p>Semua permainan gratis dan bisa dicoba tanpa akun. Sebagian halaman menampilkan rekomendasi produk (tautan afiliasi) yang bisa memberi kami komisi tanpa biaya tambahan untukmu — salah satu cara kami menjaga platform tetap gratis.</p>
        },
        {
          heading: "Bisa dipakai guru untuk mengajar di kelas?",
          body: <p>Bisa. Fitur papan tulis presentasi memungkinkan guru menulis dan menggambar di depan kelas tanpa menyentuh layar, cukup dengan gerakan tangan.</p>
        },
        {
          heading: "Bagaimana cara menghapus akun atau data saya?",
          body: <p>Buka {`/account/delete`} untuk menghapus akun, atau {`/data-request`} untuk mengajukan permintaan terkait data pribadimu.</p>
        }
      ]}
    />
  );
}
