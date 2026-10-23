import { useMemo } from 'react'

/* ── Medical devices: patient-monitor frame with live-style ECG trace ── */
export function MedicalScene() {
  const grid = []
  for (let x = 80; x <= 420; x += 20) grid.push(<line key={'v' + x} x1={x} y1="70" x2={x} y2="250" stroke="var(--line)" />)
  for (let y = 70; y <= 250; y += 20) grid.push(<line key={'h' + y} x1="80" y1={y} x2="420" y2={y} stroke="var(--line)" />)
  const ecg =
    'M80 160 H120 l6 -8 l6 8 H150 l6 10 l8 -78 l8 96 l6 -28 H215 l8 -18 l10 18 H260 l6 10 l8 -78 l8 96 l6 -28 H330 l8 -18 l10 18 H380 l6 10 l8 -78 l8 96 l6 -28 H420'
  return (
    <svg viewBox="0 0 500 400" role="img" aria-label="Patient monitor schematic with an ECG trace and three device segments.">
      <rect x="50" y="40" width="400" height="250" rx="6" fill="none" stroke="var(--line-2)" />
      <rect x="62" y="52" width="376" height="226" fill="rgba(var(--teal-rgb),.04)" stroke="var(--line)" />
      {grid}
      <path d={ecg} fill="none" stroke="rgba(var(--teal-rgb),.28)" strokeWidth="1.2" />
      <path d={ecg} fill="none" stroke="var(--teal)" strokeWidth="2" pathLength="1" strokeDasharray="0.22 1" className="ecg-scan" />
      <path d="M240 290 v28 M190 322 h120" stroke="var(--line-2)" fill="none" />
      {['Vital Monitoring', 'Medical Imaging', 'Surgical Technologies'].map((t, i) => (
        <g key={t} transform={`translate(${70 + i * 130} ${342})`}>
          <rect width="116" height="34" fill="none" stroke="var(--line-2)" />
          <circle cx="14" cy="17" r="3.5" fill={i === 0 ? 'var(--teal)' : 'var(--line-2)'} className={i === 0 ? 'blink' : ''} />
          <text x="26" y="21" className="svg-label" style={{ fontSize: 9.5 }}>{t.split(' ')[0]}</text>
        </g>
      ))}
    </svg>
  )
}

