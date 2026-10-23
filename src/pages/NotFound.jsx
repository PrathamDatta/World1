import { Link } from 'react-router-dom'
import Seo from '../components/Seo.jsx'

export default function NotFound() {
  return (
    <section className="notfound wrap">
      <Seo title="Page not found" />
      <span className="mono eyebrow">Error 404</span>
      <h1 className="display h-xl">Off the <em>schematic.</em></h1>
      <p className="lede">That page doesn’t exist. Let’s get you back to something that does.</p>
      <Link to="/" className="btn btn--solid">Back to home <span className="arr">→</span></Link>
    </section>
  )
}
