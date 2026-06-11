import { styles } from '../../styles/homeStyles'
import { stats } from '../../data/homeData'
import WeatherCard from './WeatherCard'

const btnReset = { border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }

export default function HeroSection({ activeCity, setActiveCity, time, onNavigate }) {
  return (
    <section style={styles.hero}>
      <div style={styles.heroLeft}>
        <div style={styles.badge}>
          <span style={styles.badgeDot} />
          Live weather intelligence
        </div>

        <h1 style={styles.headline}>
          Weather,<br />
          <span style={styles.headlineAccent}>Reimagined</span><br />
          for You.
        </h1>

        <p style={styles.subhead}>
          Hyper-local forecasts. Real-time radar. Intelligent alerts that
          know what matters to you — before you do.
        </p>

        <div style={styles.heroActions}>
          <button onClick={() => onNavigate('/auth')}
            style={{ ...btnReset, ...styles.ctaBtn }}>
            Start Tracking
            <span style={styles.ctaArrow}>→</span>
          </button>
          <a href="#features" style={styles.ghostBtn}>
            See Features
          </a>
        </div>

        <div style={styles.statsRow}>
          {stats.map(([v, l]) => (
            <div key={l} style={styles.stat}>
              <span style={styles.statVal}>{v}</span>
              <span style={styles.statLabel}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      <WeatherCard
        activeCity={activeCity}
        setActiveCity={setActiveCity}
        time={time}
      />
    </section>
  )
}