"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const reveal: [string, string][] = [
  [".section-head, .cta-band__inner > *", "up"],
  [".index-row", "left"],
  [".product, .panel, .solution-card, .tile", "scale"],
  [".reasons li, .col-block, .stages li, .contact-details li", "up"],
  [".quote", "fade"],
  [".faq, .tabs, .compare, .hcompare, .domain-box", "up"],
];

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function PageEffects() {
  const pathname = usePathname();
  const [showTop, setShowTop] = useState(false);

  // Scroll reveals + kinetic text. Only elements that start below the fold are hidden, so nothing above the fold flashes.
  useEffect(() => {
    if (reduced()) return;
    const marked: Element[] = [];
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    document.querySelectorAll<HTMLElement>('[data-split="view"]').forEach((el) => io.observe(el));
    reveal.forEach(([sel, variant]) => {
      document.querySelectorAll<HTMLElement>(`main ${sel.split(",").join(", main ")}`).forEach((el) => {
        if (el.parentElement?.closest(".rv")) return;
        if (el.getBoundingClientRect().top < window.innerHeight * 0.95) return;
        const siblings = Array.from(el.parentElement?.children ?? []).filter((c) => c.matches(sel));
        el.style.setProperty("--d", String(Math.min(siblings.indexOf(el), 5)));
        el.classList.add("rv", `rv--${variant}`);
        marked.push(el);
        io.observe(el);
      });
    });
    return () => {
      io.disconnect();
      marked.forEach((el) => el.classList.remove("rv", "in"));
    };
  }, [pathname]);

  // Scroll-linked parallax: one rAF-throttled loop writes --p (-1..1) onto [data-parallax] elements.
  useEffect(() => {
    if (reduced()) return;
    let raf = 0;
    const run = () => {
      raf = 0;
      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
        const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
        el.style.setProperty("--p", Math.max(-1.5, Math.min(1.5, p)).toFixed(3));
      });
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
  }, [pathname]);

  // Card spotlight + subtle magnetic buttons (mouse only).
  useEffect(() => {
    let raf = 0;
    let magnet: HTMLElement | null = null;
    const reset = (el: HTMLElement | null) => {
      el?.style.removeProperty("--tx");
      el?.style.removeProperty("--ty");
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const t = e.target as HTMLElement;
      const card = t.closest<HTMLElement>(".product, .panel, .solution-card, .tile");
      const btn = reduced() ? null : t.closest<HTMLElement>(".btn");
      if (magnet && magnet !== btn) { reset(magnet); magnet = null; }
      if (!card && !btn) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (card) {
          const r = card.getBoundingClientRect();
          card.style.setProperty("--mx", `${e.clientX - r.left}px`);
          card.style.setProperty("--my", `${e.clientY - r.top}px`);
        }
        if (btn) {
          const r = btn.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
          const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
          btn.style.setProperty("--tx", `${(dx * 10).toFixed(1)}px`);
          btn.style.setProperty("--ty", `${(dy * 8).toFixed(1)}px`);
          magnet = btn;
        }
      });
    };
    document.addEventListener("pointermove", move, { passive: true });
    return () => {
      document.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight * 1.2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <button
      type="button"
      className="to-top"
      data-show={showTop}
      aria-label="Back to top"
      tabIndex={showTop ? 0 : -1}
      data-cursor="Top"
      onClick={() => window.scrollTo({ top: 0, behavior: reduced() ? "auto" : "smooth" })}
    >
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 10l5-5 5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
  );
}
