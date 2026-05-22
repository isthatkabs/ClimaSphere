import { useEffect, useState, useRef } from 'react'
import { getWeatherSuggestions, buildSuggestionInputs, buildWeatherSummary } from '../data/suggestions'
import { getAISuggestions } from '../services/ai'
import { useSettings } from '../context/SettingsContext'
import SuggestionChat from '../components/dashboard/SuggestionChat'

export default function ActivitySuggestion({ weather, forecast, locationName }) {
  const { settings } = useSettings()
  const [suggestions,   setSuggestions]   = useState(null)
  const [inputs,        setInputs]        = useState(null)
  const [weatherSummary, setWeatherSummary] = useState('')
  const [aiInsight,     setAiInsight]     = useState(null)
  const [aiLoading,     setAiLoading]     = useState(false)
  const [aiError,       setAiError]       = useState(false)
  const prevKeyRef = useRef(null)

  useEffect(() => {
    if (!weather || !forecast) return

    const derived = buildSuggestionInputs(weather, forecast)
    setInputs(derived)

    const result = getWeatherSuggestions(derived)
    setSuggestions(result)

    const summary = buildWeatherSummary(derived, locationName, result.primaryCondition)
    setWeatherSummary(summary)

    const key = `${locationName}|${Math.round(derived.temp)}|${derived.weathercode}|${Math.round(derived.precipProb)}`
    if (key === prevKeyRef.current) return
    prevKeyRef.current = key

    setAiLoading(true)
    setAiError(false)
    setAiInsight(null)

    getAISuggestions({
      location:         locationName ?? 'your location',
      country:          derived.country,
      temp:             derived.temp,
      feelsLike:        derived.feelsLike,
      windspeed:        derived.windspeed,
      precipProb:       derived.precipProb,
      weathercode:      derived.weathercode,
      uvIndex:          derived.uvIndex,
      humidity:         derived.humidity,
      primaryCondition: result.primaryCondition,
    })
      .then(data => setAiInsight(data.insight))
      .catch(() => setAiError(true))
      .finally(() => setAiLoading(false))
  }, [weather, forecast, locationName])

  if (!settings.activitySuggestions) {
    return (
      <div className="cs-activity">
        <div className="cs-activity-header">
          <div>
            <div className="cs-activity-title">Suggestions</div>
            <div className="cs-activity-sub">
              Activity and clothing suggestions are turned off. Enable them in{' '}
              <span style={{ color: '#a78bfa', cursor: 'default' }}>Settings → Suggestions</span>.
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!suggestions || !inputs) {
    return (
      <div className="cs-activity">
        <div className="cs-activity-header">
          <div>
            <div className="cs-activity-title">Suggestions</div>
            <div className="cs-activity-sub">Loading your personalised recommendations…</div>
          </div>
        </div>
      </div>
    )
  }

  const { primaryCondition, primaryEmoji, conditionLabels, activities, clothing } = suggestions
  const cityLabel = locationName ?? 'Your location'

  return (
    <div className="cs-activity">

      {/* ── Header ── */}
      <div className="cs-activity-header">
        <div>
          <div className="cs-activity-title">Suggestions for {cityLabel}</div>
          <div className="cs-activity-sub">
            Personalised clothing and activity recommendations based on today's forecast
          </div>
        </div>
        <div className="cs-activity-condition-badge">
          <span className="cs-activity-condition-emoji">{primaryEmoji}</span>
          <span className="cs-activity-condition-label">{primaryCondition}</span>
        </div>
      </div>

      {/* ── Active condition pills ── */}
      {conditionLabels.length > 0 && (
        <div className="cs-activity-pills">
          {conditionLabels.map(label => (
            <span key={label} className="cs-activity-pill">{label}</span>
          ))}
          <span className="cs-activity-pill">
            {Math.round(inputs.temp)}°C · {Math.round(inputs.windspeed)} km/h wind · {inputs.precipProb}% rain
          </span>
        </div>
      )}

      {/* ── AI Insight card ── */}
      <div className="cs-activity-insight">
        <span className="cs-activity-insight-icon">🤖</span>
        <div className="cs-activity-insight-body">
          <div className="cs-activity-insight-label">AI Insight</div>
          {aiLoading && (
            <>
              <div className="cs-activity-skeleton" style={{ width: '90%' }} />
              <div className="cs-activity-skeleton" style={{ width: '75%' }} />
              <div className="cs-activity-skeleton" />
            </>
          )}
          {!aiLoading && aiInsight && (
            <div className="cs-activity-insight-text">{aiInsight}</div>
          )}
          {!aiLoading && aiError && (
            <div className="cs-activity-insight-error">
              AI insight unavailable — recommendations below are still accurate.
            </div>
          )}
        </div>
      </div>

      {/* ── Activities ── */}
      <div className="cs-activity-section">
        <div className="cs-activity-section-header">
          <span className="cs-activity-section-icon">🎯</span>
          <span className="cs-activity-section-title">What to Do Today</span>
          <span className="cs-activity-section-count">{activities.length} suggestions</span>
        </div>
        <div className="cs-activity-chips">
          {activities.map((item, i) => (
            <div key={i} className="cs-activity-chip">
              <span className="cs-activity-chip-icon">{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* ── Clothing ── */}
      <div className="cs-activity-section">
        <div className="cs-activity-section-header">
          <span className="cs-activity-section-icon">👔</span>
          <span className="cs-activity-section-title">What to Wear</span>
          <span className="cs-activity-section-count">{clothing.length} items</span>
        </div>
        <div className="cs-activity-chips">
          {clothing.map((item, i) => (
            <div key={i} className="cs-activity-chip clothing">
              <span className="cs-activity-chip-icon">{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* ── AI Chat ── */}
      <SuggestionChat weatherSummary={weatherSummary} />

      {/* ── Disclaimer ── */}
      <p className="cs-activity-disclaimer">
        Forecasts are not 100% guaranteed — these suggestions are guidance only. Always use your own judgement.
      </p>

    </div>
  )
}
