import type { Metadata } from "next";
import { operationalPolicy } from "@/lib/shop/operationalPolicy";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Kebijakan Belanja · Mainlagi Shop",
  description:
    "Pembayaran, pengiriman, pembatalan, retur, refund, dan bantuan Mainlagi Shop.",
};

const whatsappHref = (phone: string) =>
  `https://wa.me/${phone.replace(/\D/g, "")}`;

export default function ShopPoliciesPage() {
  const decision = operationalPolicy.ownerDecisions;
  const support = decision.support.contact ?? "";

  return (
    <main className="shop-flow shop-policy-page">
      <p className="shop-eyebrow">MAINLAGI SHOP · KEBIJAKAN V1</p>
      <h1>Belanja dengan aturan yang jelas.</h1>
      <p className="shop-policy-lead">
        Ringkasan ini adalah kebijakan operasional Mainlagi Shop yang disetujui
        untuk rilis awal. Estimasi kurir tetap mengikuti layanan yang tersedia
        saat checkout.
      </p>

      <div className="shop-policy-grid">
        <section className="shop-summary">
          <h2>Pembayaran</h2>
          <p>
            Selesaikan pembayaran dalam{" "}
            <strong>{decision.paymentExpiry.minutes} menit</strong>. Pesanan yang
            belum dibayar dapat dibiarkan kedaluwarsa.
          </p>
          <p>{decision.cancellation.publicPolicy}</p>
        </section>

        <section className="shop-summary">
          <h2>Pengiriman</h2>
          <p>{decision.sla.processing}</p>
          <p>{decision.sla.shipping}</p>
          <p>
            Packing normal sudah termasuk. <strong>Tidak ada handling fee.</strong>
          </p>
        </section>

        <section className="shop-summary">
          <h2>Retur &amp; penukaran</h2>
          <p>{decision.returnExchange.publicPolicy}</p>
        </section>

        <section className="shop-summary">
          <h2>Refund</h2>
          <p>{decision.refund.publicPolicy}</p>
          <p>{decision.sla.refund}</p>
        </section>

        <section className="shop-summary">
          <h2>Pesanan guest</h2>
          <p>{decision.guestOrderRecovery.note}</p>
          <p>
            Untuk rilis awal, Mainlagi tidak mengirim notifikasi order otomatis
            melalui email atau WhatsApp. Status pesanan tersedia melalui halaman
            pesanan yang terotorisasi.
          </p>
        </section>

        <section className="shop-summary">
          <h2>Masalah pengiriman</h2>
          <p><strong>Barang rusak:</strong> {decision.exceptionHandling.damaged}</p>
          <p><strong>Barang salah:</strong> {decision.exceptionHandling.wrongItem}</p>
          <p><strong>Kiriman hilang:</strong> {decision.exceptionHandling.lostShipment}</p>
          <p><strong>Kiriman terlambat:</strong> {decision.exceptionHandling.delayedShipment}</p>
        </section>
      </div>

      <section className="shop-support-card" aria-labelledby="shop-support-title">
        <div>
          <p className="shop-eyebrow">BUTUH BANTUAN?</p>
          <h2 id="shop-support-title">Hubungi Mainlagi Shop</h2>
          <p>
            WhatsApp {support} · {decision.support.hours}
          </p>
        </div>
        {support ? (
          <a
            className="shop-button"
            href={whatsappHref(support)}
            target="_blank"
            rel="noreferrer"
          >
            Buka WhatsApp
          </a>
        ) : null}
      </section>
    </main>
  );
}
