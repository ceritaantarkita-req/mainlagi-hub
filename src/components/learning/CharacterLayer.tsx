/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import type {
  CharacterPresentationState
} from "@/lib/learning/characterAssets";
import type {
  ResolvedPresentationCharacter
} from "@/lib/learning/characterPresentation";
import styles from "./CharacterLayer.module.css";

const STATE_CLASS: Readonly<Record<CharacterPresentationState, string>> = {
  hero: styles.stateHero,
  welcome: styles.stateWelcome,
  pointing: styles.statePointing,
  thinking: styles.stateThinking,
  correct: styles.stateCorrect,
  try_again: styles.stateTryAgain,
  celebrate: styles.stateCelebrate
};

export function CharacterLayer({
  characters,
  className,
  decorative = true,
  ariaLabel
}: {
  characters: readonly ResolvedPresentationCharacter[];
  className?: string;
  decorative?: boolean;
  ariaLabel?: string;
}) {
  const visible = characters.slice(0, 2);
  if (visible.length === 0) return null;

  return (
    <div
      className={[styles.layer, className].filter(Boolean).join(" ")}
      data-character-layer
      data-character-count={visible.length}
      aria-hidden={decorative ? true : undefined}
      aria-label={!decorative ? ariaLabel : undefined}
      role={!decorative && ariaLabel ? "group" : undefined}
    >
      {visible.map((character) => (
        <img
          key={`${character.side}:${character.id}:${character.state}`}
          src={character.src}
          className={[
            styles.character,
            character.side === "left" ? styles.left : styles.right,
            STATE_CLASS[character.state]
          ].join(" ")}
          style={{ "--character-order": character.side === "left" ? 0 : 1 } as CSSProperties}
          data-character-id={character.id}
          data-character-state={character.state}
          data-character-side={character.side}
          data-character-role={character.role}
          data-character-asset-source={character.assetSource}
          alt=""
          draggable={false}
          width={500}
          height={650}
        />
      ))}
    </div>
  );
}
