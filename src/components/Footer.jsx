import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import { SITE, INDUSTRIES } from '../data/content.js'

export default function Footer() {
  return (
    <footer className="footer dark">
      <div className="wrap">
        <div className="f-grid">
          <div>
            <Logo chip />
            <p className="mute" style={{ marginTop: 20, maxWidth: '34ch', fontSize: 15 }}>
              An ISO 13485 / ISO 9001 certified design consulting firm — globally compliant engineering and quality solutions for life science, avionics and other safety-critical domains.
            </p>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link to="/about">Company</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/industries">Industries</Link></li>
              <li><Link to="/case-studies">Case studies</Link></li>
              <li><Link to="/insights">Insights</Link></li>
              <li><Link to="/careers">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4>Industries</h4>
            <ul>
              {INDUSTRIES.map((i) => (
                <li key={i.id}><Link to={`/industries/${i.slug}`}>{i.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Bengaluru office</h4>
            <address>
              {SITE.address.map((l) => (<span key={l}>{l}<br /></span>))}
            </address>
            <ul style={{ marginTop: 14 }}>
              {SITE.phones.slice(0, 1).map((p) => (<li key={p.href}><a href={p.href}>{p.label}</a></li>))}
              <li><a href={`mailto:${SITE.emails[0]}`}>{SITE.emails[0]}</a></li>
            </ul>
            <p className="mono mute" style={{ marginTop: 14 }}>Mon–Sat 08:00–20:00</p>
          </div>
        </div>
        <div className="f-base mono">
          <span>© {new Date().getFullYear()} Caliber Assurance Services</span>
          <span>Moving excellence</span>
        </div>
      </div>
    </footer>
  )
}
