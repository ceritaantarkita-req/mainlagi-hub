import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
  if (!shopRuntimeEnabled()) notFound();
  return (
    <div className="shop-shell">
      <nav className="shop-nav" aria-label="Mainlagi Shop">
        <Link href="/shop" className="shop-wordmark">
          mainlagi<span>shop</span>
        </Link>
        <div className="shop-nav-links">
          <Link href="/shop/policies">Kebijakan</Link>
          <Link href="/shop/orders">Pesanan</Link>
          <Link href="/shop/cart">Keranjang</Link>
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
