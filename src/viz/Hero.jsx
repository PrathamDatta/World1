import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { prefersReduced } from '../components/anim.jsx'

const NODES = ['Design', 'Verification', 'Validation', 'Compliance', 'Lifecycle']
const C = 300

const pol = (r, deg) => {
  const a = (deg * Math.PI) / 180
  return [C + r * Math.cos(a), C + r * Math.sin(a)]
}

/** Canvas dot-field: a calm engineering grid with a slow sweep and cursor-lit points. */
export function HeroField() {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current
    const ctx = cv.getContext('2d')
    const reduced = prefersReduced()
    let w = 0, h = 0, raf = 0, visible = true
    const mouse = { x: -999, y: -999, tx: -999, ty: -999 }
    const GAP = 44
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const cs = getComputedStyle(cv)
    const fg = cs.getPropertyValue('--fg-rgb').trim() || '35,40,45'
    const acc = cs.getPropertyValue('--amber-rgb').trim() || '45,111,161'

    const size = () => {
      const r = cv.getBoundingClientRect()
      w = r.width; h = r.height
      cv.width = w * dpr; cv.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const draw = (t) => {
      ctx.clearRect(0, 0, w, h)
      mouse.x += (mouse.tx - mouse.x) * 0.08
      mouse.y += (mouse.ty - mouse.y) * 0.08
      const sweep = (t * 0.00006) % 1
      const cx = w * 0.72, cy = h * 0.5
      const maxd = Math.hypot(w, h) * 0.6
      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) {
          const d = Math.hypot(x - cx, y - cy)
          const ring = Math.abs(((d / maxd) % 1) - sweep)
          let a = 0.1 + Math.max(0, 0.45 - ring * 4) * (1 - Math.min(1, d / maxd))
          const md = Math.hypot(x - mouse.x, y - mouse.y)
          const m = Math.max(0, 1 - md / 190)
          a += m * 0.7
          ctx.fillStyle = m > 0.15 ? `rgba(${acc},${Math.min(1, a)})` : `rgba(${fg},${a * 0.8})`
          const s = 1 + m * 1.6
          ctx.fillRect(x - s / 2, y - s / 2, s, s)
        }
      }
    }
    const loop = (t) => {
      if (visible) draw(t)
      raf = requestAnimationFrame(loop)
    }
    size()
    if (reduced) draw(0)
    else raf = requestAnimationFrame(loop)
    const onMove = (e) => {
      const r = cv.getBoundingClientRect()
      mouse.tx = e.clientX - r.left
      mouse.ty = e.clientY - r.top
    }
    const onLeave = () => { mouse.tx = mouse.ty = -999 }
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting))
    io.observe(cv)
    const ro = new ResizeObserver(() => { size(); if (reduced) draw(0) })
    ro.observe(cv)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [])
  return <canvas ref={ref} className="field" aria-hidden="true" />
}

