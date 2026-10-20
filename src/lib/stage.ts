/**
 * Shared mutable state between the DOM (scroll story, stack index) and the WebGL scene.
 * Plain object + listeners on purpose: pointer/scroll/focus changes must never trigger React re-renders.
 */
export const stage = {
  /** layer currently centred in the scroll story, -1 while in the hero */
  focus: -1,
  /** layer hovered/focused in the stack index, -1 for none */
  hover: -1,
};

type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeStage(cb: Listener) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function setStage(patch: Partial<typeof stage>) {
  let changed = false;
  (Object.keys(patch) as (keyof typeof stage)[]).forEach((k) => {
    if (patch[k] !== undefined && stage[k] !== patch[k]) {
      stage[k] = patch[k] as number;
      changed = true;
    }
  });
  if (changed) listeners.forEach((l) => l());
}
