import { useEffect, useState, useRef } from 'react'
import { getWeatherSuggestions, buildSuggestionInputs, buildWeatherSummary } from '../data/suggestions'
import { getAISuggestions } from '../services/ai'
import { useSettings } from '../context/SettingsContext'
import { useAuth } from '../context/AuthContext'
import { usePreferences } from '../hooks/usePreferences'
import SuggestionChat from '../components/dashboard/SuggestionChat'

export default function ActivitySuggestion({ weather, forecast, locationName }) {
  const { settings } = useSettings()
  const { user } = useAuth()
  const { preferences, setPreference } = usePreferences()
  const [suggestions,          setSuggestions]          = useState(null)
  const [inputs,               setInputs]               = useState(null)
  const [weatherSummary,       setWeatherSummary]       = useState('')
  const [aiInsight,            setAiInsight]            = useState(null)
  const [aiLoading,            setAiLoading]            = useState(false)
  const [aiError,              setAiError]              = useState(false)
  const [showHiddenActivities, setShowHiddenActivities] = useState(false)
  const [showHiddenClothing,   setShowHiddenClothing]   = useState(false)
  const prevKeyRef = useRef(null)

  function handleReact(text, reaction) {
    const current = preferences[text]
    setPreference(text, current === reaction ? null : reaction)
  }

  useEffect(() => {
    if (!weather || !forecast) return

    const derived = buildSuggestionInputs(weather, forecast)
    setInputs(derived)

    const result = getWeatherSuggestions(derived, settings.interests ?? [])
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

  const visibleActivities = activities.filter(i => preferences[i.text] !== 'disliked')
  const hiddenActivities  = activities.filter(i => preferences[i.text] === 'disliked')
  const visibleClothing   = clothing.filter(i => preferences[i.text] !== 'disliked')
  const hiddenClothing    = clothing.filter(i => preferences[i.text] === 'disliked')
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
          <span className="cs-activity-section-count">{visibleActivities.length} suggestions</span>
        </div>
        <div className="cs-activity-chips">
          {visibleActivities.map((item, i) => {
            const reaction = preferences[item.text]
            return (
              <div key={i} className={`cs-activity-chip${reaction === 'liked' ? ' liked' : ''}`}>
                <span className="cs-activity-chip-icon">{item.icon}</span>
                {item.text}
                {user && (
                  <div className="cs-chip-reactions">
                    <button
                      className={`cs-chip-react${reaction === 'liked' ? ' active' : ''}`}
                      onClick={() => handleReact(item.text, 'liked')}
                      title="Like this suggestion"
                      aria-label="Like"
                    >👍</button>
                    <button
                      className="cs-chip-react"
                      onClick={() => handleReact(item.text, 'disliked')}
                      title="Hide this suggestion"
                      aria-label="Dislike"
                    >👎</button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        {hiddenActivities.length > 0 && (
          <div className="cs-hidden-row">
            <button className="cs-hidden-toggle" onClick={() => setShowHiddenActivities(v => !v)}>
              {hiddenActivities.length} hidden · {showHiddenActivities ? 'Hide' : 'Manage'}
            </button>
            {showHiddenActivities && (
              <div className="cs-hidden-list">
                {hiddenActivities.map((item, i) => (
                  <div key={i} className="cs-hidden-item">
                    <span>{item.icon} {item.text}</span>
                    <button className="cs-hidden-restore" onClick={() => setPreference(item.text, null)}>
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {!user && (
          <p className="cs-pref-guest-note">
            <a href="/auth">Sign in</a> to save your preferences.
          </p>
        )}
      </div>

      {/* ── Clothing ── */}
      <div className="cs-activity-section">
        <div className="cs-activity-section-header">
          <span className="cs-activity-section-icon">👔</span>
          <span className="cs-activity-section-title">What to Wear</span>
          <span className="cs-activity-section-count">{visibleClothing.length} items</span>
        </div>
        <div className="cs-activity-chips">
          {visibleClothing.map((item, i) => {
            const reaction = preferences[item.text]
            return (
              <div key={i} className={`cs-activity-chip clothing${reaction === 'liked' ? ' liked' : ''}`}>
                <span className="cs-activity-chip-icon">{item.icon}</span>
                {item.text}
                {user && (
                  <div className="cs-chip-reactions">
                    <button
                      className={`cs-chip-react${reaction === 'liked' ? ' active' : ''}`}
                      onClick={() => handleReact(item.text, 'liked')}
                      title="Like this suggestion"
                      aria-label="Like"
                    >👍</button>
                    <button
                      className="cs-chip-react"
                      onClick={() => handleReact(item.text, 'disliked')}
                      title="Hide this suggestion"
                      aria-label="Dislike"
                    >👎</button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        {hiddenClothing.length > 0 && (
          <div className="cs-hidden-row">
            <button className="cs-hidden-toggle" onClick={() => setShowHiddenClothing(v => !v)}>
              {hiddenClothing.length} hidden · {showHiddenClothing ? 'Hide' : 'Manage'}
            </button>
            {showHiddenClothing && (
              <div className="cs-hidden-list">
                {hiddenClothing.map((item, i) => (
                  <div key={i} className="cs-hidden-item">
                    <span>{item.icon} {item.text}</span>
                    <button className="cs-hidden-restore" onClick={() => setPreference(item.text, null)}>
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {!user && (
          <p className="cs-pref-guest-note">
            <a href="/auth">Sign in</a> to save your preferences.
          </p>
        )}
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
