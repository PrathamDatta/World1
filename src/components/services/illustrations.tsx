import type { CSSProperties, ReactNode } from "react";

/**
 * Seven conceptual, isometric-style infographics, one per service. Purely illustrative (aria-hidden in the stage);
 * the accessible content is the service list and panel. Motion is CSS only so reduced-motion rules switch it all off.
 */

const along = (d: string, dur = 3.4, delay = 0): CSSProperties =>
  ({ offsetPath: `path('${d}')`, ["--dur" as string]: `${dur}s`, ["--delay" as string]: `${delay}s` }) as CSSProperties;

function Cloud({ x, y, s = 1, tone = "base" }: { x: number; y: number; s?: number; tone?: "base" | "small" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} className={`i-cloud i-cloud--${tone}`}>
      <ellipse cx="4" cy="44" rx="104" ry="13" className="i-shadow" />
      <g fill="url(#cloudFill)">
        <circle cx="-58" cy="16" r="30" />
        <circle cx="-22" cy="-6" r="42" />
        <circle cx="30" cy="-2" r="38" />
        <circle cx="66" cy="18" r="28" />
        <rect x="-62" y="14" width="132" height="32" rx="16" />
      </g>
      <path d="M-60 46 H68" className="i-belly" />
    </g>
  );
}

function Pulse({ d, dur, delay, r = 3.5 }: { d: string; dur?: number; delay?: number; r?: number }) {
  return <circle r={r} className="i-pulse" style={along(d, dur, delay)} />;
}

function Server({ x, y, w = 110, leds = 2 }: { x: number; y: number; w?: number; leds?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height="20" rx="4" className="i-unit" />
      <rect x={x + 8} y={y + 8} width={w * 0.45} height="4" rx="2" className="i-slot" />
      {Array.from({ length: leds }, (_, k) => (
        <circle key={k} cx={x + w - 12 - k * 11} cy={y + 10} r="2.6" className="i-led" style={{ ["--delay" as string]: `${(x + y + k * 7) % 5 * 0.35}s` } as CSSProperties} />
      ))}
    </g>
  );
}

function Browser({ x, y, w, h, cols = 2 }: { x: number; y: number; w: number; h: number; cols?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" className="i-glass" />
      <path d={`M${x} ${y + 16} H${x + w}`} className="i-line i-line--thin" />
      {[0, 1, 2].map((k) => <circle key={k} cx={x + 10 + k * 9} cy={y + 8} r="2.4" className="i-dot" />)}
      <rect x={x + 10} y={y + 24} width={w - 20} height="10" rx="3" className="i-bar i-bar--strong" />
      {Array.from({ length: cols }, (_, k) => (
        <rect key={k} x={x + 10 + k * ((w - 26) / cols + 6)} y={y + 42} width={(w - 26) / cols} height={h - 54} rx="4" className="i-bar" />
      ))}
    </g>
  );
}

