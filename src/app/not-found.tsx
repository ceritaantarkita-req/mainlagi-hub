import Link from "next/link";

export default function NotFound() {
  return (
    <main className="center-page">
      <section className="dialog-card">
        <h1>Halaman tidak ditemukan</h1>
        <p>Game atau halaman yang dicari tidak tersedia.</p>
        <Link className="button button--primary" href="/">
          Kembali ke beranda
        </Link>
      </section>
    </main>
  );
}
