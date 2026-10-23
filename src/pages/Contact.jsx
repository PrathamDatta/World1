import { useRef, useState } from 'react'
import Seo from '../components/Seo.jsx'
import PageHero from '../components/PageHero.jsx'
import { usePageAnimations } from '../components/anim.jsx'
import { SITE, INDUSTRIES } from '../data/content.js'

/**
 * No backend / form endpoint is documented for Caliber. Rather than pretend to submit, this form
 * composes an email to operations@ and hands it to the visitor's mail client.
 */
export default function Contact() {
  const root = useRef(null)
  usePageAnimations(root)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const v = Object.fromEntries(f)
    const err = {}
    if (!v.name?.trim()) err.name = 'Please enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(v.email || '')) err.email = 'Please enter a valid email address.'
    if (!v.message?.trim()) err.message = 'Please tell us a little about your project.'
    setErrors(err)
    if (Object.keys(err).length) return
    const body = `Name: ${v.name}\nCompany: ${v.company || '-'}\nEmail: ${v.email}\nPhone: ${v.phone || '-'}\nArea of interest: ${v.area}\n\n${v.message}`
    window.location.href = `mailto:${SITE.emails[0]}?subject=${encodeURIComponent('Website enquiry — ' + v.area)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <div ref={root}>
      <Seo title="Contact — Bengaluru Office" description="Contact Caliber Assurance Services, 3499 14th Main Road, HAL II Stage, Indiranagar, Bangalore 560008. Call 080 25283196." />
      <PageHero crumbs={[[null, 'Contact']]} eyebrow="Contact" title="Can we help?" em={['help?']} lede="Tell us about your device or system — we’ll help you understand the regulatory landscape and plan the path to market." />
      <section className="section">
        <div className="wrap contact-grid">
          <div data-stagger>
            <div className="c-block">
              <h3>Visit our office</h3>
              <p><b style={{ fontWeight: 500 }}>Caliber Assurance Services</b></p>
              {SITE.address.map((l) => <p key={l} style={{ color: 'var(--bone-2)' }}>{l}</p>)}
              <a href={SITE.mapUrl} target="_blank" rel="noopener noreferrer" className="link-arrow" style={{ marginTop: 14 }}>Open in Google Maps ↗</a>
            </div>
            <div className="c-block">
              <h3>Call us</h3>
              {SITE.phones.map((p) => <a key={p.href} href={p.href}>{p.label}</a>)}
            </div>
            <div className="c-block">
              <h3>Email us</h3>
              {SITE.emails.map((m) => <a key={m} href={`mailto:${m}`}>{m}</a>)}
            </div>
            <div className="c-block">
              <h3>Working hours</h3>
              {SITE.hours.map(([d, h]) => <div className="hours-row" key={d}><span>{d}</span><span>{h}</span></div>)}
              <p className="mute" style={{ fontSize: 14, marginTop: 10 }}>We work six days a week, excluding major holidays. Contact us if you have an emergency.</p>
            </div>
          </div>

          <form className="form" onSubmit={submit} noValidate data-reveal aria-describedby="form-note">
            <div className="field">
              <label htmlFor="name">Name *</label>
              <input id="name" name="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'e-name' : undefined} />
              {errors.name && <span id="e-name" role="alert" style={{ color: 'var(--amber)', fontSize: 14 }}>{errors.name}</span>}
            </div>
            <div className="field"><label htmlFor="company">Company</label><input id="company" name="company" autoComplete="organization" /></div>
            <div className="field">
              <label htmlFor="email">Email *</label>
              <input id="email" name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'e-email' : undefined} />
              {errors.email && <span id="e-email" role="alert" style={{ color: 'var(--amber)', fontSize: 14 }}>{errors.email}</span>}
            </div>
            <div className="field"><label htmlFor="phone">Phone</label><input id="phone" name="phone" type="tel" autoComplete="tel" /></div>
            <div className="field">
              <label htmlFor="area">Area of interest</label>
              <select id="area" name="area">
                {INDUSTRIES.map((i) => <option key={i.id}>{i.name}</option>)}
                <option>Design &amp; Engineering</option>
                <option>Verification, Validation &amp; Assurance</option>
                <option>Consulting</option>
                <option>Careers</option>
                <option>Other</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="message">Message *</label>
              <textarea id="message" name="message" aria-invalid={!!errors.message} aria-describedby={errors.message ? 'e-msg' : undefined} />
              {errors.message && <span id="e-msg" role="alert" style={{ color: 'var(--amber)', fontSize: 14 }}>{errors.message}</span>}
            </div>
            <div><button type="submit" className="btn btn--solid">Compose email <span className="arr">→</span></button></div>
            <p className="form-note" id="form-note" aria-live="polite">
              {sent
                ? 'Your email app should now be open with the message prepared. If nothing opened, write to operations@caliberassurance.com directly.'
                : 'This form does not send data to a server. It prepares an email to operations@caliberassurance.com in your own mail app.'}
            </p>
          </form>
        </div>
      </section>
    </div>
  )
}
