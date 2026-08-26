import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Konsen Orang Tua | Mainlagi Hub" };

export default function ParentalConsentPage() {
  return (
    <LegalPage
      title="Konsen Orang Tua"
      updated="22 Agustus 2026"
      sections={[
        {
          heading: "Untuk orang tua atau wali",
          body: (
            <p>
              Mainlagi Hub dirancang untuk digunakan anak di bawah pengawasan
              orang tua atau wali. Akun utama bersifat akun orang tua, dan
              profil pemain dibuat di bawah akun tersebut.
            </p>
          )
        },
        {
          heading: "Data anak",
          body: (
            <p>
              Kami tidak meminta email atau tanggal lahir anak. Profil pemain
              hanya memakai alias dan kelompok umur. Jika kami perlu
              mengumpulkan data anak lebih lanjut, kami akan meminta konsen
              orang tua terlebih dahulu.
            </p>
          )
        },
        {
          heading: "Kontrol orang tua",
          body: (
            <p>
              Orang tua dapat melihat dan menghapus profil pemain, mengelola
              preferensi, serta menghapus akun beserta seluruh data terkait.
            </p>
          )
        }
      ]}
    />
  );
}
