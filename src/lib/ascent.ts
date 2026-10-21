/**
 * Shared state between the cloud scene (which owns the scroll maths) and the service tour's DOM.
 * A plain object + listeners on purpose: scroll must never trigger React renders; only a change of
 * mode or active layer notifies, so the text swaps once per layer, not once per frame.
 */
export const ascent = {
  /** "tour": camera climbs through the seven cloud layers while the section is pinned (sticky). "static": plain list. */
  mode: "static" as "static" | "tour",
  /** the WebGL sky is running */
  gl: false,
  /** layer index (0 = Cloud, bottom) currently in focus */
  active: 0,
};

type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeAscent(cb: Listener) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function setAscent(patch: Partial<typeof ascent>) {
  let changed = false;
  (Object.keys(patch) as (keyof typeof ascent)[]).forEach((k) => {
    if (patch[k] !== undefined && ascent[k] !== patch[k]) {
      (ascent as Record<string, unknown>)[k] = patch[k];
      changed = true;
    }
  });
  if (changed) listeners.forEach((l) => l());
}
