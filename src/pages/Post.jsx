import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import Seo from '../components/Seo.jsx'
import PageHero from '../components/PageHero.jsx'
import { usePageAnimations } from '../components/anim.jsx'
import NotFound from './NotFound.jsx'
import { POST } from '../data/content.js'

export default function Post() {
  const { slug } = useParams()
  const root = useRef(null)
  usePageAnimations(root, [slug])
  if (slug !== POST.slug) return <NotFound />
  return (
    <div ref={root}>
      <Seo title={POST.title} description={POST.body[0]} />
      <PageHero crumbs={[['/insights', 'Insights'], [null, 'Article']]} eyebrow={`${POST.category} · ${POST.dateLabel} · ${POST.author}`} title={POST.title} />
      <section className="section">
        <div className="wrap">
          <article className="article" data-stagger>
            {POST.body.map((p, i) => <p key={i}>{p}</p>)}
          </article>
          <p style={{ marginTop: 40 }}><Link to="/contact" className="btn btn--solid">Speak to our regulatory team <span className="arr">→</span></Link></p>
        </div>
      </section>
    </div>
  )
}