export function HeroScene() {
  const root = useRef(null)
  const ticks = useMemo(
    () => Array.from({ length: 120 }, (_, i) => {
      const long = i % 10 === 0
      const [x1, y1] = pol(262, i * 3)
      const [x2, y2] = pol(long ? 276 : 269, i * 3)
      return { x1, y1, x2, y2, long }
    }),
    [],
  )

  useLayoutEffect(() => {
    const el = root.current
    const reduced = prefersReduced()
    const ctx = gsap.context(() => {
      if (!reduced) {
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.2 })
        tl.from('.h-ring', { scale: 0.82, opacity: 0, duration: 2, stagger: 0.12, transformOrigin: '50% 50%' })
          .from('.h-core', { scale: 0.6, opacity: 0, duration: 1.4, transformOrigin: '300px 300px' }, 0.3)
          .fromTo('.h-arc', { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.6, ease: 'power2.inOut' }, 0.5)
          .from('.h-node', { opacity: 0, scale: 0, transformOrigin: '50% 50%', duration: 0.9, stagger: 0.15 }, 0.9)
          .from('.h-note', { opacity: 0, x: -12, duration: 1, stagger: 0.2 }, 1.6)

        const layers = [['.l-back', 14], ['.l-mid', 26], ['.l-front', 44]]
        const qs = layers.map(([s, d]) => ({
          x: gsap.quickTo(s, 'x', { duration: 1.2, ease: 'power3.out' }),
          y: gsap.quickTo(s, 'y', { duration: 1.2, ease: 'power3.out' }),
          d,
        }))
        const move = (e) => {
          const nx = (e.clientX / window.innerWidth - 0.5) * 2
          const ny = (e.clientY / window.innerHeight - 0.5) * 2
          qs.forEach((q) => { q.x(-nx * q.d); q.y(-ny * q.d) })
        }
        window.addEventListener('pointermove', move, { passive: true })
        return () => window.removeEventListener('pointermove', move)
      }
    }, el)
    return () => ctx.revert()
  }, [])

  const pts = NODES.map((_, i) => pol(200, -90 + i * 72))

  return (
    <div className="hero-scene" ref={root}>
      <svg viewBox="-70 -10 740 620" role="img" aria-label="Diagram of a product moving through design, verification, validation, compliance and lifecycle support around a central core.">
        <defs>
          <radialGradient id="hglow" cx="50%" cy="50%" r="50%">
            <stop offset="0" style={{ stopColor: 'var(--amber)' }} stopOpacity="0.16" />
            <stop offset="1" style={{ stopColor: 'var(--amber)' }} stopOpacity="0" />
          </radialGradient>
        </defs>

        <g className="l-back">
          <circle className="h-ring" cx={C} cy={C} r="250" fill="url(#hglow)" />
          <g className="h-ring spin-rev">
            <circle cx={C} cy={C} r="262" className="stroke-line" />
            {ticks.map((t, i) => (
              <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="rgba(var(--fg-rgb),.4)" strokeWidth={t.long ? 1.3 : 0.7} />
            ))}
          </g>
          <circle className="h-ring stroke-line dash" cx={C} cy={C} r="150" />
          <circle className="h-ring stroke-line" cx={C} cy={C} r="96" />
        </g>

        <g className="l-mid">
          <circle className="h-arc" cx={C} cy={C} r="200" fill="none" stroke="rgba(var(--fg-rgb),.35)" strokeWidth="1" pathLength="1" />
          <circle cx={C} cy={C} r="200" fill="none" stroke="var(--amber)" strokeWidth="1.5" pathLength="1" strokeDasharray="0.1 0.9" className="flow-ring" />
          <circle r="4.5" fill="var(--amber)">
            <animateMotion dur="16s" repeatCount="indefinite" path={`M${C} ${C - 200} A200 200 0 1 1 ${C - 0.01} ${C - 200}`} />
          </circle>

          <g className="h-core">
            <rect x={C - 54} y={C - 54} width="108" height="108" fill="var(--ink)" stroke="var(--line-2)" />
            <rect x={C - 34} y={C - 34} width="68" height="68" fill="none" stroke="var(--amber)" strokeWidth="1.2" />
            {[-20, 0, 20].map((o) => (
              <g key={o}>
                <line x1={C - 54} y1={C + o} x2={C - 34} y2={C + o} stroke="var(--line-2)" />
                <line x1={C + 34} y1={C + o} x2={C + 54} y2={C + o} stroke="var(--line-2)" />
                <line x1={C + o} y1={C - 54} x2={C + o} y2={C - 34} stroke="var(--line-2)" />
                <line x1={C + o} y1={C + 34} x2={C + o} y2={C + 54} stroke="var(--line-2)" />
              </g>
            ))}
            <circle cx={C} cy={C} r="5" fill="var(--amber)" className="blink" />
            <path d={`M${C - 16} ${C + 10} h8 l4 -14 l6 22 l4 -8 h10`} fill="none" stroke="var(--bone)" strokeWidth="1.2" />
          </g>

          {pts.map(([x, y], i) => (
            <line key={i} x1={C} y1={C} x2={x} y2={y} className="stroke-line dash" opacity="0.35" />
          ))}
        </g>

        <g className="l-front">
          {pts.map(([x, y], i) => {
            const right = x > C + 4
            const left = x < C - 4
            const [lx, ly] = pol(236, -90 + i * 72)
            return (
              <g key={NODES[i]} className="h-node">
                <circle cx={x} cy={y} r="16" fill="var(--ink)" stroke="var(--line-2)" />
                <circle cx={x} cy={y} r="16" fill="none" stroke="var(--amber)" className="node-hot" style={{ animationDelay: `${i * 2.4}s` }} />
                <text x={x} y={y + 4} textAnchor="middle" className="svg-label amber" style={{ fontSize: 10 }}>{`0${i + 1}`}</text>
                <text x={lx} y={ly + 4} textAnchor={right ? 'start' : left ? 'end' : 'middle'} dy={!right && !left ? -6 : 0} className="svg-label">{NODES[i]}</text>
              </g>
            )
          })}

          <g className="h-note">
            <line x1="468" y1="76" x2="520" y2="40" className="stroke-line" />
            <text x="524" y="38" className="svg-label amber">ISO 13485</text>
            <text x="524" y="54" className="svg-label mute">ISO 9001 · certified</text>
          </g>
          <g className="h-note">
            <line x1="132" y1="520" x2="60" y2="566" className="stroke-line" />
            <text x="-62" y="584" className="svg-label amber">Design for global</text>
            <text x="-62" y="600" className="svg-label mute">regulatory compliance</text>
          </g>
        </g>
      </svg>
    </div>
  )
}
