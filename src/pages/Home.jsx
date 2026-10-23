import {useCallback, useEffect, useRef, useState} from 'react'
import { useIsoLayoutEffect } from '../components/iso.js'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Seo from '../components/Seo.jsx'
import { Split, usePageAnimations, prefersReduced } from '../components/anim.jsx'
import { HeroField, HeroScene } from '../viz/Hero.jsx'
import LifecycleViz from '../viz/Lifecycle.jsx'
import Ecosystem from '../components/Ecosystem.jsx'
import { SCENES, SafetyViz } from '../viz/Scenes.jsx'
import CaseViz from '../viz/CaseViz.jsx'
import { STAGES, INDUSTRIES, CASES, WHY, SYSTEM_SAFETY, TEAM } from '../data/content.js'

/* ───────── Lifecycle: sticky scene scrubbed by scroll ───────── */
function Lifecycle() {
  const track = useRef(null)
  const arc = useRef(null)
  const [stage, setStage] = useState(0)
  const last = useRef(0)

  useIsoLayoutEffect(() => {
    const st = ScrollTrigger.create({
      trigger: track.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const p6 = Math.min(self.progress, 0.9999) * 6
        const s = Math.floor(p6)
        if (arc.current) arc.current.style.strokeDashoffset = String(1 - Math.min(1, self.progress))
        if (s !== last.current) {
          last.current = s
          setStage(s)
        }
      },
    })
    return () => st.kill()
  }, [])

  const goTo = useCallback((i) => {
    const el = track.current
    const top = el.getBoundingClientRect().top + window.scrollY
    const span = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + ((i + 0.5) / 6) * span, behavior: prefersReduced() ? 'auto' : 'smooth' })
  }, [])

  return (
    <section className="lc dark" id="lifecycle" aria-label="Engineering lifecycle">
      <div className="lc-track" ref={track}>
        <div className="lc-stick">
          <div className="wrap" style={{ display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
            <div className="lc-top">
              <div>
                <span className="mono eyebrow lc-eyebrow">The engineering lifecycle</span>
                <h2 className="display h-md" style={{ marginTop: 10 }}>One product. <em>Six</em> stages. One loop.</h2>
              </div>
              <div className="lc-progress" role="tablist" aria-label="Lifecycle stage">
                {STAGES.map((s, i) => (
                  <button key={s.id} role="tab" aria-selected={i === stage} aria-label={`${s.n} ${s.name}`} className={i === stage ? 'on' : ''} onClick={() => goTo(i)} />
                ))}
              </div>
            </div>
            <div className="lc-grid">
              <div className="lc-viz">
                <LifecycleViz stage={stage} arcRef={arc} onPick={goTo} />
              </div>
              <div className="lc-copy" aria-live="polite">
                {STAGES.map((s, i) => (
                  <article key={s.id} className={`lc-stage${i === stage ? ' on' : ''}`} aria-hidden={i !== stage}>
                    <span className="n">{s.n} / 06</span>
                    <h3 className="display h-md">{s.name}</h3>
                    <p className="display h-sm em" style={{ marginBottom: 12, color: 'var(--bone)', fontStyle: 'italic' }}>{s.line}</p>
                    <p className="body">{s.body}</p>
                    <div className="chips">{s.services.map((x) => <span className="chip" key={x}>{x}</span>)}</div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────── Industries: tabbed scenes ───────── */
function IndustryTabs() {
  const [id, setId] = useState('medical')
  const cur = INDUSTRIES.find((i) => i.id === id)
  const Scene = SCENES[id]
  const onKey = (e) => {
    const idx = INDUSTRIES.findIndex((i) => i.id === id)
    if (e.key === 'ArrowRight') setId(INDUSTRIES[(idx + 1) % 3].id)
    if (e.key === 'ArrowLeft') setId(INDUSTRIES[(idx + 2) % 3].id)
  }
  const corner = { medical: 'Vital monitoring · Imaging · Surgical', life: 'Pharma industry', aero: 'Avionics · Defence · Automotive' }[id]
  return (
    <div>
      <div className="tabs" role="tablist" aria-label="Industry verticals" onKeyDown={onKey}>
        {INDUSTRIES.map((i) => (
          <button key={i.id} role="tab" id={`tab-${i.id}`} aria-controls="ind-panel" aria-selected={i.id === id} tabIndex={i.id === id ? 0 : -1} className="tab" onClick={() => setId(i.id)}>
            {i.name}
          </button>
        ))}
      </div>
      <div className="ind-stage" id="ind-panel" role="tabpanel" aria-labelledby={`tab-${id}`} key={id}>
        <div className="scene fade-swap">
          <Scene />
          <span className="corner tl">{corner}</span>
        </div>
        <div className="ind-copy fade-swap">
          <h3 className="display h-md">{cur.name}</h3>
          <p className="lede">{cur.lede}</p>
          <ul className="tick-list">
            {cur.services.slice(0, 6).map((s) => <li key={s}>{s}</li>)}
          </ul>
          <p style={{ marginTop: 28 }}><Link className="link-arrow" to={`/industries/${cur.slug}`}>Explore {cur.short} <span>→</span></Link></p>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const root = useRef(null)
  usePageAnimations(root)

  useEffect(() => {
    // the lifecycle track changes document height; refresh once fonts settle
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return (
    <div ref={root}>
      <Seo description="ISO 13485 / ISO 9001 certified design consulting in Bengaluru: engineering, V&V and regulatory compliance for medical devices, pharma and avionics." />

      {/* HERO */}
      <section className="hero" aria-label="Introduction">
        <HeroField />
        <div className="wrap hero-in">
          <div className="hero-copy">
            <span className="mono eyebrow" data-reveal data-hero data-delay="0.1">Caliber Assurance Services · Bengaluru</span>
            <Split as="h1" data-hero className="display h-xl" text="Engineered for global compliance, from the first design decision." em={['global', 'compliance,']} />
            <p className="lede" data-reveal data-hero data-delay="0.7">
              An ISO 13485 / ISO 9001 certified design consulting firm delivering globally compliant engineering and quality solutions to life science, avionics and other safety-critical domains.
            </p>
            <div className="cta-row" data-reveal data-hero data-delay="0.9">
              <a href="#lifecycle" className="btn btn--solid">See the lifecycle <span className="arr">↓</span></a>
              <Link to="/contact" className="btn">Talk to our team <span className="arr">→</span></Link>
            </div>
          </div>
          <HeroScene />
        </div>
        <div className="scroll-hint mono" aria-hidden="true"><span className="bar" /> Scroll</div>
        <div className="hero-meta mono" aria-hidden="true">Design · Verification · Compliance</div>
      </section>

      {/* STATEMENT */}
      <section className="section statement">
        <div className="wrap">
          <span className="mono eyebrow" data-reveal>What Caliber does</span>
          <Split as="p" className="display h-lg" style={{ marginTop: 28 }} text="We design, verify and certify products for the world’s safety-critical domains." em={['verify', 'certify']} />
          <div className="facts" data-stagger>
            <div className="fact">
              <span className="num"><span data-count="100">100</span><sup>+</sup></span>
              <p>years of cumulative expertise in design, engineering, quality and regulatory assurance.</p>
            </div>
            <div className="fact">
              <span className="num" style={{ fontSize: 'clamp(2rem,3.4vw,3.2rem)', lineHeight: 1.1 }}>ISO 13485<br />ISO 9001</span>
              <p>certified design consulting firm — the quality system behind every engagement.</p>
            </div>
            <div className="fact">
              <span className="num"><span data-count="3">3</span></span>
              <p>service pillars: Design &amp; Engineering, Verification &amp; Validation, and Consulting.</p>
            </div>
          </div>
        </div>
      </section>

      <Lifecycle />

      {/* ECOSYSTEM */}
      <section className="section" id="ecosystem" style={{ background: 'var(--ink)' }}>
        <div className="grid-bg" aria-hidden="true" />
        <div className="wrap" style={{ position: 'relative' }}>
          <div className="sec-head">
            <div>
              <span className="mono eyebrow" data-reveal>Connected capabilities</span>
              <Split className="display h-lg" style={{ marginTop: 22 }} text="Services that work as one system." em={['one', 'system.']} />
            </div>
            <p className="lede" data-reveal>Sixteen services across three pillars. Pick any service — or any industry — to see how Caliber’s own pages connect them.</p>
          </div>
          <Ecosystem />
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="section" id="industries" style={{ background: 'var(--ink-2)' }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="mono eyebrow" data-reveal>Industry verticals</span>
              <Split className="display h-lg" style={{ marginTop: 22 }} text="Three domains. One regulatory mindset." em={['regulatory', 'mindset.']} />
            </div>
            <p className="lede" data-reveal>From patient monitors to avionics, each domain has its own standards. The engineering discipline behind them is shared.</p>
          </div>
          <IndustryTabs />
        </div>
      </section>

      {/* SYSTEM SAFETY */}
      <section className="section ss dark">
        <div className="grid-bg" aria-hidden="true" />
        <div className="wrap ss-grid" style={{ position: 'relative' }}>
          <div>
            <span className="mono eyebrow" data-reveal>A point of view</span>
            <Split className="display h-xl" style={{ marginTop: 22, fontSize: 'clamp(2.8rem,6vw,5.6rem)' }} text="Welcome to System Safety 2.0." em={['System', 'Safety', '2.0.']} />
            <p data-reveal>{SYSTEM_SAFETY.p1}</p>
            <p data-reveal>{SYSTEM_SAFETY.p2}</p>
            <div className="serves" data-reveal>
              {SYSTEM_SAFETY.serves.map((s) => <span className="chip" key={s}>{s}</span>)}
            </div>
          </div>
          <div className="ss-viz" data-reveal><SafetyViz /></div>
        </div>
      </section>

      {/* WHY */}
      <section className="section section--tight">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="mono eyebrow" data-reveal>Why Caliber</span>
              <Split className="display h-lg" style={{ marginTop: 22 }} text="A group of young passionate engineers with a singular focus on your success." em={['singular', 'focus']} />
            </div>
          </div>
          <div className="trio" data-stagger>
            {WHY.map((w, i) => (
              <div key={w.t}>
                <span className="idx">0{i + 1}</span>
                <h3>{w.t}</h3>
                <p>{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CASES */}
      <section className="section paper">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="mono eyebrow" data-reveal>Case studies</span>
              <Split className="display h-lg" style={{ marginTop: 22 }} text="Credentials, proven in practice." em={['proven']} />
            </div>
            <p className="lede" data-reveal>Three documented medical-device engagements, from a start-up’s end-to-end product loop to wearable vital monitoring and paediatric lung function testing.</p>
          </div>
          <div className="case-list" data-stagger>
            {CASES.map((c) => (
              <Link to={`/case-studies/${c.slug}`} className="case-row" key={c.slug}>
                <span className="num">{c.n}</span>
                <div>
                  <p className="mono" style={{ color: 'var(--paper-mute)', marginBottom: 10 }}>{c.kicker}</p>
                  <h3>{c.title}</h3>
                </div>
                <p>{c.summary}</p>
                <span className="link-arrow go">Read <span>→</span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section className="section">
        <div className="wrap team">
          <div>
            <span className="mono eyebrow" data-reveal>Leadership</span>
            <Split className="display h-lg" style={{ marginTop: 22 }} text="Decades of regulated-industry experience." em={['regulated-industry']} />
            <p style={{ marginTop: 24 }} data-reveal><Link to="/about" className="link-arrow">Meet the team →</Link></p>
          </div>
          <div className="lead-card" data-reveal>
            <img className="lead-photo" src={TEAM[0].photo} alt={`Portrait of ${TEAM[0].name}`} width="263" height="300" loading="lazy" />
            <div>
              <h3 className="display h-sm">{TEAM[0].name}</h3>
              <p className="mono mute" style={{ margin: '8px 0 14px' }}>{TEAM[0].role}</p>
              <p>Electrical engineer with over 24 years of system engineering, quality and regulatory assurance services — specialising in ISO, FDA, FAA and IEC requirements, and a Certified Lead Auditor.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta blue">
        <div className="grid-bg" aria-hidden="true" />
        <div className="wrap" style={{ position: 'relative' }}>
          <span className="mono eyebrow" data-reveal>Can we help?</span>
          <Split className="display h-xl" style={{ marginTop: 22 }} text="Introduce new products to market, quickly." em={['quickly.']} />
          <p className="lede" style={{ marginBottom: 36 }} data-reveal>Tell us about your device or system. We’ll help you understand the regulatory landscape and plan an integrated path through development, verification and compliance.</p>
          <div className="cta-row" data-reveal>
            <Link to="/contact" className="btn btn--solid">Start a conversation <span className="arr">→</span></Link>
            <a href="tel:+918025283196" className="btn">080 25283196</a>
          </div>
        </div>
      </section>
    </div>
  )
}
