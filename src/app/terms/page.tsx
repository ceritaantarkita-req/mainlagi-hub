import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Syarat Layanan" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Syarat Layanan"
      updated="22 Agustus 2026"
      sections={[
        {
          heading: "Penggunaan aplikasi",
          body: (
            <p>
              Mainlagi Hub adalah platform permainan edukasi berbasis gerakan.
              Gunakan aplikasi sesuai tujuan edukatif dan dengan pengawasan
              orang tua bila digunakan oleh anak.
            </p>
          )
        },
        {
          heading: "Akun",
          body: (
            <p>
              Kamu bertanggung jawab menjaga kerahasiaan kredensial akunmu. Akun
              orang tua digunakan untuk mengelola profil pemain dan memantau
              progres. Kamu dapat menghapus akunmu kapan saja.
            </p>
          )
        },
        {
          heading: "Konten dan tautan pihak ketiga",
          body: (
            <p>
              Tautan affiliate mengarah ke platform pihak ketiga. Kami tidak
              bertanggung jawab atas ketersediaan atau isi platform tersebut.
            </p>
          )
        },
        {
          heading: "Perubahan",
          body: (
            <p>
              Kami dapat memperbarui syarat ini dari waktu ke waktu. Versi
              terbaru selalu tersedia di halaman ini.
            </p>
          )
        }
      ]}
    />
  );
}
