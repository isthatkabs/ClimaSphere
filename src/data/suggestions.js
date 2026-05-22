// ── Weather-to-suggestion rule engine ────────────────────────────
// Rules follow the spec:
//   Hot:   temp > 20°C
//   Warm:  10°C ≤ temp ≤ 20°C
//   Cold:  temp < 10°C  (< 5°C adds extra thermals)
//   Rain:  precipProb > 60%
//   Snow:  WMO codes 71–77, 85–86
//   Storm: WMO codes 95–99
//   Windy: windspeed > 30 km/h
//   UV:    uvIndex ≥ 6

const HOT_ACTIVITIES = [
  { icon: '🧺', text: 'Picnic under the shade' },
  { icon: '🏖',  text: 'Chill by the beach' },
  { icon: '⚽', text: 'Outdoor sports — football or cricket' },
  { icon: '🏊', text: 'Go swimming' },
  { icon: '🍦', text: 'Ice cream and enjoy the outdoors' },
  { icon: '🌅', text: 'Walk during sunset when it cools down' },
]
const HOT_CLOTHING = [
  { icon: '👕', text: 'T-shirt' },
  { icon: '🩳', text: 'Shorts' },
  { icon: '👗', text: 'Light dress' },
  { icon: '🕶',  text: 'Sunglasses' },
  { icon: '🧢', text: 'Sun hat' },
]

const WARM_ACTIVITIES = [
  { icon: '⚽', text: 'Outdoor sports — football or cricket' },
  { icon: '🚶', text: 'Go on a long walk' },
  { icon: '🚲', text: 'Cycling' },
  { icon: '☕', text: 'Visit an outdoor café' },
  { icon: '👫', text: 'Meet up with friends' },
  { icon: '📸', text: 'Photography of any scenery' },
  { icon: '🎨', text: 'Drawing or painting outdoors' },
]
const WARM_CLOTHING = [
  { icon: '🧥', text: 'Light jacket' },
  { icon: '👚', text: 'Long sleeve top' },
  { icon: '👖', text: 'Jeans' },
  { icon: '🧣', text: 'Light accessories' },
]

const COLD_ACTIVITIES = [
  { icon: '☕', text: 'Go for a hot chocolate / café hopping' },
  { icon: '🎬', text: 'Visit indoor attractions — cinema, bowling, arcade' },
  { icon: '🎮', text: 'Board games or card games' },
  { icon: '🍳', text: 'Cooking or baking at home' },
  { icon: '🏋️', text: 'Gym session or indoor sports' },
  { icon: '🚶', text: 'Go for a walk if you\'re dressed warmly enough' },
]
const COLD_CLOTHING = [
  { icon: '🧥', text: 'Warm coat' },
  { icon: '👚', text: 'Jumper' },
  { icon: '🧣', text: 'Scarf' },
  { icon: '🧤', text: 'Gloves' },
  { icon: '🔥', text: 'Thermal layers' },
  { icon: '🧢', text: 'Hat' },
]

const RAIN_ACTIVITIES = [
  { icon: '☕', text: 'Visit a café or coffee shop' },
  { icon: '📚', text: 'Read a book or listen to podcasts indoors' },
  { icon: '🎬', text: 'Watch movies or a series' },
  { icon: '🏛',  text: 'Go to a museum, gallery, or library' },
  { icon: '🏋️', text: 'Light indoor exercises' },
  { icon: '🎮', text: 'Video games or board games' },
]
const RAIN_CLOTHING = [
  { icon: '🧥', text: 'Waterproof jacket' },
  { icon: '🌂', text: 'Raincoat' },
  { icon: '☂',  text: 'Umbrella' },
  { icon: '👟', text: 'Waterproof shoes' },
]

const SNOW_ACTIVITIES = [
  { icon: '🚶', text: 'Walk in the snow' },
  { icon: '📸', text: 'Photography of snowy scenery' },
  { icon: '⛄', text: 'Build a snowman' },
  { icon: '🏠', text: 'Get cosy indoors and watch a film' },
  { icon: '🍳', text: 'Cooking or baking comfort food' },
  { icon: '☕', text: 'Visit a café or coffee shop' },
  { icon: '🏋️', text: 'Gym session indoors' },
]
const SNOW_CLOTHING = [
  { icon: '🧥', text: 'Winter coat' },
  { icon: '👖', text: 'Thermal trousers' },
  { icon: '🧤', text: 'Gloves' },
  { icon: '🧣', text: 'Scarf' },
  { icon: '🧢', text: 'Hat' },
  { icon: '👟', text: 'Snow-suitable shoes' },
]

