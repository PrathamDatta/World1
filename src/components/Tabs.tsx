"use client";

import { useId, useRef, useState } from "react";

export type TabItem = { id: string; label: string; content: React.ReactNode };

export default function Tabs({ tabs, label }: { tabs: TabItem[]; label: string }) {
  const [active, setActive] = useState(tabs[0].id);
  const base = useId();
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const move = (to: number) => {
    const t = tabs[(to + tabs.length) % tabs.length];
    setActive(t.id);
    refs.current[t.id]?.focus();
  };

  return (
    <div className="tabs">
      <div
        className="tabs__list"
        role="tablist"
        aria-label={label}
        onKeyDown={(e) => {
          const i = tabs.findIndex((t) => t.id === active);
          if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); move(i + 1); }
          if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); move(i - 1); }
          if (e.key === "Home") { e.preventDefault(); move(0); }
          if (e.key === "End") { e.preventDefault(); move(tabs.length - 1); }
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            ref={(el) => { refs.current[t.id] = el; }}
            role="tab"
            type="button"
            id={`${base}-tab-${t.id}`}
            aria-selected={active === t.id}
            aria-controls={`${base}-panel-${t.id}`}
            tabIndex={active === t.id ? 0 : -1}
            className="tabs__tab"
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${base}-panel-${t.id}`}
          aria-labelledby={`${base}-tab-${t.id}`}
          hidden={active !== t.id}
          className="tabs__panel"
          tabIndex={0}
        >
          {active === t.id && <div className="tabs__fade">{t.content}</div>}
        </div>
      ))}
    </div>
  );
}
