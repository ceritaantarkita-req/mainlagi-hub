import "server-only";
import seed from "./seed.json";
import { catalog } from "./server";
import type { Product } from "./types";
export const localPreview = () =>
  process.env.NODE_ENV === "development" &&
  process.env.SHOP_LOCAL_PREVIEW === "true";
export const previewProducts = (): Product[] =>
  seed.map((p) => ({
    id: p.code,
    product_code: p.code,
    slug: p.slug,
    title: p.title,
    description: p.description,
    category_slug: p.category,
    base_price_amount: p.price,
    status: "draft",
    facts_verified: false,
    media_approved: true,
    shop_variants: [],
    shop_product_media: p.media.map((m, i) => ({
      path: m.path,
      alt_text: m.alt,
      sort_order: i,
      approval_status: "approved",
    })),
  }));
export async function shopCatalog() {
  return localPreview() ? previewProducts() : catalog();
}
