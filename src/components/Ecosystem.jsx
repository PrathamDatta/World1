import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { PILLARS, INDUSTRIES, LINKS } from '../data/content.js'

const svcName = (id) => PILLARS.flatMap((p) => p.services).find((s) => s.id === id)?.name
const indOf = (id) => INDUSTRIES.find((i) => i.id === id)

/**
 * Connected capability map. Services (left) link to the industry verticals (right) that
 * Caliber's pages document them for. Selecting either side lights the related edges.
 * Edges are measured from the DOM so the SVG stays aligned at any width.
 */
export default function Ecosystem() {
  const box = useRef(null)
  const refs = useRef({})
  const [sel, setSel] = useState(null) // { kind: 's' | 'i', id }
  const [edges, setEdges] = useState([])

  const measure = useCallback(() => {
    const b = box.current
    if (!b) return
    const br = b.getBoundingClientRect()
    const out = LINKS.map((l) => {
      const a = refs.current['s:' + l.s]?.getBoundingClientRect()
      const c = refs.current['i:' + l.i]?.getBoundingClientRect()
      if (!a || !c) return null
      return { ...l, x1: a.right - br.left, y1: a.top + a.height / 2 - br.top, x2: c.left - br.left, y2: c.top + c.height / 2 - br.top }
    }).filter(Boolean)
    setEdges(out)
  }, [])

  useLayoutEffect(() => {
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(box.current)
    document.fonts?.ready.then(measure)
    return () => ro.disconnect()
  }, [measure])
  useEffect(() => {
    const t = setTimeout(measure, 600)
    return () => clearTimeout(t)
  }, [measure])

  const active = (l) => !sel || (sel.kind === 's' ? l.s === sel.id : l.i === sel.id)
  const relS = new Set(sel ? LINKS.filter(active).map((l) => l.s) : [])
  const relI = new Set(sel ? LINKS.filter(active).map((l) => l.i) : [])
  const pick = (kind, id) => setSel((cur) => (cur && cur.kind === kind && cur.id === id ? null : { kind, id }))

  let panel
  if (!sel) {
    panel = { title: 'Select a service or an industry', body: 'Each line is a documented relationship: Caliber’s industry pages name these services for these verticals.', list: [] }
  } else if (sel.kind === 's') {
    const ls = LINKS.filter((l) => l.s === sel.id)
    panel = {
      title: svcName(sel.id),
      body: ls.length ? 'Documented for:' : 'A cross-industry service — no single industry page lists it specifically.',
      list: ls.map((l) => `${indOf(l.i).name} — ${l.why}`),
    }
  } else {
    const ls = LINKS.filter((l) => l.i === sel.id)
    panel = {
      title: indOf(sel.id).name,
      body: 'Engineering and assurance services documented for this vertical:',
      list: ls.map((l) => `${svcName(l.s)} — ${l.why}`),
    }
  }

  return (
    <div>
      <div className="eco" ref={box}>
        <svg className="eco-svg" aria-hidden="true">
          {edges.map((e, i) => {
            const on = sel && active(e)
            const mx = (e.x1 + e.x2) / 2
            return (
              <path
                key={i}
                d={`M${e.x1} ${e.y1} C ${mx} ${e.y1}, ${mx} ${e.y2}, ${e.x2} ${e.y2}`}
                fill="none"
                stroke={on ? 'var(--teal)' : 'rgba(188,204,232,.16)'}
                strokeWidth={on ? 1.8 : 1}
                className={on ? 'flow' : ''}
                style={{ transition: 'stroke .4s, stroke-width .4s', opacity: sel && !on ? 0.25 : 1 }}
              />
            )
          })}
        </svg>

        <div className="eco-col">
          {PILLARS.map((p) => (
            <div key={p.id}>
              <div className="pillar-title mono"><b>{p.code}</b> {p.title}</div>
              <div className="svc-list">
                {p.services.map((s) => {
                  const k = 's:' + s.id
                  const isSel = sel?.kind === 's' && sel.id === s.id
                  const rel = LINKS.filter((l) => l.s === s.id)
                  return (
                    <div key={s.id}>
                    <button
                      ref={(el) => (refs.current[k] = el)}
                      className={`svc${isSel ? ' sel' : ''}${sel?.kind === 'i' && relS.has(s.id) ? ' rel' : ''}`}
                      aria-pressed={isSel}
                      onClick={() => pick('s', s.id)}
                    >
                      <span>{s.name}</span>
                      <span className="tick" />
                    </button>
                    {isSel && (
                      <div className="inline-rel">
                        {rel.length ? rel.map((l) => <Link key={l.i} to={`/industries/${indOf(l.i).slug}`} className="chip">{indOf(l.i).name} →</Link>) : <span className="mute">Cross-industry service.</span>}
                      </div>
                    )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="eco-hub" aria-hidden="true" />

        <div className="eco-col eco-right">
          <div className="pillar-title mono"><b>→</b> Industry verticals</div>
          {INDUSTRIES.map((i) => {
            const isSel = sel?.kind === 'i' && sel.id === i.id
            return (
              <button
                key={i.id}
                ref={(el) => (refs.current['i:' + i.id] = el)}
                className={`ind-node${isSel ? ' sel' : ''}${sel?.kind === 's' && relI.has(i.id) ? ' rel' : ''}`}
                aria-pressed={isSel}
                onClick={() => pick('i', i.id)}
              >
                <span className="mono">{i.services.length} listed services</span>
                <span className="t">{i.name}</span>
              </button>
            )
          })}
          <div className="eco-panel-wrap">
      <div className="eco-panel" aria-live="polite">
              <div>
                <p className="mono mute" style={{ marginBottom: 10 }}>Relationship</p>
                <h3 className="display h-sm">{panel.title}</h3>
              </div>
              <div>
                <p className="mute" style={{ marginBottom: 12 }}>{panel.body}</p>
                {panel.list.length > 0 && <ul>{panel.list.map((t) => <li key={t}>{t}</li>)}</ul>}
                {sel?.kind === 'i' && (
                  <p style={{ marginTop: 16 }}><Link className="link-arrow" to={`/industries/${indOf(sel.id).slug}`}>Open {indOf(sel.id).short} page →</Link></p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
