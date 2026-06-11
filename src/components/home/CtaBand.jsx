import { styles } from '../../styles/homeStyles'

export default function CtaBand({ onNavigate }) {
  return (
    <section style={styles.ctaBand}>
      <div style={styles.ctaBandInner}>
        <h2 style={styles.ctaBandTitle}>Ready to track your world?</h2>
        <p style={styles.ctaBandSub}>No payments needed, free forever!</p>
        <button
          onClick={() => onNavigate('/auth?mode=signup')}
          style={{ ...styles.ctaBtn, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
          Create Free Account <span style={styles.ctaArrow}>→</span>
        </button>
      </div>
    </section>
  )
}