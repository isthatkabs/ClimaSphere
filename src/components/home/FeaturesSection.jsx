import { styles } from '../../styles/homeStyles'
import { features } from '../../data/homeData'

export default function FeaturesSection() {
  return (
    <section id="features" style={styles.features}>
      <div style={styles.sectionLabel}>Why ClimaSphere</div>
      <h2 style={styles.sectionTitle}>
        Built for people who<br />care about precision
      </h2>

      <div style={styles.featuresGrid}>
        {features.map((f) => (
          <div key={f.label} style={styles.featureCard}>
            <div style={styles.featureIcon}>{f.icon}</div>
            <div style={styles.featureLabel}>{f.label}</div>
            <div style={styles.featureDesc}>{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}