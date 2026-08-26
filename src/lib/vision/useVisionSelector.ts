"use client";

import { useEffect, useRef, useState } from "react";
import { useLatest } from "@/lib/react/useLatest";
import type {
  VisionRuntime,
  VisionSnapshot,
  TrackedFace,
  TrackedHand
} from "./types";

/**
 * Subscribes to the vision stream and re-renders **only** when the selected
 * value actually changes.
 *
 * The previous design put the whole snapshot in React state, so every one of
 * the ~25 frames per second re-rendered the game tree, and every effect keyed
 * on the snapshot fired again and called `setState` - the loop that produced
 * "Maximum update depth exceeded". Selecting a scalar (a gesture name, a body
 * action, a boolean) turns 25 renders per second into a handful per minute.
 */
export function useVisionValue<T>(
  vision: VisionRuntime,
  select: (snapshot: VisionSnapshot) => T,
  isEqual: (a: T, b: T) => boolean = Object.is
): T {
  const [value, setValue] = useState<T>(() => select(vision.getSnapshot()));
  const valueRef = useRef(value);
  const selectRef = useLatest(select);
  const equalRef = useLatest(isEqual);

  useEffect(() => {
    return vision.subscribe((snapshot) => {
      const next = selectRef.current(snapshot);
      if (equalRef.current(valueRef.current, next)) return;
      valueRef.current = next;
      setValue(next);
    });
  }, [equalRef, selectRef, vision]);

  return value;
}

/**
 * Runs a callback on every published frame without ever touching React state.
 *
 * Use this for canvas drawing and for input handling that keeps its own refs.
 */
export function useVisionFrame(
  vision: VisionRuntime,
  handler: (snapshot: VisionSnapshot) => void
): void {
  const handlerRef = useLatest(handler);

  useEffect(() => {
    return vision.subscribe((snapshot) => handlerRef.current(snapshot));
  }, [handlerRef, vision]);
}

/** The hand currently holding the pen for a player, as a stable-ish value. */
export function findPrimaryHand(
  snapshot: VisionSnapshot,
  player: "A" | "B"
): TrackedHand | undefined {
  return snapshot.hands.find((hand) => hand.player === player && hand.primary);
}

export function findFace(
  snapshot: VisionSnapshot,
  player: "A" | "B"
): TrackedFace | undefined {
  return snapshot.faces.find((item) => item.player === player);
}

/**
 * Gesture of a player's pen hand. A string, so it only re-renders on an actual
 * gesture change rather than on every frame.
 */
export function usePlayerGesture(
  vision: VisionRuntime,
  player: "A" | "B"
): string {
  return useVisionValue(
    vision,
    (snapshot) => findPrimaryHand(snapshot, player)?.gesture ?? "none"
  );
}
