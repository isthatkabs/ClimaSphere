import { Link } from 'react-router-dom'
import { styles } from '../../styles/homeStyles'

export default function HomeFooter() {
  return (
    <footer style={styles.footer}>
      <div style={styles.logo}>
        <span style={styles.logoIcon}>⚡</span>
        <span style={styles.logoText}>
          Clima<span style={styles.logoBold}>Sphere</span>
        </span>
      </div>

      <div style={styles.footerLinks}>
        {[
          { label: 'Privacy', to: '/privacy' },
          { label: 'Terms',   to: '/terms'   },
          { label: 'Status',  to: '/status'  },
          { label: 'Contact', to: '/contact' },
        ].map(({ label, to }) => (
          <Link key={label} to={to} style={styles.footerLink}>{label}</Link>
        ))}
      </div>

      <div style={styles.footerCopy}>© 2026 ClimaSphere</div>
    </footer>
  )
}