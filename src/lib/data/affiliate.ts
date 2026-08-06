export type AffiliatePlatform = "Shopee" | "TikTok Shop";

export interface AffiliateItem {
  slug: string;
  title: string;
  platform: AffiliatePlatform;
  category: string;
  image: string;
  href: string;
  note: string;
}

export const AFFILIATE_ITEMS: AffiliateItem[] = [
  {
    slug: "tripod-webcam-anak",
    title: "Tripod webcam meja untuk area bermain lebih stabil",
    platform: "Shopee",
    category: "Peralatan kamera",
    image: "/affiliate/tripod.svg",
    href: "https://shopee.co.id/",
    note: "Contoh tautan. Ganti dengan link affiliate milik Mainlagi."
  },
  {
    slug: "lampu-belajar-ring",
    title: "Lampu ring kecil untuk membantu pencahayaan tangan",
    platform: "TikTok Shop",
    category: "Pencahayaan",
    image: "/affiliate/ring-light.svg",
    href: "https://www.tiktok.com/",
    note: "Contoh tautan. Ganti dengan link affiliate milik Mainlagi."
  },
  {
    slug: "matras-gerak-anak",
    title: "Matras anti-slip untuk aktivitas Dodge dan Run to Target",
    platform: "Shopee",
    category: "Aktivitas tubuh",
    image: "/affiliate/mat.svg",
    href: "https://shopee.co.id/",
    note: "Contoh tautan. Ganti dengan link affiliate milik Mainlagi."
  }
];

export function getAffiliateItem(slug: string): AffiliateItem | null {
  return AFFILIATE_ITEMS.find((item) => item.slug === slug) ?? null;
}
