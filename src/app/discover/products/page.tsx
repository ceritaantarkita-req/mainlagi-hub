import type { Metadata } from "next";
import { getData } from "@/lib/data";
import { ProductGrid } from "@/components/discover/ProductGrid";

export const metadata: Metadata = {
  title: "Produk | Mainlagi Hub",
  description: "Perlengkapan pendukung permainan gerak Mainlagi Hub."
};

export const dynamic = "force-dynamic";

export default async function DiscoverProductsPage() {
  const products = await getData().products.listActive();

  return (
    <div className="fun-home">
      <section className="page-shell fun-section">
        <header className="fun-section__head">
          <h2>Peralatan pendukung</h2>
        </header>
        <p className="fun-privacy">
          Tautan afiliasi. Kami bisa menerima komisi dari pembelian tanpa biaya tambahan untukmu.
        </p>
        <ProductGrid items={products} />
      </section>
    </div>
  );
}
