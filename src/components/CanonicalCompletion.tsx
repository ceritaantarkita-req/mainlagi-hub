"use client";

import Link from "next/link";
import { ArrowLeft, ArrowClockwise, ArrowRight, ShareNetwork, Star } from "@phosphor-icons/react";
import { useEffect, useId, useRef, type HTMLAttributes, type ReactNode } from "react";
import styles from "./CanonicalCompletion.module.css";

export type CanonicalCompletionContext = "belajar" | "bermain" | "world";
export type CanonicalCompletionSurface = "overlay" | "inline";

export type CanonicalCompletionAction =
  | {
      href: string;
      ariaLabel?: string;
    }
  | {
      onClick: () => void;
      ariaLabel?: string;
      disabled?: boolean;
    };

type CanonicalCompletionProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  context: CanonicalCompletionContext;
  surface?: CanonicalCompletionSurface;
  praise: ReactNode;
  message?: ReactNode;
  eyebrow?: ReactNode;
  characterSlot?: ReactNode;
  supportingContent?: ReactNode;
  back: CanonicalCompletionAction;
  again: CanonicalCompletionAction;
  next: CanonicalCompletionAction;
  onShare: () => void | Promise<void>;
  focusHeading?: boolean;
};

function CompletionAction({
  kind,
  action
}: {
  kind: "back" | "again" | "next";
  action: CanonicalCompletionAction;
}) {
  const label = kind === "back" ? "Back" : kind === "again" ? "Again" : "Next";
  const icon = kind === "back"
    ? <ArrowLeft size={22} weight="bold" aria-hidden />
    : kind === "again"
      ? <ArrowClockwise size={22} weight="bold" aria-hidden />
      : <ArrowRight size={22} weight="bold" aria-hidden />;

  if ("href" in action) {
    return (
      <Link
        href={action.href}
        className={kind === "next" ? styles.primaryAction : styles.secondaryAction}
        aria-label={action.ariaLabel ?? label}
        data-completion-action={kind}
      >
        {icon}
        {label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={kind === "next" ? styles.primaryAction : styles.secondaryAction}
      onClick={action.onClick}
      disabled={action.disabled}
      aria-label={action.ariaLabel ?? label}
      data-completion-action={kind}
    >
      {icon}
      {label}
    </button>
  );
}

export function CanonicalCompletion({
  context,
  surface = "overlay",
  praise,
  message,
  eyebrow,
  characterSlot,
  supportingContent,
  back,
  again,
  next,
  onShare,
  focusHeading = true,
  className,
  ...rootProps
}: CanonicalCompletionProps) {
  const generatedHeadingId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingId = `canonical-completion-${generatedHeadingId}`;

  useEffect(() => {
    if (!focusHeading) return;
    const frame = window.requestAnimationFrame(() => headingRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [focusHeading]);

  return (
    <section
      {...rootProps}
      className={[styles.root, styles[surface], className].filter(Boolean).join(" ")}
      role={surface === "overlay" ? "dialog" : "region"}
      aria-modal={surface === "overlay" ? true : undefined}
      aria-labelledby={headingId}
      data-canonical-completion="v1"
      data-completion-context={context}
      data-completion-surface={surface}
      data-completion-stars="3"
    >
      <div className={styles.card}>
        {eyebrow ? <div className={styles.eyebrow}>{eyebrow}</div> : null}

        <h2 ref={headingRef} id={headingId} className={styles.praise} tabIndex={-1}>
          {praise}
        </h2>

        <div className={styles.stars} aria-label="Tiga bintang">
          {[0, 1, 2].map((index) => (
            <Star
              key={index}
              size={46}
              weight="fill"
              aria-hidden
              style={{ animationDelay: `${index * 100}ms` }}
            />
          ))}
        </div>

        {characterSlot ? <div className={styles.characterSlot}>{characterSlot}</div> : null}
        {supportingContent ? <div className={styles.supporting}>{supportingContent}</div> : null}
        {message ? <div className={styles.message}>{message}</div> : null}

        <nav className={styles.actions} aria-label="Navigasi setelah selesai">
          <CompletionAction kind="back" action={back} />
          <CompletionAction kind="again" action={again} />
          <CompletionAction kind="next" action={next} />
        </nav>

        <button
          type="button"
          className={styles.shareButton}
          onClick={() => void onShare()}
          data-completion-action="share"
        >
          <ShareNetwork size={22} weight="bold" aria-hidden />
          Share
        </button>
      </div>
    </section>
  );
}
