import Link from "next/link";
export const metadata = { title: "Privasi Kamera" };
export default function PrivacyPage() {
  return <main className="docs-page"><Link href="/">← Beranda</Link><h1>Privasi kamera</h1><p>Motion Learning Hub dirancang tanpa login dan tanpa database pengguna.</p><section><h2>Yang dilakukan</h2><p>Browser membaca landmark tangan dari video untuk mengubah gerakan menjadi titik koordinat, lintasan, digit, atau skor bentuk.</p></section><section><h2>Yang tidak dilakukan</h2><p>Video tidak direkam, tidak diunggah, tidak digunakan untuk mengenali identitas wajah, dan tidak disimpan oleh aplikasi.</p></section><section><h2>Data lokal</h2><p>Skor terbaik dan setting suara dapat disimpan di localStorage perangkat. Data ini bisa dihapus melalui pengaturan browser.</p></section></main>;
}
