import { Link } from 'react-router-dom'
import { styles } from '../../styles/homeStyles'

const NAV_LINKS = [
  { label: 'Forecast', to: '/forecast' },
  { label: 'Maps',     to: '/maps'     },
  { label: 'Alerts',   to: '/alerts'   },
  { label: 'API',      to: '/api'      },
]

export default function HomeNav() {
  return (
    <nav style={styles.nav}>
      <Link to="/" style={{ ...styles.logo, textDecoration: 'none' }}>
        <span style={styles.logoIcon}>⚡</span>
        <span style={styles.logoText}>
          Clima<span style={styles.logoBold}>Sphere</span>
        </span>
      </Link>

      <div style={styles.navLinks}>
        {NAV_LINKS.map(({ label, to }) => (
          <Link key={label} to={to} style={{ ...styles.navLink, textDecoration: 'none' }}>
            {label}
          </Link>
        ))}
      </div>

      <div style={styles.navActions}>
        <Link to="/auth" style={{ ...styles.navCta, textDecoration: 'none' }}>
          Get Started
        </Link>
      </div>
    </nav>
  )
}