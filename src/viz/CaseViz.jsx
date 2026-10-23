import { CASES } from '../data/content.js'

const CX = 400, CY = 225

/* Case 1 — the six-stage product loop exactly as presented on Caliber's case-study page */
function Loop() {
  const items = CASES[0].loop
  // 3 columns x 2 rows, connected clockwise
  const pos = [[100, 110], [400, 110], [700, 110], [700, 340], [400, 340], [100, 340]]
  const w = 200, h = 96
  const path = 'M200 110 H300 M500 110 H600 M700 158 V292 M600 340 H500 M300 340 H200 M100 292 V158'
  return (
    <svg viewBox="0 0 800 450" role="img" aria-label="Loop of six stages: design services, independent verification testing, design validation and usability engineering, market research, marketing and sales, regulatory assurance.">
      <path d={path} fill="none" stroke="var(--amber)" strokeWidth="1.5" strokeDasharray="4 7" className="flow" />
      <rect x="100" y="110" width="600" height="230" fill="none" stroke="var(--line)" strokeDasharray="2 8" />
      {items.map((it, i) => {
        const [x, y] = pos[i]
        const lines = it.t.split(' ').reduce((a, wd) => {
          const last = a[a.length - 1]
          if (last && (last + ' ' + wd).length <= 18) a[a.length - 1] = last + ' ' + wd
          else a.push(wd)
          return a
        }, [])
        return (
          <g key={it.t}>
            <rect x={x - w / 2} y={y - h / 2} width={w} height={h} fill="var(--ink)" stroke={i === 0 ? 'var(--amber)' : 'var(--line-2)'} />
            <text x={x - w / 2 + 14} y={y - h / 2 + 20} className="svg-label amber" style={{ fontSize: 10 }}>{`0${i + 1}`}</text>
            {lines.map((l, k) => (
              <text key={k} x={x - w / 2 + 14} y={y - 6 + k * 17} className="svg-label" style={{ fontSize: 11.5, fill: 'var(--bone)' }}>{l}</text>
            ))}
            {it.s && ['Hardware, firmware,', 'mechanical, system'].map((l, k) => (
              <text key={k} x={x - w / 2 + 14} y={y + h / 2 - 20 + k * 12} className="svg-label mute" style={{ fontSize: 9 }}>{l}</text>
            ))}
          </g>
        )
      })}
      <circle r="5" fill="var(--amber)">
        <animateMotion dur="14s" repeatCount="indefinite" path="M100 110 H700 V340 H100 Z" />
      </circle>
    </svg>
  )
}

/* Case 2 — bulky monitor replaced by tiny wireless device with BT link */
function Ecg() {
  const wave = 'M30 225 H110 l8 -10 l8 10 H160 l8 12 l10 -92 l10 112 l8 -32 H250 l10 -22 l12 22 H320'
  return (
    <svg viewBox="0 0 800 450" role="img" aria-label="A bulky ECG monitor on the left replaced by a tiny wireless sensor connected over Bluetooth.">
      <g opacity="0.55">
        <rect x="30" y="90" width="230" height="170" fill="none" stroke="var(--line-2)" strokeDasharray="4 5" />
        <rect x="46" y="106" width="198" height="110" fill="none" stroke="var(--line)" />
        <path d={wave.replace(/^M30 225/, 'M46 160').replace('H110', 'H80')} fill="none" stroke="var(--mute)" transform="scale(0.62) translate(30 60)" />
        <path d="M145 260 v30 M95 292 h100" stroke="var(--line-2)" />
        <text x="30" y="330" className="svg-label mute">Bulky ECG monitor</text>
      </g>
      <path d="M270 175 h70" stroke="var(--line-2)" strokeDasharray="3 5" />
      <path d="M296 170 l12 5 l-12 5" fill="none" stroke="var(--amber)" />
      <g transform="translate(410 150)">
        <rect width="72" height="52" rx="6" fill="var(--ink)" stroke="var(--teal)" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="3" fill="var(--teal)" className="blink" />
        <path d="M12 36 h12 l4 -10 l6 18 l4 -8 h22" fill="none" stroke="var(--teal)" strokeWidth="1.3" />
      </g>
      <text x="410" y="236" className="svg-label" style={{ fill: 'var(--teal)' }}>Tiny wireless device</text>
      {[26, 48, 70].map((r, i) => (
        <path key={r} d={`M${500 + i * 2} ${176 - r * 0.7} A${r} ${r} 0 0 1 ${500 + i * 2} ${176 + r * 0.7}`} fill="none" stroke="var(--amber)" className="blink" style={{ animationDelay: `${i * 0.3}s` }} />
      ))}
      <g transform="translate(610 120)">
        <rect width="150" height="110" fill="none" stroke="var(--line-2)" />
        <rect x="14" y="14" width="122" height="62" fill="none" stroke="var(--line)" />
        <path d="M14 46 h26 l4 -16 l8 34 l6 -18 h20 l4 -10 l6 10 h44" fill="none" stroke="var(--amber)" strokeWidth="1.5" pathLength="1" strokeDasharray="0.3 1" className="ecg-scan" />
        <text x="14" y="98" className="svg-label mute" style={{ fontSize: 9.5 }}>Remote patient care</text>
      </g>
      <path d="M30 380 H770" stroke="var(--line)" />
      <text x="30" y="410" className="svg-label mute">ADAS1000-4 analog front end · BT connectivity</text>
    </svg>
  )
}

/* Case 3 — forced oscillation superimposed on breathing */
function Fot() {
  const pts = Array.from({ length: 161 }, (_, i) => {
    const x = 40 + i * 4.5
    const t = i / 160
    const y = CY + Math.sin(t * Math.PI * 4) * 70 + Math.sin(t * Math.PI * 4 * 14) * 9
    return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`
  }).join(' ')
  const base = Array.from({ length: 161 }, (_, i) => `${i ? 'L' : 'M'}${(40 + i * 4.5).toFixed(1)} ${(CY + Math.sin((i / 160) * Math.PI * 4) * 70).toFixed(1)}`).join(' ')
  return (
    <svg viewBox="0 0 800 450" role="img" aria-label="Breathing waveform with a small forced oscillation superimposed on it.">
      <line x1="40" y1={CY} x2="760" y2={CY} stroke="var(--line)" />
      {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={40 + i * 180} y1="70" x2={40 + i * 180} y2="380" stroke="var(--line)" strokeDasharray="2 6" />)}
      <path d={base} fill="none" stroke="var(--line-2)" strokeWidth="1.4" strokeDasharray="5 6" />
      <path d={pts} fill="none" stroke="var(--teal)" strokeWidth="1.6" pathLength="1" className="draw-in" />
      <text x="40" y="52" className="svg-label amber">Forced Oscillation Technique</text>
      <text x="40" y="414" className="svg-label mute">Breathing signal · small superimposed oscillation · patient-friendly technique</text>
    </svg>
  )
}

export default function CaseViz({ kind }) {
  return kind === 'loop' ? <Loop /> : kind === 'ecg' ? <Ecg /> : <Fot />
}
