import { Link } from 'react-router-dom'

export default function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Caliber Assurance Services — home">
      <span>
        Cal<i>i</i>ber
      </span>
      <small>Assurance Services</small>
    </Link>
  )
}
