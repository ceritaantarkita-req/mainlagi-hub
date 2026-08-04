import Link from "next/link";
export const metadata = { title: "Cara Bermain" };
export default function HowToPlayPage() {
  return <main className="docs-page"><Link href="/">← Beranda</Link><h1>Cara bermain</h1><section><h2>1. Siapkan perangkat</h2><p>Gunakan laptop atau desktop dengan kamera. Tempatkan dua pemain di kiri dan kanan kamera dengan pencahayaan yang cukup.</p></section><section><h2>2. Aktifkan kamera</h2><p>Browser akan meminta izin kamera. Video diproses lokal dan tidak dikirim ke server.</p></section><section><h2>3. Menulis di udara</h2><p>Angkat telunjuk dan lipat jari lain. Gambar satu digit, lalu diamkan telunjuk sekitar 650 ms agar sistem mengunci digit.</p></section><section><h2>4. Menghapus</h2><p>Buka telapak tangan sekitar satu detik, atau tekan tombol Hapus. Garis tengah layar adalah zona netral.</p></section><section><h2>5. Mode demo</h2><p>Gunakan mouse atau sentuhan untuk menguji seluruh game tanpa webcam.</p></section></main>;
}
