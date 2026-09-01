import type { Metadata } from "next";
import { requireOwner } from "@/lib/auth/requireOwner";
import { AdminGate } from "@/components/admin/AdminGate";
import { getAdminMetrics, DEFAULT_WINDOW_DAYS, WINDOW_DAY_OPTIONS } from "@/lib/admin/metrics";
import { Icon, type IconName } from "@/components/Icon";
import { DailyBarChart } from "@/components/admin/charts/DailyBarChart";
import { RankedBars } from "@/components/admin/charts/RankedBars";
import { RangeFilter } from "@/components/admin/RangeFilter";

export const metadata: Metadata = { title: "Admin" };

export const dynamic = "force-dynamic";

const KPIS: { key: keyof Awaited<ReturnType<typeof getAdminMetrics>>["counts"]; label: string; icon: IconName }[] = [
  { key: "accounts", label: "Akun", icon: "account" },
  { key: "players", label: "Profil pemain", icon: "games" },
  { key: "sessions", label: "Sesi game", icon: "activity" },
  { key: "articles", label: "Artikel", icon: "doc" },
  { key: "affiliateClicks", label: "Klik affiliate", icon: "tag" }
];

function parseDays(raw: string | undefined): number {
  const n = Number(raw);
  return (WINDOW_DAY_OPTIONS as readonly number[]).includes(n) ? n : DEFAULT_WINDOW_DAYS;
}

export default async function AdminDashboardPage({
  searchParams
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const gate = await requireOwner();
  if (!gate.ok) return <AdminGate title="Admin" reason={gate.reason} />;

  const days = parseDays((await searchParams).days);
  const metrics = await getAdminMetrics(days);

  return (
    <main className="admin-page-main">
      <div className="admin-page-head">
        <div>
          <h1>Dashboard</h1>
          <p>Ringkasan sistem Mainlagi Hub.</p>
        </div>
        <RangeFilter current={days} options={WINDOW_DAY_OPTIONS as readonly number[]} basePath="/admin/dashboard" />
      </div>

      {!metrics.configured && (
        <p className="admin-banner admin-banner--warn">
          <code>SUPABASE_SERVICE_ROLE_KEY</code> belum terpasang di Worker, jadi semua angka di bawah ini 0.
          Pasang secret-nya lalu deploy ulang.
        </p>
      )}
      {metrics.configured && metrics.countsFailed && (
        <p className="admin-banner admin-banner--warn">
          Sebagian data tidak bisa dimuat dari Supabase barusan -- coba muat ulang halaman.
        </p>
      )}

      <div className="admin-kpis">
        {KPIS.map((kpi) => (
          <div key={kpi.key} className="admin-kpi">
            <span className="admin-kpi__icon">
              <Icon name={kpi.icon} size={19} />
            </span>
            <strong className="admin-kpi__value">{metrics.counts[kpi.key]}</strong>
            <span className="admin-kpi__label">{kpi.label}</span>
          </div>
        ))}
      </div>

      <section className="admin-charts">
        <DailyBarChart
          title="Pendaftaran akun"
          subtitle={`Akun baru per hari · ${days} hari terakhir`}
          data={metrics.accountsDaily}
          color="var(--brand)"
          emptyMessage={`Belum ada akun baru dalam ${days} hari terakhir.`}
        />
      </section>

      <section className="admin-charts admin-charts--pair">
        <DailyBarChart
          title="Aktivitas game"
          subtitle="Sesi dimainkan per hari"
          data={metrics.sessionsDaily}
          color="var(--admin-teal)"
          emptyMessage="Belum ada sesi game yang tercatat. Muncul di sini begitu ada anak yang mulai main."
        />
        <RankedBars
          title="Game paling sering dimainkan"
          subtitle={`${days} hari terakhir`}
          items={metrics.topGames}
          color="var(--admin-teal)"
          emptyMessage="Belum ada data permainan."
        />
      </section>

      <section className="admin-charts admin-charts--pair">
        <DailyBarChart
          title="Klik affiliate"
          subtitle="Klik produk per hari"
          data={metrics.clicksDaily}
          color="var(--admin-indigo)"
          emptyMessage="Belum ada klik produk affiliate. Muncul di sini begitu ada yang klik card Shopee/TikTok Shop."
        />
        <RankedBars
          title="Produk paling banyak diklik"
          subtitle={`${days} hari terakhir`}
          items={metrics.topAffiliate}
          color="var(--admin-indigo)"
          emptyMessage="Belum ada data klik produk."
        />
      </section>
    </main>
  );
}