const STORM_ACTIVITIES = [
  { icon: '🏠', text: 'Stay indoors — it\'s dangerous outside' },
  { icon: '🎬', text: 'Watch movies or a series' },
  { icon: '📚', text: 'Read a book or catch up on podcasts' },
  { icon: '🎮', text: 'Video games or board games' },
  { icon: '🍳', text: 'Cooking or baking comfort food' },
]
const STORM_CLOTHING = [
  { icon: '🧥', text: 'Waterproof jacket' },
  { icon: '☂',  text: 'Umbrella' },
  { icon: '👟', text: 'Waterproof shoes' },
  { icon: '🌂', text: 'Raincoat' },
]

const WINDY_EXTRAS_ACTIVITIES = [
  { icon: '📸', text: 'Photography of dramatic clouds and skies' },
  { icon: '🏬', text: 'Visit shopping centres or indoor markets' },
  { icon: '📚', text: 'Reading indoors' },
  { icon: '📺', text: 'Watch live sports or documentaries' },
]
const WINDY_EXTRAS_CLOTHING = [
  { icon: '💨', text: 'Wind-suitable jacket' },
  { icon: '👖', text: 'Long trousers' },
]

const HIGH_UV_ACTIVITIES = [
  { icon: '🌳', text: 'Relax in a park under shade' },
  { icon: '📖', text: 'Reading outdoors with protective clothing' },
  { icon: '☕', text: 'Outdoor cafés (seek shade)' },
  { icon: '🧘', text: 'Light stretching or yoga outdoors (avoid midday)' },
  { icon: '📸', text: 'Photography during morning or evening' },
]
const HIGH_UV_CLOTHING = [
  { icon: '🧴', text: 'Sunscreen — essential today!' },
  { icon: '🧢', text: 'Cap' },
  { icon: '🕶',  text: 'Sunglasses' },
]

const MILD_ACTIVITIES = [
  { icon: '🚶', text: 'Go for a walk' },
  { icon: '☕', text: 'Visit a café' },
  { icon: '📸', text: 'Photography outdoors' },
  { icon: '🚲', text: 'Cycling' },
  { icon: '📚', text: 'Read in a quiet spot' },
]
const MILD_CLOTHING = [
  { icon: '🧥', text: 'Light jacket' },
  { icon: '👖', text: 'Jeans' },
  { icon: '👟', text: 'Comfortable shoes' },
]

// ── deduplicate by text field ─────────────────────────────────────
function dedup(arr) {
  const seen = new Set()
  return arr.filter(item => {
    if (seen.has(item.text)) return false
    seen.add(item.text)
    return true
  })
}