/* ── Life sciences: molecular lattice with a qualification pipeline ── */
export function LifeScene() {
  const hexes = useMemo(() => {
    const out = []
    const r = 22
    const w = Math.sqrt(3) * r
    for (let row = -1; row < 10; row++) {
      for (let col = -1; col < 13; col++) {
        const cx = col * w + (row % 2 ? w / 2 : 0)
        const cy = row * r * 1.5 + 10
        const pts = Array.from({ length: 6 }, (_, k) => {
          const a = (Math.PI / 3) * k + Math.PI / 6
          return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`
        }).join(' ')
        out.push(<polygon key={`${row}-${col}`} points={pts} fill="none" stroke="var(--line)" />)
      }
    }
    return out
  }, [])
  const nodes = [
    { x: 100, y: 250, t: 'GxP', s: 'Compliance' },
    { x: 250, y: 150, t: 'Qualification', s: '& Validation' },
    { x: 400, y: 250, t: 'Remediation', s: 'Services' },
  ]
  const hex = (x, y, r) => Array.from({ length: 6 }, (_, k) => { const a = (Math.PI / 3) * k; return `${x + r * Math.cos(a)},${y + r * Math.sin(a)}` }).join(' ')
  return (
    <svg viewBox="0 0 500 400" role="img" aria-label="Pipeline linking GxP compliance, qualification and validation, and remediation services.">
      <g opacity="0.8">{hexes}</g>
      <path d="M100 250 L250 150 L400 250" fill="none" stroke="var(--teal)" strokeWidth="1.6" strokeDasharray="4 8" className="flow" />
      {nodes.map((n, i) => (
        <g key={n.t}>
          <polygon points={hex(n.x, n.y, 46)} fill="var(--ink-2)" stroke="var(--teal)" strokeWidth="1.5" />
          <polygon points={hex(n.x, n.y, 56)} fill="none" stroke="var(--teal)" opacity="0.35" className="blink" style={{ animationDelay: `${i * 0.8}s` }} />
          <text x={n.x} y={n.y - 2} textAnchor="middle" className="svg-label" style={{ fontSize: 11, fill: 'var(--bone)' }}>{n.t}</text>
          <text x={n.x} y={n.y + 14} textAnchor="middle" className="svg-label mute" style={{ fontSize: 9.5 }}>{n.s}</text>
        </g>
      ))}
    </svg>
  )
}

/* ── Aerospace & defence: aircraft wireframe with system-level services ── */
export function AeroScene() {
  const ac = 'M250 56 L262 130 L420 226 L420 248 L262 216 L254 300 L300 330 L300 344 L250 332 L200 344 L200 330 L246 300 L238 216 L80 248 L80 226 L238 130 Z'
  const blocks = [
    { x: 14, y: 40, t: 'R&D', s: 'Services', to: [240, 140] },
    { x: 366, y: 40, t: 'Regulatory', s: 'Compliance', to: [262, 150] },
    { x: 14, y: 318, t: 'System', s: 'Safety', to: [238, 235] },
    { x: 366, y: 318, t: 'Qualification', s: '& Validation', to: [262, 235] },
  ]
  return (
    <svg viewBox="0 0 500 400" role="img" aria-label="Aircraft wireframe linked to R&D, regulatory compliance, system safety, and qualification and validation services.">
      <circle cx="250" cy="200" r="170" fill="none" stroke="var(--line)" strokeDasharray="2 6" />
      <circle cx="250" cy="200" r="110" fill="none" stroke="var(--line)" />
      <g className="radar"><path d="M250 200 L250 30 A170 170 0 0 1 370 80 Z" fill="rgba(var(--amber-rgb),.08)" /><line x1="250" y1="200" x2="250" y2="30" stroke="var(--amber)" /></g>
      <path d={ac} fill="rgba(var(--fg-rgb),.04)" stroke="var(--bone-2)" strokeWidth="1.4" pathLength="1" className="draw-in" />
      <path d="M250 70 V320" stroke="var(--line-2)" />
      <path d="M180 200 H320" stroke="var(--line)" strokeDasharray="3 5" />
      {blocks.map((b, i) => {
        const right = b.x > 200
        const ax = right ? b.x : b.x + 120
        const ay = b.y + 22
        return (
          <g key={b.t}>
            <path d={`M${ax} ${ay} L${b.to[0]} ${b.to[1]}`} stroke="var(--amber)" strokeWidth="1" strokeDasharray="3 4" className="flow" fill="none" />
            <circle cx={b.to[0]} cy={b.to[1]} r="3.5" fill="var(--amber)" />
            <rect x={b.x} y={b.y} width="120" height="44" fill="var(--ink-2)" stroke="var(--line-2)" />
            <text x={b.x + 12} y={b.y + 19} className="svg-label" style={{ fontSize: 11, fill: 'var(--bone)' }}>{b.t}</text>
            <text x={b.x + 12} y={b.y + 34} className="svg-label mute" style={{ fontSize: 9.5 }}>{b.s}</text>
          </g>
        )
      })}
    </svg>
  )
}

export const SCENES = { medical: MedicalScene, life: LifeScene, aero: AeroScene }

/* ── System Safety 2.0: from safety-in-isolation to cradle-to-grave ── */
export function SafetyViz() {
  const marks = [90, 190, 290, 390, 490, 590]
  return (
    <svg viewBox="0 0 680 440" role="img" aria-label="Comparison: the old model treats safety in isolation near the end of the lifecycle; System Safety 2.0 runs through the whole lifecycle from cradle to grave.">
      <text x="40" y="60" className="svg-label mute">Old model — safety in isolation</text>
      <line x1="40" y1="100" x2="640" y2="100" stroke="var(--line-2)" strokeDasharray="3 6" />
      <rect x="470" y="82" width="90" height="36" fill="none" stroke="var(--mute)" strokeDasharray="3 4" />
      <text x="515" y="104" textAnchor="middle" className="svg-label mute" style={{ fontSize: 10 }}>Check</text>

      <text x="40" y="190" className="svg-label amber">System Safety 2.0 — cradle to grave</text>
      <rect x="40" y="224" width="600" height="56" fill="rgba(var(--amber-rgb),.08)" stroke="var(--amber)" data-draw />
      <path d="M40 252 H640" stroke="var(--amber)" strokeWidth="1.2" strokeDasharray="4 8" className="flow" />
      {marks.map((x, i) => (
        <g key={x}>
          <circle cx={x} cy="252" r="7" fill="var(--ink)" stroke="var(--amber)" strokeWidth="1.5" className="blink" style={{ animationDelay: `${i * 0.4}s` }} />
          <line x1={x} y1="280" x2={x} y2="300" stroke="var(--line-2)" />
        </g>
      ))}
      <text x="40" y="324" className="svg-label">Cradle</text>
      <text x="640" y="324" textAnchor="end" className="svg-label">Grave</text>
      <text x="40" y="384" className="svg-label mute" style={{ fontSize: 10.5 }}>Failure modes addressed ahead in the design cycle</text>
      <path d="M40 342 H340" stroke="var(--teal)" strokeWidth="2" />
      <text x="40" y="364" className="svg-label" style={{ fill: 'var(--teal)', fontSize: 10.5 }}>Early in design</text>
    </svg>
  )
}
