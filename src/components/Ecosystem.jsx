import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { PILLARS, INDUSTRIES, LINKS, STAGES } from '../data/content.js'

const ALL = PILLARS.flatMap((p) => p.services.map((s) => ({ ...s, pillar: p.id })))
const svc = (id) => ALL.find((s) => s.id === id)
const svcName = (id) => svc(id)?.name
const pillarOf = (sid) => PILLARS.find((p) => p.id === svc(sid)?.pillar)
const indOf = (id) => INDUSTRIES.find((i) => i.id === id)
const stageOf = (sid) => STAGES.find((st) => st.services.includes(svcName(sid)))

/**
 * Connected capability map. Three kinds of connection:
 *  - rail: every service belongs to a pillar of Caliber's services table (all 16 are linked);
 *  - lines: service → industry vertical, where an industry page names that service;
 *  - lifecycle stage: where the service appears in the lifecycle scene above.
 * Edges are measured from the DOM so the SVG stays aligned at any width.
 */
export default function Ecosystem() {
  const box = useRef(null)
  const refs = useRef({})
  const [sel, setSel] = useState(null) // { kind: 's' | 'i' | 'p', id }
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

  const active = (l) => {
    if (!sel) return true
    if (sel.kind === 's') return l.s === sel.id
    if (sel.kind === 'i') return l.i === sel.id
    return svc(l.s).pillar === sel.id
  }
  const activeLinks = sel ? LINKS.filter(active) : []
  const relS = new Set(activeLinks.map((l) => l.s))
  const relI = new Set(activeLinks.map((l) => l.i))
  const pillarLit = (p) => (sel?.kind === 'p' && sel.id === p.id) || (sel?.kind === 's' && svc(sel.id).pillar === p.id)
  const pick = (kind, id) => setSel((cur) => (cur && cur.kind === kind && cur.id === id ? null : { kind, id }))

  const indNames = (sid) => LINKS.filter((l) => l.s === sid).map((l) => indOf(l.i).short)

  let panel
  if (!sel) {
    panel = { title: 'Select a pillar, service or industry', body: 'Rails group the services into Caliber’s three pillars. Lines show which industry pages name each service.', list: [] }
  } else if (sel.kind === 'p') {
    const p = PILLARS.find((x) => x.id === sel.id)
    panel = {
      title: p.title,
      body: `${p.services.length} services in this pillar:`,
      list: p.services.map((s) => `${s.name} — ${indNames(s.id).join(', ') || 'named on no single industry page'}`),
    }
  } else if (sel.kind === 's') {
    const ls = LINKS.filter((l) => l.s === sel.id)
    const st = stageOf(sel.id)
    const p = pillarOf(sel.id)
    panel = {
      title: svcName(sel.id),
      body: ls.length ? `${p.title} · documented for:` : `${p.title}. Caliber’s industry pages don’t name this service separately, so it is linked only to its pillar.`,
      list: [
        ...ls.map((l) => `${indOf(l.i).name} — ${l.why}`),
        ...(st ? [`Lifecycle stage ${st.n}: ${st.name} (our placement of this service in the lifecycle)`] : []),
      ],
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
                stroke={on ? 'var(--teal)' : 'rgba(var(--fg-rgb),.16)'}
                strokeWidth={on ? 1.8 : 1}
                className={on ? 'flow' : ''}
                style={{ transition: 'stroke .4s, stroke-width .4s', opacity: sel && !on ? 0.25 : 1 }}
              />
            )
          })}
        </svg>

        <div className="eco-col">
          {PILLARS.map((p) => (
            <div key={p.id} className={`pillar${pillarLit(p) ? ' lit' : ''}`}>
              <button className={`pillar-title mono${sel?.kind === 'p' && sel.id === p.id ? ' sel' : ''}`} aria-pressed={sel?.kind === 'p' && sel.id === p.id} onClick={() => pick('p', p.id)}>
                <b>{p.code}</b> {p.title} <span className="count">{p.services.length}</span>
              </button>
              <div className="svc-list">
                {p.services.map((s) => {
                  const k = 's:' + s.id
                  const isSel = sel?.kind === 's' && sel.id === s.id
                  const rel = LINKS.filter((l) => l.s === s.id)
                  const st = stageOf(s.id)
                  return (
                    <div key={s.id}>
                      <button
                        ref={(el) => (refs.current[k] = el)}
                        className={`svc${isSel ? ' sel' : ''}${(sel?.kind === 'i' || sel?.kind === 'p') && relS.has(s.id) ? ' rel' : ''}${sel?.kind === 'p' && sel.id === p.id ? ' rel' : ''}`}
                        aria-pressed={isSel}
                        onClick={() => pick('s', s.id)}
                      >
                        <span>{s.name}</span>
                        <span className="tick" />
                      </button>
                      {isSel && (
                        <div className="inline-rel">
                          {rel.map((l) => <Link key={l.i} to={`/industries/${indOf(l.i).slug}`} className="chip">{indOf(l.i).name} →</Link>)}
                          {st && <span className="chip">Stage {st.n} · {st.name}</span>}
                          {!rel.length && <span className="mute">Linked to its pillar only; no industry page names it separately.</span>}
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
          <div className="pillar-title mono static"><b>→</b> Industry verticals</div>
          {INDUSTRIES.map((i) => {
            const isSel = sel?.kind === 'i' && sel.id === i.id
            return (
              <button
                key={i.id}
                ref={(el) => (refs.current['i:' + i.id] = el)}
                className={`ind-node${isSel ? ' sel' : ''}${(sel?.kind === 's' || sel?.kind === 'p') && relI.has(i.id) ? ' rel' : ''}`}
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
