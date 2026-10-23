import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import Seo from '../components/Seo.jsx'
import PageHero from '../components/PageHero.jsx'
import { usePageAnimations } from '../components/anim.jsx'
import { SCENES } from '../viz/Scenes.jsx'
import NotFound from './NotFound.jsx'
import { INDUSTRIES, LINKS, PILLARS, CASES } from '../data/content.js'

export default function Industry() {
  const { slug } = useParams()
  const idx = INDUSTRIES.findIndex((i) => i.slug === slug)
  const root = useRef(null)
  usePageAnimations(root, [slug])
  if (idx < 0) return <NotFound />
  const ind = INDUSTRIES[idx]
  const next = INDUSTRIES[(idx + 1) % INDUSTRIES.length]
  const Scene = SCENES[ind.id]
  const rel = LINKS.filter((l) => l.i === ind.id).map((l) => PILLARS.flatMap((p) => p.services).find((s) => s.id === l.s).name)
  return (
    <div ref={root} key={slug}>
      <Seo title={ind.seoTitle} description={`${ind.lede} ${ind.intro}`.slice(0, 160)} />
      <PageHero crumbs={[['/industries', 'Industries'], [null, ind.short]]} eyebrow="Industry vertical" title={ind.name} lede={ind.lede} />

      <section className="section">
        <div className="wrap ind-stage" style={{ paddingTop: 0 }}>
          <div className="scene" data-reveal><Scene /></div>
          <div>
            <p className="lede" style={{ marginBottom: 28 }} data-reveal>{ind.intro}</p>
            {ind.drivers && (
              <div data-reveal>
                <p className="mono mute" style={{ marginBottom: 12 }}>Factors driving R&amp;D outsourcing</p>
                <div className="drivers">{ind.drivers.map((d) => <span className="chip" key={d}>{d}</span>)}</div>
              </div>
            )}
            {ind.segments && (
              <div style={{ marginTop: 28 }} data-reveal>
                <p className="mono mute" style={{ marginBottom: 12 }}>Industry segments we cater to</p>
                <div className="drivers">{ind.segments.map((d) => <span className="chip" key={d} style={{ color: 'var(--teal)', borderColor: 'var(--teal)' }}>{d}</span>)}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section section--tight" style={{ background: 'var(--ink-2)' }}>
        <div className="wrap two-col">
          <div className="sticky-h">
            <span className="mono eyebrow">What we deliver</span>
            <h2 className="display h-md" style={{ marginTop: 18 }}>{ind.servicesTitle}</h2>
            {ind.standards?.length > 0 && (
              <div className="drivers" style={{ marginTop: 24 }}>{ind.standards.map((s) => <span className="chip" key={s} style={{ color: 'var(--amber)', borderColor: 'rgba(var(--amber-rgb),.4)' }}>{s}</span>)}</div>
            )}
          </div>
          <div>
            <ul className="tick-list" data-stagger>{ind.services.map((s) => <li key={s}>{s}</li>)}</ul>
            {rel.length > 0 && (
              <p className="mute" style={{ marginTop: 28, fontSize: 15 }}>Related service-table entries: {rel.join(' · ')}.</p>
            )}
          </div>
        </div>
      </section>

      {ind.id === 'medical' && (
        <section className="section section--tight paper">
          <div className="wrap">
            <span className="mono eyebrow">Evidence</span>
            <h2 className="display h-md" style={{ margin: '18px 0 28px' }}>Medical device case studies</h2>
            <div className="case-list">
              {CASES.map((c) => (
                <Link to={`/case-studies/${c.slug}`} className="case-row" key={c.slug}>
                  <span className="num">{c.n}</span>
                  <h3>{c.title}</h3>
                  <p>{c.summary}</p>
                  <span className="link-arrow go">Read <span>→</span></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section section--tight">
        <div className="wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="mono mute">Next vertical</p>
            <Link to={`/industries/${next.slug}`} className="display h-md" style={{ display: 'inline-block', marginTop: 8 }}>{next.name} →</Link>
          </div>
          <Link to="/contact" className="btn btn--solid">Contact us for further information <span className="arr">→</span></Link>
        </div>
      </section>
    </div>
  )
}
