import { useRef } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo.jsx'
import PageHero from '../components/PageHero.jsx'
import { Split, usePageAnimations } from '../components/anim.jsx'
import Ecosystem from '../components/Ecosystem.jsx'
import { PILLARS, STAGES } from '../data/content.js'

export default function Services() {
  const root = useRef(null)
  usePageAnimations(root)
  return (
    <div ref={root}>
      <Seo title="Services" description="Design & engineering, verification & validation / assurance, and consulting services from Caliber Assurance Services." />
      <PageHero
        crumbs={[[null, 'Services']]}
        eyebrow="Our services"
        title="Design, assurance and consulting."
        em={['assurance']}
        lede="World-class services in Design & Engineering Solutions, Assurance Solutions and Consulting — with regulatory requirements treated as critical to quality."
      />

      <section className="section">
        <div className="wrap">
          <div className="svc-table" data-stagger>
            {PILLARS.map((p, i) => (
              <div className="svc-col" key={p.id}>
                <span className="mono" style={{ color: 'var(--amber)' }}>0{i + 1}</span>
                <h3>{p.title}</h3>
                <ul className="tick-list">{p.services.map((s) => <li key={s.id}>{s.name}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--ink-2)' }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="mono eyebrow">How they connect</span>
              <Split className="display h-lg" style={{ marginTop: 22 }} text="From service to industry." em={['industry.']} />
            </div>
            <p className="lede">Select a service to see which industry verticals document it, or start from an industry.</p>
          </div>
          <Ecosystem />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="mono eyebrow">Total ownership</span>
              <Split className="display h-lg" style={{ marginTop: 22 }} text="Turnkey, concept to post-market." em={['Turnkey,']} />
            </div>
            <p className="lede">Turnkey solutions covering concept, design, engineering, prototyping, validation, compliance testing, certifications, maintenance, value engineering and post-market surveillance.</p>
          </div>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, borderTop: '1px solid var(--line)' }} data-stagger>
            {STAGES.map((s) => (
              <li key={s.id} style={{ display: 'grid', gap: 12, padding: '26px 0', borderBottom: '1px solid var(--line)', gridTemplateColumns: 'minmax(48px,80px) minmax(0,1fr)' }}>
                <span className="mono" style={{ color: 'var(--amber)' }}>{s.n}</span>
                <div>
                  <h3 className="display h-sm">{s.name}</h3>
                  <p className="mute" style={{ margin: '8px 0 12px', maxWidth: '60ch' }}>{s.body}</p>
                  <div className="chips" style={{ marginTop: 0 }}>{s.services.map((x) => <span className="chip" key={x}>{x}</span>)}</div>
                </div>
              </li>
            ))}
          </ol>
          <p style={{ marginTop: 40 }}><Link to="/contact" className="btn btn--solid">Discuss your project <span className="arr">→</span></Link></p>
        </div>
      </section>
    </div>
  )
}
