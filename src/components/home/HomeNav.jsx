import { styles } from '../../styles/homeStyles'

export default function HomeNav() {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <span style={styles.logoIcon}>⚡</span>
        <span style={styles.logoText}>
          Clima<span style={styles.logoBold}>Sphere</span>
        </span>
      </div>

      <div style={styles.navLinks}>
        {['Forecast', 'Maps', 'Alerts', 'API'].map((l) => (
          <a key={l} href="#" style={styles.navLink}>{l}</a>
        ))}
      </div>

      <div style={styles.navActions}>
        <a href="/auth" style={styles.navCta}>Get Started</a>
      </div>
    </nav>
  )
}