export const illustrations: Record<string, ReactNode> = {
  cloud: (
    <g>
      <g className="i-rise" style={{ ["--n" as string]: 0 } as CSSProperties}>
        <Cloud x={240} y={118} s={1.45} />
      </g>
      <g className="i-rise" style={{ ["--n" as string]: 1 } as CSSProperties}>
        <rect x="168" y="96" width="144" height="112" rx="12" className="i-glass i-glass--strong" />
        <Server x={184} y={110} w={112} />
        <Server x={184} y={136} w={112} leds={3} />
        <Server x={184} y={162} w={112} />
        <rect x="184" y="188" width="50" height="9" rx="3" className="i-bar i-bar--strong" />
        <rect x="240" y="188" width="56" height="9" rx="3" className="i-bar" />
      </g>
      {["M240 214 V262 H120 V296", "M240 214 V296", "M240 214 V262 H360 V296"].map((d, i) => (
        <g key={d}>
          <path d={d} className="i-line i-line--dash" />
          <Pulse d={d} dur={2.6 + i * 0.5} delay={i * 0.7} />
          <circle cx={[120, 240, 360][i]} cy="302" r="9" className="i-node" />
        </g>
      ))}
      <rect x="62" y="248" width="52" height="22" rx="6" className="i-chip" /><text x="88" y="263" className="i-text">compute</text>
      <rect x="366" y="248" width="56" height="22" rx="6" className="i-chip" /><text x="394" y="263" className="i-text">network</text>
    </g>
  ),

  hosting: (
    <g>
      <g className="i-rise" style={{ ["--n" as string]: 0 } as CSSProperties}>
        <Cloud x={240} y={84} s={1.05} />
      </g>
      <g className="i-rise" style={{ ["--n" as string]: 1 } as CSSProperties}>
        <Browser x={160} y={118} w={160} h={112} cols={2} />
        <path d="M200 218 V236 M280 218 V236" className="i-line i-line--dash" />
      </g>
      {[110, 240, 370].map((cx, i) => {
        const d = `M${i === 1 ? 240 : i === 0 ? 200 : 280} 236 V262 H${cx} V290`;
        return (
          <g key={cx}>
            <path d={d} className="i-line" />
            <Pulse d={d} dur={2.8} delay={i * 0.8} />
            <rect x={cx - 26} y="290" width="52" height="26" rx="6" className="i-unit" />
            <circle cx={cx - 14} cy="303" r="2.6" className="i-led" style={{ ["--delay" as string]: `${i * 0.6}s` } as CSSProperties} />
            <rect x={cx - 6} y="300" width="24" height="6" rx="2" className="i-slot" />
          </g>
        );
      })}
    </g>
  ),

  domains: (
    <g>
      <g className="i-rise" style={{ ["--n" as string]: 0 } as CSSProperties}>
        <Cloud x={240} y={236} s={1.35} />
      </g>
      <g className="i-rise" style={{ ["--n" as string]: 1 } as CSSProperties}>
        <circle cx="240" cy="124" r="78" className="i-glass i-glass--strong" />
        <g className="i-globe">
          <ellipse cx="240" cy="124" rx="30" ry="78" className="i-line i-line--thin" />
          <ellipse cx="240" cy="124" rx="62" ry="78" className="i-line i-line--thin" />
          <path d="M162 124 H318 M170 90 H310 M170 158 H310" className="i-line i-line--thin" />
        </g>
        {[[196, 86], [276, 98], [214, 152], [292, 146], [240, 60]].map(([x, y], k) => (
          <circle key={k} cx={x} cy={y} r="5" className="i-node" />
        ))}
      </g>
      <path d="M196 86 Q120 60 92 120" className="i-line i-line--dash" />
      <path d="M292 146 Q380 170 392 110" className="i-line i-line--dash" />
      <Pulse d="M196 86 Q120 60 92 120" dur={3.2} />
      <Pulse d="M292 146 Q380 170 392 110" dur={3.6} delay={1} />
      <rect x="58" y="120" width="68" height="26" rx="13" className="i-chip" /><text x="92" y="137" className="i-text">www</text>
      <rect x="360" y="108" width="64" height="26" rx="13" className="i-chip" /><text x="392" y="125" className="i-text">.com</text>
    </g>
  ),

  email: (
    <g>
      {[[96, 112], [384, 112], [240, 262]].map(([x, y], k) => (
        <g key={k} className="i-rise" style={{ ["--n" as string]: k } as CSSProperties}>
          <Cloud x={x} y={y} s={0.62} tone="small" />
          <circle cx={x} cy={y + 8} r="7" className="i-node" />
        </g>
      ))}
      {[
        { d: "M126 100 Q240 20 354 100", dur: 5, delay: 0 },
        { d: "M372 134 Q350 230 270 246", dur: 5, delay: 1.7 },
        { d: "M212 246 Q130 230 108 134", dur: 5, delay: 3.4 },
      ].map((p) => (
        <g key={p.d}>
          <path d={p.d} className="i-line i-line--dash" />
          <g className="i-fly" style={along(p.d, p.dur, p.delay)}>
            <rect x="-16" y="-11" width="32" height="22" rx="3" className="i-env" />
            <path d="M-16 -9 L0 3 L16 -9" className="i-line i-line--thin" />
          </g>
        </g>
      ))}
    </g>
  ),

  security: (
    <g>
      <g className="i-rise" style={{ ["--n" as string]: 0 } as CSSProperties}>
        <Cloud x={240} y={176} s={1.25} />
      </g>
      <g className="i-rise" style={{ ["--n" as string]: 1 } as CSSProperties}>
        <path d="M240 24 L350 58 V150 C350 218 304 266 240 296 C176 266 130 218 130 150 V58 Z" className="i-shield" />
        <path d="M240 24 L350 58 V150 C350 218 304 266 240 296 C176 266 130 218 130 150 V58 Z" className="i-scan" pathLength={100} />
        <rect x="222" y="168" width="36" height="28" rx="6" className="i-lock" />
        <path d="M229 168 v-8 a11 11 0 0 1 22 0 v8" className="i-line" />
        <circle cx="240" cy="182" r="3.4" className="i-dot" />
      </g>
      {[[104, 104], [376, 104], [96, 238], [384, 238]].map(([x, y], k) => (
        <circle key={k} cx={x} cy={y} r="5" className="i-node" />
      ))}
    </g>
  ),

  apps: (
    <g>
      <g className="i-rise" style={{ ["--n" as string]: 0 } as CSSProperties}>
        <Cloud x={240} y={262} s={1.3} />
      </g>
      <path d="M180 250 V210 M240 250 V160 M300 250 V190" className="i-line i-line--dash" />
      <g className="i-bob" style={{ ["--n" as string]: 0 } as CSSProperties}>
        <Browser x={112} y={62} w={170} h={110} cols={2} />
      </g>
      <g className="i-bob" style={{ ["--n" as string]: 1 } as CSSProperties}>
        <rect x="262" y="118" width="110" height="96" rx="10" className="i-glass i-glass--strong" />
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <rect key={k} x={274 + (k % 3) * 32} y={130 + Math.floor(k / 3) * 36} width="26" height="26" rx="7" className={k === 1 ? "i-tile i-tile--on" : "i-tile"} />
        ))}
      </g>
      <g className="i-bob" style={{ ["--n" as string]: 2 } as CSSProperties}>
        <rect x="98" y="186" width="120" height="58" rx="10" className="i-glass" />
        {[0, 1].map((k) => (
          <g key={k}>
            <rect x="112" y={198 + k * 20} width="56" height="8" rx="3" className="i-bar" />
            <rect x="178" y={195 + k * 20} width="28" height="14" rx="7" className={k ? "i-toggle" : "i-toggle i-toggle--on"} />
          </g>
        ))}
      </g>
    </g>
  ),

  support: (
    <g>
      <circle cx="240" cy="170" r="46" className="i-ring" />
      <circle cx="240" cy="170" r="46" className="i-ring i-ring--b" />
      <circle cx="240" cy="170" r="34" className="i-hub" />
      <path d="M224 170 l11 11 l22 -24" className="i-check" />
      {[
        { d: "M240 136 V96 H150", x: 90, y: 56, kind: "laptop" },
        { d: "M274 170 H340", x: 340, y: 128, kind: "monitor" },
        { d: "M240 204 V248 H150", x: 96, y: 232, kind: "phone" },
      ].map((p, i) => (
        <g key={p.kind}>
          <path d={p.d} className="i-line i-line--dash" />
          <Pulse d={p.d} dur={2.6} delay={i * 0.9} />
          {p.kind === "laptop" && (
            <g className="i-rise" style={{ ["--n" as string]: 1 } as CSSProperties}>
              <rect x="86" y="62" width="74" height="48" rx="6" className="i-glass i-glass--strong" />
              <path d="M96 90 h12 l6 -12 l8 22 l6 -10 h24" className="i-line i-ecg" />
              <path d="M76 116 H170" className="i-line" />
            </g>
          )}
          {p.kind === "monitor" && (
            <g className="i-rise" style={{ ["--n" as string]: 2 } as CSSProperties}>
              <rect x="340" y="128" width="92" height="64" rx="7" className="i-glass i-glass--strong" />
              <rect x="352" y="140" width="44" height="7" rx="3" className="i-bar i-bar--strong" />
              <rect x="352" y="154" width="68" height="6" rx="3" className="i-bar" />
              <rect x="352" y="166" width="54" height="6" rx="3" className="i-bar" />
              <path d="M386 192 v12 M372 206 h28" className="i-line" />
            </g>
          )}
          {p.kind === "phone" && (
            <g className="i-rise" style={{ ["--n" as string]: 3 } as CSSProperties}>
              <rect x="112" y="216" width="38" height="68" rx="8" className="i-glass i-glass--strong" />
              <circle cx="131" cy="262" r="9" className="i-node" />
              <rect x="122" y="228" width="18" height="5" rx="2.5" className="i-bar" />
            </g>
          )}
        </g>
      ))}
    </g>
  ),
};

export function IllustrationDefs(): ReactNode {
  return (
    <defs>
      <linearGradient id="cloudFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.7" stopColor="#f1f8ff" />
        <stop offset="1" stopColor="#cfe3f8" />
      </linearGradient>
    </defs>
  );
}
