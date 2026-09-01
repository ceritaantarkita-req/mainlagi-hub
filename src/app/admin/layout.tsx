import type { ReactNode } from "react";
import Link from "next/link";
import { AdminGate } from "@/components/admin/AdminGate";
import { requireOwner } from "@/lib/auth/requireOwner";
import { Icon, type IconName } from "@/components/Icon";
import { AdminNavLink } from "@/components/admin/AdminNavLink";

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "grid" },
  { href: "/admin/articles", label: "Artikel", icon: "doc" },
  { href: "/admin/affiliate", label: "Affiliate", icon: "tag" }
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const gate = await requireOwner();
  if (!gate.ok) return <AdminGate title="Admin" reason={gate.reason} />;

  return (
    <div className="admin-shell-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <span className="admin-sidebar__mark">MH</span>
          <div>
            <strong>Mainlagi Hub</strong>
            <span>Admin</span>
          </div>
        </div>
        <nav className="admin-sidebar__nav">
          {NAV.map((item) => (
            <AdminNavLink key={item.href} href={item.href} label={item.label} icon={item.icon} />
          ))}
        </nav>
        <div className="admin-sidebar__foot">
          <Link href="/" className="admin-sidebar__back">
            <Icon name="back" size={16} />
            Kembali ke situs
          </Link>
          <div className="admin-sidebar__owner">
            <span className="admin-sidebar__owner-dot" />
            <span>{gate.email ?? "Owner"}</span>
          </div>
        </div>
      </aside>
      <div className="admin-scope">{children}</div>
    </div>
  );
}
