import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "FAQ | Mainlagi Hub" };

export default function FaqPage() {
  return (
    <LegalPage
      title="Pertanyaan yang sering diajukan"
      updated="22 Agustus 2026"
      sections={[
        {
          heading: "Apakah perlu akun untuk bermain?",
          body: <p>Tidak. Kamu bisa bermain tanpa akun. Akun hanya untuk menyimpan progres, mengelola pemain, dan mengikuti leaderboard.</p>
        },
        {
          heading: "Apakah video kamera diunggah?",
          body: <p>Tidak. Video diproses di perangkatmu dan tidak disimpan atau diunggah.</p>
        },
        {
          heading: "Browser apa yang didukung?",
          body: <p>Disarankan Chrome atau Edge terbaru, dengan akses kamera melalui localhost atau HTTPS.</p>
        },
        {
          heading: "Bagaimana jika kamera tidak tersedia?",
          body: <p>Sebagian game menyediakan mode mouse atau keyboard sebagai alternatif.</p>
        },
        {
          heading: "Bagaimana cara menghapus akun?",
          body: <p>Buka {`/account/delete`} atau lihat {`/data-request`} untuk permintaan data.</p>
        }
      ]}
    />
  );
}
