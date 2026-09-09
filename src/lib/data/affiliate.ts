import catalog from "./affiliate-catalog.json";
import provenance from "./affiliate-provenance.json";

export type AffiliatePlatform = "Shopee" | "TikTok Shop";
export type AffiliateAssetStatus = "owned" | "licensed" | "third-party-reference" | "unverified";

export interface AffiliateAssetProvenance {
  status: AffiliateAssetStatus;
  localPath: string | null;
  redistributionAllowed: boolean;
  source: string;
  rightsHolder: string;
  licenseBasis: string;
  reviewedAt: string;
}

export interface AffiliateItem {
  slug: string;
  title: string;
  platform: AffiliatePlatform;
  category: string;
  image: string | null;
  href: string;
  note: string;
  featured?: boolean;
}

interface CatalogEntry {
  slug: string;
  title: string;
  price: string;
  href: string;
  image: string | null;
  featured?: boolean;
}

interface ProvenanceRegistry {
  version: number;
  items: Record<string, AffiliateAssetProvenance>;
}

const entries = catalog as CatalogEntry[];
const provenanceRegistry = provenance as ProvenanceRegistry;

function approvedLocalImage(slug: string): string | null {
  const record = provenanceRegistry.items[slug];
  if (!record?.redistributionAllowed) return null;
  if (record.status !== "owned" && record.status !== "licensed") return null;
  if (!record.localPath?.startsWith("/affiliate/")) return null;
  return record.localPath;
}

export const AFFILIATE_ITEMS: AffiliateItem[] = entries.map((item) => ({
  slug: item.slug,
  title: item.title,
  platform: "Shopee",
  category: "Perlengkapan belajar",
  image: approvedLocalImage(item.slug),
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
