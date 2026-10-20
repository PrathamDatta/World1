"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { layers } from "@/data/layers";
import { IllustrationDefs, illustrations } from "@/components/services/illustrations";

/**
 * The seven services as one connected infographic. The rail (buttons) selects; the stage shows that service's
 * illustration; the panel carries the description and real links. Everything is real DOM text, so the content
 * stays complete with scripts, WebGL or animation unavailable.
 */
export default function ServiceWorld() {
  const [selected, setSelected] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const layer = layers[selected];

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.75) return;
    el.dataset.in = "false";
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { el.dataset.in = "true"; io.disconnect(); }
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="svc" ref={rootRef} data-in="true">
      <nav className="svc__rail" aria-label="Services">
        <ol>
          {layers.map((l) => (
            <li key={l.id} data-on={l.index === selected}>
              <button
                type="button"
                aria-pressed={l.index === selected}
                aria-controls="svc-panel"
                onClick={() => setSelected(l.index)}
                onPointerEnter={(e) => e.pointerType === "mouse" && setSelected(l.index)}
              >
                <span className="svc__n">{String(l.index + 1).padStart(2, "0")}</span>
                <span className="svc__l">{l.label}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div className="svc__stage" aria-hidden="true">
        <svg key={layer.id} viewBox="0 0 480 340" className="ill" focusable="false">
          <IllustrationDefs />
          {illustrations[layer.id]}
        </svg>
      </div>

      <div className="svc__panel" id="svc-panel" role="region" aria-label="Selected service" aria-live="polite">
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
  );
}
