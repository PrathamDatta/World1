import { useRef } from 'react'
import Seo from '../components/Seo.jsx'
import PageHero from '../components/PageHero.jsx'
import { usePageAnimations } from '../components/anim.jsx'
import { CAREER, SITE } from '../data/content.js'

export default function Careers() {
  const root = useRef(null)
  usePageAnimations(root)
  const subject = encodeURIComponent(`Application: ${CAREER.title}`)
  return (
    <div ref={root}>
      <Seo title="Careers" description={`${CAREER.title} — ${CAREER.location}. Join Caliber Assurance Services.`} />
      <PageHero crumbs={[[null, 'Careers']]} eyebrow="Careers" title="Join the engineers." em={['engineers.']} lede="Caliber is a group of young passionate engineers with a singular focus on the success of its clients." />
      <section className="section">
        <div className="wrap two-col">
          <div className="sticky-h">
            <span className="mono eyebrow">Open role</span>
            <h2 className="display h-md" style={{ marginTop: 18 }}>{CAREER.title}</h2>
            <p className="mono mute" style={{ marginTop: 14 }}>Location · {CAREER.location}</p>
          </div>
          <div>
            <h3 className="mono" style={{ color: 'var(--amber)', marginBottom: 14 }}>Requirements</h3>
            <ul className="tick-list" data-stagger>{CAREER.reqs.map((r) => <li key={r}>{r}</li>)}</ul>
            <h3 className="mono" style={{ color: 'var(--amber)', margin: '36px 0 14px' }}>Qualification</h3>
            <p style={{ color: 'var(--bone-2)' }}>{CAREER.qual}</p>
            <p style={{ marginTop: 36 }}>
              <a className="btn btn--solid" href={`mailto:${SITE.emails[1]}?subject=${subject}`}>Apply by email <span className="arr">→</span></a>
            </p>
            <p className="mute" style={{ marginTop: 14, fontSize: 14 }}>Opens your email app, addressed to {SITE.emails[1]}.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
