"use client";

import { useCallback, useState } from "react";
import { AirCursor } from "@/components/AirCursor";
import { GrabCursor } from "@/components/GrabCursor";
import { playTone, speak } from "@/lib/audio/feedback";
import { buildMoneyChoices, type MoneyChoiceSet } from "@/lib/engine/moneyChoices";
import { createRandom, type RandomSource } from "@/lib/engine/random";
import type { PlayerId } from "@/lib/engine/types";
import type { GameModuleProps } from "./types";
import {
  CameraBackdrop,
  FeedbackToast,
  GameHud,
  usePresence,
  RoundEndOverlay,
  useRoundTimer
} from "./shared";
import { useProgressSync } from "@/lib/auth/progress";

/**
 * Math Warung - a trip to the minimarket, not an abstract sum.
 *
 * A child is handed a fixed amount of money, fills a basket from a shelf of
 * everyday snacks, and at the register has to say what change comes back
 * from the money they were actually given - not from some total the app
 * quietly rounds up for them.
 *
 * Two different touchless gestures are used on purpose, for two different
 * jobs. Shopping is a pick-up-and-carry action, so it uses a real pinch-and-
 * drag (`GrabCursor`): pinch a shelf card, carry it to the basket, let go.
 * The shelf and the basket both live in thin strips at the very top and
 * bottom of the screen so the middle of the frame - where the player's own
 * face is - stays clear the whole time. Once it's time to answer (the total,
 * then the change), the game switches to resting a hand on one of four boxes
 * - the same dwell mechanic as Math Pilih Jawaban - because that is the more
 * reliable gesture for a young child, and answering correctly is the part
 * that should not also be a fine-motor test.
 */

const PRODUCTS = [
  { id: "air", name: "Air Mineral", price: 2, emoji: "💧" },
  { id: "keripik", name: "Snack Keripik", price: 3, emoji: "🍟" },
  { id: "wafer", name: "Wafer", price: 2, emoji: "🧇" },
  { id: "coklat", name: "Coklat", price: 3, emoji: "🍫" },
  { id: "permen", name: "Permen", price: 1, emoji: "🍬" },
  { id: "susu", name: "Susu Kotak", price: 4, emoji: "🥛" },
  { id: "roti", name: "Roti", price: 3, emoji: "🍞" },
  { id: "eskrim", name: "Es Krim", price: 5, emoji: "🍦" }
] as const;

type Product = (typeof PRODUCTS)[number];
const PRODUCT_BY_ID = new Map<string, Product>(
  PRODUCTS.map((product) => [product.id, product] as const)
);

/** Budgets a round can hand out, in thousands of rupiah. */
const BUDGETS = [5, 10, 15, 20] as const;

type Step = "shopping" | "total" | "change";

function hapticSelection(): void {
  if ("vibrate" in navigator) navigator.vibrate(35);
}

/** The specific ways a child miscounts a cart, as answer choices. */
function totalMistakes(basket: Record<string, number>, total: number): number[] {
  const mistakes: number[] = [];
  for (const product of PRODUCTS) {
    const qty = basket[product.id] ?? 0;
    if (qty <= 0) continue;
    mistakes.push(total - product.price); // forgot one unit of this item
    mistakes.push(total + product.price); // counted one unit twice
  }
  mistakes.push(total + 1, total - 1, total + 2, total - 2);
  return mistakes;
}

/** The specific ways a child gets change wrong, as answer choices. */
function changeMistakes(budget: number, total: number, change: number): number[] {
  return [
    total, // forgot to subtract at all - answered with what they spent
    budget, // forgot spending happened - answered with the whole budget
    budget + total, // added instead of subtracting
    total - budget, // subtracted the wrong way round
    change + 1,
    change - 1,
    change + 2,
    change - 2
  ];
}

