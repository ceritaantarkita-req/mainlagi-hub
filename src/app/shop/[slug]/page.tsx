import { notFound } from "next/navigation";
import { shopCatalog } from "@/lib/shop/catalog";
import { ProductDetail } from "@/components/shop/ProductDetail";
export const dynamic = "force-dynamic";
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = (await shopCatalog()).find((p) => p.slug === slug);
  if (!p) notFound();
  return (
    <ProductDetail
      product={p}
      enabled={
        p.status === "active" && process.env.SHOP_SALES_ENABLED === "true"
      }
    />
  );
}
