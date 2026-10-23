import { Link } from 'react-router-dom'
import { Split } from './anim.jsx'

export default function PageHero({ crumbs = [], eyebrow, title, em = [], lede, children }) {
  return (
    <section className="page-hero">
      <div className="grid-bg" aria-hidden="true" />
      <div className="wrap" style={{ position: 'relative' }}>
        <nav className="crumbs mono" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          {crumbs.map(([to, l]) => (
            <span key={l}>/ {to ? <Link to={to}>{l}</Link> : l}</span>
          ))}
        </nav>
        {eyebrow && <span className="mono eyebrow" data-reveal data-hero>{eyebrow}</span>}
        <Split as="h1" data-hero className="display h-xl" style={{ marginTop: 22, fontSize: 'clamp(2.8rem,6.6vw,6.2rem)' }} text={title} em={em} />
        {lede && <p className="lede" data-reveal data-hero data-delay="0.5">{lede}</p>}
        {children}
      </div>
    </section>
  )
}
