import catalog from "./affiliate-catalog.json";

export type AffiliatePlatform = "Shopee" | "TikTok Shop";

export interface AffiliateItem {
  slug: string;
  title: string;
  platform: AffiliatePlatform;
  category: string;
  image: string;
  href: string;
  note: string;
  featured?: boolean;
}

interface CatalogEntry {
  slug: string;
  title: string;
  price: string;
  href: string;
  image: string;
  featured?: boolean;
}

const entries = catalog as CatalogEntry[];

export const AFFILIATE_ITEMS: AffiliateItem[] = entries.map((item) => ({
  slug: item.slug,
  title: item.title,
  platform: "Shopee",
  category: "Perlengkapan belajar",
  image: item.image,
  href: item.href,
  note: item.price ? `Tautan afiliasi · ${item.price}` : "Tautan afiliasi",
  featured: item.featured
}));

export function getAffiliateItem(slug: string): AffiliateItem | null {
  return AFFILIATE_ITEMS.find((item) => item.slug === slug) ?? null;
}

export function getFeaturedAffiliateItems(limit = 3): AffiliateItem[] {
  const featured = AFFILIATE_ITEMS.filter((item) => item.featured);
  return (featured.length ? featured : AFFILIATE_ITEMS).slice(0, limit);
}
