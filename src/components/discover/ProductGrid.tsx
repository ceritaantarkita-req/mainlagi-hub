/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import type { AffiliateItem } from "@/lib/data/domain";

/**
 * Owner-managed affiliate grid: photo-first tiles.
 *
 * The tile is a photo; pointing the cursor over the image surfaces an overlay
 * (shadow + short product text). Clicking goes to `/go/[slug]` for a validated
 * Shopee redirect. On touch devices the title stays visible as a bottom label.
 */
function ProductPhoto({ item }: { item: AffiliateItem }) {
  const [failed, setFailed] = useState(false);
  return item.imageUrl && !failed
    ? <img src={item.imageUrl} alt="" loading="lazy" onError={() => setFailed(true)} />
    : <span style={{ display:"grid", placeItems:"center", minHeight:180, padding:24, background:"#f3f0e7", color:"#486e63", textAlign:"center" }}>Foto produk belum tersedia</span>;
}

export function ProductGrid({ items }: { items: AffiliateItem[] }) {
  return (
    <div className="product-grid">
      {items.map((item) => (
        <a key={item.slug} href={`/go/${item.slug}`} className="product-tile" aria-label={`${item.title} — lihat di Shopee (tautan afiliasi)`}>
          <span className="product-tile__media">
            <ProductPhoto key={item.imageUrl} item={item} />
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
