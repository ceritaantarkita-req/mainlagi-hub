/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { ArrowLeft, SpeakerHigh } from "@phosphor-icons/react";
import { useState, type CSSProperties, type ReactNode } from "react";
import { speakWithStatus, unlockAudio } from "@/lib/audio/feedback";
import { useActivityCharacterPresentation, useActivityVisualTheme } from "./ActivityVisualThemeProvider";
import { CharacterLayer } from "./CharacterLayer";
import styles from "./GardenActivityFrame.module.css";

/** Presentation only: completion and evidence stay with each activity runtime. */
export function GardenActivityFrame({ backHref, title, narration, lang = "id-ID", onHear, hint, children, spacious = false, workspace = false, compactShortDesktop = false }: {
  backHref: string; title?: string; narration?: string; lang?: string;
  onHear?: () => void; hint?: string; children: ReactNode; spacious?: boolean; workspace?: boolean; compactShortDesktop?: boolean;
}) {
  const [audioNotice, setAudioNotice] = useState<string | null>(null);
  const visualTheme = useActivityVisualTheme();
  const { moment: characterMoment, presentation: characterPresentation, setMoment: setCharacterMoment } =
    useActivityCharacterPresentation();
  const runtimeAssets = visualTheme?.scene.runtimeAssets;
  const runtimeCharacters = characterPresentation?.characters ?? [];
  const sceneStyle = runtimeAssets ? ({
    "--ml-scene-wide": `url("${runtimeAssets.wideSrc}")`,
    "--ml-scene-mobile": `url("${runtimeAssets.mobileSrc}")`,
    "--ml-scene-color": visualTheme.scene.fallbackColor
  } as CSSProperties) : undefined;
  const hear = () => {
    setCharacterMoment("guide");
    if (onHear) { onHear(); return; }
    unlockAudio(lang);
    const status = speakWithStatus(narration ?? title ?? "", lang);
    setAudioNotice(status === "spoken" ? null : status === "muted"
      ? "Suara sedang dimatikan. Kamu tetap bisa membaca petunjuknya."
      : lang.toLowerCase().startsWith("id")
        ? "Narasi Bahasa Indonesia belum tersedia di browser atau perangkat ini. Petunjuknya tetap bisa dibaca bersama."
        : "Narasi belum tersedia di browser atau perangkat ini. Petunjuknya tetap bisa dibaca bersama.");
  };
  return <main
    className={`${styles.garden} ${runtimeAssets ? styles.themedScene : ""} ${workspace ? styles.workspace : ""}`}
    style={sceneStyle}
    data-activity-frame="garden"
    data-subject-theme={visualTheme?.subjectId}
    data-scene-variant={visualTheme?.scene.id}
    data-scene-source={visualTheme?.source}
    data-scene-assets={runtimeAssets ? "approved" : "fallback"}
    data-character-source={characterPresentation?.source}
    data-character-moment={characterMoment}
    data-character-state={runtimeCharacters[0]?.state}
    data-character-left={runtimeCharacters[0]?.id}
    data-character-right={runtimeCharacters[1]?.id}
  >
    <header className={styles.header}>
      <Link href={backHref} className={styles.control} aria-label="Kembali"><ArrowLeft size={25} weight="bold" aria-hidden/><span>Kembali</span></Link>
      <img className={styles.brand} src="/artwork/garden-wordmark.webp" alt="Mainlagi" width={600} height={220}/>
      <button type="button" className={styles.control} onClick={hear} aria-label="Dengar petunjuk"><SpeakerHigh size={26} weight="fill" aria-hidden/><span>Dengar</span></button>
    </header>
    <div className={`${styles.play} ${spacious ? styles.spacious : ""} ${compactShortDesktop ? styles.compactShortDesktop : ""}`}>
      {title ? <h1 className={styles.title}>{title}</h1> : null}
      {audioNotice ? <p className={styles.notice} role="status">{audioNotice}</p> : null}
      {children}
      {hint ? <p className={styles.hint}>{hint}</p> : null}
    </div>
    {!workspace && characterPresentation ? (
      <CharacterLayer characters={runtimeCharacters} />
    ) : null}
  </main>;
}
