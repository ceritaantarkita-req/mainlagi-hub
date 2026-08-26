import type { Metadata } from "next";
import type { SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";
import { AdminGate } from "@/components/admin/AdminGate";
import { requireOwner } from "@/lib/auth/requireOwner";

export const metadata: Metadata = { title: "Admin | Mainlagi Hub" };

export const dynamic = "force-dynamic";

async function count(supabase: SupabaseClient, table: string): Promise<number> {
  const { count } = await supabase.from(table).select("id", { count: "exact", head: true });
  return count ?? 0;
}

export default async function AdminDashboardPage() {
  const gate = await requireOwner();
  if (!gate.ok) return <AdminGate title="Admin" reason={gate.reason} />;
  const { supabase } = gate;

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
