/* eslint-disable @next/next/no-img-element */
"use client";
import type { AffiliateItem } from "@/lib/data/domain";
import { AffiliateProductMedia } from "./AffiliateProductMedia";

/**
 * Owner-managed affiliate grid: photo-first tiles.
 *
 * The tile is a photo; pointing the cursor over the image surfaces an overlay
 * (shadow + short product text). Clicking goes to `/go/[slug]` for a validated
 * Shopee redirect. On touch devices the title stays visible as a bottom label.
 */
export function ProductGrid({ items }: { items: AffiliateItem[] }) {
  return (
    <div className="product-grid">
      {items.map((item) => (
        <a key={item.slug} href={`/go/${item.slug}`} className="product-tile" aria-label={`${item.title} — lihat di Shopee (tautan afiliasi)`}>
          <span className="product-tile__media">
            <AffiliateProductMedia key={item.slug + ":" + (item.imageUrl ?? "")} imageUrl={item.imageUrl} title={item.title} />
          </span>
          <span className="product-tile__overlay" style={{ opacity:1, transform:"none" }}>
            <strong>{item.title}</strong>
            <small>Lihat di Shopee ↗</small>
          </span>
        </a>
      ))}
    </div>
  );
}
