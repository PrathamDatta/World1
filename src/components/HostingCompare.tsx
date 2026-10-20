"use client";

import { useState } from "react";

export default function HostingCompare() {
  const [mode, setMode] = useState<"single" | "cloud">("cloud");
  return (
    <div className="hcompare">
      <div className="hcompare__toggle" role="group" aria-label="Hosting model">
        <button type="button" aria-pressed={mode === "single"} onClick={() => setMode("single")}>One physical server</button>
        <button type="button" aria-pressed={mode === "cloud"} onClick={() => setMode("cloud")}>Cloud virtual partition</button>
      </div>
      <svg viewBox="0 0 480 220" role="img" aria-label={mode === "single" ? "A website hosted on one physical server" : "A website hosted on a virtual partition drawing on a pool of resources"} className="hcompare__svg">
        <g className="hc-layer" data-on={mode === "single"}>
          <rect x="170" y="40" width="140" height="140" rx="10" className="hc-box" />
          <rect x="190" y="62" width="100" height="14" rx="3" className="hc-dim" />
          <rect x="190" y="86" width="100" height="14" rx="3" className="hc-dim" />
          <rect x="190" y="110" width="100" height="14" rx="3" className="hc-dim" />
          <rect x="190" y="142" width="100" height="22" rx="4" className="hc-site" />
          <text x="240" y="157" textAnchor="middle" className="hc-label">Your website</text>
        </g>
        <g className="hc-layer" data-on={mode === "cloud"}>
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x={30 + i * 112} y="24" width="92" height="46" rx="8" className="hc-box" />
              <text x={76 + i * 112} y="52" textAnchor="middle" className="hc-label">Resources</text>
              <path d={`M${76 + i * 112} 70 C${76 + i * 112} 110 240 100 240 134`} className="hc-flow" />
            </g>
          ))}
          <rect x="150" y="134" width="180" height="56" rx="12" className="hc-part" />
          <rect x="190" y="150" width="100" height="24" rx="4" className="hc-site" />
          <text x="240" y="166" textAnchor="middle" className="hc-label">Your website</text>
        </g>
      </svg>
      <p className="hcompare__cap" aria-live="polite">
        {mode === "single"
          ? "Traditional hosting places your website on a single instance of a physical server."
          : "Cloud hosting places your website on a virtual partition that draws its resources from a shared pool."}
      </p>
    </div>
  );
}
