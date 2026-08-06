"use client";

import { useCallback, useMemo, useState } from "react";
import { AirCursor } from "@/components/AirCursor";
import { MotionPad } from "@/components/MotionPad";
import { classifyDigit, verifyExpectedDigit } from "@/lib/engine/digit";
import type { PlayerId, Stroke } from "@/lib/engine/types";
import type { GameModuleProps } from "./types";
import {
  CameraBackdrop,
  FeedbackToast,
  GameHud,
  RoundEndOverlay,
  useRoundTimer
} from "./shared";
import { useProgressSync } from "@/lib/auth/progress";
import airStyles from "./MathWarungAir.module.css";

const PRODUCTS = [
  { id: "susu", name: "Susu", price: 8, emoji: "🥛" },
  { id: "roti", name: "Roti", price: 6, emoji: "🍞" },
  { id: "apel", name: "Apel", price: 4, emoji: "🍎" },
  { id: "pensil", name: "Pensil", price: 3, emoji: "✏️" },
  { id: "buku", name: "Buku", price: 7, emoji: "📘" },
  { id: "air", name: "Air", price: 5, emoji: "💧" }
] as const;

const PRODUCT_BY_ID = new Map(PRODUCTS.map((product) => [product.id, product]));

type Step = "shopping" | "total" | "change" | "result";

function hapticSelection(): void {
  if ("vibrate" in navigator) navigator.vibrate(35);
}

