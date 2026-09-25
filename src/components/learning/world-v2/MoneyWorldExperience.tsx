"use client";

import Link from "next/link";
import {
  ArrowClockwise,
  ArrowLeft,
  ArrowRight,
  Copy,
  LockKey,
  ShareNetwork,
  SpeakerHigh,
  Star
} from "@phosphor-icons/react";
import {
  Fragment,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent
} from "react";
import { CharacterLayer } from "@/components/learning/CharacterLayer";
import { WorldSceneRenderer } from "@/components/learning/world/WorldSceneRenderer";
import type { CharacterPresentationState } from "@/lib/learning/characterAssets";
import {
  resolveCharacterPresentation,
  type ResolvedCharacterPresentation
} from "@/lib/learning/characterPresentation";
import { MONEY_WORLD_PILOT_AGE_BAND } from "@/lib/learning/world/moneyWorldPresentation";
import { MONEY_WORLD_RUNTIME_CHARACTER_POLICY } from "@/lib/learning/world/moneyWorldAssets";
import { audioStatus, playTone, unlockAudio, warmAudio, type SpeechStartStatus } from "@/lib/audio/feedback";
import {
  MONEY_WORLD_CHAPTERS,
  MONEY_WORLD_ID,
  MONEY_WORLD_STAGES,
  getMoneyWorldSegments,
  getMoneyWorldStage,
  nextMoneyWorldStage,
  type MoneyWorldActivityPlacement
} from "@/lib/learning/world/moneyWorld";
import { getMoneyWorldSceneForSegment } from "@/lib/learning/world/moneyWorldStructure";
import { getMoneyWorldPilotStage } from "@/lib/learning/world/moneyWorldPilot";
import {
  playMoneyWorldNarration,
  stopMoneyWorldFixedNarration,
  type MoneyWorldNarrationPlaybackMode
} from "@/lib/learning/world/moneyWorldNarrationPlayback";
import {
  WORLD_PROGRESS_EVENT,
  checkpointMoneyWorldStage,
  completeMoneyWorldStage,
  isMoneyWorldStageUnlocked,
  moneyWorldProgressTimestamp,
  moneyWorldStars,
  readMoneyWorldProgress,
  replaceMoneyWorldProgress,
  restartMoneyWorldStage,
  type MoneyWorldProgress
} from "@/lib/learning/world/progress";
import {
  readCloudMoneyWorldProgress,
  syncMoneyWorldProgressCloud
} from "@/lib/learning/world/cloud";
import {
  emitMoneyWorldEvidenceObservation,
  type MoneyWorldEvidenceCompletionObservation,
  type MoneyWorldEvidenceInputMode
} from "@/lib/learning/world/moneyWorldEvidenceClient";
import { validateReusableMechanicPayload } from "@/lib/learning/mechanicLibrary";
import styles from "./MoneyWorldExperience.module.css";

const EMPTY_PROGRESS: MoneyWorldProgress = {
  worldId: MONEY_WORLD_ID,
  completedStageIds: [],
  currentStageId: null,
  currentSegmentIndex: 0,
  updatedAt: ""
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

type MoneyWorldStorySpeaker = keyof typeof MONEY_WORLD_RUNTIME_CHARACTER_POLICY.storyRoleToRuntimeCharacter;
type MoneyWorldStageVisualStyle = CSSProperties & {
  "--world-scene-wide": string;
  "--world-scene-mobile": string;
};

type MoneyWorldActivityCompletion = Omit<
  MoneyWorldEvidenceCompletionObservation,
  "childId"
>;

type MoneyWorldCharacterFeedbackState = "correct" | "try_again";


const WorldCharacterFeedbackContext = createContext<(state: MoneyWorldCharacterFeedbackState) => void>(() => {});

function useWorldCharacterFeedback() {
  return useContext(WorldCharacterFeedbackContext);
}

function resolveMoneyWorldCharacterPresentation(
  context: "world_catalog" | "world_map" | "world_scene" | "world_completion",
  requestedState?: CharacterPresentationState
): ResolvedCharacterPresentation {
  return resolveCharacterPresentation({
    context,
    worldId: MONEY_WORLD_ID,
    requestedState
  });
}

function segmentDefaultCharacterState(segmentType: string): CharacterPresentationState {
  return segmentType === "activity" || segmentType === "narrative_choice" || segmentType === "recap"
    ? "thinking"
    : "hero";
}

function runtimeCharacterForStoryRole(speaker: MoneyWorldStorySpeaker) {
  const id = MONEY_WORLD_RUNTIME_CHARACTER_POLICY.storyRoleToRuntimeCharacter[speaker];
  return { id, name: id === "gavi" ? "Gavi" : "Paca" } as const;
}

function presentDummyCharacterCopy(text: string) {
  return text
    .replace(/\bKak Naya\b/g, "Paca")
    .replace(/\bNaya\b/g, "Paca")
    .replace(/\bGian\b/g, "Gavi");
}

function StageAmbience({ stageId }: { stageId: string }) {
  const pilotStage = getMoneyWorldPilotStage(stageId);
  if (!pilotStage) return null;
  return (
    <div className={styles.sceneDecor} aria-hidden data-world-ambience-stage={stageId}>
      {pilotStage.ambience.map((item, index) => (
        <span key={item + index} data-decor-index={index}>{item}</span>
      ))}
    </div>
  );
}

function useMoneyWorldProgress(childId: string) {
  const [progress, setProgress] = useState<MoneyWorldProgress>(EMPTY_PROGRESS);
  const [ready, setReady] = useState(false);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const refresh = () => {
      if (cancelled) return;
      setProgress(readMoneyWorldProgress(childId));
      setReady(true);
    };

    const hydrateCloud = async () => {
      try {
        const cloud = await readCloudMoneyWorldProgress(childId);
        if (cancelled || !cloud) return;

        const local = readMoneyWorldProgress(childId);
        const cloudCompleted = cloud.completedStageIds.length;
        const localCompleted = local.completedStageIds.length;
        const cloudIsNewer = cloudCompleted > localCompleted
          || (cloudCompleted === localCompleted && moneyWorldProgressTimestamp(cloud) > moneyWorldProgressTimestamp(local));

        if (cloudIsNewer) {
          replaceMoneyWorldProgress(childId, cloud);
          return;
        }

        const localIsNewer = localCompleted > cloudCompleted
          || (localCompleted === cloudCompleted && moneyWorldProgressTimestamp(local) > moneyWorldProgressTimestamp(cloud));
        if (localIsNewer) void syncMoneyWorldProgressCloud(childId, local);
      } finally {
        if (!cancelled) setSettled(true);
      }
    };

    const frame = window.requestAnimationFrame(() => {
      setSettled(false);
      refresh();
      void hydrateCloud();
    });
    const onProgress = (event: Event) => {
      const detail = (event as CustomEvent<{ childId?: string }>).detail;
      if (!detail?.childId || detail.childId === childId) refresh();
    };
    const onOnline = () => { void hydrateCloud(); };
    window.addEventListener(WORLD_PROGRESS_EVENT, onProgress);
    window.addEventListener("storage", refresh);
    window.addEventListener("online", onOnline);
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener(WORLD_PROGRESS_EVENT, onProgress);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("online", onOnline);
    };
  }, [childId]);

  return { progress, ready, settled };
}

