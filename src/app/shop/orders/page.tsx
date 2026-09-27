import Link from "next/link";
import { db, result, userId } from "@/lib/shop/server";
import { rupiah } from "@/lib/shop/types";
export const dynamic = "force-dynamic";
export default async function OrdersPage() {
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
  const c = await db();
  const orders = result(
    await c
      .from("shop_orders")
      .select("order_number,grand_total_amount,payment_status")
      .eq("account_id", id)
      .order("created_at", { ascending: false })
      .limit(100),
  );
  return (
    <main className="shop-flow">
      <h1>Pesananmu</h1>
      {orders.length ? (
        orders.map((o) => (
          <article className="shop-cart-line" key={o.order_number}>
            <Link href={`/shop/order/${o.order_number}`}>{o.order_number}</Link>
            <span>
              {rupiah(o.grand_total_amount)} · {o.payment_status}
            </span>
          </article>
        ))
      ) : (
        <p>Belum ada pesanan dari akun ini.</p>
      )}
    </main>
  );
}
