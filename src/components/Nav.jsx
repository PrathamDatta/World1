import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Logo from './Logo.jsx'
import { INDUSTRIES } from '../data/content.js'

const LINKS = [
  ['/about', 'Company'],
  ['/services', 'Services'],
  ['/case-studies', 'Case studies'],
  ['/insights', 'Insights'],
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => (document.body.style.overflow = '')
  }, [open])

  return (
    <>
      <header className={`nav ${scrolled ? 'scrolled' : ''} ${open ? 'open' : ''}`}>
        <div className="wrap nav-in">
          <Logo />
          <nav className="nav-links" aria-label="Primary">
            <NavLink to="/about">Company</NavLink>
            <NavLink to="/services">Services</NavLink>
            <div className="dd">
              <NavLink to="/industries" className={({ isActive }) => (isActive || pathname.startsWith('/industries') ? 'active' : '')}>
                Industries
              </NavLink>
              <div className="dd-menu">
                {INDUSTRIES.map((i) => (
                  <Link key={i.id} to={`/industries/${i.slug}`}>
                    {i.name}
                  </Link>
                ))}
              </div>
            </div>
            <NavLink to="/case-studies">Case studies</NavLink>
            <NavLink to="/insights">Insights</NavLink>
            <NavLink to="/careers">Careers</NavLink>
          </nav>
          <Link to="/contact" className="btn nav-cta">
            Contact <span className="arr">→</span>
          </Link>
          <button className="burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
            <span />
            <span />
          </button>
        </div>
      </header>
      <div className="mobile-menu" aria-hidden={!open}>
        {LINKS.slice(0, 2).map(([to, l]) => (
          <Link key={to} to={to} tabIndex={open ? 0 : -1}>{l}</Link>
        ))}
        <Link to="/industries" tabIndex={open ? 0 : -1}>Industries</Link>
        {INDUSTRIES.map((i) => (
          <Link key={i.id} className="sub" to={`/industries/${i.slug}`} tabIndex={open ? 0 : -1}>{i.name}</Link>
        ))}
        {LINKS.slice(2).map(([to, l]) => (
          <Link key={to} to={to} tabIndex={open ? 0 : -1}>{l}</Link>
        ))}
        <Link to="/careers" tabIndex={open ? 0 : -1}>Careers</Link>
        <Link to="/contact" tabIndex={open ? 0 : -1}>Contact</Link>
      </div>
    </>
  )
}
