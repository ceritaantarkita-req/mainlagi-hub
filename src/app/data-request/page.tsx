import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Permintaan Data | Mainlagi Hub" };

export default function DataRequestPage() {
  return (
    <LegalPage
      title="Permintaan Data"
      updated="22 Agustus 2026"
      sections={[
        {
          heading: "Akses dan ekspor",
          body: (
            <p>
              Kamu dapat mengakses data yang tersimpan di akunmu melalui menu
              Account. Untuk salinan data atau pertanyaan lebih lanjut, hubungi
              kami melalui email yang tertera di beranda.
            </p>
          )
        },
        {
          heading: "Penghapusan",
          body: (
            <p>
              Gunakan halaman {`/account/delete`} untuk menghapus akun beserta
              seluruh data terkait. Kamu juga dapat mengirim permintaan
              penghapusan melalui email.
            </p>
          )
        },
        {
          heading: "Waktu respons",
          body: (
            <p>
              Kami berusaha menanggapi permintaan data dalam waktu yang wajar
              dan sesuai ketentuan yang berlaku di wilayahmu.
            </p>
          )
        }
      ]}
    />
  );
}
