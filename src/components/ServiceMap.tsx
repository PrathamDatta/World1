"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { asset } from "@/data/assets";
import { hub, mapNodes, type MapNode } from "@/data/services";

export default function ServiceMap() {
  const [activeId, setActiveId] = useState(mapNodes[0].id);
  const all: MapNode[] = [hub, ...mapNodes];
  const active = all.find((n) => n.id === activeId) ?? hub;

  return (
    <div className="smap">
      <div className="smap__stage">
        <svg className="smap__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <circle cx="50" cy="50" r="38" className="smap__orbit" />
          {mapNodes.map((n) => (
            <line key={n.id} x1="50" y1="50" x2={n.x} y2={n.y} className={n.id === activeId ? "is-active" : undefined} />
          ))}
        </svg>
        <button
          type="button"
          className="smap__hub"
          aria-pressed={activeId === hub.id}
          onClick={() => setActiveId(hub.id)}
        >
          <Image src={asset("/brand/adinet-logo.png")} alt="" width={74} height={61} />
          <span>IT Support</span>
        </button>
        {mapNodes.map((n, i) => (
          <button
            key={n.id}
            type="button"
            className="smap__node"
            style={{ left: `${n.x}%`, top: `${n.y}%`, ["--f" as string]: `${i * 0.6}s` }}
            aria-pressed={activeId === n.id}
            onClick={() => setActiveId(n.id)}
            onPointerEnter={(e) => { if (e.pointerType === "mouse") setActiveId(n.id); }}
          >
            {n.label}
          </button>
        ))}
      </div>
      <div className="smap__panel" aria-live="polite">
        <div key={active.id} className="smap__panel-in">
          <h2 className="smap__title">{active.title}</h2>
          <p>{active.text}</p>
          <p className="smap__links">
            {active.links.map((l) => (
              <Link key={l.href} href={l.href} className="arrow-link">
                {l.label} <span aria-hidden="true">→</span>
              </Link>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}