export function MathWarungGame(props: GameModuleProps) {
  const [basket, setBasket] = useState<Record<string, number>>({
    roti: 1,
    susu: 1
  });
  const [step, setStep] = useState<Step>("shopping");
  const [digits, setDigits] = useState<Record<PlayerId, string>>({
    A: "",
    B: ""
  });
  const [score, setScore] = useState<Record<PlayerId, number>>({ A: 0, B: 0 });
  const [message, setMessage] = useState(
    "Pilih barang, lalu lanjutkan ke kasir."
  );
  const [tone, setTone] = useState<"neutral" | "good" | "bad">("neutral");
  const [focusedAirTarget, setFocusedAirTarget] = useState<string | null>(null);
  const timer = useRoundTimer(90);
  const total = PRODUCTS.reduce(
    (sum, product) => sum + product.price * (basket[product.id] ?? 0),
    0
  );
  const paid = Math.ceil((total + 1) / 10) * 10;
  const change = paid - total;
  const expected = step === "total" ? total : change;
  const answer = String(expected);
  const hands = useMemo(
    () => ({
      A: props.snapshot.hands.find((hand) => hand.player === "A"),
      B: props.snapshot.hands.find((hand) => hand.player === "B")
    }),
    [props.snapshot.hands]
  );

  const adjust = useCallback((id: string, delta: number) => {
    setBasket((current) => ({
      ...current,
      [id]: Math.max(0, Math.min(3, (current[id] ?? 0) + delta))
    }));
  }, []);

  const beginCheckout = useCallback(() => {
    if (step !== "shopping" || total <= 0) return;
    setStep("total");
    setTone("neutral");
    setMessage("Tulis total belanja dalam ribuan.");
    setFocusedAirTarget(null);
  }, [step, total]);

  const handleAirSelection = useCallback(
    (targetId: string) => {
      if (step !== "shopping") return;

      if (targetId === "checkout") {
        hapticSelection();
        beginCheckout();
        return;
      }

      if (!targetId.startsWith("product:")) return;
      const productId = targetId.slice("product:".length);
      const product = PRODUCT_BY_ID.get(productId);
      if (!product) return;

      adjust(product.id, 1);
      hapticSelection();
      setTone("good");
      setMessage(
        `${product.name} ditambahkan. Arahkan jari keluar dari card sebelum memilih lagi.`
      );
    },
    [adjust, beginCheckout, step]
  );

  const submitDigit = (player: PlayerId, strokes: Stroke[]) => {
    if (step !== "total" && step !== "change") return;

    const index = digits[player].length;
    const expectedDigit = Number(answer[index]);
    const verified = verifyExpectedDigit(strokes, expectedDigit);
    const classified = classifyDigit(strokes);

    if (!verified.accepted) {
      if (classified.accepted && classified.value !== expectedDigit) {
        setTone("bad");
        setMessage(
          `Player ${player}: terbaca ${classified.value}. Coba hitung lagi.`
        );
        setDigits((current) => ({ ...current, [player]: "" }));
      } else {
        timer.addSeconds(1);
        setTone("neutral");
        setMessage("Tulisan belum jelas. Waktu +1 detik untuk mencoba lagi.");
      }
      return;
    }

    const next = `${digits[player]}${expectedDigit}`;
    setDigits((current) => ({ ...current, [player]: next }));
    if (next.length < answer.length) {
      setTone("good");
      setMessage(`Digit ${expectedDigit} terbaca. Lanjutkan.`);
      return;
    }

    if (Number(next) === expected) {
      setScore((current) => ({
        ...current,
        [player]: current[player] + 100
      }));
      setDigits({ A: "", B: "" });
      setTone("good");
      if (step === "total") {
        setStep("change");
        setMessage(
          `Benar. Pembeli membayar Rp${paid}.000. Berapa kembaliannya?`
        );
      } else {
        setStep("result");
        setMessage(`Transaksi selesai. Kembalian Rp${change}.000.`);
      }
    }
  };

  const keypad = (value: number) => {
    const player: PlayerId = "A";
    const next = `${digits[player]}${value}`;
    setDigits((current) => ({ ...current, A: next }));

    if (next.length < answer.length) return;
    if (Number(next) === expected) {
      setScore((current) => ({ ...current, A: current.A + 100 }));
      setDigits({ A: "", B: "" });
      setTone("good");
      if (step === "total") {
        setStep("change");
        setMessage(`Benar. Pembeli membayar Rp${paid}.000. Hitung kembalian.`);
      } else {
        setStep("result");
        setMessage("Transaksi selesai!");
      }
    } else {
      setDigits({ A: "", B: "" });
      setTone("bad");
      setMessage("Belum tepat. Coba lagi.");
    }
  };

  const resetTransaction = () => {
    setBasket({ roti: 1, susu: 1 });
    setStep("shopping");
    setDigits({ A: "", B: "" });
    setTone("neutral");
    setMessage("Pilih barang untuk transaksi baru.");
  };

  useProgressSync(props.game.slug, Math.max(score.A, score.B));

  const airCursorEnabled =
    props.inputMode === "camera" && step === "shopping" && timer.running;

  return (
    <CameraBackdrop
      inputMode={props.inputMode}
      bindVideo={props.bindVideo}
      snapshot={props.snapshot}
    >
      <GameHud
        title="Math Warung"
        remaining={timer.remaining}
        score={score}
        playerCount={props.playerCount}
        paused={timer.paused}
        onTogglePause={timer.toggle}
      />

      <div className="warung-layout">
        <section className="warung-shop">
          <div className="shop-sign">
            <span>WARUNG MAINLAGI</span>
            <small>Harga dalam ribuan rupiah</small>
          </div>

          {props.inputMode === "camera" && step === "shopping" ? (
            <div className={airStyles.airHint}>
              <span>
                Arahkan telunjuk Player A ke card. Tahan sampai lingkaran hijau
                penuh.
              </span>
              <strong>Tanpa klik</strong>
            </div>
          ) : null}

          <div className="product-grid">
            {PRODUCTS.map((product) => {
              const targetId = `product:${product.id}`;
              return (
                <article
                  key={product.id}
                  className={airStyles.target}
                  data-air-target={step === "shopping" ? targetId : undefined}
                  data-air-disabled={step !== "shopping" ? "true" : undefined}
                  data-air-focused={focusedAirTarget === targetId}
                >
                  <span>{product.emoji}</span>
                  <b>{product.name}</b>
                  <small>Rp{product.price}.000</small>
                  <div>
                    <button
                      type="button"
                      aria-label={`Kurangi ${product.name}`}
                      onClick={() => adjust(product.id, -1)}
                    >
                      −
                    </button>
                    <strong>{basket[product.id] ?? 0}</strong>
                    <button
                      type="button"
                      aria-label={`Tambah ${product.name}`}
                      onClick={() => adjust(product.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="receipt">
            <span>Total sementara</span>
            <strong>Rp{total}.000</strong>
            <button
              className={`button button--primary ${airStyles.checkoutTarget}`}
              type="button"
              disabled={total <= 0 || step !== "shopping"}
              data-air-target={
                total > 0 && step === "shopping" ? "checkout" : undefined
              }
              data-air-focused={focusedAirTarget === "checkout"}
              onClick={beginCheckout}
            >
              Ke kasir
            </button>
          </div>
        </section>

        <section className="warung-counter">
          <div className="transaction-card">
            <small>
              {step === "shopping"
                ? "PILIH BARANG"
                : step === "total"
                  ? "HITUNG TOTAL"
                  : step === "change"
                    ? "HITUNG KEMBALIAN"
                    : "SELESAI"}
            </small>
            <h2>
              {step === "shopping"
                ? "Isi keranjang"
                : step === "total"
                  ? "Total belanja?"
                  : step === "change"
                    ? `Bayar Rp${paid}.000`
                    : "Terima kasih!"}
            </h2>

            {step === "total" || step === "change" ? (
              <>
                <div className="warung-answer">
                  {digits.A || "?"}
                  <span>.000</span>
                </div>
                <div className="number-keypad">
                  {Array.from({ length: 10 }, (_, value) => (
                    <button key={value} onClick={() => keypad(value)}>
                      {value}
                    </button>
                  ))}
                </div>
              </>
            ) : null}

            {step === "result" ? (
              <button
                className="button button--primary"
                onClick={resetTransaction}
              >
                Transaksi baru
              </button>
            ) : null}
          </div>

          {step === "total" || step === "change" ? (
            <div
              className={`warung-pads ${props.playerCount === 1 ? "is-single" : ""}`}
            >
              <MotionPad
                player="A"
                playerCount={props.playerCount}
                hand={hands.A}
                enabled={timer.running}
                label="Tulis angka"
                onSubmit={(strokes) => submitDigit("A", strokes)}
              />
              {props.playerCount === 2 ? (
                <MotionPad
                  player="B"
                  playerCount={props.playerCount}
                  hand={hands.B}
                  enabled={timer.running}
                  label="Tulis angka"
                  onSubmit={(strokes) => submitDigit("B", strokes)}
                />
              ) : null}
            </div>
          ) : null}
        </section>
      </div>

      <AirCursor
        hand={hands.A}
        enabled={airCursorEnabled}
        magneticRadiusPx={112}
        dwellMs={900}
        label="Tahan untuk pilih"
        onFocusChange={setFocusedAirTarget}
        onSelect={handleAirSelection}
      />

      <FeedbackToast message={message} tone={tone} />
      {timer.ended ? (
        <RoundEndOverlay
          score={score}
          playerCount={props.playerCount}
          onReplay={props.onReplay}
          onCalibration={props.onExit}
        />
      ) : null}
    </CameraBackdrop>
  );
}
