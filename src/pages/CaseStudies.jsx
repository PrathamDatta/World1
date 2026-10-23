import { useRef } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo.jsx'
import PageHero from '../components/PageHero.jsx'
import { usePageAnimations } from '../components/anim.jsx'
import CaseViz from '../viz/CaseViz.jsx'
import { CASES } from '../data/content.js'

export default function CaseStudies() {
  const root = useRef(null)
  usePageAnimations(root)
  return (
    <div ref={root}>
      <Seo title="Medical Device Engineering Case Studies" description="Documented medical-device engagements: end-to-end product consultancy, a wireless vital monitoring device and a forced-oscillation PFT device." />
      <PageHero crumbs={[[null, 'Case studies']]} eyebrow="Case studies" title="Credentials, proven in practice." em={['proven']} lede="We have some great case studies to prove credentials." />
      <section className="section">
        <div className="wrap" style={{ display: 'grid', gap: 72 }}>
          {CASES.map((c) => (
            <Link to={`/case-studies/${c.slug}`} key={c.slug} className="ind-stage" style={{ padding: 0 }} data-reveal>
              <div className="case-viz"><CaseViz kind={c.kind} /></div>
              <div className="ind-copy">
                <span className="mono" style={{ color: 'var(--amber)' }}>{c.n} · {c.kicker}</span>
                <h2 className="display h-md" style={{ margin: '14px 0 14px' }}>{c.title}</h2>
                <p className="lede" style={{ marginBottom: 24 }}>{c.summary}</p>
                <span className="link-arrow">Read case study <span>→</span></span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
