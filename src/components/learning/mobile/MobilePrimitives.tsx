import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  PropsWithChildren,
  ReactNode
} from "react";
import Link, { type LinkProps } from "next/link";
import styles from "./MobileFoundation.module.css";

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export type MobileRouteKind =
  | "child-select"
  | "child-learning"
  | "parent"
  | "game-catalog"
  | "game-play";

export function MobileFoundation({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return <div className={classes(styles.foundation, className)} {...props}>{children}</div>;
}

export function MobileRouteBoundary({
  children,
  routeKind,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement> & { routeKind: MobileRouteKind }>) {
  return (
    <div
      className={classes(styles.routeBoundary, className)}
      {...props}
      data-mainlagi-route-boundary={routeKind}
    >
      {children}
    </div>
  );
}

export function MobilePage({ children, narrow = false, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLElement> & { narrow?: boolean }>) {
  return <main className={classes(narrow ? styles.pageNarrow : styles.page, className)} {...props}>{children}</main>;
}

export function MobileSection({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLElement>>) {
  return <section className={classes(styles.section, className)} {...props}>{children}</section>;
}

export function MobileStack({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return <div className={classes(styles.stack, className)} {...props}>{children}</div>;
}

export function MobileGrid({ children, compact = false, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement> & { compact?: boolean }>) {
  return <div className={classes(compact ? styles.gridCompact : styles.grid, className)} {...props}>{children}</div>;
}

export function MobileActionRow({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return <div className={classes(styles.actionRow, className)} {...props}>{children}</div>;
}

export function MobileScrollRow({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return <div className={classes(styles.scrollRow, className)} {...props}>{children}</div>;
}

export function MobileCard({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLElement>>) {
  return <article className={classes(styles.card, className)} {...props}>{children}</article>;
}

export function MobileActivityViewport({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return <div className={classes(styles.activityViewport, className)} {...props}>{children}</div>;
}

export function MobileDialogSurface({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return <div className={classes(styles.dialog, className)} {...props}>{children}</div>;
}

export function MobileTouchButton({ children, className, ...props }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return <button className={classes(styles.touchTarget, className)} {...props}>{children}</button>;
}

type MobileTouchLinkProps = PropsWithChildren<LinkProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>>;

export function MobileTouchLink({ children, className, ...props }: MobileTouchLinkProps) {
  return <Link className={classes(styles.touchTarget, className)} {...props}>{children}</Link>;
}

export function MobileStickyHeader({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLElement>>) {
  return <header className={classes(styles.stickyHeader, className)} {...props}>{children}</header>;
}

export function MobileBottomDock({ children, className, label = "Navigasi", ...props }: PropsWithChildren<HTMLAttributes<HTMLElement> & { label?: string }>) {
  return <nav className={classes(styles.bottomDock, className)} aria-label={label} {...props}>{children}</nav>;
}

export function MobileFullBleed({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return <div className={classes(styles.fullBleedMobile, className)} {...props}>{children}</div>;
}

export function MobileVisuallySafeText({ children }: { children: ReactNode }) {
  return <span style={{ minWidth: 0, overflowWrap: "break-word" }}>{children}</span>;
}
