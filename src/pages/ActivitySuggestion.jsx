import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getWeatherSuggestions, buildSuggestionInputs, buildWeatherSummary, TIME_OF_DAY_LABEL } from '../data/suggestions'
import { getAISuggestions, getDayPlan } from '../services/ai'
import { useSettings } from '../context/SettingsContext'
import { useAuth } from '../context/AuthContext'
import { usePreferences } from '../hooks/usePreferences'
import SuggestionChat from '../components/dashboard/SuggestionChat'

export default function ActivitySuggestion({ weather, forecast, locationName }) {
  const { settings } = useSettings()
  const { user } = useAuth()
  const { preferences, setPreference } = usePreferences()
  const navigate = useNavigate()
  const [suggestions,          setSuggestions]          = useState(null)
  const [inputs,               setInputs]               = useState(null)
  const [weatherSummary,       setWeatherSummary]       = useState('')
  const [aiInsight,            setAiInsight]            = useState(null)
  const [aiLoading,            setAiLoading]            = useState(false)
  const [aiError,              setAiError]              = useState(false)
  const [showHiddenActivities, setShowHiddenActivities] = useState(false)
  const [showHiddenClothing,   setShowHiddenClothing]   = useState(false)
  const [dayPlan,              setDayPlan]              = useState(null)
  const [dayPlanLoading,       setDayPlanLoading]       = useState(false)
  const [dayPlanError,         setDayPlanError]         = useState(false)
  const prevKeyRef = useRef(null)

  async function generateDayPlan() {
    if (!inputs) return
    setDayPlanLoading(true)
    setDayPlanError(false)
    setDayPlan(null)
    try {
      const plan = await getDayPlan({
        location:         locationName ?? 'your location',
        country:          inputs.country,
        temp:             inputs.temp,
        feelsLike:        inputs.feelsLike,
        windspeed:        inputs.windspeed,
        precipProb:       inputs.precipProb,
        primaryCondition: suggestions?.primaryCondition ?? '',
        interests:        settings.interests ?? [],
      })
      setDayPlan(plan)
    } catch {
      setDayPlanError(true)
    } finally {
      setDayPlanLoading(false)
    }
  }

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

    const key = `${locationName}|${Math.round(derived.temp)}|${derived.weathercode}|${Math.round(derived.precipProb)}|${derived.timeOfDay}`
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
      timeOfDay:        derived.timeOfDay,
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

  const { primaryCondition, primaryEmoji, conditionLabels, activities, clothing, timeOfDay } = suggestions
  const tod = TIME_OF_DAY_LABEL[timeOfDay] ?? TIME_OF_DAY_LABEL.afternoon

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
            Personalised recommendations for this {tod.label.toLowerCase()}
          </div>
        </div>
        <div className="cs-activity-condition-badge">
          <span className="cs-activity-condition-emoji">{primaryEmoji}</span>
          <span className="cs-activity-condition-label">{primaryCondition}</span>
        </div>
      </div>

      {/* ── Active condition pills ── */}
      <div className="cs-activity-pills">
        <span className="cs-activity-pill">{tod.emoji} {tod.label}</span>
        {conditionLabels.map(label => (
          <span key={label} className="cs-activity-pill">{label}</span>
        ))}
        <span className="cs-activity-pill">
          {Math.round(inputs.temp)}°C · {Math.round(inputs.windspeed)} km/h wind · {inputs.precipProb}% rain
        </span>
      </div>

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

      {/* ── Day Plan ── */}
      <div className="cs-activity-section">
        <div className="cs-activity-section-header">
          <span className="cs-activity-section-icon">📅</span>
          <span className="cs-activity-section-title">Plan My Day</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 16px', lineHeight: 1.6 }}>
          Get a full-day itinerary tailored to your interests and today's weather in {locationName ?? 'your location'}.
        </p>

        {(settings.interests ?? []).length === 0 ? (
          <div className="cs-dayplan-no-interests">
            <p className="cs-dayplan-no-interests-text">
              Add your interests on your profile so we can personalise your day plan.
            </p>
            <button className="cs-dayplan-profile-link" onClick={() => navigate('/profile')}>
              ✏️ &nbsp;Set interests on your profile
            </button>
          </div>
        ) : (
          <>
            <div className="cs-dayplan-interests">
              {(settings.interests ?? []).map(i => (
                <span key={i} className="cs-dayplan-interest-tag">{i}</span>
              ))}
            </div>

            {!dayPlan && (
              <div style={{ textAlign: 'center' }}>
                <button
                  className="cs-dayplan-btn"
                  onClick={generateDayPlan}
                  disabled={dayPlanLoading}
                >
                  {dayPlanLoading ? (
                    <>
                      <span className="cs-dayplan-spinner" /> Generating your plan…
                    </>
                  ) : (
                    '✨ Generate My Day Plan'
                  )}
                </button>
                {dayPlanError && (
                  <p style={{ fontSize: 12, color: '#f87171', marginTop: 10 }}>
                    Couldn't generate a plan — please try again.
                  </p>
                )}
              </div>
            )}

            {dayPlan && (
              <>
                <div className="cs-dayplan-slots">
                  {dayPlan.slots.map(slot => (
                    <div key={slot.period} className="cs-dayplan-slot">
                      <div className="cs-dayplan-slot-header">
                        <span className="cs-dayplan-slot-emoji">{slot.emoji}</span>
                        <div>
                          <div className="cs-dayplan-slot-period">{slot.period}</div>
                          <div className="cs-dayplan-slot-time">{slot.time}</div>
                        </div>
                        <span className="cs-dayplan-slot-theme">"{slot.theme}"</span>
                      </div>
                      <div className="cs-dayplan-items">
                        {slot.items.map((item, i) => (
                          <div key={i} className="cs-dayplan-item">
                            <span className="cs-dayplan-item-emoji">{item.emoji}</span>
                            <div>
                              <div className="cs-dayplan-item-title">{item.title}</div>
                              <div className="cs-dayplan-item-detail">{item.detail}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cs-dayplan-regen">
                  <button
                    className="cs-dayplan-regen-btn"
                    onClick={generateDayPlan}
                    disabled={dayPlanLoading}
                  >
                    {dayPlanLoading ? 'Regenerating…' : '↺ Regenerate'}
                  </button>
                </div>
              </>
            )}
          </>
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
