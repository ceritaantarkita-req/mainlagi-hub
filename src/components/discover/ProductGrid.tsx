/* eslint-disable @next/next/no-img-element */
import type { AffiliateItem } from "@/lib/data/domain";

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
        <a key={item.slug} href={`/go/${item.slug}`} className="product-tile">
          <span className="product-tile__media">
            {item.imageUrl ? <img src={item.imageUrl} alt="" loading="lazy" /> : null}
          </span>
          <span className="product-tile__overlay" aria-hidden>
            <strong>{item.title}</strong>
            <small>Lihat di Shopee ↗</small>
          </span>
        </a>
      ))}
    </div>
  );
}