function WorldHero({
  compact = false,
  context = "world_catalog"
}: {
  compact?: boolean;
  context?: "world_catalog" | "world_map" | "world_completion";
}) {
  const presentation = resolveMoneyWorldCharacterPresentation(context);
  return (
    <div
      className={cx(styles.worldHero, compact && styles.worldHeroCompact)}
      data-world-character-state={presentation.requestedState}
      data-world-character-source={presentation.source}
    >
      <div className={styles.worldHeroCopy}>
        <span className={styles.eyebrow}>Mainlagi World</span>
        <h1>Petualangan Uang</h1>
        <p>Bantu Gavi dan Paca menyiapkan Festival Mainlagi!</p>
      </div>
      <div className={styles.heroCharacters}>
        <CharacterLayer characters={presentation.characters} className={styles.heroCharacterLayer} />
      </div>
    </div>
  );
}

export function WorldCatalogScreen({ childId }: { childId: string }) {
  const state = useMoneyWorldProgress(childId);
  const completed = state.progress.completedStageIds.length;
  const nextStage = state.ready
    ? MONEY_WORLD_STAGES.find((stage) => !state.progress.completedStageIds.includes(stage.id)) ?? null
    : null;
  const cardHref = "/child/" + childId + "/world/" + MONEY_WORLD_ID;
  const cta = !state.ready
    ? "Memuat…"
    : completed === MONEY_WORLD_STAGES.length
      ? "Main lagi →"
      : completed === 0
        ? "Mulai petualangan →"
        : "Lanjut Stage " + (nextStage?.order ?? completed + 1) + " →";

  return (
    <main className={styles.catalogPage}>
      <section className={styles.catalogIntro}>
        <span className={styles.eyebrow}>World</span>
        <h1>Pilih petualangan</h1>
        <p>Pilih cerita, dengarkan, mainkan, lalu buka Stage berikutnya.</p>
      </section>

      <Link className={styles.worldCard} href={cardHref}>
        <WorldHero compact />
        <div className={styles.worldCardMeta}>
          <span data-world-age-policy={"pilot-" + MONEY_WORLD_PILOT_AGE_BAND.id}>{"Usia rekomendasi " + MONEY_WORLD_PILOT_AGE_BAND.label}</span>
          <span>{state.ready ? String(completed) + "/" + MONEY_WORLD_STAGES.length + " Stage selesai" : "Memuat progres…"}</span>
          <strong data-world-catalog-cta>{cta}</strong>
        </div>
      </Link>
    </main>
  );
}

