import Link from "next/link";
import "../../shop/shop.css";
export default function ShopAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="shop-shell">
      <nav className="shop-nav" aria-label="Admin Shop">
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
