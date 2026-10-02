import Link from "next/link";
export default async function FinishPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  const { order_id } = await searchParams;
  return (
    <main className="shop-flow">
      <h1>Periksa kabar pesananmu</h1>
      <p>Status pembayaran diperiksa langsung ke penyedia pembayaran.</p>
      <Link
        className="shop-button"
        href={
          order_id && /^MLG-\d{8}-[A-F0-9]{12}$/.test(order_id)
            ? `/shop/order/${order_id}`
            : "/shop/orders"
        }
      >
        Lihat pesanan
      </Link>
    </main>
  );
}
