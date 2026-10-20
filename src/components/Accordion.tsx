"use client";

import { useId, useState } from "react";

export type AccordionItem = { q: string; a: React.ReactNode };

export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const base = useId();
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className="faq">
      {items.map((it, i) => {
        const isOpen = open.has(i);
        return (
          <div className="faq__item" data-open={isOpen} key={it.q}>
            <h3>
              <button
                type="button"
                className="faq__q"
                aria-expanded={isOpen}
                aria-controls={`${base}-a-${i}`}
                id={`${base}-q-${i}`}
                onClick={() => toggle(i)}
              >
                <span>{it.q}</span>
                <span className="faq__icon" aria-hidden="true" />
              </button>
            </h3>
            <div
              className="faq__a"
              id={`${base}-a-${i}`}
              role="region"
              aria-labelledby={`${base}-q-${i}`}
              inert={!isOpen}
            >
              <div className="faq__a-inner">{it.a}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
