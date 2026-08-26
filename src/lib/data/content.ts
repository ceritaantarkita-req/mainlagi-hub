import type { Article } from "./domain";

/**
 * Editorial content seed (MVP).
 *
 * Static source of published articles. When the Supabase CMS lands (Phase 5
 * teardown), these move into the `articles` table and the repository reads
 * them from there. Each article answers a real intent - no filler.
 */

function article(input: Omit<Article, "id" | "status" | "canonicalUrl">): Article {
  const slug = input.slug;
  return {
    ...input,
    id: `article-${slug}`,
    status: "published",
    canonicalUrl: `/discover/articles/${slug}`
  };
}

export const ARTICLES: Article[] = [
  article({
    slug: "cara-bermain-game-gerak-anak",
    title: "Cara Bermain Game Gerak untuk Anak di Rumah",
    excerpt:
      "Panduan singkat menyiapkan ruang, kamera, dan gerakan agar permainan gerak berjalan aman dan menyenangkan di rumah.",
    content: [
      "Game gerak memakai kamera untuk mendeteksi tangan dan badan. Anak cukup berdiri di depan kamera dan mengikuti instruksi di layar.",
      "Siapkan ruang kosong minimal 1–2 meter, cahaya yang cukup, dan posisi kamera setinggi dada. Pastikan kamera diizinkan saat browser memintanya.",
      "Mulai dari satu pemain dan game tanpa tulisan, lalu naik ke mode dua pemain. Istirahatkan anak setiap beberapa ronde.",
      "Format jawaban yang benar disarankan untuk latihan dasar: anak hanya perlu memilih jawaban, bukan menulis."
    ].join("\n\n"),
    author: "Tim Mainlagi",
    category: "Tips orang tua",
    tags: ["cara bermain", "game gerak", "orang tua"],
    coverImage: null,
    locale: "id",
    seoTitle: "Cara Bermain Game Gerak untuk Anak di Rumah",
    seoDescription:
      "Panduan menyiapkan ruang, kamera, dan gerakan untuk bermain game gerak edukasi bersama anak di rumah.",
    publishedAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z"
  }),
  article({
    slug: "permainan-matematika-untuk-anak-tk",
    title: "Permainan Matematika untuk Anak TK: Mulai dari Mana",
    excerpt:
      "Permainan matematika untuk anak TK sebaiknya fokus pada jumlah dan pengenalan angka, bukan hafalan.",
    content: [
      "Anak TK belajar matematika lewat pengalaman konkret: menghitung benda, membandingkan jumlah, dan mengenal angka.",
      "Game pilihan ganda cocok karena tidak menuntut menulis. Anak hanya memilih jawaban yang benar dari beberapa pilihan.",
      "Mulai dari angka 1–10, lalu naik bertahap. Beri pujian untuk usaha, bukan hanya jawaban benar.",
      "Bermain 10–15 menit per sesi lebih efektif daripada sesi panjang."
    ].join("\n\n"),
    author: "Tim Mainlagi",
    category: "Aktivitas belajar",
    tags: ["matematika", "TK", "angka"],
    coverImage: null,
    locale: "id",
    seoTitle: "Permainan Matematika untuk Anak TK",
    seoDescription:
      "Ide permainan matematika untuk anak TK: fokus pada jumlah, pengenalan angka, dan pilihan ganda tanpa menulis.",
    publishedAt: "2026-08-05T00:00:00.000Z",
    updatedAt: "2026-08-05T00:00:00.000Z"
  }),
  article({
    slug: "melatih-koordinasi-tangan-anak",
    title: "Melatih Koordinasi Tangan Anak Lewat Gerakan",
    excerpt:
      "Gerakan menulis di udara membantu anak melatih koordinasi tangan-mata sambil belajar huruf dan angka.",
    content: [
      "Koordinasi tangan-mata adalah dasar banyak keterampilan, termasuk menulis.",
      "Game menulis dengan gerakan tangan meminta anak menghubungkan titik, mengikuti bentuk huruf, atau menulis angka di udara.",
      "Gunakan tangan yang dominan dulu, lalu coba tangan lainnya. Beri contoh bentuk sebelum anak mencoba.",
      "Yang terpenting bukan hasil sempurna, melainkan konsistensi gerakan."
    ].join("\n\n"),
    author: "Tim Mainlagi",
    category: "Aktivitas belajar",
    tags: ["koordinasi", "tangan", "menulis"],
    coverImage: null,
    locale: "id",
    seoTitle: "Melatih Koordinasi Tangan Anak Lewat Gerakan",
    seoDescription:
      "Cara melatih koordinasi tangan-mata anak lewat permainan menulis dan menjiplak bentuk dengan gerakan.",
    publishedAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  }),
  article({
    slug: "permainan-edukasi-dua-pemain",
    title: "Permainan Edukasi untuk Dua Anak dalam Satu Layar",
    excerpt:
      "Banyak game mendukung dua pemain dalam satu kamera. Ini cara membuat sesi tetap adil dan terstruktur.",
    content: [
      "Mode dua pemain memungkinkan dua anak bermain bersamaan di depan satu kamera. Cocok untuk saudara atau teman.",
      "Atur giliran agar setiap anak mendapat kesempatan yang sama, dan pisahkan skor per pemain.",
      "Pilih game dengan tingkat kesulitan yang cocok untuk keduanya, atau set level berbeda per pemain.",
      "Sesi dua pemain lebih baik dibatasi waktu agar tidak terlalu lama."
    ].join("\n\n"),
    author: "Tim Mainlagi",
    category: "Aktivitas belajar",
    tags: ["dua pemain", "bersama", "keluarga"],
    coverImage: null,
    locale: "id",
    seoTitle: "Permainan Edukasi untuk Dua Anak dalam Satu Layar",
    seoDescription:
      "Tips bermain permainan edukasi dua pemain dalam satu kamera: atur giliran, skor, dan level yang adil.",
    publishedAt: "2026-08-15T00:00:00.000Z",
    updatedAt: "2026-08-15T00:00:00.000Z"
  }),
  article({
    slug: "cara-menyiapkan-kamera-game-gerak",
    title: "Cara Menyiapkan Kamera untuk Game Gerak",
    excerpt:
      "Posisi kamera dan cahaya sangat memengaruhi deteksi gerakan. Berikut pengaturannya.",
    content: [
      "Letakkan kamera pada ketinggian dada, bukan terlalu rendah atau tinggi.",
      "Pastikan anak berada dalam jangkauan kamera dan tidak bergerak keluar dari bingkai.",
      "Gunakan cahaya yang cukup dari depan, hindari cahaya dari belakang (backlight).",
      "Bersihkan lensa dan hindari area yang terlalu gelap agar deteksi lebih andal."
    ].join("\n\n"),
    author: "Tim Mainlagi",
    category: "Tips orang tua",
    tags: ["kamera", "setup", "pencahayaan"],
    coverImage: null,
    locale: "id",
    seoTitle: "Cara Menyiapkan Kamera untuk Game Gerak",
    seoDescription:
      "Panduan posisi kamera dan pencahayaan agar game gerak mendeteksi gerakan dengan lebih andal.",
    publishedAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z"
  }),
  article({
    slug: "belajar-huruf-hijaiyah-untuk-anak",
    title: "Cara Mengenalkan Huruf Hijaiyah ke Anak",
    excerpt:
      "Game gerak bisa membantu anak mengenali bentuk huruf Hijaiyah sambil bergerak.",
    content: [
      "Mulai dengan mengenalkan bentuk huruf lewat gambar dan suara sebelum menjiplak.",
      "Gunakan aktivitas menjiplak untuk melatih gerakan tangan mengikuti bentuk.",
      "Biarkan anak mencoba berulang tanpa takut salah; fokus pada pengenalan bentuk.",
      "Gunakan audio untuk mendampingi setiap huruf."
    ].join("\n\n"),
    author: "Tim Mainlagi",
    category: "Aktivitas belajar",
    tags: ["hijaiyah", "huruf", "iqro"],
    coverImage: null,
    locale: "id",
    seoTitle: "Cara Mengenalkan Huruf Hijaiyah ke Anak",
    seoDescription:
      "Cara mengenalkan bentuk huruf Hijaiyah ke anak lewat gambar, suara, dan aktivitas menjiplak.",
    publishedAt: "2026-08-20T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  })
];

export function getArticleBySlug(slug: string): Article | null {
  return ARTICLES.find((a) => a.slug === slug) ?? null;
}