// ── main engine ──────────────────────────────────────────────────
export function getWeatherSuggestions({ temp, windspeed, precipProb, weathercode, uvIndex = 3 }) {
  const isStorm     = weathercode >= 95
  const isSnow      = (weathercode >= 71 && weathercode <= 77) || (weathercode >= 85 && weathercode <= 86)
  const isRain      = (weathercode >= 51 && weathercode <= 67) || (weathercode >= 80 && weathercode <= 82) || precipProb >= 60
  const isHot       = temp > 20
  const isWarm      = temp >= 10 && temp <= 20
  const isCold      = temp < 10
  const isWindy     = windspeed > 30
  const isHighUV    = uvIndex >= 6

  let activities = []
  let clothing   = []
  let primaryCondition = 'Mild'
  let primaryEmoji     = '🌤'
  const conditionLabels = []

  // Priority: storm → snow → rain → temperature → overlays
  if (isStorm) {
    activities = [...STORM_ACTIVITIES]
    clothing   = [...STORM_CLOTHING]
    primaryCondition = 'Stormy'
    primaryEmoji     = '⛈'
    conditionLabels.push('Storm')
  } else if (isSnow) {
    activities = [...SNOW_ACTIVITIES]
    clothing   = [...SNOW_CLOTHING]
    primaryCondition = 'Snowy'
    primaryEmoji     = '❄️'
    conditionLabels.push('Snow')
  } else if (isRain) {
    activities = [...RAIN_ACTIVITIES]
    clothing   = [...RAIN_CLOTHING]
    primaryCondition = 'Rainy'
    primaryEmoji     = '🌧'
    conditionLabels.push('Rain')

    // Layer temperature clothing under rain gear
    if (isCold) {
      clothing = [...clothing, ...COLD_CLOTHING]
      conditionLabels.push('Cold')
    }
  } else if (isHot) {
    activities = [...HOT_ACTIVITIES]
    clothing   = [...HOT_CLOTHING]
    primaryCondition = 'Hot'
    primaryEmoji     = '☀️'
    conditionLabels.push('Hot')
  } else if (isWarm) {
    activities = [...WARM_ACTIVITIES]
    clothing   = [...WARM_CLOTHING]
    primaryCondition = 'Warm'
    primaryEmoji     = '🌤'
    conditionLabels.push('Warm')
  } else if (isCold) {
    activities = [...COLD_ACTIVITIES]
    clothing   = [...COLD_CLOTHING]
    primaryCondition = temp < 5 ? 'Very Cold' : 'Cold'
    primaryEmoji     = '🥶'
    conditionLabels.push('Cold')
  } else {
    activities = [...MILD_ACTIVITIES]
    clothing   = [...MILD_CLOTHING]
  }

  // Overlay: windy (adds extra items unless it's a storm)
  if (isWindy && !isStorm) {
    conditionLabels.push('Windy')
    if (primaryCondition === 'Mild') {
      primaryCondition = 'Windy'
      primaryEmoji     = '💨'
    }
    activities = [...activities, ...WINDY_EXTRAS_ACTIVITIES]
    const hasJacket = clothing.some(c => c.text.toLowerCase().includes('jacket') || c.text.toLowerCase().includes('coat'))
    if (!hasJacket) clothing = [...clothing, ...WINDY_EXTRAS_CLOTHING]
    else clothing = [...clothing, { icon: '👖', text: 'Long trousers' }]
  }

  // Overlay: high UV (adds items when outdoors is viable)
  if (isHighUV && !isStorm && !isSnow) {
    conditionLabels.push('High UV')
    if (!isRain) {
      activities = [...activities, ...HIGH_UV_ACTIVITIES]
    }
    const hasSunscreen = clothing.some(c => c.text.toLowerCase().includes('sunscreen'))
    if (!hasSunscreen) clothing = [...clothing, ...HIGH_UV_CLOTHING]
  }

  return {
    primaryCondition,
    primaryEmoji,
    conditionLabels,
    activities: dedup(activities).slice(0, 8),
    clothing:   dedup(clothing).slice(0, 8),
  }
}

// ── derive usable inputs from raw API data ───────────────────────
export function buildSuggestionInputs(weather, forecast) {
  const temp      = weather?.main?.temp ?? 15
  const feelsLike = weather?.main?.feels_like ?? temp
  const humidity  = weather?.main?.humidity ?? 60
  // OpenWeatherMap gives wind in m/s; convert to km/h
  const windspeed = (weather?.wind?.speed ?? 0) * 3.6
  const country   = weather?.sys?.country ?? ''

  let precipProb  = 0
  let weathercode = 0
  let uvIndex     = 0

  if (forecast?.hourly) {
    const { time, precipitation_probability, weathercode: codes } = forecast.hourly
    const now   = Date.now()
    const cutoff = now + 12 * 60 * 60 * 1000

    // Max precip and most severe code in the next 12 hours
    time.forEach((t, i) => {
      const ts = new Date(t).getTime()
      if (ts >= now && ts <= cutoff) {
        if (precipitation_probability[i] > precipProb) precipProb = precipitation_probability[i]
        if (codes[i] > weathercode) weathercode = codes[i]
      }
    })
  }

  if (forecast?.daily?.uv_index_max?.length) {
    uvIndex = forecast.daily.uv_index_max[0] ?? 0
  }

  return { temp, feelsLike, windspeed, precipProb, weathercode, uvIndex, humidity, country }
}
