"use client";

import { useEffect, useRef, useState } from "react";

type NavigatorWithHints = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

/** CSS/SVG poster first; the three.js scene is imported lazily once the page is idle, then fades in over it. */
export default function CloudCanvas() {
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
        const { createCloud } = await import("./cloud");
        if (cancelled) return;
        dispose = createCloud(canvas, { lite, reducedMotion, onLost: () => setState("failed") });
        setState("live");
      } catch {
        setState("failed");
      }
    };
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    let timer = 0;
    const kick = () => {
      timer = window.setTimeout(() => (idle ? idle(start, { timeout: 1500 }) : start()), 400);
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
    <div className="cloud" aria-hidden="true" data-state={state}>
      <div className="cloud__poster">
        <i className="cloud__halo" />
        <svg viewBox="0 0 400 300" focusable="false">
          <g className="cp-tiers">
            <path d="M200 196l132 50-132 50-132-50z" />
            <path d="M200 176l132 50-132 50-132-50z" />
            <path d="M200 156l132 50-132 50-132-50z" />
          </g>
          <path className="cp-cloud" d="M110 170a46 46 0 0 1 14-88 62 62 0 0 1 118-10 52 52 0 0 1 54 98z" />
          <g className="cp-nodes">
            <circle cx="140" cy="132" r="4" /><circle cx="196" cy="108" r="5" /><circle cx="248" cy="128" r="4" /><circle cx="214" cy="154" r="3" /><circle cx="162" cy="156" r="3" />
          </g>
        </svg>
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
}
