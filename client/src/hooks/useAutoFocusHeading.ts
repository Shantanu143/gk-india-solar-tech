import { useEffect, useRef } from "react";

/** Moves focus to a step's heading when it mounts, so screen reader users land on the new step. */
export function useAutoFocusHeading<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return ref;
}
