/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";

import {
  resolveLearningSemanticIllustration,
  type LearningSemanticIllustrationKey
} from "@/lib/learning/semanticIllustrationRuntime";
import styles from "./LearningVisualToken.module.css";

export function LearningVisualToken({
  children,
  className = "",
  label,
  semanticKey
}: {
  children: ReactNode;
  className?: string;
  label?: string;
  semanticKey?: LearningSemanticIllustrationKey | string;
}) {
  const fallbackGlyph = typeof children === "string" ? children : null;
  const resolved = resolveLearningSemanticIllustration(semanticKey, fallbackGlyph);
  const accessibility = label
    ? { role: "img" as const, "aria-label": label }
    : { "aria-hidden": true as const };

  return (
    <span
      className={`${styles.frame} ${className}`}
      data-learning-visual-token
      data-learning-semantic-key={semanticKey}
      data-learning-visual-source={resolved ? "semantic-svg" : "fallback"}
      {...accessibility}
    >
      <span className={styles.glyph} data-learning-visual-glyph>
        {resolved ? (
          <img
            src={resolved.src}
            alt=""
            aria-hidden="true"
            decoding="async"
            data-learning-semantic-image
          />
        ) : children}
      </span>
    </span>
  );
}
