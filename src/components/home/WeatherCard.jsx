import { styles } from '../../styles/homeStyles'
import { weatherData, miniDays } from '../../data/homeData'

export default function WeatherCard({ activeCity, setActiveCity, time }) {
  const current = weatherData[activeCity]

  return (
    <div style={styles.heroRight}>
      <div style={styles.weatherCard}>
        <div style={styles.cardHeader}>
          <div>
            <div style={styles.cardCity}>{current.city}</div>
            <div style={styles.cardTime}>
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <div style={styles.cardIcon}>{current.icon}</div>
        </div>

        <div style={styles.tempDisplay}>
          <span style={styles.tempNum}>{current.temp}</span>
          <span style={styles.tempUnit}>°C</span>
        </div>

        <div style={styles.conditionText}>{current.condition}</div>

        <div style={styles.cardStats}>
          <div style={styles.cardStat}>
            <span style={styles.cardStatIcon}>💧</span>
            <span style={styles.cardStatVal}>{current.humidity}%</span>
            <span style={styles.cardStatLabel}>Humidity</span>
          </div>
          <div style={styles.cardStatDivider} />
          <div style={styles.cardStat}>
            <span style={styles.cardStatIcon}>🌬️</span>
            <span style={styles.cardStatVal}>{current.wind} km/h</span>
            <span style={styles.cardStatLabel}>Wind</span>
          </div>
        </div>

        <div style={styles.cityDots}>
          {weatherData.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveCity(i)}
              style={{ ...styles.dot, ...(i === activeCity ? styles.dotActive : {}) }}
            />
          ))}
        </div>

        <div style={styles.miniRow}>
          {miniDays.map((d) => (
            <div key={d.day} style={styles.miniDay}>
              <span style={styles.miniLabel}>{d.day}</span>
              <span style={styles.miniIcon}>{d.icon}</span>
              <span style={styles.miniTemp}>{d.temp}°</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.floatingAlert}>
        <span>⚠️</span>
        <div>
          <div style={styles.alertTitle}>Storm Warning</div>
          <div style={styles.alertSub}>Northeast Coast · 6h away</div>
        </div>
      </div>
    </div>
  )
}