"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// [selector, variant, stagger-group parent selector]
const targets: [string, string][] = [
  [".section-head, .cta-band__inner > *", "up"],
  [".index-row", "left"],
  [".product, .panel, .solution-card, .tile", "scale"],
  [".reasons li, .col-block, .stages li, .contact-details li", "up"],
  [".quote", "fade"],
  [".faq, .tabs, .compare, .hcompare, .domain-box", "up"],
];

export default function PageEffects() {
  const pathname = usePathname();
  const [showTop, setShowTop] = useState(false);

  // Scroll reveals: only elements that start below the fold are hidden, so nothing above the fold ever flashes.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const marked: Element[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    targets.forEach(([sel, variant]) => {
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

  // Cursor spotlight on cards (mouse only).
  useEffect(() => {
    let raf = 0;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const card = (e.target as HTMLElement).closest<HTMLElement>(".product, .panel, .solution-card, .tile");
      if (!card) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    };
    document.addEventListener("pointermove", move, { passive: true });
    return () => {
      document.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Back-to-top, only once the page has scrolled well past the first screen.
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
      onClick={() =>
        window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })
      }
    >
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 10l5-5 5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
  );
}
