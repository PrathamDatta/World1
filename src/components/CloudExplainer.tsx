"use client";

import { useEffect, useRef, useState } from "react";

const parts = [
  { id: "compute", n: "01", t: "Compute", p: "Processing power and memory allocated to your website and applications." },
  { id: "storage", n: "02", t: "Storage", p: "Where site files, databases and backups are kept." },
  { id: "network", n: "03", t: "Network", p: "DNS and routing that connect visitors to your site." },
  { id: "partition", n: "04", t: "Virtual partition", p: "Your website runs on a virtual partition that draws on shared resources, rather than one physical server." },
  { id: "protect", n: "05", t: "Security & backup", p: "SSL, website security and cloud backup protect and restore your site." },
] as const;
type PartId = (typeof parts)[number]["id"];

const unit = (x: number, y: number, w: number) => (
  <g>
    <rect x={x} y={y} width={w} height="18" rx="4" className="i-unit" />
    <rect x={x + 8} y={y + 7} width={w * 0.4} height="4" rx="2" className="i-slot" />
    <circle cx={x + w - 11} cy={y + 9} r="2.4" className="i-led" style={{ ["--delay" as string]: `${(x + y) % 5 * 0.3}s` } as React.CSSProperties} />
  </g>
);

/**
 * Technical explainer: the cloud opens (scroll-linked `--open`) to reveal a conceptual hosting diagram. The legend is
 * real list content; focusing or hovering an item highlights the matching part. Not a diagram of ADINET's infrastructure.
 */
