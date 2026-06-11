import { Link, useNavigate } from 'react-router-dom'
import { styles } from '../../styles/homeStyles'

const NAV_LINKS = [
  { label: 'Forecast', to: '/forecast' },
  { label: 'Maps',     to: '/maps'     },
  { label: 'Alerts',   to: '/alerts'   },
]

const btnReset = { border: 'none', background: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }

export default function HomeNav({ onNavigate }) {
  const nav = useNavigate()
  const go = (to) => onNavigate ? onNavigate(to) : nav(to)

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
          <button key={label} onClick={() => go(to)}
            style={{ ...btnReset, ...styles.navLink }}>
            {label}
          </button>
        ))}
      </div>

      <div style={styles.navActions}>
        <button onClick={() => go('/auth')}
          style={{ ...btnReset, ...styles.navCta }}>
          Get Started
        </button>
      </div>
    </nav>
  )
}