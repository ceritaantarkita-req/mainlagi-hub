import Link from "next/link";
import type { Metadata } from "next";
import { shopRuntimeEnabled } from "@/lib/shop/server";
import "./shop.css";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Mainlagi Shop",
  description: "Teman kecil untuk hari penuh main, belajar, dan berkarya.",
};
export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const commerceEnabled =
    shopRuntimeEnabled() && process.env.SHOP_SALES_ENABLED === "true";
  return (
    <div className="shop-shell">
      <nav className="shop-nav" aria-label="Mainlagi Shop">
        <Link href="/shop" className="shop-wordmark">
          mainlagi<span>shop</span>
        </Link>
        <div className="shop-nav-links">
          <Link href="/">Mainlagi</Link>
          <Link href="/shop/policies">Kebijakan</Link>
          {commerceEnabled ? (
            <>
              <Link href="/shop/orders">Pesanan</Link>
              <Link href="/shop/cart">Keranjang</Link>
            </>
          ) : (
            <span className="shop-preview-badge" data-mainlagi-shop-mode="read-only">
              Pratinjau
            </span>
          )}
        </div>
      </nav>
      {children}
      <footer className="shop-footer">
        Mainlagi Shop · Teman main, tumbuh bersama.
        <br />
        <Link href="/shop">Jelajahi koleksi</Link>
        {" · "}
        <Link href="/shop/policies">Kebijakan belanja & bantuan</Link>
      </footer>
    </div>
  );
}
