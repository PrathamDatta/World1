import { Link } from 'react-router-dom'

export default function Logo({ chip = false }) {
  return (
    <Link to="/" className={`logo${chip ? ' chip' : ''}`} aria-label="Caliber Assurance Services — home">
      <img src="/images/caliber-logo.png" alt="Caliber — Moving excellence" width="90" height="50" />
    </Link>
  )
}
