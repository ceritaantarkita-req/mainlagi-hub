import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Kebijakan Cookie | Mainlagi Hub" };

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Kebijakan Cookie"
      updated="22 Agustus 2026"
      sections={[
        {
          heading: "Apa itu cookie",
          body: (
            <p>
              Cookie adalah file kecil yang disimpan di perangkatmu untuk
              mengingat preferensi dan sesi masuk. Kami memakai cookie untuk
              mempertahankan sesi masuk dan preferensi tema serta bahasa.
            </p>
          )
        },
        {
          heading: "Cookie yang kami gunakan",
          body: (
            <ul>
              <li>Cookie sesi autentikasi (dikelola oleh penyedia akun).</li>
              <li>Preferensi lokal (tema dan bahasa).</li>
              <li>Data progres lokal di perangkat.</li>
            </ul>
          )
        },
        {
          heading: "Mengelola cookie",
          body: (
            <p>
              Kamu dapat menghapus cookie melalui pengaturan browser. Menonaktifkan
              cookie dapat mengganggu fungsi sesi masuk dan sebagian fitur.
            </p>
          )
        }
      ]}
    />
  );
}
