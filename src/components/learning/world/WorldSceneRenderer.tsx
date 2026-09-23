import type { ReactNode } from "react";
import type { CanonicalWorldSceneDefinition } from "@/lib/learning/world/worldStructure";
import { getWorldScenePresentation } from "@/lib/learning/world/worldScenePresentation";
import styles from "./WorldSceneRenderer.module.css";

export interface WorldSceneRendererProps {
  scene: CanonicalWorldSceneDefinition;
  sceneSegmentPosition: number;
  sceneSegmentCount: number;
  companionLayer?: ReactNode;
  children: ReactNode;
}

export function WorldSceneRenderer({
  scene,
  sceneSegmentPosition,
  sceneSegmentCount,
  companionLayer,
  children
}: WorldSceneRendererProps) {
  const presentation = getWorldScenePresentation(scene.kind);
  const headingId = "world-scene-heading-" + scene.id;

  return (
    <div
      className={styles.sceneFrame}
      role="region"
      aria-labelledby={headingId}
      data-world-scene-frame={scene.id}
      data-world-scene-kind={scene.kind}
      data-world-scene-presentation={presentation.surface}
    >
      <div
        className={styles.sceneMeta}
        aria-live="polite"
        aria-atomic="true"
        data-world-scene-emphasis={presentation.emphasizeSceneTitle ? "strong" : "quiet"}
      >
        <span>{presentation.label}</span>
        <strong id={headingId} data-world-scene-label={scene.id}>{scene.title}</strong>
        <small data-world-scene-progress>{"Bagian " + sceneSegmentPosition + "/" + sceneSegmentCount}</small>
      </div>

      {presentation.showAmbientCompanions ? companionLayer : null}

      <div className={styles.sceneBody} data-world-scene-content>
        {children}
      </div>
    </div>
  );
}
