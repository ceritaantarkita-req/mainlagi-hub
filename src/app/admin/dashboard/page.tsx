import type { Metadata } from "next";
import Link from "next/link";
import { getServerClient } from "@/lib/auth/supabase-server";

export const metadata: Metadata = { title: "Admin | Mainlagi Hub" };

export const dynamic = "force-dynamic";

function Gate({ reason }: { reason: string }) {
  return (
    <div className="center-page">
      <section className="dialog-card">
        <h1>Admin</h1>
        <p>{reason}</p>
        <Link className="button button--primary" href="/login">
          Masuk
        </Link>
      </section>
    </div>
  );
}

async function count(client: NonNullable<Awaited<ReturnType<typeof getServerClient>>>, table: string): Promise<number> {
  const { count } = await client.from(table).select("id", { count: "exact", head: true });
  return count ?? 0;
}

export default async function AdminDashboardPage() {
  const supabase = await getServerClient();
  if (!supabase) return <Gate reason="Supabase belum dikonfigurasi." />;

  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) return <Gate reason="Login diperlukan." />;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "owner") return <Gate reason="Hanya owner yang boleh mengakses dashboard ini." />;

  const [users, players, sessions, articles, clicks] = await Promise.all([
    count(supabase, "profiles"),
    count(supabase, "player_profiles"),
    count(supabase, "game_sessions"),
    count(supabase, "articles"),
    count(supabase, "affiliate_clicks")
  ]);

  const stats = [
    { label: "Akun", value: users },
    { label: "Profil pemain", value: players },
    { label: "Sesi game", value: sessions },
    { label: "Artikel", value: articles },
    { label: "Klik affiliate", value: clicks }
  ];

  return (
    <div className="fun-home">
      <main className="page-shell admin-dashboard">
        <header className="fun-section__head">
          <h2>Admin dashboard</h2>
        </header>
        <div className="admin-stats">
          {stats.map((stat) => (
            <div key={stat.label} className="admin-stat">
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
        <nav className="admin-links">
          <Link href="/admin/affiliate">Kelola affiliate</Link>
          <Link href="/discover/articles">Lihat artikel</Link>
          <Link href="/">Beranda</Link>
        </nav>
        <p className="admin-note">
          Grafik tren dan analitik waktu-nyata akan ditambahkan pada fase berikutnya.
        </p>
      </main>
    </div>
  );
}
