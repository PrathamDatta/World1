import { useRef } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo.jsx'
import PageHero from '../components/PageHero.jsx'
import { usePageAnimations } from '../components/anim.jsx'
import { POST } from '../data/content.js'

export default function Insights() {
  const root = useRef(null)
  usePageAnimations(root)
  return (
    <div ref={root}>
      <Seo title="Insights on Regulatory Strategy" description="Perspectives on regulatory strategy and engineering from Caliber Assurance Services." />
      <PageHero crumbs={[[null, 'Insights']]} eyebrow="Insights" title="Notes from the regulatory front." em={['regulatory']} />
      <section className="section">
        <div className="wrap">
          <Link to={`/insights/${POST.slug}`} className="post-row" data-reveal>
            <div>
              <p className="mono mute"><time dateTime={POST.date}>{POST.dateLabel}</time></p>
              <p className="mono" style={{ color: 'var(--amber)', marginTop: 6 }}>{POST.category}</p>
            </div>
            <div>
              <h2 className="display h-md">{POST.title}</h2>
              <p className="mute" style={{ marginTop: 10 }}>By {POST.author}</p>
            </div>
            <span className="link-arrow">Read <span>→</span></span>
          </Link>
          <p className="mute" style={{ marginTop: 32, fontSize: 14 }}>This is the only article currently published on Caliber’s site.</p>
        </div>
      </section>
    </div>
  )
}
