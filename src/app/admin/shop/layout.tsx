import Link from "next/link";
import { notFound } from "next/navigation";
import { shopRuntimeEnabled } from "@/lib/shop/server";
import "../../shop/shop.css";
export const dynamic = "force-dynamic";
export default function ShopAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!shopRuntimeEnabled()) notFound();
  return (
    <div className="shop-shell">
      <nav className="shop-nav shop-admin-nav" aria-label="Admin Shop">
        {[
          ["products", "Produk"],
          ["inventory", "Inventory"],
          ["orders", "Pesanan"],
          ["reports", "Laporan"],
        ].map(([path, label]) => (
          <Link href={`/admin/shop/${path}`} key={path}>
            {label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
