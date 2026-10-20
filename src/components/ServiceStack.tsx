"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { layers } from "@/data/layers";
import Split from "@/components/Split";

/** One isometric plate; geometry matches StackGlyph so the stack reads as the same object everywhere. */
function Plate() {
  return (
    <svg viewBox="0 0 240 92" className="stackx__plate" aria-hidden="true" focusable="false">
      <path className="sp-side" d="M26 40 L120 74 L214 40 L214 48 L120 82 L26 48 Z" />
      <path className="sp-top" d="M120 6 L214 40 L120 74 L26 40 Z" />
      <path className="sp-grid" d="M120 23 L167 40 M73 40 L120 57" />
    </svg>
  );
}

/**
 * Interactive version of the seven-layer stack. The list is always in the DOM and always readable: scroll progress
 * only drives the `--sep` custom property (0 = compressed stack, 1 = settled), written outside React's render path.
 * Layers are buttons (selection state); destinations are real links in the detail panel.
 */
export default function ServiceStack() {
  const vizRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(0);
  const layer = layers[selected];

  useEffect(() => {
    const el = vizRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.dataset.anim = "on";
    let raf = 0;
    const run = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = Math.min(1, Math.max(0, (vh * 0.92 - r.top) / (vh * 0.5)));
      const eased = raw * raw * (3 - 2 * raw);
      el.style.setProperty("--sep", eased.toFixed(3));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(run); };
    run();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="stackx section--navy" id="stack" aria-labelledby="stack-title">
      <div className="wrap">
        <div className="stackx__head">
          <p className="eyebrow">The stack</p>
          <Split as="h2" id="stack-title" text="Seven layers.|*One* team." className="display" delay={80} />
          <p className="lede">
            Everything we offer builds on the layer beneath it, from cloud infrastructure at the foundation to the
            support that looks after it all. Select a layer to explore it. This is a conceptual map of our services, not
            a diagram of our infrastructure.
          </p>
        </div>

        <div className="stackx__grid">
          <div className="stackx__viz" ref={vizRef}>
            <span className="stackx__spine" aria-hidden="true" />
            <ol className="stackx__layers" aria-label="Seven service layers, foundation first">
              {layers.map((l) => (
                <li key={l.id} style={{ ["--i" as string]: l.index }} data-on={l.index === selected}>
                  <Plate />
                  <button
                    type="button"
                    className="stackx__btn"
                    aria-pressed={l.index === selected}
                    aria-controls="stackx-panel"
                    onClick={() => setSelected(l.index)}
                    onPointerEnter={(e) => e.pointerType === "mouse" && setSelected(l.index)}
                  >
                    <span className="stackx__n">{String(l.index + 1).padStart(2, "0")}</span>
                    <span className="stackx__l">{l.label}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="stackx__panel" id="stackx-panel" role="region" aria-label="Selected service" aria-live="polite">
            <div key={layer.id} className="stackx__detail">
              <p className="stackx__tag">
                Layer {selected + 1} of {layers.length} · {layer.tag}
              </p>
              <h3>{layer.title}</h3>
              <p>{layer.text}</p>
              <p className="stackx__links">
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
    </section>
  );
}
