import { ShopCatalog } from "@/components/shop/ShopCatalog";
import { shopCatalog, localPreview } from "@/lib/shop/catalog";
export const dynamic = "force-dynamic";
export default async function ShopPage() {
  return (
    <ShopCatalog products={await shopCatalog()} preview={localPreview()} />
  );
}