export function MathWarungGame(props: GameModuleProps) {
  const [random] = useState<RandomSource>(() =>
    createRandom(Math.floor(Math.random() * 0x7fffffff) + 1)
  );
  const [budget, setBudget] = useState<number>(() => random.pick(BUDGETS));
  const [basket, setBasket] = useState<Record<string, number>>({});
  const [step, setStep] = useState<Step>("shopping");
  const [transitioning, setTransitioning] = useState(false);
  const [totalChoices, setTotalChoices] = useState<Record<PlayerId, MoneyChoiceSet> | null>(
    null
  );
  const [changeChoices, setChangeChoices] = useState<Record<PlayerId, MoneyChoiceSet> | null>(
    null
  );
  const [score, setScore] = useState<Record<PlayerId, number>>({ A: 0, B: 0 });
  const [ruledOut, setRuledOut] = useState<Record<PlayerId, number[]>>({ A: [], B: [] });
  const [locked, setLocked] = useState<Record<PlayerId, boolean>>({ A: false, B: false });
  const [focused, setFocused] = useState<Record<PlayerId, string | null>>({ A: null, B: null });
  const [message, setMessage] = useState(
    "Uang belanjamu sudah siap. Jepit barang, lalu geser ke keranjang!"
  );
  const [tone, setTone] = useState<"neutral" | "good" | "bad">("neutral");
  const [focusedAirTarget, setFocusedAirTarget] = useState<string | null>(null);
  const [grabbedId, setGrabbedId] = useState<string | null>(null);
  const [armedA, setArmedA] = useState(false);
  const [armedB, setArmedB] = useState(false);
  const cartArmed = armedA || armedB;

  const present = usePresence(props.vision, props.inputMode);
  const timer = useRoundTimer(90, {
    mode: props.sessionMode,
    presence: present
  });

  const total = PRODUCTS.reduce(
    (sum, product) => sum + product.price * (basket[product.id] ?? 0),
    0
  );
  const change = budget - total;
  const cartEntries = Object.entries(basket).filter(([, qty]) => qty > 0);
  const cartCount = cartEntries.reduce((sum, [, qty]) => sum + qty, 0);

  const adjust = useCallback((id: string, delta: number) => {
    setBasket((current) => ({
      ...current,
      [id]: Math.max(0, Math.min(3, (current[id] ?? 0) + delta))
    }));
  }, []);

  const startNewTransaction = useCallback(() => {
    setBudget(random.pick(BUDGETS));
    setBasket({});
    setStep("shopping");
    setTotalChoices(null);
    setChangeChoices(null);
    setRuledOut({ A: [], B: [] });
    setLocked({ A: false, B: false });
    setTone("neutral");
    setMessage("Uang belanja baru sudah siap. Yuk belanja lagi!");
  }, [random]);

  const beginCheckout = useCallback(() => {
    if (step !== "shopping" || total <= 0) return;

    if (total > budget) {
      hapticSelection();
      setTone("bad");
      setMessage(
        `Uangmu cuma Rp${budget}.000, belanjaanmu Rp${total}.000. Kurangin dulu ya!`
      );
      return;
    }

    const mistakes = totalMistakes(basket, total);
    setTotalChoices({
      A: buildMoneyChoices(random, total, mistakes),
      B: buildMoneyChoices(random, total, mistakes)
    });
    setStep("total");
    setRuledOut({ A: [], B: [] });
    setLocked({ A: false, B: false });
    setTone("neutral");
    setMessage("Berapa total belanjamu?");
    setFocusedAirTarget(null);
  }, [basket, budget, random, step, total]);

  const handleAirSelection = useCallback(
    (targetId: string) => {
      if (targetId === "checkout") {
        hapticSelection();
        beginCheckout();
      }
    },
    [beginCheckout]
  );

  const handleGrabPickUp = useCallback((sourceId: string) => {
    setGrabbedId(sourceId);
  }, []);

  const handleGrabDrop = useCallback(
    (sourceId: string, targetId: string) => {
      setGrabbedId(null);
      if (step !== "shopping" || targetId !== "cart") return;
      const product = PRODUCT_BY_ID.get(sourceId);
      if (!product) return;

      const current = basket[product.id] ?? 0;
      if (current >= 3) {
        setTone("bad");
        setMessage(`${product.name} udah maksimal 3 di keranjang.`);
        return;
      }

      adjust(product.id, 1);
      hapticSelection();
      setTone("good");
      setMessage(`${product.name} masuk keranjang!`);
    },
    [adjust, basket, step]
  );

  const handleGrabCancel = useCallback(() => {
    setGrabbedId(null);
  }, []);

  const choose = useCallback(
    (player: PlayerId, value: number) => {
      if (!timer.running || transitioning) return;
      if (step !== "total" && step !== "change") return;
      if (locked[player]) return;
      if (ruledOut[player].includes(value)) return;

      const correctValue = step === "total" ? total : change;

      if (value !== correctValue) {
        playTone("wrong");
        setRuledOut((current) => ({
          ...current,
          [player]: [...current[player], value]
        }));
        setTone("bad");
        setMessage(`Pemain ${player}: Rp${value}.000 belum tepat. Coba lagi.`);
        return;
      }

      playTone("correct");
      speak(`Benar. Rp${correctValue} ribu`);
      setTransitioning(true);
      setLocked({ A: true, B: true });
      const cleanBonus = ruledOut[player].length === 0 ? 40 : 0;
      setScore((current) => ({
        ...current,
        [player]: current[player] + 100 + cleanBonus
      }));
      setTone("good");

      if (step === "total") {
        setMessage(
          `Pemain ${player} benar! Total Rp${total}.000. Sekarang hitung kembaliannya.`
        );
        window.setTimeout(() => {
          const mistakes = changeMistakes(budget, total, change);
          setChangeChoices({
            A: buildMoneyChoices(random, change, mistakes),
            B: buildMoneyChoices(random, change, mistakes)
          });
          setStep("change");
          setRuledOut({ A: [], B: [] });
          setLocked({ A: false, B: false });
          setTransitioning(false);
          setTone("neutral");
          setMessage(`Kembaliannya berapa dari Rp${budget}.000?`);
        }, 900);
      } else {
        setMessage(`Pemain ${player} benar! Kembaliannya Rp${change}.000.`);
        window.setTimeout(() => {
          startNewTransaction();
          setTransitioning(false);
        }, 1400);
      }
    },
    [
      budget,
      change,
      locked,
      random,
      ruledOut,
      startNewTransaction,
      step,
      timer.running,
      total,
      transitioning
    ]
  );

  const handleMoneyAirSelect = (player: PlayerId) => (targetId: string) => {
    const raw = targetId.split("-").pop();
    const value = Number(raw);
    if (Number.isFinite(value)) choose(player, value);
  };

  useProgressSync(props.game.slug, Math.max(score.A, score.B));

  const grabEnabled =
    props.inputMode === "camera" && step === "shopping" && timer.running;
  const checkoutAirEnabled =
    props.inputMode === "camera" && step === "shopping" && timer.running;

  const renderMoneyBoard = (player: PlayerId) => {
    const activeChoices = step === "total" ? totalChoices?.[player] : changeChoices?.[player];
    if (!activeChoices) return null;

    const correctValue = step === "total" ? total : change;
    const out = ruledOut[player];
    const isLocked = locked[player];

    return (
      <div className="choice-column" key={player}>
        <div className="question-card" data-player={player}>
          <small>
            {step === "total" ? "HITUNG TOTAL • RIBUAN RUPIAH" : "HITUNG KEMBALIAN • RIBUAN RUPIAH"}
          </small>
          <strong>{step === "total" ? "Total belanjamu?" : "Kembaliannya berapa?"}</strong>
          <span>
            {step === "total"
              ? `Uang belanja Rp${budget}.000`
              : `Bayar Rp${budget}.000 untuk belanjaan Rp${total}.000`}
          </span>
        </div>

        <div className="choice-grid" role="group" aria-label="Pilihan jawaban">
          {activeChoices.options.map((value) => {
            const id = `opt-${player}-${value}`;
            const dead = out.includes(value);
            const correct = isLocked && value === correctValue;
            return (
              <button
                key={value}
                type="button"
                className={`choice-box ${dead ? "is-out" : ""} ${
                  correct ? "is-correct" : ""
                } ${focused[player] === id ? "is-focused" : ""}`}
                data-player={player}
                data-air-target={id}
                data-air-disabled={dead || isLocked ? "true" : undefined}
                disabled={dead || isLocked}
                onClick={() => choose(player, value)}
              >
                {value}
              </button>
            );
          })}
        </div>

        <span className="choice-hint">
          {props.inputMode === "camera"
            ? "Arahkan tangan ke kotak, tahan sampai lingkarannya penuh"
            : "Klik kotak jawaban"}
        </span>
      </div>
    );
  };

  return (
    <CameraBackdrop inputMode={props.inputMode} vision={props.vision}>
      <GameHud
        title="Math Warung"
        remaining={timer.remaining}
        timed={timer.timed}
        score={score}
        playerCount={props.playerCount}
        paused={timer.paused}
        awayPaused={timer.awayPaused}
        onTogglePause={timer.timed ? timer.toggle : undefined}
      />

      {step === "shopping" ? (
        <>
          <div className="warung-topbar">
            <div className="warung-budget-pill">
              <span>Uang belanja</span>
              <strong>Rp{budget}.000</strong>
            </div>
          </div>

          <div
            className={`warung-cart-panel ${cartArmed ? "is-armed" : ""}`}
            data-grab-target="cart"
          >
            <span className="warung-cart-panel__icon" aria-hidden>
              🛒
            </span>
            <strong className="warung-cart-panel__label">Keranjang</strong>
            <strong className="warung-cart-panel__total">Rp{total}.000</strong>
            <span className="warung-cart-panel__count">{cartCount} barang</span>

            <div className="warung-cart-panel__items">
              {cartEntries.length > 0 ? (
                cartEntries.map(([id, qty]) => {
                  const product = PRODUCT_BY_ID.get(id);
                  if (!product) return null;
                  return (
                    <button
                      key={id}
                      type="button"
                      className="warung-cart-chip"
                      onClick={() => adjust(id, -1)}
                      aria-label={`Keluarkan satu ${product.name}`}
                    >
                      {product.emoji} ×{qty}
                    </button>
                  );
                })
              ) : (
                <span className="warung-cart-panel__empty">
                  {props.inputMode === "camera"
                    ? "Jepit barang, seret ke sini"
                    : "Klik barang buat masukin"}
                </span>
              )}
            </div>

            <button
              className="warung-checkout-pill"
              type="button"
              disabled={total <= 0}
              data-air-target={total > 0 ? "checkout" : undefined}
              data-air-focused={focusedAirTarget === "checkout"}
              onClick={beginCheckout}
            >
              Ke kasir
            </button>
          </div>

          <div className="warung-shelf">
            {PRODUCTS.map((product) => {
              const qty = basket[product.id] ?? 0;
              return (
                <article
                  key={product.id}
                  className={`warung-shelf-card ${
                    grabbedId === product.id ? "is-carried" : ""
                  }`}
                  data-grab-source={product.id}
                  data-grab-emoji={product.emoji}
                  onClick={
                    props.inputMode === "camera"
                      ? undefined
                      : () => handleGrabDrop(product.id, "cart")
                  }
                  role={props.inputMode === "camera" ? undefined : "button"}
                >
                  <span className="warung-shelf-card__emoji">{product.emoji}</span>
                  <b>{product.name}</b>
                  <small>Rp{product.price}.000</small>
                  {qty > 0 ? <em className="warung-shelf-card__qty">×{qty}</em> : null}
                </article>
              );
            })}
          </div>
        </>
      ) : (
        <div
          className={`choice-grid-layout ${
            props.playerCount === 1 ? "is-single" : ""
          }`}
        >
          {renderMoneyBoard("A")}
          {props.playerCount === 2 ? renderMoneyBoard("B") : null}
        </div>
      )}

      <AirCursor
        vision={props.vision}
        enabled={checkoutAirEnabled}
        targetSelector='[data-air-target="checkout"]'
        magneticRadiusPx={96}
        dwellMs={900}
        label="Tahan untuk ke kasir"
        onFocusChange={(id) => setFocusedAirTarget(id)}
        onSelect={handleAirSelection}
      />

      <GrabCursor
        vision={props.vision}
        player="A"
        enabled={grabEnabled}
        onPickUp={handleGrabPickUp}
        onDrop={handleGrabDrop}
        onCancel={handleGrabCancel}
        onArmedChange={(id) => setArmedA(id === "cart")}
      />
      {grabEnabled && props.playerCount === 2 ? (
        <GrabCursor
          vision={props.vision}
          player="B"
          enabled={grabEnabled}
          onPickUp={handleGrabPickUp}
          onDrop={handleGrabDrop}
          onCancel={handleGrabCancel}
          onArmedChange={(id) => setArmedB(id === "cart")}
        />
      ) : null}

      {props.inputMode === "camera" && (step === "total" || step === "change") ? (
        <>
          <AirCursor
            vision={props.vision}
            player="A"
            enabled={timer.running && !locked.A}
            targetSelector='[data-air-target^="opt-A-"]'
            dwellMs={850}
            label="Tahan untuk memilih"
            onFocusChange={(id) =>
              setFocused((current) =>
                current.A === id ? current : { ...current, A: id }
              )
            }
            onSelect={handleMoneyAirSelect("A")}
          />
          {props.playerCount === 2 ? (
            <AirCursor
              vision={props.vision}
              player="B"
              enabled={timer.running && !locked.B}
              targetSelector='[data-air-target^="opt-B-"]'
              dwellMs={850}
              label="Tahan untuk memilih"
              onFocusChange={(id) =>
                setFocused((current) =>
                  current.B === id ? current : { ...current, B: id }
                )
              }
              onSelect={handleMoneyAirSelect("B")}
            />
          ) : null}
        </>
      ) : null}

      <FeedbackToast message={message} tone={tone} />
      {timer.ended ? (
        <RoundEndOverlay
          score={score}
          playerCount={props.playerCount}
          onReplay={props.onReplay}
          onCalibration={props.onExit}
          game={props.game.slug}
        />
      ) : null}
    </CameraBackdrop>
  );
}