export default function CloudExplainer() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<PartId | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.dataset.anim = "on";
    let raf = 0;
    const run = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = Math.min(1, Math.max(0, (vh * 0.9 - r.top) / (vh * 0.55)));
      el.style.setProperty("--open", (raw * raw * (3 - 2 * raw)).toFixed(3));
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

  const on = (id: PartId) => ({ "data-part": id, "data-hot": active === id });

  return (
    <div className="xplain" ref={ref} data-active={active ?? ""}>
      <div className="xplain__figure">
        <svg viewBox="0 28 960 440" role="img" aria-label="Conceptual diagram: visitors reach a website hosted on a virtual partition inside a cloud, which draws on compute, storage and network resources, alongside security and backup." focusable="false">
          <defs>
            <linearGradient id="xCloud" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#d3e6fa" />
            </linearGradient>
          </defs>

          {/* revealed infrastructure */}
          <g transform="translate(0 -56)">
          <g className="x-inner">
            <rect x="170" y="120" width="620" height="290" rx="22" className="x-bay" />
            <path d="M480 410 V470 M300 410 V470 M660 410 V470" className="i-line i-line--dash" />

            <g {...on("compute")} className="x-part">
              <text x="200" y="152" className="x-label">COMPUTE</text>
              {unit(200, 166, 150)}{unit(200, 190, 150)}{unit(200, 214, 150)}
              <rect x="200" y="242" width="46" height="34" rx="6" className="i-chip" /><rect x="254" y="242" width="46" height="34" rx="6" className="i-chip" /><rect x="308" y="242" width="42" height="34" rx="6" className="i-chip" />
            </g>
            <g {...on("storage")} className="x-part">
              <text x="620" y="152" className="x-label">STORAGE</text>
              {[0, 1, 2].map((k) => (
                <g key={k}>
                  <ellipse cx={690 + (k - 1) * 0} cy={176 + k * 44} rx="62" ry="12" className="i-unit" />
                  <path d={`M628 ${176 + k * 44} v22 a62 12 0 0 0 124 0 v-22`} className="i-unit" />
                  <ellipse cx="690" cy={176 + k * 44} rx="62" ry="12" className="i-glass" />
                </g>
              ))}
            </g>
            <g {...on("partition")} className="x-part">
              <rect x="372" y="176" width="216" height="104" rx="16" className="x-partition" />
              <text x="480" y="162" className="x-label" textAnchor="middle">VIRTUAL PARTITION</text>
              <rect x="410" y="204" width="140" height="44" rx="8" className="i-glass i-glass--strong" />
              <circle cx="424" cy="216" r="2.4" className="i-dot" /><circle cx="433" cy="216" r="2.4" className="i-dot" /><circle cx="442" cy="216" r="2.4" className="i-dot" />
              <rect x="420" y="228" width="120" height="8" rx="3" className="i-bar i-bar--strong" />
              <text x="480" y="268" className="i-text" textAnchor="middle">your website</text>
            </g>
            <g {...on("network")} className="x-part">
              <text x="566" y="382" className="x-label">NETWORK</text>
              <rect x="408" y="364" width="144" height="26" rx="8" className="i-unit" />
              {[0, 1, 2, 3, 4, 5].map((k) => <rect key={k} x={420 + k * 22} y="372" width="14" height="10" rx="2" className="i-slot" />)}
            </g>
            <g {...on("protect")} className="x-part x-shield">
              <path d="M470 20 L524 36 V80 C524 110 502 130 470 144 C438 130 416 110 416 80 V36 Z" className="i-shield" transform="translate(204 334) scale(.4) translate(-416 -20)" />
              <path d="M462 72 v-8 a8 8 0 0 1 16 0 v8 M454 72 h32 v26 h-32z" className="i-line" transform="translate(204 334) scale(.4) translate(-416 -20)" />
              <text x="260" y="360" className="x-label">SECURITY</text>
              <text x="260" y="376" className="x-label">&amp; BACKUP</text>
            </g>

            {/* paths between parts, with travelling pulses */}
            {[
              "M350 230 H372", "M588 228 H628", "M480 280 V364",
            ].map((d, i) => (
              <g key={d}>
                <path d={d} className="i-line" />
                <circle r="3.5" className="i-pulse" style={{ offsetPath: `path('${d}')`, ["--dur" as string]: `${2 + i * 0.4}s`, ["--delay" as string]: `${i * 0.5}s` } as React.CSSProperties} />
              </g>
            ))}
            {[300, 480, 660].map((cx, i) => (
              <g key={cx}>
                <circle cx={cx} cy="476" r="9" className="i-node" />
                <circle r="3.5" className="i-pulse" style={{ offsetPath: `path('M${cx} 410 V470')`, ["--dur" as string]: "2.4s", ["--delay" as string]: `${i * 0.6}s` } as React.CSSProperties} />
              </g>
            ))}
            <text x="300" y="506" className="i-text" textAnchor="middle">visitors</text>
            <text x="480" y="506" className="i-text" textAnchor="middle">your customers</text>
            <text x="660" y="506" className="i-text" textAnchor="middle">your team</text>
          </g>
          </g>

          {/* the cloud that opens */}
          <g className="x-lid x-lid--l">
            <g fill="url(#xCloud)">
              <circle cx="240" cy="108" r="64" /><circle cx="318" cy="76" r="72" /><circle cx="396" cy="112" r="58" /><circle cx="180" cy="130" r="42" />
              <rect x="150" y="104" width="300" height="46" rx="23" />
            </g>
          </g>
          <g className="x-lid x-lid--r">
            <g fill="url(#xCloud)">
              <circle cx="560" cy="108" r="60" /><circle cx="636" cy="78" r="70" /><circle cx="716" cy="116" r="56" /><circle cx="780" cy="132" r="38" />
              <rect x="510" y="104" width="300" height="46" rx="23" />
            </g>
          </g>
        </svg>
      </div>

      <ul className="xplain__legend">
        {parts.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              aria-pressed={active === p.id}
              onClick={() => setActive(p.id)}
              onPointerEnter={(e) => e.pointerType === "mouse" && setActive(p.id)}
            >
              <span className="svc__n">{p.n}</span>
              <strong>{p.t}</strong>
              <span>{p.p}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
