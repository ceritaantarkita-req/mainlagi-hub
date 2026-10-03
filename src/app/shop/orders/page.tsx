import Link from "next/link";
import { db, userId, ShopError } from "@/lib/shop/server";
import { rupiah } from "@/lib/shop/types";
export const dynamic = "force-dynamic";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const id = await userId();
  if (!id)
    return (
      <main className="shop-flow">
        <h1>Pesananmu</h1>
        <p>
          Masuk untuk melihat pesanan yang dibuat dengan akunmu. Pesanan tamu
          dapat dibuka dari halaman pesanan pada perangkat checkout.
        </p>
        <Link className="shop-button" href="/login">
          Masuk
        </Link>
      </main>
    );

  const query = await searchParams;
  const page = Math.max(1, Number.parseInt(query.page ?? "1", 10) || 1);
  const pageSize = 20;
  const c = await db();
  const response = await c
    .from("shop_orders")
    .select(
      "order_number,grand_total_amount,payment_status,fulfillment_status,created_at",
      { count: "exact" },
    )
    .eq("account_id", id)
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);
  if (response.error)
    throw new ShopError("Pesanan akun belum dapat dimuat.", 503);
  const orders = response.data ?? [];
  const total = response.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <main className="shop-flow">
      <h1>Pesananmu</h1>
      <p>
        {total} pesanan · halaman {page} dari {totalPages}.
      </p>
      {orders.length ? (
        orders.map((o) => (
          <article className="shop-cart-line" key={o.order_number}>
            <Link href={`/shop/order/${o.order_number}`}>{o.order_number}</Link>
            <span>
              {rupiah(o.grand_total_amount)} · {o.payment_status} ·{" "}
              {o.fulfillment_status}
            </span>
          </article>
        ))
      ) : (
        <p>Belum ada pesanan dari akun ini.</p>
      )}
      <nav aria-label="Pagination pesanan" style={{ display: "flex", gap: 12 }}>
        {page > 1 ? (
          <Link href={page === 2 ? "/shop/orders" : `/shop/orders?page=${page - 1}`}>
            ← Sebelumnya
          </Link>
        ) : null}
        {page < totalPages ? (
          <Link href={`/shop/orders?page=${page + 1}`}>Berikutnya →</Link>
        ) : null}
      </nav>
    </main>
  );
}
