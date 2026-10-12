"use client";

import { useState } from "react";

/** Never scrape or fabricate marketplace product photos. Fallback when missing or blocked. */
export function AffiliateProductMedia({ imageUrl, title }: { imageUrl: string | null | undefined; title: string }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const url = imageUrl?.trim() ?? "";
  const allowedSource = url.startsWith("/affiliate/") || /^https:\/\//i.test(url);
  const canDisplay = allowedSource && failedUrl !== url;

  if (!canDisplay) {
    return (
      <span className="product-tile__fallback" data-affiliate-photo-fallback role="img" aria-label={"Foto belum tersedia: " + title}>
        <span aria-hidden="true" className="product-tile__fallback-symbol">📦</span>
        <span>Foto produk belum tersedia</span>
      </span>
    );
  }

  return (
    // Image URLs from the owner CMS may be unavailable or block cross-site requests.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt="" loading="lazy" decoding="async" onError={() => setFailedUrl(url)} />
  );
}
