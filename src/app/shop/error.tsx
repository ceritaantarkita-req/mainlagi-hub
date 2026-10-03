"use client";
export default function ShopError({ reset }: { reset: () => void }) {
  return (
    <main className="shop-empty">
      <h1>Shop belum dapat dimuat.</h1>
      <p>Silakan coba lagi sebentar.</p>
      <button className="shop-button" onClick={reset}>
        Coba lagi
      </button>
    </main>
  );
}
