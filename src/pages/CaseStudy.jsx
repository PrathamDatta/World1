import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import Seo from '../components/Seo.jsx'
import PageHero from '../components/PageHero.jsx'
import { usePageAnimations } from '../components/anim.jsx'
import CaseViz from '../viz/CaseViz.jsx'
import NotFound from './NotFound.jsx'
import { CASES } from '../data/content.js'

export default function CaseStudy() {
  const { slug } = useParams()
  const root = useRef(null)
  usePageAnimations(root, [slug])
  const i = CASES.findIndex((c) => c.slug === slug)
  if (i < 0) return <NotFound />
  const c = CASES[i]
  const prev = CASES[(i + CASES.length - 1) % CASES.length]
  const next = CASES[(i + 1) % CASES.length]
  return (
    <div ref={root} key={slug}>
      <Seo title={c.seoTitle} description={`${c.title}. ${c.summary}`.slice(0, 158)} />
      <PageHero crumbs={[['/case-studies', 'Case studies'], [null, `Case study ${c.n}`]]} eyebrow={`Case study ${c.n} · ${c.kicker}`} title={c.title} />
      <section className="section section--tight">
        <div className="wrap">
          <div className="case-viz" data-reveal><CaseViz kind={c.kind} /></div>
        </div>
      </section>
      <section className="section section--tight">
        <div className="wrap">
          {c.kind === 'loop' ? (
            <div className="two-col">
              <div className="sticky-h"><span className="mono eyebrow">The engagement</span></div>
              <div>
                <p className="lede" style={{ marginBottom: 24 }}>{c.summary}</p>
                <ol className="tick-list" style={{ listStyle: 'none' }} data-stagger>
                  {c.loop.map((l) => <li key={l.t}>{l.t}{l.s ? ` — ${l.s}` : ''}</li>)}
                </ol>
                <p className="mute" style={{ marginTop: 24, fontSize: 14 }}>{c.note}</p>
              </div>
            </div>
          ) : (
            <div className="cs-cols" data-stagger>
              <div><h3>Business challenges</h3><ul className="tick-list">{c.challenges.map((x) => <li key={x}>{x}</li>)}</ul></div>
              <div><h3>Our solutions</h3><ul className="tick-list">{c.solutions.map((x) => <li key={x}>{x}</li>)}</ul></div>
              <div><h3>Benefits</h3><ul className="tick-list">{c.benefits.map((x) => <li key={x}>{x}</li>)}</ul></div>
            </div>
          )}
        </div>
      </section>
      <section className="section--tight">
        <div className="wrap pager">
          <Link to={`/case-studies/${prev.slug}`}><span className="mono mute">← Previous</span><span className="display">{prev.title}</span></Link>
          <Link to={`/case-studies/${next.slug}`}><span className="mono mute">Next →</span><span className="display">{next.title}</span></Link>
        </div>
      </section>
    </div>
  )
}
