import { useRef } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo.jsx'
import PageHero from '../components/PageHero.jsx'
import { Split, usePageAnimations } from '../components/anim.jsx'
import { EDGE, WHY, TEAM, CERT } from '../data/content.js'

export default function About() {
  const root = useRef(null)
  usePageAnimations(root)
  const [lead, ...rest] = TEAM
  return (
    <div ref={root}>
      <Seo title="Company" description="Caliber Assurance Services is an ISO 13485 / ISO 9001 certified design consulting firm — a group of young passionate engineers with a singular focus on the success of their clients." />
      <PageHero
        crumbs={[[null, 'Company']]}
        eyebrow="About Caliber"
        title="A group of young passionate engineers."
        em={['passionate', 'engineers.']}
        lede="With a singular focus on the success of our clients. We offer world-class services in Design & Engineering Solutions, Assurance Solutions and Consulting."
      />

      <section className="section">
        <div className="wrap two-col">
          <div className="sticky-h">
            <span className="mono eyebrow">Overview</span>
            <h2 className="display h-md" style={{ marginTop: 18 }}>{CERT}</h2>
          </div>
          <div style={{ display: 'grid', gap: 22 }} data-stagger>
            <p className="lede">At Caliber Assurance Services, we offer solutions that precisely meet constantly changing markets and technology. Consumers and businesses expect sophisticated products: the latest technologies, enhanced designs, improved materials, superior quality and an enriched user experience. As a result, product companies are continuously innovating, re-engineering, optimising processes, localising, customising and rationalising cost.</p>
            <p className="lede">Our R&amp;D services focus on enabling customers to stay well ahead of the technology curve. We are closely involved in every phase of the product development life cycle — from conceptualisation, architecting and design implementation, through integration, validation, support and managed services — with a strong focus on regulatory compliance in Medical Devices, Avionics and related industries.</p>
          </div>
        </div>
      </section>

      <section className="section section--tight" style={{ background: 'var(--ink-2)' }}>
        <div className="wrap">
          <span className="mono eyebrow">The Caliber edge</span>
          <div className="trio" style={{ marginTop: 36 }} data-stagger>
            {EDGE.map((e, i) => (
              <div key={e.t}><span className="idx">0{i + 1}</span><h3>{e.t}</h3><p>{e.d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="mono eyebrow">Why Caliber</span>
              <Split className="display h-lg" style={{ marginTop: 22 }} text="Three reasons our clients choose us." em={['clients']} />
            </div>
          </div>
          <div className="trio" data-stagger>
            {WHY.map((w, i) => (
              <div key={w.t}><span className="idx">0{i + 1}</span><h3>{w.t}</h3><p>{w.d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section paper">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="mono eyebrow">Leadership team</span>
              <Split className="display h-lg" style={{ marginTop: 22 }} text="The people behind the practice." em={['people']} />
            </div>
          </div>
          <div className="team">
            <div className="lead-card" data-reveal>
              <img className="lead-photo" style={{ borderColor: 'var(--paper-line)' }} src={lead.photo} alt={`Portrait of ${lead.name}`} width="263" height="300" loading="lazy" />
              <div>
                <h3 className="display h-md">{lead.name}</h3>
                <p className="mono mute" style={{ margin: '8px 0 16px' }}>{lead.role}</p>
                <p style={{ color: 'var(--paper-mute)' }}>{lead.bio}</p>
                <p style={{ marginTop: 18 }}><a className="link-arrow" href={lead.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></p>
              </div>
            </div>
            <div className="roster" data-stagger>
              {rest.map((p) => (
                <div className="person" key={p.name}>
                  <span className="mono-badge" style={{ color: 'var(--amber)', borderColor: 'var(--paper-line)' }} aria-hidden="true">{p.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</span>
                  <div><b>{p.name}</b><span>{p.role}</span></div>
                  {p.linkedin && <a href={p.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} on LinkedIn`}>LinkedIn ↗</a>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="display h-md">Ready to talk compliance?</h2>
          <Link to="/contact" className="btn btn--solid">Contact us <span className="arr">→</span></Link>
        </div>
      </section>
    </div>
  )
}
