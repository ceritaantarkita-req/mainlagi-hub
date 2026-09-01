"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/Icon";

export function AdminNavLink({ href, label, icon }: { href: string; label: string; icon: IconName }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link href={href} className={active ? "is-active" : undefined} aria-current={active ? "page" : undefined}>
      <Icon name={icon} size={18} />
      {label}
    </Link>
  );
}
