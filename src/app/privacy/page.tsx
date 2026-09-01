import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Kebijakan Privasi" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Kebijakan Privasi"
      updated="22 Agustus 2026"
      sections={[
        {
          heading: "Data yang kami kumpulkan",
          body: (
            <>
              <p>
                Kami hanya mengumpulkan data yang diperlukan untuk menjalankan
                aplikasi: informasi akun (email dan nama tampilan), profil pemain
                (alias, kelompok umur, kelas), preferensi (bahasa dan tema), serta
                data skor yang kamu kirim.
              </p>
              <p>Kami tidak meminta email atau tanggal lahir anak.</p>
            </>
          )
        },
        {
          heading: "Kamera dan video",
          body: (
            <p>
              Video dari kamera diproses secara lokal di perangkatmu. Tidak ada
              frame kamera yang diunggah, disimpan, atau dibagikan. Kamu dapat
              berhenti menggunakan kamera kapan saja dan memakai input mouse atau
              keyboard sebagai gantinya.
            </p>
          )
        },
        {
          heading: "Penyimpanan dan retensi",
          body: (
            <p>
              Skor dan progres dapat disimpan secara lokal maupun di akunmu.
              Data dihapus saat kamu menghapus akun atau meminta penghapusan
              melalui halaman {`/data-request`}.
            </p>
          )
        },
        {
          heading: "Layanan pihak ketiga",
          body: (
            <p>
              Kami memakai penyedia autentikasi dan database untuk akun serta
              leaderboard. Tautan affiliate mengarah ke platform pihak ketiga dan
              tunduk pada kebijakan mereka.
            </p>
          )
        },
        {
          heading: "Hak kamu",
          body: (
            <p>
              Kamu berhak mengakses, memperbaiki, mengekspor, atau menghapus data
              pribadimu. Hubungi kami melalui email yang tertera di halaman
              beranda untuk permintaan terkait data.
            </p>
          )
        }
      ]}
    />
  );
}
