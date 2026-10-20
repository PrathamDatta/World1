"use client";

import { useEffect, useRef } from "react";

/** Trailing ring on top of the native cursor (never replaces it). Desktop mouse only. */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = ring.current;
    if (!fine || reduce || !el) return;
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0, on = false;
    const loop = () => {
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      el.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.3 ? requestAnimationFrame(loop) : 0;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!on) { on = true; rx = x; ry = y; el.dataset.on = "true"; }
      if (!raf) raf = requestAnimationFrame(loop);
      const t = e.target as HTMLElement | null;
      const hit = t?.closest<HTMLElement>("[data-cursor], a, button, [role=tab], select, summary");
      const text = t?.closest("input, textarea");
      el.dataset.state = text ? "text" : hit ? "link" : "idle";
      const custom = hit?.dataset.cursor;
      if (label.current) label.current.textContent = custom ?? "";
      el.dataset.label = custom ? "true" : "false";
    };
    const leave = () => { el.dataset.on = "false"; on = false; };
    const down = () => { el.dataset.press = "true"; };
    const up = () => { el.dataset.press = "false"; };
    document.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.addEventListener("pointerdown", down);
    document.addEventListener("pointerup", up);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <div className="cursor" ref={ring} aria-hidden="true" data-on="false" data-state="idle">
      <span className="cursor__ring"><span ref={label} className="cursor__label" /></span>
    </div>
  );
}
