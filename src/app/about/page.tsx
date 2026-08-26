import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Tentang | Mainlagi Hub" };

export default function AboutPage() {
  return (
    <LegalPage
      title="Tentang Mainlagi Hub"
      updated="22 Agustus 2026"
      sections={[
        {
          heading: "Apa itu Mainlagi Hub",
          body: (
            <p>
              Mainlagi Hub adalah platform permainan edukasi
              berbasis gerakan tangan dan badan. Anak belajar sambil bergerak di
              depan kamera, tanpa perangkat tambahan.
            </p>
          )
        },
        {
          heading: "Misi kami",
          body: (
            <p>
              Kami ingin membuat belajar terasa seperti bermain: aktif,
              menyenangkan, dan bisa dilakukan bersama keluarga di rumah.
            </p>
          )
        },
        {
          heading: "Privasi",
          body: (
            <p>
              Video kamera diproses di perangkat dan tidak diunggah. Lihat
              {` `}{`/privacy`} untuk detail.
            </p>
          )
        }
      ]}
    />
  );
}
