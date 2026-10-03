"use client";
export default function ShopAdminError({ reset }: { reset: () => void }) {
  return (
    <main className="shop-flow">
      <h1>Data Shop belum tersedia</h1>
      <p>
        Periksa koneksi, konfigurasi, migration, atau rentang tanggal. Angka
        laporan tidak diganti menjadi nol.
      </p>
      <button className="shop-button" onClick={reset}>
        Coba lagi
      </button>
    </main>
  );
}
