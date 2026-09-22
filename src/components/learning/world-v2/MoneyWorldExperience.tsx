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
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent
} from "react";
import { CharacterAvatar, useLearningProfile } from "@/components/learning/LearningCommon";
import { audioStatus, playTone, speakPrompt, unlockAudio, warmAudio, type SpeechStartStatus } from "@/lib/audio/feedback";
import {
  MONEY_WORLD_ID,
  MONEY_WORLD_STAGES,
  getMoneyWorldSegments,
  getMoneyWorldStage,
  nextMoneyWorldStage,
  type MoneyWorldActivityPlacement
} from "@/lib/learning/world/moneyWorld";
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

const WORLD_STAGE_AMBIENCE: Record<number, string[]> = {
  1: ["🏠", "🎈", "🧃"],
  2: ["🏪", "🤖", "🏷️"],
  3: ["🥖", "🌱", "🚲"],
  4: ["🛒", "💧", "🍎"],
  5: ["🌳", "🐷", "🎯"],
  6: ["🌱", "↗️", "🪙"],
  7: ["🌉", "⬆️", "⬇️"],
  8: ["🎪", "🎀", "🎉"]
};

function StageAmbience({ stageOrder }: { stageOrder: number }) {
  const props = WORLD_STAGE_AMBIENCE[stageOrder] ?? [];
  return (
    <div className={styles.sceneDecor} aria-hidden>
      {props.map((item, index) => (
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

function WorldHero({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cx(styles.worldHero, compact && styles.worldHeroCompact)}>
      <div className={styles.worldHeroCopy}>
        <span className={styles.eyebrow}>Mainlagi World</span>
        <h1>Petualangan Uang</h1>
        <p>Bantu Gian dan Naya menyiapkan Festival Mainlagi!</p>
      </div>
      <div className={styles.heroCharacters} aria-label="Gian, Naya, Paca, dan Gavi">
        <CharacterAvatar id="gian" large />
        <CharacterAvatar id="naya" large />
        <CharacterAvatar id="paca" />
        <CharacterAvatar id="gavi" />
      </div>
    </div>
  );
}

export function WorldCatalogScreen({ childId }: { childId: string }) {
  const profile = useLearningProfile(childId);
  const state = useMoneyWorldProgress(childId);
  const age = profile?.age;
  const completed = state.progress.completedStageIds.length;
  const cardHref = "/child/" + childId + "/world/" + MONEY_WORLD_ID;

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
          <span>Usia rekomendasi 6–8</span>
          <span>{state.ready ? String(completed) + "/8 Stage selesai" : "Memuat progres…"}</span>
          <strong>{age && (age < 6 || age > 8) ? "Bisa dijelajahi →" : "Mulai petualangan →"}</strong>
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
      <WorldHero />
      <div className={styles.mapTopline}>
        <Link href={worldsHref} className={styles.textButton}>← Semua World</Link>
        <span>{state.ready ? String(state.progress.completedStageIds.length) + "/8 Stage" : "Memuat…"}</span>
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
            <small>Semua 8 Stage sudah selesai.</small>
          </div>
        ) : null}
        {MONEY_WORLD_STAGES.map((stage, index) => {
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
            <div
              key={stage.id}
              className={cx(styles.stageRow, rowClass)}
              data-stage-order={stage.order}
              data-world-stage-id={stage.id}
            >
              {unlocked ? (
                <Link href={mapBase + "/stage/" + stage.id} className={styles.stageLink}>{node}</Link>
              ) : (
                <div className={styles.stageLink} aria-disabled="true">{node}</div>
              )}
            </div>
          );
        })}
      </section>
    </main>
  );
}

