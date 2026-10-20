"use client";

import { useEffect, useRef, useState } from "react";
import StackGlyph from "./StackGlyph";

type NavigatorWithHints = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

export default function StageCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"poster" | "live" | "failed">("poster");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let dispose: (() => void) | undefined;
    let cancelled = false;
    const nav = navigator as NavigatorWithHints;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lite =
      !!nav.connection?.saveData ||
      (nav.hardwareConcurrency ?? 8) <= 2 ||
      (nav.deviceMemory ?? 8) <= 2 ||
      window.innerWidth < 700;

    const start = async () => {
      try {
        const { createStage } = await import("./scene");
        if (cancelled) return;
        dispose = createStage(canvas, { lite, reducedMotion, onLost: () => setState("failed") });
        setState("live");
      } catch {
        setState("failed");
      }
    };
    // Keep the three.js bundle and shader compilation off the critical path: wait until the headline has
    // painted (the SVG poster covers the gap), then start when the main thread is idle.
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    let timer = 0;
    const kick = () => {
      timer = window.setTimeout(() => (idle ? idle(start, { timeout: 1500 }) : start()), 1200);
    };
    if (document.readyState === "complete") kick();
    else window.addEventListener("load", kick, { once: true });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener("load", kick);
      dispose?.();
    };
  }, []);

  return (
    <div className="stage__canvas" aria-hidden="true" data-state={state}>
      <StackGlyph className="stage__poster" />
      <canvas ref={canvasRef} />
    </div>
  );
}
