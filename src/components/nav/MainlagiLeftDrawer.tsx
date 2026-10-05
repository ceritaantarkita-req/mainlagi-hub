"use client";

import Link from "next/link";
import { List, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import styles from "./MainlagiLeftDrawer.module.css";

export type MainlagiDrawerItem = {
  href?: string;
  label: string;
  description?: string;
  current?: boolean;
  disabled?: boolean;
  dataShopSlot?: string;
};

export function MainlagiLeftDrawer({
  items,
  label = "Menu",
  ariaLabel = "Menu Mainlagi",
  productNavMarker = false
}: {
  items: MainlagiDrawerItem[];
  label?: string;
  ariaLabel?: string;
  productNavMarker?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = () =>
      Array.from(
        drawerRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      );

    const frame = requestAnimationFrame(() => focusables()[0]?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        requestAnimationFrame(() => triggerRef.current?.focus());
        return;
      }
      if (event.key !== "Tab") return;

      const nodes = focusables();
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <div className={styles.root} data-mainlagi-product-nav={productNavMarker ? "left-drawer" : undefined}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-controls="mainlagi-left-drawer"
        onClick={() => setOpen(true)}
        data-mainlagi-left-menu-trigger
      >
        <List size={24} weight="bold" aria-hidden />
        <span>{label}</span>
      </button>

      {open ? (
        <div
          className={styles.overlay}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
          data-mainlagi-left-menu-overlay
        >
          <aside
            ref={drawerRef}
            id="mainlagi-left-drawer"
            className={styles.drawer}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            data-mainlagi-left-menu-drawer
          >
            <div className={styles.drawerHeader}>
              <strong>Menu Mainlagi</strong>
              <button
                type="button"
                className={styles.close}
                aria-label="Tutup menu"
                onClick={() => {
                  setOpen(false);
                  requestAnimationFrame(() => triggerRef.current?.focus());
                }}
              >
                <X size={24} weight="bold" aria-hidden />
              </button>
            </div>

            <nav className={styles.nav} aria-label={ariaLabel}>
              {items.map((item) =>
                item.disabled || !item.href ? (
                  <span key={item.label} className={styles.disabled} aria-disabled="true">
                    <strong>{item.label}</strong>
                    {item.description ? <small>{item.description}</small> : null}
                  </span>
                ) : (
                  <Link
                    key={`${item.href}:${item.label}`}
                    href={item.href}
                    className={item.current ? styles.current : undefined}
                    aria-current={item.current ? "page" : undefined}
                    data-mainlagi-shop-slot={item.dataShopSlot}
                    onClick={() => setOpen(false)}
                  >
                    <strong>{item.label}</strong>
                    {item.description ? <small>{item.description}</small> : null}
                  </Link>
                )
              )}
            </nav>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