function SpeechCard({
  speaker,
  text,
  kind,
  onNext,
  nextLabel
}: {
  speaker: "Gian" | "Naya";
  text: string;
  kind: "narrative" | "concept" | "payoff";
  onNext: () => void;
  nextLabel: string;
}) {
  const [speechStatus, setSpeechStatus] = useState<SpeechStartStatus | null>(null);
  const autoAttemptedRef = useRef(false);

  useEffect(() => {
    autoAttemptedRef.current = false;
    setSpeechStatus(null);
    let cancelled = false;

    const startNarration = () => {
      if (cancelled || autoAttemptedRef.current || !audioStatus().unlocked || audioStatus().muted) return;
      autoAttemptedRef.current = true;
      setSpeechStatus(speakPrompt(text, {
        lang: "id-ID",
        key: "world-narration:" + text,
        interrupt: true
      }));
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
    };
  }, [text]);

  const hear = () => {
    autoAttemptedRef.current = true;
    unlockAudio("id-ID");
    setSpeechStatus(speakPrompt(text, {
      lang: "id-ID",
      key: "world-replay:" + text,
      interrupt: true,
      dedupeMs: 0
    }));
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
    <section className={cx(styles.storyScene, kind === "concept" && styles.conceptScene)}>
      <div className={styles.storyCharacter}>
        <CharacterAvatar id={speaker === "Naya" ? "naya" : "gian"} large />
        <strong>{speaker}</strong>
      </div>
      <div className={styles.speechBubble}>
        <span className={styles.sceneType}>{kind === "concept" ? "Temukan idenya" : kind === "payoff" ? "Cerita berlanjut" : "Cerita"}</span>
        <p>{text}</p>
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

  if (!validation.valid) return <div className={styles.runtimeError}>Payload drag tidak valid.</div>;

  const place = (itemId: string, targetId: string) => {
    if (matched.includes(itemId)) return;
    if (assignments[itemId] !== targetId) {
      const nextWrong = incorrectCount + 1;
      setIncorrectCount(nextWrong);
      setMessage(nextWrong >= 2 ? "Lihat angka uang dan angka pada label harga." : "Belum cocok. Coba target lain.");
      playTone("wrong");
      return;
    }
    const next = [...matched, itemId];
    setMatched(next);
    setSelected(null);
    playTone("correct");
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
      <div className={styles.activityHeading}>
        <span className={styles.sceneType}>Mini-game</span>
        <h2>{placement.payload.prompt}</h2>
        <p>Sentuh uang lalu sentuh barang. Di desktop, kartu juga bisa diseret.</p>
      </div>
      <div className={styles.dragBoard}>
        <div className={styles.sourceColumn}>
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
        <div className={styles.targetColumn}>
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

  if (!validation.valid) return <div className={styles.runtimeError}>Payload matching tidak valid.</div>;

  const chooseRight = (pairId: string) => {
    if (!selectedPairId || matched.includes(pairId)) return;
    if (selectedPairId !== pairId) {
      const nextWrong = incorrectCount + 1;
      setIncorrectCount(nextWrong);
      setSelectedPairId(null);
      setMessage(nextWrong >= 2 ? "Ingat harga yang tadi kamu lihat." : "Belum cocok. Coba pasangan lain.");
      playTone("wrong");
      return;
    }
    const next = [...matched, pairId];
    setMatched(next);
    setSelectedPairId(null);
    playTone("correct");
    if (next.length === pairs.length) {
      setMessage("Semua pasangan cocok!");
      window.setTimeout(onComplete, 450);
    } else {
      setMessage("Cocok! Cari pasangan berikutnya.");
    }
  };

  return (
    <section className={styles.activityScene}>
      <div className={styles.activityHeading}>
        <span className={styles.sceneType}>Mini-game</span>
        <h2>{placement.payload.prompt}</h2>
        <p>Pasangkan kartu di kiri dengan pasangannya di kanan.</p>
      </div>
      <div className={styles.matchBoard}>
        <div className={styles.matchColumn}>
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
        <div className={styles.matchColumn}>
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

  if (!validation.valid) return <div className={styles.runtimeError}>Payload compare tidak valid.</div>;

  const choose = (optionId: string) => {
    if (optionId !== correctOptionId) {
      const nextWrong = incorrectCount + 1;
      setIncorrectCount(nextWrong);
      setSelected(optionId);
      setMessage(nextWrong >= 2 ? "Bandingkan angkanya: sepuluh dan dua belas." : "Belum tepat. Coba bandingkan lagi.");
      playTone("wrong");
      return;
    }
    setSelected(optionId);
    setMessage("Betul. Dua belas lebih mahal daripada sepuluh.");
    playTone("correct");
    window.setTimeout(onComplete, 450);
  };

  return (
    <section className={styles.activityScene}>
      <div className={styles.activityHeading}>
        <span className={styles.sceneType}>Mini-game</span>
        <h2>{placement.payload.prompt}</h2>
        <p>Lihat harga kemarin dan harga sekarang.</p>
      </div>
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

  if (!validation.valid) return <div className={styles.runtimeError}>Payload sort tidak valid.</div>;

  const place = (groupId: string) => {
    if (!selected) return;
    if (assignments[selected] !== groupId) {
      const nextWrong = incorrectCount + 1;
      setIncorrectCount(nextWrong);
      setMessage(nextWrong >= 2 ? "Perhatikan contoh dan nama kelompoknya." : "Belum tepat. Coba kelompok satunya.");
      playTone("wrong");
      return;
    }

    const next = { ...placed, [selected]: groupId };
    setPlaced(next);
    setSelected(null);
    playTone("correct");
    if (Object.keys(next).length === items.length) {
      setMessage("Semua kartu sudah dikelompokkan.");
      window.setTimeout(onComplete, 450);
    } else {
      setMessage("Cocok. Pilih kartu berikutnya.");
    }
  };

  return (
    <section className={styles.activityScene}>
      <div className={styles.activityHeading}>
        <span className={styles.sceneType}>Mini-game</span>
        <h2>{placement.payload.prompt}</h2>
        <p>Pilih satu perubahan harga, lalu masukkan ke kelompok yang sesuai.</p>
      </div>

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
  onComplete: () => void;
}) {
  const validation = validateReusableMechanicPayload("tap_choice", placement.payload);
  const options = placement.payload.options ?? [];
  const correctOptionId = placement.payload.correctOptionId ?? "";
  const [selected, setSelected] = useState<string | null>(null);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [message, setMessage] = useState("Pilih jawaban yang paling cocok.");

  if (!validation.valid) return <div className={styles.runtimeError}>Payload pilihan tidak valid.</div>;

  const choose = (optionId: string) => {
    setSelected(optionId);
    if (optionId !== correctOptionId) {
      const nextWrong = incorrectCount + 1;
      setIncorrectCount(nextWrong);
      setMessage(nextWrong >= 2 ? "Dengarkan pertanyaannya lagi, lalu lihat semua pilihan." : "Belum tepat. Coba pilihan lain.");
      playTone("wrong");
      return;
    }
    setMessage("Betul!");
    playTone("correct");
    window.setTimeout(onComplete, 450);
  };

  const takeAway = placement.presentation?.kind === "take_away";
  const startCount = placement.presentation?.startCount ?? 0;
  const removeCount = placement.presentation?.removeCount ?? 0;

  return (
    <section className={styles.activityScene}>
      <div className={styles.activityHeading}>
        <span className={styles.sceneType}>Mini-game</span>
        <h2>{placement.payload.prompt}</h2>
        <p>Pilih satu jawaban.</p>
      </div>

      {takeAway ? (
        <div className={styles.tokenBoard} aria-label={startCount + " token, " + removeCount + " dipakai"}>
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

  if (!validation.valid) return <div className={styles.runtimeError}>Payload urutan tidak valid.</div>;

  const add = (itemId: string) => {
    if (order.includes(itemId)) return;
    setOrder([...order, itemId]);
    setMessage("Bagus. Pilih langkah berikutnya.");
  };

  const reset = () => {
    setOrder([]);
    setMessage("Mulai lagi dari langkah pertama.");
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
      return;
    }
    setMessage("Urutannya tepat!");
    playTone("correct");
    window.setTimeout(onComplete, 450);
  };

  const orderedItems = order.map((id) => items.find((item) => item.id === id)).filter(Boolean);
  const remaining = items.filter((item) => !order.includes(item.id));

  return (
    <section className={styles.activityScene}>
      <div className={styles.activityHeading}>
        <span className={styles.sceneType}>Mini-game</span>
        <h2>{placement.payload.prompt}</h2>
        <p>Sentuh kartu dari langkah pertama sampai terakhir.</p>
      </div>

      <div className={styles.orderSlots} aria-label="Urutan yang dipilih">
        {items.map((_, index) => (
          <div key={index} className={styles.orderSlot}>
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
  prompt,
  options,
  onNext
}: {
  prompt: string;
  options: Array<{ id: string; label: string; reaction: string }>;
  onNext: () => void;
}) {
  const [choiceId, setChoiceId] = useState<string | null>(null);
  const selected = options.find((option) => option.id === choiceId);

  return (
    <section className={styles.activityScene}>
      <div className={styles.activityHeading}>
        <span className={styles.sceneType}>Pilihanmu</span>
        <h2>{prompt}</h2>
        <p>Tidak ada jawaban salah di bagian ini. Pilih yang kamu mau.</p>
      </div>
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
          <p>{selected.reaction}</p>
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
      <div className={styles.recapGrid} aria-label="Ringkasan Petualangan Uang">
        {items.map((item) => (
          <div key={item.id} className={styles.recapCard}>
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

function WorldActivity({ placement, onComplete }: { placement: MoneyWorldActivityPlacement; onComplete: () => void }) {
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
  const [shareGate, setShareGate] = useState<"idle" | "checking" | "allowed" | "denied">("idle");
  const [copyStatus, setCopyStatus] = useState("");
  const next = nextMoneyWorldStage(stageId);
  const stage = getMoneyWorldStage(stageId);
  const mapHref = "/child/" + childId + "/world/" + MONEY_WORLD_ID;
  const nextHref = next ? mapHref + "/stage/" + next.id : mapHref;
  const praiseByStage = ["Awesome!", "Hebat!", "Good job!", "Excellent!", "Keren!", "Bagus sekali!", "Mantap!", "Luar biasa!"];
  const praise = stage ? praiseByStage[Math.max(0, Math.min(praiseByStage.length - 1, stage.order - 1))] : "Awesome!";
  const finalStage = stage?.order === MONEY_WORLD_STAGES.length;
  const chapterOneComplete = stage?.order === 4;
  const shareText = finalStage
    ? "⭐⭐⭐ Petualangan Uang selesai. Festival Mainlagi siap!"
    : "⭐⭐⭐ Stage “" + (stage?.title ?? "Petualangan Uang") + "” selesai di Mainlagi!";

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

  return (
    <section className={styles.completion} aria-labelledby="world-stage-complete-title">
      <div className={styles.completionCard}>
        <span className={styles.eyebrow}>Stage selesai</span>
        <h2 id="world-stage-complete-title">{praise}</h2>
        <div className={styles.completionStars} aria-label="Tiga bintang">
          {[0, 1, 2].map((index) => (
            <Star key={index} size={58} weight="fill" aria-hidden style={{ animationDelay: String(index * 140) + "ms" }} />
          ))}
        </div>
        {chapterOneComplete ? (
          <div className={styles.chapterReward}>
            <span aria-hidden>🏅</span>
            <div>
              <strong>Chapter 1 selesai</strong>
              <small>Pilih Pintar</small>
            </div>
          </div>
        ) : null}
        <p>{finalStage ? "Petualangan Uang selesai. Festival Mainlagi siap!" : stage?.title + " selesai. Stage berikutnya sekarang terbuka."}</p>
        <div className={styles.completionActions}>
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
    setHydrated(true);
  };

  if (!stage || !segments.length) return <div className={styles.runtimeError}>Stage belum memiliki segment runtime.</div>;
  if (!state.ready || !state.settled || !hydrated) return <div className={styles.stageLoading}>Menyiapkan petualangan…</div>;
  if (completed) return <WorldStageCompletion childId={childId} stageId={stageId} onAgain={again} />;

  const segment = segments[segmentIndex];
  const percent = ((segmentIndex + 1) / segments.length) * 100;

  return (
    <div className={styles.stageRuntime} data-stage-order={stage.order} data-world-scene={stage.order}>
      <div className={styles.stageProgressBar} aria-label={"Bagian " + (segmentIndex + 1) + " dari " + segments.length}>
        <span style={{ width: String(percent) + "%" }} />
      </div>
      <div className={styles.stageRuntimeTop}>
        <Link href={"/child/" + childId + "/world/" + MONEY_WORLD_ID} className={styles.roundBack} aria-label="Kembali ke peta">
          <ArrowLeft size={24} weight="bold" aria-hidden />
        </Link>
        <div>
          <small>{"Stage " + stage.order}</small>
          <strong>{stage.title}</strong>
          <span className={styles.locationPill}>{stage.locationLabel}</span>
        </div>
        <span className={styles.stageCount}>{String(segmentIndex + 1) + "/" + segments.length}</span>
      </div>

      <StageAmbience stageOrder={stage.order} />

      {segment.type === "activity" ? (
        <WorldActivity placement={segment.activity} onComplete={advance} />
      ) : segment.type === "narrative_choice" ? (
        <NarrativeChoiceCard prompt={segment.prompt} options={segment.options} onNext={advance} />
      ) : segment.type === "recap" ? (
        <WorldRecapCard title={segment.title} items={segment.items} onNext={advance} />
      ) : (
        <SpeechCard
          speaker={segment.speaker}
          text={segment.text}
          kind={segment.type}
          onNext={advance}
          nextLabel={segmentIndex === lastIndex ? "Selesai" : "Lanjut"}
        />
      )}
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
        <span className={styles.eyebrow}>Petualangan belajar · Usia rekomendasi 6–8</span>
        <h2>Bantu siapkan Festival Mainlagi</h2>
        <p>World ini mengenalkan barang dan harga, perubahan harga, bekerja dan usaha, kebutuhan dan keinginan, menabung, investasi, risiko, dan budget sederhana melalui cerita serta mini-game.</p>
        <p>Halaman ini aman untuk dibagikan dan tidak menampilkan nama, umur, akun, atau progres anak.</p>
        <Link href="/child/select" className={styles.primaryButton}>Pilih profil anak <ArrowRight size={20} weight="bold" aria-hidden /></Link>
      </section>
    </main>
  );
}
