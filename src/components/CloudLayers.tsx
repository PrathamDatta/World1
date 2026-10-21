"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { layers } from "@/data/layers";
import { IllustrationDefs, illustrations } from "@/components/services/illustrations";
import type { LayersState } from "@/components/layers/layers";

type NavigatorWithHints = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

/**
 * The seven services as seven real cloud decks. Each deck is a button (selection state); the WebGL clouds sit behind
 * the rows and are purely visual. The selected service's illustration and description appear beside the stack, with
 * real links. Everything is DOM text, so content and navigation survive without WebGL, scripts or animation.
 */
export default function CloudLayers() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<LayersState>({ sep: 1, selected: 0, poke: () => {} });
  const [selected, setSelected] = useState(0);
  const [gl, setGl] = useState<"css" | "live" | "failed">("css");
  const layer = layers[selected];

  useEffect(() => {
    stateRef.current.selected = selected;
    stateRef.current.poke();
  }, [selected]);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const st = stateRef.current;
    let raf = 0;
    const run = () => {
      raf = 0;
      const r = root.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = Math.min(1, Math.max(0, (vh * 0.92 - r.top) / (vh * 0.5)));
      st.sep = raw * raw * (3 - 2 * raw);
      root.style.setProperty("--sep", st.sep.toFixed(3));
      st.poke();
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(run); };
    if (!reducedMotion) {
      root.dataset.anim = "on";
      run();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    }

    let dispose: (() => void) | undefined;
    let cancelled = false;
    const nav = navigator as NavigatorWithHints;
    const lite = !!nav.connection?.saveData || (nav.deviceMemory ?? 8) <= 2 || (nav.hardwareConcurrency ?? 8) <= 2 || window.innerWidth < 700;
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const start = async () => {
      try {
        const { createLayers } = await import("./layers/layers");
        if (cancelled) return;
        dispose = createLayers(canvas, root, st, { lite, reducedMotion, count: layers.length, onLost: () => setGl("failed") });
        setGl("live");
      } catch {
        setGl("failed");
      }
    };
    const timer = window.setTimeout(() => (idle ? idle(start, { timeout: 1500 }) : start()), 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      dispose?.();
    };
  }, []);

  return (
    <div className="cls">
      <div className="cl" ref={rootRef} data-gl={gl}>
        <canvas ref={canvasRef} className="cl__canvas" aria-hidden="true" />
        <ol className="cl__list" aria-label="Seven service layers, foundation first">
          {layers.map((l) => (
            <li key={l.id} style={{ ["--i" as string]: l.index }} data-on={l.index === selected}>
              <button
                type="button"
                aria-pressed={l.index === selected}
                aria-controls="cl-panel"
                onClick={() => setSelected(l.index)}
                onPointerEnter={(e) => e.pointerType === "mouse" && setSelected(l.index)}
              >
                <span className="cl__n">{String(l.index + 1).padStart(2, "0")}</span>
                <span className="cl__l">{l.label}</span>
                <span className="cl__t">{l.tag}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="cls__side">
        <div className="svc__stage" aria-hidden="true">
          <svg key={layer.id} viewBox="0 0 480 340" className="ill" focusable="false">
            <IllustrationDefs />
            {illustrations[layer.id]}
          </svg>
        </div>
        <div className="svc__panel" id="cl-panel" role="region" aria-label="Selected service" aria-live="polite">
          <div key={layer.id} className="svc__detail">
            <p className="svc__tag">Layer {selected + 1} of {layers.length} · {layer.tag}</p>
            <h3>{layer.title}</h3>
            <p>{layer.text}</p>
            <p className="svc__links">
              {layer.links.map((k) => (
                <Link key={k.href} href={k.href} className="arrow-link">
                  {k.label} <span aria-hidden="true">→</span>
                </Link>
              ))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
