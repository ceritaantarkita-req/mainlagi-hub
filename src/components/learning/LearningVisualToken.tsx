import type { ReactNode } from "react";

import styles from "./LearningVisualToken.module.css";

export function LearningVisualToken({
  children,
  className = "",
  label
}: {
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  const accessibility = label
    ? { role: "img" as const, "aria-label": label }
    : { "aria-hidden": true as const };

  return (
    <span
      className={`${styles.frame} ${className}`}
      data-learning-visual-token
      {...accessibility}
    >
      <span className={styles.glyph} data-learning-visual-glyph>
        {children}
      </span>
    </span>
  );
}