export function MoneyWorldMapScreen({ childId, worldId }: { childId: string; worldId: string }) {
  const state = useMoneyWorldProgress(childId);
  const mapRef = useRef<HTMLElement>(null);
  const worldsHref = "/child/" + childId + "/worlds";
  const mapBase = "/child/" + childId + "/world/" + MONEY_WORLD_ID;
  const worldComplete = state.ready && state.progress.completedStageIds.length === MONEY_WORLD_STAGES.length;
  const nextJourneyStageId = state.ready
    ? MONEY_WORLD_STAGES.find((stage) => !state.progress.completedStageIds.includes(stage.id))?.id ?? null
    : null;

  useEffect(() => {
    if (!state.ready || state.progress.completedStageIds.length === 0) return;
    const nextStage = MONEY_WORLD_STAGES.find((stage) => !state.progress.completedStageIds.includes(stage.id))
      ?? MONEY_WORLD_STAGES.at(-1);
    if (!nextStage) return;
    const frame = window.requestAnimationFrame(() => {
      const target = mapRef.current?.querySelector<HTMLElement>('[data-world-stage-id="' + nextStage.id + '"]');
      target?.scrollIntoView({ block: "center", inline: "nearest", behavior: "auto" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [state.progress.completedStageIds, state.ready]);

  if (worldId !== MONEY_WORLD_ID) {
    return (
      <main className={styles.catalogPage}>
        <div className={styles.noticeCard}>
          <h1>World belum tersedia.</h1>
          <Link href={worldsHref}>Kembali ke World</Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.mapPage}>
      <WorldHero context={worldComplete ? "world_completion" : "world_map"} />
      <div className={styles.mapTopline}>
        <Link href={worldsHref} className={styles.textButton}>← Semua World</Link>
        <span>{state.ready ? String(state.progress.completedStageIds.length) + "/" + MONEY_WORLD_STAGES.length + " Stage" : "Memuat…"}</span>
      </div>

      <section
        className={styles.mapShell}
        aria-label="Peta Petualangan Uang"
        data-world-map="money-festival"
        data-world-complete={worldComplete ? "true" : "false"}
        ref={mapRef}
      >
        <div className={styles.mapPath} aria-hidden />
        {worldComplete ? (
          <div className={styles.festivalFinish} role="status">
            <span aria-hidden>🎪 🎉</span>
            <strong>Festival siap!</strong>
            <small>{"Semua " + MONEY_WORLD_STAGES.length + " Stage sudah selesai."}</small>
          </div>
        ) : null}
        {MONEY_WORLD_STAGES.map((stage, index) => {
          const chapterIndex = MONEY_WORLD_CHAPTERS.findIndex((chapter) => chapter.id === stage.chapterId);
          const chapter = chapterIndex >= 0 ? MONEY_WORLD_CHAPTERS[chapterIndex] : null;
          const isChapterStart = chapter?.stageIds[0] === stage.id;
          const chapterCompleted = chapter
            ? chapter.stageIds.filter((chapterStageId) => state.progress.completedStageIds.includes(chapterStageId)).length
            : 0;
          const unlocked = state.ready && isMoneyWorldStageUnlocked(state.progress, stage.id);
          const stars = moneyWorldStars(state.progress, stage.id);
          const node = (
            <div
              className={cx(
                styles.stageNode,
                unlocked ? styles.stageUnlocked : styles.stageLocked,
                stars === 3 && styles.stageDone,
                stage.id === nextJourneyStageId && styles.stageCurrent
              )}
              data-stage-order={stage.order}
              data-current-stage={stage.id === nextJourneyStageId ? "true" : "false"}
            >
              <div className={styles.stageStars} aria-label={stars === 3 ? "Tiga bintang" : "Belum selesai"}>
                {[0, 1, 2].map((star) => (
                  <Star key={star} size={17} weight={stars === 3 ? "fill" : "regular"} aria-hidden />
                ))}
              </div>
              <div className={styles.stageIcon} aria-hidden>
                {unlocked ? stage.emoji : <LockKey size={26} weight="fill" />}
                {stage.id === nextJourneyStageId ? <span className={styles.currentPin}>▶</span> : null}
              </div>
              <div className={styles.stageCopy}>
                <small>{"Stage " + stage.order + " · " + stage.locationLabel}</small>
                <strong>{stage.title}</strong>
                <span>{stage.subtitle}</span>
                {unlocked && !stage.playable ? <em>Checkpoint berikutnya</em> : null}
              </div>
            </div>
          );
          const rowClass = index % 2 ? styles.stageRowRight : styles.stageRowLeft;
          return (
            <Fragment key={stage.id}>
              {isChapterStart && chapter ? (
                <div
                  className={styles.chapterMapBanner}
                  data-world-chapter-id={chapter.id}
                  data-world-chapter-order={chapterIndex + 1}
                >
                  <div>
                    <small>{"Chapter " + String(chapterIndex + 1)}</small>
                    <strong>{chapter.title}</strong>
                  </div>
                  <span>{String(chapterCompleted) + "/" + String(chapter.stageIds.length) + " Stage selesai"}</span>
                </div>
              ) : null}
              <div
                className={cx(styles.stageRow, rowClass)}
                data-stage-order={stage.order}
                data-world-stage-id={stage.id}
                data-world-stage-chapter-id={stage.chapterId}
              >
                {unlocked ? (
                  <Link
                    href={mapBase + "/stage/" + stage.id}
                    className={styles.stageLink}
                    aria-current={stage.id === nextJourneyStageId ? "step" : undefined}
                  >
                    {node}
                  </Link>
                ) : (
                  <div
                    className={styles.stageLink}
                    aria-disabled="true"
                    role="group"
                    aria-label={"Stage " + stage.order + " terkunci · " + stage.title}
                  >
                    {node}
                  </div>
                )}
              </div>
            </Fragment>
          );
        })}
      </section>
    </main>
  );
}

function SpeechCard({
  audioId,
  speaker,
  text,
  kind,
  onNext,
  nextLabel
}: {
  audioId: string;
  speaker: MoneyWorldStorySpeaker;
  text: string;
  kind: "narrative" | "concept" | "payoff";
  onNext: () => void;
  nextLabel: string;
}) {
  const [speechStatus, setSpeechStatus] = useState<SpeechStartStatus | null>(null);
  const [playbackMode, setPlaybackMode] = useState<MoneyWorldNarrationPlaybackMode | null>(null);
  const autoAttemptedRef = useRef(false);
  const runtimeCharacter = runtimeCharacterForStoryRole(speaker);
  const presentedText = presentDummyCharacterCopy(text);
  const speakerPresentation = resolveCharacterPresentation({
    context: "world_scene",
    worldId: MONEY_WORLD_ID,
    requestedCharacters: [runtimeCharacter.id],
    requestedState: kind === "concept" ? "thinking" : "hero",
    allowIdentityFallback: false
  });

  useEffect(() => {
    autoAttemptedRef.current = false;
    let cancelled = false;

    const startNarration = () => {
      if (cancelled || autoAttemptedRef.current || !audioStatus().unlocked || audioStatus().muted) return;
      autoAttemptedRef.current = true;
      const result = playMoneyWorldNarration({
        cueId: audioId,
        fallbackText: presentedText,
        speech: {
          lang: "id-ID",
          key: "world-narration:" + audioId,
          interrupt: true
        },
        onFixedAudioFallback: (fallback) => {
          setSpeechStatus(fallback.status);
          setPlaybackMode(fallback.mode);
        }
      });
      setSpeechStatus(result.status);
      setPlaybackMode(result.mode);
    };

    const timer = window.setTimeout(startNarration, 0);
    const afterGesture = () => {
      warmAudio("id-ID");
      startNarration();
    };
    window.addEventListener("pointerdown", afterGesture, { once: true, capture: true });
    window.addEventListener("keydown", afterGesture, { once: true, capture: true });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", afterGesture, { capture: true });
      window.removeEventListener("keydown", afterGesture, { capture: true });
      stopMoneyWorldFixedNarration();
    };
  }, [audioId, presentedText]);

  const hear = () => {
    autoAttemptedRef.current = true;
    unlockAudio("id-ID");
    const result = playMoneyWorldNarration({
      cueId: audioId,
      fallbackText: presentedText,
      speech: {
        lang: "id-ID",
        key: "world-replay:" + audioId,
        interrupt: true,
        dedupeMs: 0
      },
      onFixedAudioFallback: (fallback) => {
        setSpeechStatus(fallback.status);
        setPlaybackMode(fallback.mode);
      }
    });
    setSpeechStatus(result.status);
    setPlaybackMode(result.mode);
  };

  const canContinue = speechStatus !== null;
  const audioNotice = speechStatus === null
    ? "Dengarkan dulu untuk lanjut."
    : speechStatus === "spoken"
      ? ""
      : speechStatus === "muted"
        ? "Suara sedang dimatikan. Kamu tetap bisa lanjut."
        : "Suara belum tersedia. Teks tetap bisa dibaca.";

  return (
    <section
      className={cx(styles.storyScene, kind === "concept" && styles.conceptScene)}
      data-world-audio-id={audioId}
      data-world-narration-mode={playbackMode ?? "idle"}
    >
      <div
        className={styles.storyCharacter}
        data-world-story-character={runtimeCharacter.id}
        data-world-character-state={speakerPresentation.requestedState}
      >
        <div className={styles.storyCharacterArt}>
          <CharacterLayer characters={speakerPresentation.characters} className={styles.storyCharacterLayer} />
        </div>
        <strong>{runtimeCharacter.name}</strong>
      </div>
      <div className={styles.speechBubble}>
        <span className={styles.sceneType}>{kind === "concept" ? "Temukan idenya" : kind === "payoff" ? "Cerita berlanjut" : "Cerita"}</span>
        <p>{presentedText}</p>
        <div className={styles.storyActions}>
          <button type="button" className={styles.secondaryButton} onClick={hear} data-world-hear>
            <SpeakerHigh size={21} weight="fill" aria-hidden /> Dengar
          </button>
          <button type="button" className={styles.primaryButton} onClick={onNext} disabled={!canContinue} data-world-next>
            {nextLabel} <ArrowRight size={20} weight="bold" aria-hidden />
          </button>
        </div>
        {audioNotice ? <small role="status">{audioNotice}</small> : null}
      </div>
    </section>
  );
}

function WorldActivityPrompt({
  audioId,
  prompt,
  helper,
  tag = "Mini-game"
}: {
  audioId: string;
  prompt?: string;
  helper?: string;
  tag?: string;
}) {
  const [audioNotice, setAudioNotice] = useState("");
  const [playbackMode, setPlaybackMode] = useState<MoneyWorldNarrationPlaybackMode | null>(null);
  const spokenPrompt = prompt?.trim() || "Dengarkan petunjuknya.";

  const hearPrompt = () => {
    unlockAudio("id-ID");
    const result = playMoneyWorldNarration({
      cueId: audioId,
      fallbackText: spokenPrompt,
      speech: {
        lang: "id-ID",
        key: "world-activity-prompt:" + audioId,
        interrupt: true,
        dedupeMs: 0
      },
      onFixedAudioFallback: (fallback) => {
        setPlaybackMode(fallback.mode);
        setAudioNotice(
          fallback.status === "spoken"
            ? ""
            : fallback.status === "muted"
              ? "Suara sedang dimatikan."
              : "Suara belum tersedia. Prompt tetap bisa dibaca."
        );
      }
    });
    setPlaybackMode(result.mode);
    setAudioNotice(
      result.status === "spoken"
        ? ""
        : result.status === "muted"
          ? "Suara sedang dimatikan."
          : "Suara belum tersedia. Prompt tetap bisa dibaca."
    );
  };

  return (
    <div
      className={styles.activityHeading}
      data-world-audio-id={audioId}
      data-world-narration-mode={playbackMode ?? "idle"}
    >
      <span className={styles.sceneType}>{tag}</span>
      <h2>{spokenPrompt}</h2>
      <button type="button" className={styles.promptAudioButton} onClick={hearPrompt} data-world-prompt-hear>
        <SpeakerHigh size={19} weight="fill" aria-hidden /> Dengar
      </button>
      {helper ? <p>{helper}</p> : null}
      {audioNotice ? <small className={styles.promptAudioNotice} role="status">{audioNotice}</small> : null}
    </div>
  );
}

function WorldDragTarget({
  placement,
  onComplete
}: {
  placement: MoneyWorldActivityPlacement;
  onComplete: () => void;
}) {
  const validation = validateReusableMechanicPayload("drag_to_target", placement.payload);
  const items = placement.payload.items ?? [];
  const targets = placement.payload.targets ?? [];
  const assignments = placement.payload.assignments ?? {};
  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [message, setMessage] = useState("Pilih atau seret kartu ke tujuan yang cocok.");
  const reportCharacterFeedback = useWorldCharacterFeedback();

  if (!validation.valid) return <div className={styles.runtimeError}>Payload drag tidak valid.</div>;

  const place = (itemId: string, targetId: string) => {
    if (matched.includes(itemId)) return;
    if (assignments[itemId] !== targetId) {
      const nextWrong = incorrectCount + 1;
      setIncorrectCount(nextWrong);
      setMessage(nextWrong >= 2 ? "Lihat angka uang dan angka pada label harga." : "Belum cocok. Coba target lain.");
      playTone("wrong");
      reportCharacterFeedback("try_again");
      return;
    }
    const next = [...matched, itemId];
    setMatched(next);
    setSelected(null);
    playTone("correct");
    reportCharacterFeedback("correct");
    if (next.length === items.length) {
      setMessage("Semua kartu sudah cocok!");
      window.setTimeout(onComplete, 450);
    } else {
      setMessage("Cocok! Cari pasangan berikutnya.");
    }
  };

  const drop = (event: DragEvent<HTMLButtonElement>, targetId: string) => {
    event.preventDefault();
    const itemId = event.dataTransfer.getData("text/plain");
    if (itemId) place(itemId, targetId);
  };

  return (
    <section className={styles.activityScene}>
      <WorldActivityPrompt
        audioId={placement.id + "-prompt"}
        prompt={placement.payload.prompt}
        helper="Sentuh kartu lalu sentuh tujuan. Di desktop, kartu juga bisa diseret."
      />
      <div className={styles.dragBoard}>
        <div className={styles.sourceColumn} role="group" aria-label="Kartu yang belum dipasangkan">
          <strong>Kartu</strong>
          {items.map((item) => {
            const done = matched.includes(item.id);
            return (
              <button
                type="button"
                key={item.id}
                draggable={!done}
                disabled={done}
                className={cx(styles.moneyChip, selected === item.id && styles.selectedCard, done && styles.doneCard)}
                onClick={() => setSelected(item.id)}
                onDragStart={(event) => event.dataTransfer.setData("text/plain", item.id)}
                aria-pressed={selected === item.id}
              >
                {done ? "✓ " : ""}{item.label}
              </button>
            );
          })}
        </div>
        <div className={styles.targetColumn} role="group" aria-label="Tujuan pasangan">
          <strong>Tujuan</strong>
          {targets.map((target) => {
            const landed = items.filter((item) => matched.includes(item.id) && assignments[item.id] === target.id);
            return (
              <button
                type="button"
                key={target.id}
                className={styles.targetCard}
                onClick={() => selected && place(selected, target.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => drop(event, target.id)}
              >
                <span>{target.label}</span>
                <small>{landed.map((item) => item.label).join(", ") || "Taruh di sini"}</small>
              </button>
            );
          })}
        </div>
      </div>
      <p className={styles.activityStatus} role="status">{message}</p>
    </section>
  );
}

function WorldMatching({
  placement,
  onComplete
}: {
  placement: MoneyWorldActivityPlacement;
  onComplete: () => void;
}) {
  const validation = validateReusableMechanicPayload("matching", placement.payload);
  const pairs = useMemo(() => placement.payload.pairs ?? [], [placement.payload.pairs]);
  const right = useMemo(() => pairs.length > 1 ? [...pairs.slice(1), pairs[0]] : [...pairs], [pairs]);
  const [selectedPairId, setSelectedPairId] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [message, setMessage] = useState("Pilih barang di kiri, lalu pilih harganya di kanan.");
  const reportCharacterFeedback = useWorldCharacterFeedback();

  if (!validation.valid) return <div className={styles.runtimeError}>Payload matching tidak valid.</div>;

  const chooseRight = (pairId: string) => {
    if (!selectedPairId || matched.includes(pairId)) return;
    if (selectedPairId !== pairId) {
      const nextWrong = incorrectCount + 1;
      setIncorrectCount(nextWrong);
      setSelectedPairId(null);
      setMessage(nextWrong >= 2 ? "Ingat harga yang tadi kamu lihat." : "Belum cocok. Coba pasangan lain.");
      playTone("wrong");
      reportCharacterFeedback("try_again");
      return;
    }
    const next = [...matched, pairId];
    setMatched(next);
    setSelectedPairId(null);
    playTone("correct");
    reportCharacterFeedback("correct");
    if (next.length === pairs.length) {
      setMessage("Semua pasangan cocok!");
      window.setTimeout(onComplete, 450);
    } else {
      setMessage("Cocok! Cari pasangan berikutnya.");
    }
  };

  return (
    <section className={styles.activityScene}>
      <WorldActivityPrompt
        audioId={placement.id + "-prompt"}
        prompt={placement.payload.prompt}
        helper="Pasangkan kartu di kiri dengan pasangannya di kanan."
      />
      <div className={styles.matchBoard}>
        <div className={styles.matchColumn} role="group" aria-label="Kartu kiri">
          {pairs.map((pair) => (
            <button
              type="button"
              key={pair.id}
              disabled={matched.includes(pair.id)}
              aria-pressed={selectedPairId === pair.id}
              className={cx(styles.matchCard, selectedPairId === pair.id && styles.selectedCard, matched.includes(pair.id) && styles.doneCard)}
              onClick={() => setSelectedPairId(pair.id)}
            >
              {matched.includes(pair.id) ? "✓ " : ""}{pair.left.label}
            </button>
          ))}
        </div>
        <div className={styles.matchArrow} aria-hidden>↔</div>
        <div className={styles.matchColumn} role="group" aria-label="Kartu kanan">
          {right.map((pair) => (
            <button
              type="button"
              key={pair.id}
              disabled={matched.includes(pair.id)}
              className={cx(styles.matchCard, matched.includes(pair.id) && styles.doneCard)}
              onClick={() => chooseRight(pair.id)}
            >
              {matched.includes(pair.id) ? "✓ " : ""}{pair.right.label}
            </button>
          ))}
        </div>
      </div>
      <p className={styles.activityStatus} role="status">{message}</p>
    </section>
  );
}

function WorldCompare({
  placement,
  onComplete
}: {
  placement: MoneyWorldActivityPlacement;
  onComplete: () => void;
}) {
  const validation = validateReusableMechanicPayload("compare", placement.payload);
  const options = placement.payload.options ?? [];
  const correctOptionId = placement.payload.correctOptionId ?? "";
  const [selected, setSelected] = useState<string | null>(null);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [message, setMessage] = useState("Bandingkan kedua harga.");
  const reportCharacterFeedback = useWorldCharacterFeedback();

  if (!validation.valid) return <div className={styles.runtimeError}>Payload compare tidak valid.</div>;

  const choose = (optionId: string) => {
    if (optionId !== correctOptionId) {
      const nextWrong = incorrectCount + 1;
      setIncorrectCount(nextWrong);
      setSelected(optionId);
      setMessage(nextWrong >= 2 ? "Bandingkan angkanya: sepuluh dan dua belas." : "Belum tepat. Coba bandingkan lagi.");
      playTone("wrong");
      reportCharacterFeedback("try_again");
      return;
    }
    setSelected(optionId);
    setMessage("Betul. Dua belas lebih mahal daripada sepuluh.");
    playTone("correct");
    reportCharacterFeedback("correct");
    window.setTimeout(onComplete, 450);
  };

  return (
    <section className={styles.activityScene}>
      <WorldActivityPrompt
        audioId={placement.id + "-prompt"}
        prompt={placement.payload.prompt}
        helper="Lihat harga kemarin dan harga sekarang."
      />
      <div className={styles.compareBoard} role="group" aria-label="Bandingkan dua harga">
        {options.map((option) => (
          <button
            type="button"
            key={option.id}
            className={cx(styles.compareCard, selected === option.id && styles.selectedCard)}
            onClick={() => choose(option.id)}
            aria-pressed={selected === option.id}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className={styles.activityStatus} role="status">{message}</p>
    </section>
  );
}

function WorldSortClassify({
  placement,
  onComplete
}: {
  placement: MoneyWorldActivityPlacement;
  onComplete: () => void;
}) {
  const validation = validateReusableMechanicPayload("sort_classify", placement.payload);
  const items = placement.payload.items ?? [];
  const groups = placement.payload.groups ?? [];
  const assignments = placement.payload.assignments ?? {};
  const [selected, setSelected] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [message, setMessage] = useState("Pilih satu kartu, lalu pilih kelompoknya.");
  const reportCharacterFeedback = useWorldCharacterFeedback();

  if (!validation.valid) return <div className={styles.runtimeError}>Payload sort tidak valid.</div>;

  const place = (groupId: string) => {
    if (!selected) return;
    if (assignments[selected] !== groupId) {
      const nextWrong = incorrectCount + 1;
      setIncorrectCount(nextWrong);
      setMessage(nextWrong >= 2 ? "Perhatikan contoh dan nama kelompoknya." : "Belum tepat. Coba kelompok satunya.");
      playTone("wrong");
      reportCharacterFeedback("try_again");
      return;
    }

    const next = { ...placed, [selected]: groupId };
    setPlaced(next);
    setSelected(null);
    playTone("correct");
    reportCharacterFeedback("correct");
    if (Object.keys(next).length === items.length) {
      setMessage("Semua kartu sudah dikelompokkan.");
      window.setTimeout(onComplete, 450);
    } else {
      setMessage("Cocok. Pilih kartu berikutnya.");
    }
  };

  return (
    <section className={styles.activityScene}>
      <WorldActivityPrompt
        audioId={placement.id + "-prompt"}
        prompt={placement.payload.prompt}
        helper="Pilih satu kartu, lalu masukkan ke kelompok yang sesuai."
      />

      <div className={styles.sortTray} role="group" aria-label="Kartu perubahan harga">
        {items.filter((item) => !placed[item.id]).map((item) => (
          <button
            type="button"
            key={item.id}
            className={cx(styles.sortItem, selected === item.id && styles.selectedCard)}
            aria-pressed={selected === item.id}
            onClick={() => setSelected(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className={styles.sortGroups} role="group" aria-label="Kelompok harga">
        {groups.map((group) => {
          const contents = items.filter((item) => placed[item.id] === group.id);
          return (
            <button
              type="button"
              key={group.id}
              className={styles.sortGroup}
              disabled={!selected}
              onClick={() => place(group.id)}
            >
              <strong>{group.label}</strong>
              <span>{contents.map((item) => item.label).join(" · ") || "Taruh di sini"}</span>
            </button>
          );
        })}
      </div>
      <p className={styles.activityStatus} role="status">{message}</p>
    </section>
  );
}

function WorldTapChoice({
  placement,
  onComplete
}: {
  placement: MoneyWorldActivityPlacement;
  onComplete: (completion?: MoneyWorldActivityCompletion) => void;
}) {
  const validation = validateReusableMechanicPayload("tap_choice", placement.payload);
  const options = placement.payload.options ?? [];
  const correctOptionId = placement.payload.correctOptionId ?? "";
  const [selected, setSelected] = useState<string | null>(null);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [answerSequence, setAnswerSequence] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const [startedAt] = useState(() => new Date().toISOString());
  const inputModeRef = useRef<MoneyWorldEvidenceInputMode>("button");
  const [message, setMessage] = useState("Pilih jawaban yang paling cocok.");
  const reportCharacterFeedback = useWorldCharacterFeedback();

  if (!validation.valid) return <div className={styles.runtimeError}>Payload pilihan tidak valid.</div>;

  const choose = (optionId: string) => {
    if (locked) return;
    const nextAnswers = [...answerSequence, optionId];
    setAnswerSequence(nextAnswers);
    setSelected(optionId);

    if (optionId !== correctOptionId) {
      const nextWrong = incorrectCount + 1;
      setIncorrectCount(nextWrong);
      setMessage(nextWrong >= 2 ? "Dengarkan pertanyaannya lagi, lalu lihat semua pilihan." : "Belum tepat. Coba pilihan lain.");
      playTone("wrong");
      reportCharacterFeedback("try_again");
      return;
    }

    const completedAt = new Date().toISOString();
    setLocked(true);
    setMessage("Betul!");
    playTone("correct");
    reportCharacterFeedback("correct");
    window.setTimeout(() => onComplete({
      answerSequence: nextAnswers,
      startedAt,
      completedAt,
      inputMode: inputModeRef.current
    }), 450);
  };

  const takeAway = placement.presentation?.kind === "take_away";
  const startCount = placement.presentation?.startCount ?? 0;
  const removeCount = placement.presentation?.removeCount ?? 0;

  return (
    <section className={styles.activityScene}>
      <WorldActivityPrompt
        audioId={placement.id + "-prompt"}
        prompt={placement.payload.prompt}
        helper="Pilih satu jawaban."
      />

      {takeAway ? (
        <div className={styles.tokenBoard} role="img" aria-label={startCount + " token, " + removeCount + " dipakai"}>
          {Array.from({ length: startCount }, (_, index) => (
            <span key={index} className={cx(styles.tokenDot, index >= startCount - removeCount && styles.tokenRemoved)} aria-hidden>🪙</span>
          ))}
        </div>
      ) : null}

      <div className={styles.choiceBoard} role="group" aria-label="Pilihan jawaban">
        {options.map((option) => (
          <button
            type="button"
            key={option.id}
            className={cx(styles.choiceCard, selected === option.id && styles.selectedCard)}
            aria-pressed={selected === option.id}
            disabled={locked}
            onPointerDown={() => { inputModeRef.current = "pointer"; }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") inputModeRef.current = "keyboard";
            }}
            onClick={() => choose(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className={styles.activityStatus} role="status">{message}</p>
    </section>
  );
}

function WorldOrdering({
  placement,
  onComplete
}: {
  placement: MoneyWorldActivityPlacement;
  onComplete: () => void;
}) {
  const validation = validateReusableMechanicPayload("ordering_sequence", placement.payload);
  const items = placement.payload.items ?? [];
  const correctOrder = placement.payload.correctOrder ?? [];
  const [order, setOrder] = useState<string[]>([]);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [message, setMessage] = useState("Sentuh kartu sesuai urutan.");
  const reportCharacterFeedback = useWorldCharacterFeedback();

  if (!validation.valid) return <div className={styles.runtimeError}>Payload urutan tidak valid.</div>;

  const add = (itemId: string) => {
    if (order.includes(itemId)) return;
    setOrder([...order, itemId]);
    setMessage("Bagus. Pilih langkah berikutnya.");
  };

  const reset = () => {
    setOrder([]);
    setMessage("Mulai lagi dari langkah pertama.");
    reportCharacterFeedback("try_again");
  };

  const check = () => {
    if (order.length !== items.length) {
      setMessage("Lengkapi semua langkah dulu.");
      return;
    }
    const correct = order.every((id, index) => id === correctOrder[index]);
    if (!correct) {
      const nextWrong = incorrectCount + 1;
      setIncorrectCount(nextWrong);
      setOrder([]);
      setMessage(nextWrong >= 2 ? "Coba mulai dari tujuan, lalu simpan sedikit demi sedikit." : "Belum urut. Coba lagi dari awal.");
      playTone("wrong");
      reportCharacterFeedback("try_again");
      return;
    }
    setMessage("Urutannya tepat!");
    playTone("correct");
    reportCharacterFeedback("correct");
    window.setTimeout(onComplete, 450);
  };

  const orderedItems = order.map((id) => items.find((item) => item.id === id)).filter(Boolean);
  const remaining = items.filter((item) => !order.includes(item.id));

  return (
    <section className={styles.activityScene}>
      <WorldActivityPrompt
        audioId={placement.id + "-prompt"}
        prompt={placement.payload.prompt}
        helper="Sentuh kartu dari langkah pertama sampai terakhir."
      />

      <div className={styles.orderSlots} role="list" aria-label="Urutan yang dipilih">
        {items.map((_, index) => (
          <div key={index} className={styles.orderSlot} role="listitem">
            <span>{index + 1}</span>
            <strong>{orderedItems[index]?.label ?? "?"}</strong>
          </div>
        ))}
      </div>

      <div className={styles.orderTray} role="group" aria-label="Kartu urutan">
        {remaining.map((item) => (
          <button type="button" key={item.id} className={styles.orderCard} onClick={() => add(item.id)}>
            {item.label}
          </button>
        ))}
      </div>

      <div className={styles.orderActions}>
        <button type="button" className={styles.secondaryButton} onClick={reset}>Ulang urutan</button>
        <button type="button" className={styles.primaryButton} onClick={check}>Cek urutan</button>
      </div>
      <p className={styles.activityStatus} role="status">{message}</p>
    </section>
  );
}

function NarrativeChoiceCard({
  audioId,
  prompt,
  options,
  onNext
}: {
  audioId: string;
  prompt: string;
  options: Array<{ id: string; label: string; reaction: string }>;
  onNext: () => void;
}) {
  const [choiceId, setChoiceId] = useState<string | null>(null);
  const selected = options.find((option) => option.id === choiceId);

  return (
    <section className={styles.activityScene}>
      <WorldActivityPrompt
        audioId={audioId}
        prompt={prompt}
        tag="Pilihanmu"
        helper="Tidak ada jawaban salah di bagian ini. Pilih yang kamu mau."
      />
      <div className={styles.choiceBoard} role="group" aria-label="Pilihan cerita">
        {options.map((option) => (
          <button
            type="button"
            key={option.id}
            className={cx(styles.choiceCard, choiceId === option.id && styles.selectedCard)}
            aria-pressed={choiceId === option.id}
            onClick={() => {
              setChoiceId(option.id);
              playTone("correct");
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
      {selected ? (
        <div className={styles.choiceReaction}>
          <p role="status" aria-live="polite">{selected.reaction}</p>
          <button type="button" className={styles.primaryButton} onClick={onNext}>Lanjut <ArrowRight size={20} weight="bold" aria-hidden /></button>
        </div>
      ) : null}
    </section>
  );
}

function WorldRecapCard({
  title,
  items,
  onNext
}: {
  title: string;
  items: Array<{ id: string; icon: string; label: string }>;
  onNext: () => void;
}) {
  return (
    <section className={cx(styles.activityScene, styles.recapScene)}>
      <div className={styles.activityHeading}>
        <span className={styles.sceneType}>Kita ingat sebentar</span>
        <h2>{title}</h2>
      </div>
      <div className={styles.recapGrid} role="list" aria-label="Ringkasan Petualangan Uang">
        {items.map((item) => (
          <div key={item.id} className={styles.recapCard} role="listitem">
            <span aria-hidden>{item.icon}</span>
            <strong>{item.label}</strong>
          </div>
        ))}
      </div>
      <button type="button" className={styles.primaryButton} onClick={onNext}>
        Lanjut <ArrowRight size={20} weight="bold" aria-hidden />
      </button>
    </section>
  );
}

function WorldActivity({
  placement,
  onComplete
}: {
  placement: MoneyWorldActivityPlacement;
  onComplete: (completion?: MoneyWorldActivityCompletion) => void;
}) {
  if (placement.mechanicId === "drag_to_target") return <WorldDragTarget placement={placement} onComplete={onComplete} />;
  if (placement.mechanicId === "matching") return <WorldMatching placement={placement} onComplete={onComplete} />;
  if (placement.mechanicId === "compare") return <WorldCompare placement={placement} onComplete={onComplete} />;
  if (placement.mechanicId === "sort_classify") return <WorldSortClassify placement={placement} onComplete={onComplete} />;
  if (placement.mechanicId === "tap_choice") return <WorldTapChoice placement={placement} onComplete={onComplete} />;
  if (placement.mechanicId === "ordering_sequence") return <WorldOrdering placement={placement} onComplete={onComplete} />;
  return <div className={styles.runtimeError}>Mechanic ini belum aktif di World dummy.</div>;
}

function WorldStageCompletion({
  childId,
  stageId,
  onAgain
}: {
  childId: string;
  stageId: string;
  onAgain: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const completionTitleRef = useRef<HTMLHeadingElement>(null);
  const [shareGate, setShareGate] = useState<"idle" | "checking" | "allowed" | "denied">("idle");
  const [copyStatus, setCopyStatus] = useState("");
  const next = nextMoneyWorldStage(stageId);
  const stage = getMoneyWorldStage(stageId);
  const mapHref = "/child/" + childId + "/world/" + MONEY_WORLD_ID;
  const nextHref = next ? mapHref + "/stage/" + next.id : mapHref;
  const praiseByStage = ["Awesome!", "Hebat!", "Good job!", "Excellent!", "Keren!", "Bagus sekali!", "Mantap!", "Luar biasa!"];
  const praise = stage ? praiseByStage[Math.max(0, Math.min(praiseByStage.length - 1, stage.order - 1))] : "Awesome!";
  const finalStage = stage?.order === MONEY_WORLD_STAGES.length;
  const chapterIndex = stage ? MONEY_WORLD_CHAPTERS.findIndex((chapter) => chapter.id === stage.chapterId) : -1;
  const chapter = chapterIndex >= 0 ? MONEY_WORLD_CHAPTERS[chapterIndex] : null;
  const chapterComplete = Boolean(chapter && chapter.stageIds.at(-1) === stageId);
  const chapterRewardLabel = chapterIndex === 0 ? "Pilih Pintar" : "Festival Siap";
  const completionContext = stage && chapter
    ? "Chapter " + String(chapterIndex + 1) + " · Stage " + String(stage.order) + "/" + String(MONEY_WORLD_STAGES.length)
    : "Stage selesai";
  const completionMessage = finalStage
    ? "Petualangan Uang selesai. Festival Mainlagi siap!"
    : chapterComplete
      ? "Chapter " + String(chapterIndex + 1) + " selesai. Stage " + String(next?.order ?? stage?.order ?? "") + " sekarang terbuka."
      : (stage?.title ?? "Stage") + " selesai. Stage " + String(next?.order ?? "") + " sekarang terbuka.";
  const shareText = finalStage
    ? "⭐⭐⭐ Petualangan Uang selesai. Festival Mainlagi siap!"
    : "⭐⭐⭐ Stage “" + (stage?.title ?? "Petualangan Uang") + "” selesai di Mainlagi!";
  const completionPresentation = resolveMoneyWorldCharacterPresentation("world_completion");

  const openShare = async () => {
    setShareGate("checking");
    setCopyStatus("");
    dialogRef.current?.showModal();
    try {
      const response = await fetch("/api/parent/share-gate", { cache: "no-store" });
      const payload = await response.json() as { allowed?: boolean };
      setShareGate(payload.allowed ? "allowed" : "denied");
    } catch {
      setShareGate("denied");
    }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.origin + "/worlds/" + MONEY_WORLD_ID : "";
  const encodedText = encodeURIComponent(shareText + " " + shareUrl);
  const encodedUrl = encodeURIComponent(shareUrl);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => completionTitleRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <section
      className={styles.completion}
      aria-labelledby="world-stage-complete-title"
      data-world-completion-stage={stageId}
      data-world-completion-chapter={chapter?.id ?? ""}
      data-world-completion-final={finalStage ? "true" : "false"}
    >
      <div className={styles.completionCard}>
        <span className={styles.eyebrow} data-world-completion-context>{completionContext}</span>
        <h2 id="world-stage-complete-title" ref={completionTitleRef} tabIndex={-1}>{praise}</h2>
        <div className={styles.completionStars} aria-label="Tiga bintang">
          {[0, 1, 2].map((index) => (
            <Star key={index} size={58} weight="fill" aria-hidden style={{ animationDelay: String(index * 140) + "ms" }} />
          ))}
        </div>
        <div
          className={styles.completionCharacters}
          data-world-character-state={completionPresentation.requestedState}
        >
          <CharacterLayer characters={completionPresentation.characters} className={styles.completionCharacterLayer} />
        </div>
        {chapterComplete && chapter ? (
          <div
            className={styles.chapterReward}
            data-world-completion-chapter-milestone={chapter.id}
          >
            <span aria-hidden>🏅</span>
            <div>
              <strong>{"Chapter " + String(chapterIndex + 1) + " selesai"}</strong>
              <small>{chapterRewardLabel}</small>
            </div>
          </div>
        ) : null}
        <p data-world-completion-message>{completionMessage}</p>
        <div className={styles.completionActions} aria-label="Navigasi setelah Stage selesai">
          <Link href={mapHref}><ArrowLeft size={21} weight="bold" aria-hidden />Back</Link>
          <button type="button" onClick={onAgain}><ArrowClockwise size={21} weight="bold" aria-hidden />Again</button>
          <Link href={nextHref}><ArrowRight size={21} weight="bold" aria-hidden />Next</Link>
        </div>
        <button type="button" className={styles.shareButton} onClick={() => void openShare()}>
          <ShareNetwork size={21} weight="bold" aria-hidden />Share
        </button>
      </div>

      <dialog ref={dialogRef} className={styles.shareDialog} aria-labelledby="world-share-title">
        <div className={styles.dialogHead}>
          <div><small>Area orang tua</small><h2 id="world-share-title">Bagikan pencapaian</h2></div>
          <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Tutup">×</button>
        </div>
        {shareGate === "checking" ? <p role="status">Memeriksa akses orang tua…</p> : null}
        {shareGate === "denied" ? (
          <div className={styles.parentGate}>
            <p>Fitur berbagi hanya tersedia melalui sesi orang tua.</p>
            <Link href="/parent">Buka Area Orang Tua</Link>
          </div>
        ) : null}
        {shareGate === "allowed" ? (
          <>
            <p>Yang dibagikan hanya pesan umum dan halaman World—tanpa nama, umur, akun, atau detail progres anak.</p>
            <div className={styles.shareGrid}>
              <button
                type="button"
                onClick={() => void navigator.clipboard.writeText(shareUrl).then(() => setCopyStatus("Link tersalin.")).catch(() => setCopyStatus("Link belum bisa disalin."))}
              >
                <Copy size={19} aria-hidden />Copy link
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!navigator.share) {
                    setCopyStatus("Gunakan Copy link di browser ini.");
                    return;
                  }
                  void navigator.share({ title: "Mainlagi", text: shareText, url: shareUrl }).catch(() => undefined);
                }}
              >
                <ShareNetwork size={19} aria-hidden />Share device
              </button>
              <a href={"https://wa.me/?text=" + encodedText} target="_blank" rel="noreferrer">WhatsApp</a>
              <a href={"https://t.me/share/url?url=" + encodedUrl + "&text=" + encodeURIComponent(shareText)} target="_blank" rel="noreferrer">Telegram</a>
              <a href={"https://twitter.com/intent/tweet?text=" + encodedText} target="_blank" rel="noreferrer">X</a>
              <a href={"https://www.facebook.com/sharer/sharer.php?u=" + encodedUrl} target="_blank" rel="noreferrer">Facebook</a>
              <a href={"https://www.threads.net/intent/post?text=" + encodedText} target="_blank" rel="noreferrer">Threads</a>
            </div>
            {copyStatus ? <p role="status">{copyStatus}</p> : null}
          </>
        ) : null}
      </dialog>
    </section>
  );
}

function MoneyWorldStageRuntime({
  childId,
  stageId
}: {
  childId: string;
  stageId: string;
}) {
  const state = useMoneyWorldProgress(childId);
  const stage = getMoneyWorldStage(stageId);
  const segments = getMoneyWorldSegments(stageId);
  const lastIndex = segments.length - 1;
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [characterFeedback, setCharacterFeedback] = useState<{
    segmentId: string;
    state: MoneyWorldCharacterFeedbackState;
  } | null>(null);
  const stageRuntimeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!state.ready || !state.settled || hydrated || lastIndex < 0) return;
    const resume = state.progress.currentStageId === stageId
      ? Math.min(lastIndex, state.progress.currentSegmentIndex)
      : 0;
    const frame = window.requestAnimationFrame(() => {
      setSegmentIndex(resume);
      setCompleted(false);
      const checkpoint = checkpointMoneyWorldStage(childId, stageId, resume);
      void syncMoneyWorldProgressCloud(childId, checkpoint);
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [childId, hydrated, lastIndex, stageId, state.progress.currentSegmentIndex, state.progress.currentStageId, state.ready, state.settled]);

  const advance = () => {
    if (segmentIndex >= lastIndex) {
      const completion = completeMoneyWorldStage(childId, stageId);
      void syncMoneyWorldProgressCloud(childId, completion);
      playTone("celebrate");
      setCompleted(true);
      return;
    }
    const next = segmentIndex + 1;
    const checkpoint = checkpointMoneyWorldStage(childId, stageId, next);
    void syncMoneyWorldProgressCloud(childId, checkpoint);
    setSegmentIndex(next);
  };

  const again = () => {
    const restarted = restartMoneyWorldStage(childId, stageId);
    void syncMoneyWorldProgressCloud(childId, restarted);
    setSegmentIndex(0);
    setCompleted(false);
    setCharacterFeedback(null);
    setHydrated(true);
  };

  if (!stage || !segments.length) return <div className={styles.runtimeError}>Stage belum memiliki segment runtime.</div>;
  if (!state.ready || !state.settled || !hydrated) return <div className={styles.stageLoading}>Menyiapkan petualangan…</div>;
  if (completed) return <WorldStageCompletion childId={childId} stageId={stageId} onAgain={again} />;

  const segment = segments[segmentIndex];
  const characterState = characterFeedback?.segmentId === segment.id
    ? characterFeedback.state
    : segmentDefaultCharacterState(segment.type);
  const characterPresentation = resolveMoneyWorldCharacterPresentation("world_scene", characterState);
  const reportCharacterFeedback = (nextState: MoneyWorldCharacterFeedbackState) => {
    setCharacterFeedback({ segmentId: segment.id, state: nextState });
  };
  const completeActivity = (completion?: MoneyWorldActivityCompletion) => {
    if (
      segment.type === "activity"
      && segment.activity.id === "money-s08-activity-02"
      && segment.activity.assessment === "assessed"
      && completion
    ) {
      void emitMoneyWorldEvidenceObservation({
        childId,
        ...completion
      });
    }
    advance();
  };
  const activeScene = getMoneyWorldSceneForSegment(stageId, segment.id);
  const pilotStage = getMoneyWorldPilotStage(stageId);
  const chapterIndex = MONEY_WORLD_CHAPTERS.findIndex((chapter) => chapter.id === stage.chapterId);
  const chapter = chapterIndex >= 0 ? MONEY_WORLD_CHAPTERS[chapterIndex] : null;
  if (!activeScene) return <div className={styles.runtimeError}>Struktur Scene World tidak valid untuk Segment ini.</div>;
  if (!pilotStage) return <div className={styles.runtimeError}>Manifest produksi Stage World tidak ditemukan.</div>;
  if (!chapter) return <div className={styles.runtimeError}>Chapter World untuk Stage ini tidak ditemukan.</div>;
  const stageVisualStyle: MoneyWorldStageVisualStyle = {
    "--world-scene-wide": `url("${pilotStage.backgroundWide}")`,
    "--world-scene-mobile": `url("${pilotStage.backgroundMobile}")`
  };
  const percent = ((segmentIndex + 1) / segments.length) * 100;
  const sceneSegmentPosition = activeScene.segmentIds.indexOf(segment.id) + 1;
  const sceneSegmentCount = activeScene.segmentIds.length;
  if (sceneSegmentPosition <= 0) return <div className={styles.runtimeError}>Segment tidak terdaftar di Scene aktif.</div>;
  const hasNarrationControl = segment.type !== "recap";
  const hearCurrentSegment = () => {
    const control = stageRuntimeRef.current?.querySelector<HTMLButtonElement>("[data-world-hear], [data-world-prompt-hear]");
    control?.click();
  };

  return (
    <div
      ref={stageRuntimeRef}
      className={styles.stageRuntime}
      style={stageVisualStyle}
      data-stage-order={stage.order}
      data-world-pilot-stage={pilotStage.stageId}
      data-world-pilot-runtime-status={pilotStage.runtimeStatus}
      data-world-scene={stage.order}
      data-world-stage-shell="garden-baseline-v1"
      data-world-runtime-character-policy={MONEY_WORLD_RUNTIME_CHARACTER_POLICY.mode}
      data-world-character-state={characterState}
      data-world-character-left={characterPresentation.characters[0]?.id}
      data-world-character-right={characterPresentation.characters[1]?.id}
      data-world-chapter-id={chapter.id}
      data-world-chapter-order={chapterIndex + 1}
      data-world-scene-id={activeScene.id}
      data-world-scene-kind={activeScene.kind}
    >
      <div
        className={styles.stageProgressBar}
        role="progressbar"
        aria-label="Progres Stage"
        aria-valuemin={1}
        aria-valuemax={segments.length}
        aria-valuenow={segmentIndex + 1}
        aria-valuetext={"Bagian " + (segmentIndex + 1) + " dari " + segments.length}
      >
        <span style={{ width: String(percent) + "%" }} />
      </div>
      <header className={styles.stageShellHeader}>
        <Link href={"/child/" + childId + "/world/" + MONEY_WORLD_ID} className={styles.stageShellControl} aria-label="Kembali">
          <ArrowLeft size={25} weight="bold" aria-hidden />
          <span>Kembali</span>
        </Link>
        <span className={styles.stageShellBrand} role="img" aria-label="Mainlagi" />
        <button
          type="button"
          className={styles.stageShellControl}
          onClick={hearCurrentSegment}
          disabled={!hasNarrationControl}
          aria-label={hasNarrationControl ? "Dengar petunjuk aktif" : "Tidak ada narasi pada bagian ini"}
          data-world-shell-hear
        >
          <SpeakerHigh size={26} weight="fill" aria-hidden />
          <span>Dengar</span>
        </button>
      </header>
      <div className={styles.stageShellTitle}>
        <span data-world-chapter-label={chapter.id}>{"Chapter " + String(chapterIndex + 1) + " · " + chapter.title}</span>
        <h1>{stage.title}</h1>
        <small>{"Stage " + stage.order + " · " + stage.locationLabel + " · Bagian " + String(segmentIndex + 1) + "/" + segments.length}</small>
      </div>

      <StageAmbience stageId={stage.id} />

      <WorldCharacterFeedbackContext.Provider value={reportCharacterFeedback}>
        <WorldSceneRenderer
          scene={activeScene}
          sceneSegmentPosition={sceneSegmentPosition}
          sceneSegmentCount={sceneSegmentCount}
          companionLayer={(
            <div className={styles.stageShellCharacters} aria-hidden>
              <CharacterLayer
                characters={characterPresentation.characters}
                className={styles.stageCharacterLayer}
              />
            </div>
          )}
        >
          {segment.type === "activity" ? (
          <WorldActivity key={segment.activity.id} placement={segment.activity} onComplete={completeActivity} />
        ) : segment.type === "narrative_choice" ? (
          <NarrativeChoiceCard audioId={segment.id + "-prompt"} prompt={segment.prompt} options={segment.options} onNext={advance} />
        ) : segment.type === "recap" ? (
          <WorldRecapCard title={segment.title} items={segment.items} onNext={advance} />
        ) : (
          <SpeechCard
            key={segment.id}
            audioId={segment.id}
            speaker={segment.speaker}
            text={segment.text}
            kind={segment.type}
            onNext={advance}
            nextLabel={segmentIndex === lastIndex ? "Selesai" : "Lanjut"}
          />
          )}
        </WorldSceneRenderer>
      </WorldCharacterFeedbackContext.Provider>
    </div>
  );
}

export function MoneyWorldStageScreen({
  childId,
  worldId,
  stageId
}: {
  childId: string;
  worldId: string;
  stageId: string;
}) {
  const state = useMoneyWorldProgress(childId);
  const stage = getMoneyWorldStage(stageId);
  const worldsHref = "/child/" + childId + "/worlds";
  const mapHref = "/child/" + childId + "/world/" + MONEY_WORLD_ID;

  if (worldId !== MONEY_WORLD_ID || !stage) {
    return (
      <main className={styles.stagePage}>
        <div className={styles.noticeCard}><h1>Stage tidak ditemukan.</h1><Link href={worldsHref}>Kembali ke World</Link></div>
      </main>
    );
  }

  if (!state.ready || !state.settled) return <main className={styles.stagePage}><div className={styles.stageLoading}>Memeriksa progres…</div></main>;

  if (!isMoneyWorldStageUnlocked(state.progress, stageId)) {
    return (
      <main className={styles.stagePage}>
        <div className={styles.noticeCard}>
          <LockKey size={40} weight="fill" aria-hidden />
          <h1>Stage ini belum terbuka.</h1>
          <p>Selesaikan Stage sebelumnya dulu.</p>
          <Link href={mapHref}>Kembali ke peta</Link>
        </div>
      </main>
    );
  }

  const segments = getMoneyWorldSegments(stageId);
  if (!stage.playable || !segments.length) {
    return (
      <main className={styles.stagePage}>
        <div className={styles.placeholderScene}>
          <span className={styles.placeholderEmoji} aria-hidden>{stage.emoji}</span>
          <span className={styles.eyebrow}>{"Stage " + stage.order + " sudah terbuka"}</span>
          <h1>{stage.title}</h1>
          <p>{stage.subtitle}</p>
          <p className={styles.placeholderNote}>Stage ini sudah masuk World Map, tetapi runtime-nya belum dibuka pada checkpoint implementasi saat ini.</p>
          <Link href={mapHref} className={styles.primaryButton}><ArrowLeft size={20} weight="bold" aria-hidden />Kembali ke peta</Link>
        </div>
      </main>
    );
  }

  return <main className={styles.stagePage}><MoneyWorldStageRuntime childId={childId} stageId={stageId} /></main>;
}

export function MoneyWorldPublicLanding() {
  return (
    <main className={styles.publicPage}>
      <WorldHero />
      <section className={styles.publicCard}>
        <span className={styles.eyebrow}>{"Petualangan belajar · Usia rekomendasi " + MONEY_WORLD_PILOT_AGE_BAND.label}</span>
        <h2>Bantu siapkan Festival Mainlagi</h2>
        <p>World ini mengenalkan barang dan harga, perubahan harga, bekerja dan usaha, kebutuhan dan keinginan, menabung, investasi, risiko, dan budget sederhana melalui cerita serta mini-game.</p>
        <p>Halaman ini aman untuk dibagikan dan tidak menampilkan nama, umur, akun, atau progres anak.</p>
        <Link href="/child/select" className={styles.primaryButton}>Pilih profil anak <ArrowRight size={20} weight="bold" aria-hidden /></Link>
      </section>
    </main>
  );
}
