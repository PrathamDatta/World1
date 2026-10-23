import { STAGES } from '../data/content.js'

const C = 320
const R = 262
const SHORT = ['Concept', 'Design', 'Verification', 'Validation', 'Compliance', 'Lifecycle']
const ang = (i) => ((-90 + i * 60) * Math.PI) / 180
const P = (r, i) => [C + r * Math.cos(ang(i)), C + r * Math.sin(ang(i))]

const cls = (stage, n) => `lyr${stage >= n ? ' on' : ''}${stage === n ? ' hot' : ''}`

/**
 * One persistent SVG. `stage` (0-5) turns layers on cumulatively so the product
 * "grows" instead of being swapped; `arcRef` is driven directly by scroll progress.
 */
export default function LifecycleViz({ stage, arcRef, onPick }) {
  return (
    <svg viewBox="-50 -10 740 660" role="img" aria-label={`Engineering lifecycle diagram. Current stage: ${STAGES[stage].name}.`}>
      {/* track ring + progress arc */}
      <circle cx={C} cy={C} r={R} fill="none" stroke="var(--line)" strokeWidth="1" />
      <circle
        ref={arcRef}
        cx={C} cy={C} r={R}
        fill="none" stroke="var(--amber)" strokeWidth="2"
        pathLength="1" strokeDasharray="1" strokeDashoffset="1"
        transform={`rotate(-90 ${C} ${C})`}
      />
      <circle cx={C} cy={C} r="208" fill="none" stroke="var(--line)" strokeDasharray="2 7" />

      {/* L0 — architecture: dashed block diagram (system, hardware, firmware, mechanical) */}
      <g className={cls(stage, 0)} style={{ opacity: 1 }}>
        <g fill="none" stroke="var(--bone-2)" strokeWidth="1" strokeDasharray="4 5" className="arch">
          <rect x="170" y="196" width="300" height="56" />
          <rect x="170" y="284" width="92" height="84" />
          <rect x="274" y="284" width="92" height="84" />
          <rect x="378" y="284" width="92" height="84" />
        </g>
        <g className="mini">
          <text x="320" y="228" textAnchor="middle" className="svg-label">System</text>
          <text x="216" y="330" textAnchor="middle" className="svg-label">Hardware</text>
          <text x="320" y="330" textAnchor="middle" className="svg-label">Firmware</text>
          <text x="424" y="330" textAnchor="middle" className="svg-label">Mechanical</text>
        </g>
      </g>

      {/* L1 — design: solid blocks + traces + pins */}
      <g className={cls(stage, 1)}>
        <g fill="rgba(var(--amber-rgb),.1)" stroke="var(--amber)" strokeWidth="1.2" className="acc-s">
          <rect x="170" y="196" width="300" height="56" />
          <rect x="170" y="284" width="92" height="84" />
          <rect x="274" y="284" width="92" height="84" />
          <rect x="378" y="284" width="92" height="84" />
        </g>
        {[216, 320, 424].map((x) => (
          <path key={x} className="trace" pathLength="1" d={`M${x} 252 V284`} />
        ))}
        <path className="trace" pathLength="1" d="M262 326 H274 M366 326 H378" />
        {[0, 1, 2].map((i) => (
          <g key={i} stroke="var(--amber)" strokeWidth="1">
            {[0, 1, 2, 3].map((k) => (
              <line key={k} x1={186 + i * 104 + k * 16} y1="368" x2={186 + i * 104 + k * 16} y2="376" />
            ))}
          </g>
        ))}
      </g>

      {/* L2 — verification: test bus + checks */}
      <g className={cls(stage, 2)}>
        <rect x="170" y="396" width="300" height="26" fill="rgba(var(--teal-rgb),.1)" stroke="var(--teal)" strokeWidth="1" />
        <text x="320" y="413" textAnchor="middle" className="svg-label mini" style={{ fill: 'var(--teal)', fontSize: 10 }}>Independent verification</text>
        {[216, 320, 424].map((x) => (
          <g key={x}>
            <path className="trace" style={{ stroke: 'var(--teal)' }} pathLength="1" d={`M${x} 376 V396`} />
            <circle cx={x + 28} cy="296" r="8" fill="var(--ink)" stroke="var(--teal)" />
            <path d={`M${x + 24} 296 l3 3 l5 -6`} fill="none" stroke="var(--teal)" strokeWidth="1.4" />
          </g>
        ))}
      </g>

      {/* L3 — validation: usability / signal trace */}
      <g className={cls(stage, 3)}>
        <path
          className="trace"
          style={{ stroke: 'var(--bone)' }}
          pathLength="1"
          d="M150 458 H214 l10 -26 l14 52 l12 -38 l8 12 H320 l10 -20 l12 40 l10 -20 H490"
        />
        <text x="150" y="500" className="svg-label mute mini" style={{ fontSize: 10 }}>Design validation / usability</text>
      </g>

      {/* L4 — compliance ring */}
      <g className={cls(stage, 4)}>
        <circle cx={C} cy={C} r="196" fill="none" stroke="var(--amber)" strokeWidth="1.4" strokeDasharray="2 6" className="spin-slow" style={{ transformOrigin: `${C}px ${C}px`, transformBox: 'view-box' }} />
        {['ISO', 'FDA', 'FAA', 'IEC'].map((t, i) => {
          const a = (-90 + i * 90) * (Math.PI / 180)
          const x = C + 196 * Math.cos(a), y = C + 196 * Math.sin(a)
          return (
            <g key={t} className="mini">
              <rect x={x - 22} y={y - 11} width="44" height="22" fill="var(--ink-2)" stroke="var(--amber)" />
              <text x={x} y={y + 4} textAnchor="middle" className="svg-label amber" style={{ fontSize: 10 }}>{t}</text>
            </g>
          )
        })}
      </g>

      {/* L5 — lifecycle: feedback loop returning to design */}
      <g className={cls(stage, 5)}>
        <path d={`M${C + 92} ${C + 168} C ${C + 196} ${C + 120}, ${C + 196} ${C - 120}, ${C + 100} ${C - 150}`} fill="none" stroke="var(--amber)" strokeWidth="1.4" className="flow" />
        <path d={`M${C + 106} ${C - 152} l-12 -2 l6 12 z`} fill="var(--amber)" />
        <text x={C - 8} y={C - 134} textAnchor="middle" className="svg-label amber mini" style={{ fontSize: 10 }}>Feedback to design</text>
      </g>

      {/* stage nodes (always visible; clickable) */}
      {STAGES.map((s, i) => {
        const [x, y] = P(R, i)
        const [lx, ly] = P(R + 30, i)
        const right = lx > C + 6, left = lx < C - 6
        const active = i === stage
        const past = i < stage
        return (
          <g key={s.id} className="lc-node" role="button" tabIndex={0} aria-label={`Go to stage ${s.n}: ${s.name}`}
            onClick={() => onPick(i)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onPick(i))} style={{ cursor: 'pointer' }}>
            <circle cx={x} cy={y} r="26" fill="transparent" />
            <circle className="node-dot" cx={x} cy={y} r={active ? 15 : 10} fill={active ? 'var(--amber)' : 'var(--ink-2)'} stroke={active || past ? 'var(--amber)' : 'var(--line-2)'} strokeWidth="1.5" />
            <text x={x} y={y + 4} textAnchor="middle" className="svg-label" style={{ fontSize: 10, fill: active ? 'var(--ink)' : 'var(--bone-2)' }}>{i + 1}</text>
            <text x={lx} y={ly + 4} dy={!right && !left ? (ly < C ? -4 : 12) : 0} textAnchor={right ? 'start' : left ? 'end' : 'middle'} className={`svg-label${active ? ' amber' : ' mute'}`}>{SHORT[i]}</text>
          </g>
        )
      })}
    </svg>
  )
}
