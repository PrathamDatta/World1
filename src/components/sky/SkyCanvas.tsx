"use client";

import { useEffect, useRef, useState } from "react";
import { setAscent } from "@/lib/ascent";

type NavigatorWithHints = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

/**
 * Fixed full-viewport sky behind the whole homepage. The CSS sky and cloud poster render immediately; the three.js
 * cloud environment is imported lazily once the page is idle and fades in over the poster. If WebGL fails, the poster stays.
 */
export default function SkyCanvas() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"poster" | "live" | "failed">("poster");

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    let dispose: (() => void) | undefined;
    let cancelled = false;
    const nav = navigator as NavigatorWithHints;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lite =
      !!nav.connection?.saveData ||
      (nav.deviceMemory ?? 8) <= 2 ||
      (nav.hardwareConcurrency ?? 8) <= 2 ||
      window.innerWidth < 700;

    const start = async () => {
      try {
        const { createSky } = await import("./sky");
        if (cancelled) return;
        dispose = createSky(canvas, root, { lite, reducedMotion, onLost: () => { setAscent({ gl: false }); setState("failed"); } });
        setAscent({ gl: true });
        setState("live");
      } catch {
        setAscent({ gl: false });
        setState("failed");
      }
    };
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    let timer = 0;
    const kick = () => { timer = window.setTimeout(() => (idle ? idle(start, { timeout: 1200 }) : start()), 250); };
    if (document.readyState === "complete") kick();
    else window.addEventListener("load", kick, { once: true });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener("load", kick);
      dispose?.();
      setAscent({ gl: false });
    };
  }, []);

  return (
    <div className="sky" ref={rootRef} aria-hidden="true" data-state={state}>
      <div className="sky__calm" />
      <div className="sky__alt" />
      <div className="sky__poster">
        <i /><i /><i /><i />
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
}
