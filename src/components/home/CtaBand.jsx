import { styles } from '../../styles/homeStyles'

export default function CtaBand() {
  return (
    <section style={styles.ctaBand}>
      <div style={styles.ctaBandInner}>
        <h2 style={styles.ctaBandTitle}>Ready to track your world?</h2>
        <p style={styles.ctaBandSub}>No payments needed, free forever!</p>
        <a href="/auth" style={styles.ctaBtn}>
          Create Free Account <span style={styles.ctaArrow}>→</span>
        </a>
      </div>
    </section>
  )
}