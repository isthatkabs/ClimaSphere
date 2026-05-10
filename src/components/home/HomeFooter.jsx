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
        {['Privacy', 'Terms', 'Status', 'Contact'].map((l) => (
          <a key={l} href="#" style={styles.footerLink}>{l}</a>
        ))}
      </div>

      <div style={styles.footerCopy}>© 2026 ClimaSphere</div>
    </footer>
  )
}