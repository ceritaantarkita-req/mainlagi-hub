"use client";

import { useEffect, useRef, type MutableRefObject } from "react";

/**
 * Keeps a mutable ref pointed at the newest value of a prop.
 *
 * Frame-driven code (canvas painting, camera subscriptions) must not close over
 * props directly, or every prop change would have to tear down and rebuild the
 * subscription. Assigning to a ref *during render* is the obvious shortcut, but
 * it breaks under concurrent rendering and React flags it. Syncing in an effect
 * is the supported form: the ref is correct from the first commit onward, which
 * is the only point at which frame callbacks can run.
 */
export function useLatest<T>(value: T): MutableRefObject<T> {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}
