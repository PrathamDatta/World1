import { useRef } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo.jsx'
import PageHero from '../components/PageHero.jsx'
import { Split, usePageAnimations } from '../components/anim.jsx'
import { SCENES, SafetyViz } from '../viz/Scenes.jsx'
import { INDUSTRIES, SYSTEM_SAFETY } from '../data/content.js'

export default function Industries() {
  const root = useRef(null)
  usePageAnimations(root)
  return (
    <div ref={root}>
      <Seo title="Industries Served — System Safety 2.0" description="Caliber serves avionics, defence, life science and medical device organisations with System Safety 2.0 thinking." />
      <PageHero
        crumbs={[[null, 'Industries']]}
        eyebrow="Industry verticals"
        title="Welcome to System Safety 2.0."
        em={['System', 'Safety', '2.0.']}
        lede={SYSTEM_SAFETY.p2}
      />
      <section className="section">
        <div className="wrap ss-grid">
          <div>
            <p style={{ color: 'var(--bone-2)', maxWidth: '54ch' }} data-reveal>{SYSTEM_SAFETY.p1}</p>
            <p className="mono mute" style={{ margin: '36px 0 14px' }}>Industries that we serve</p>
            <div className="serves" style={{ marginTop: 0 }}>{SYSTEM_SAFETY.serves.map((s) => <span className="chip" key={s}>{s}</span>)}</div>
          </div>
          <div className="ss-viz" data-reveal><SafetyViz /></div>
        </div>
      </section>
      <section className="section section--tight" style={{ background: 'var(--ink-2)' }}>
        <div className="wrap" style={{ display: 'grid', gap: 56 }}>
          {INDUSTRIES.map((i, k) => {
            const Scene = SCENES[i.id]
            return (
              <Link to={`/industries/${i.slug}`} key={i.id} className="ind-stage" style={{ padding: 0, borderTop: '1px solid var(--line)', paddingTop: 40 }} data-reveal>
                <div className="scene" style={{ order: k % 2 && 0 }}><Scene /></div>
                <div className="ind-copy">
                  <span className="mono" style={{ color: 'var(--amber)' }}>0{k + 1}</span>
                  <h2 className="display h-lg" style={{ margin: '14px 0 16px' }}>{i.name}</h2>
                  <p className="lede" style={{ marginBottom: 24 }}>{i.lede}</p>
                  <span className="link-arrow">Explore <span>→</span></span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
