"use client";

import { useState } from "react";
import { getAffiliateItem } from "@/lib/data/affiliate";

/**
 * Show the owner-configured direct image first; when unavailable (e.g. stale
 * marketplace/CDN image URL), retry the locally approved photo mapped to the
 * SAME product slug. Do not scrape or guess a different product photograph.
 */
export function AffiliateProductMedia({
  imageUrl,
  title,
  slug
}: {
  imageUrl: string | null | undefined;
  title: string;
  slug: string;
}) {
  const [failedUrls, setFailedUrls] = useState<string[]>([]);
  const preferred = imageUrl?.trim() ?? "";
  const local = getAffiliateItem(slug)?.image ?? "";
  const candidates = [preferred, local].filter(
    (url, index, urls) =>
      Boolean(url) &&
      urls.indexOf(url) === index &&
      (url.startsWith("/affiliate/") || /^https:\/\//i.test(url))
  );
  const active = candidates.find((url) => !failedUrls.includes(url));

  if (!active) {
    return (
      <span className="product-tile__fallback" data-affiliate-photo-fallback role="img" aria-label={"Foto belum tersedia: " + title}>
        <span aria-hidden="true" className="product-tile__fallback-symbol">📦</span>
        <span>Foto produk belum tersedia</span>
      </span>
    );
  }

  return (
    // Existing owner-managed image URLs may expire or block third-party loads.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={active}
      src={active}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setFailedUrls((current) => current.includes(active) ? current : [...current, active])}
    />
  );
}
