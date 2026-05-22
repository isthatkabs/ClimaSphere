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
  { icon: '🏖',  text: 'Chill by the beach or lido' },
  { icon: '⚽', text: 'Outdoor sports — football or cricket' },
  { icon: '🏊', text: 'Go swimming outdoors or at a pool' },
  { icon: '🍦', text: 'Get ice cream and enjoy the outdoors' },
  { icon: '🌅', text: 'Walk during sunset when it cools down' },
  { icon: '🥾', text: 'Hike on a shaded trail early morning' },
  { icon: '🌿', text: 'Visit a botanical garden' },
  { icon: '🎾', text: 'Early morning tennis before the heat peaks' },
  { icon: '🏕',  text: 'Evening BBQ or garden party' },
  { icon: '🌟', text: 'Stargazing after dark when it\'s cooler' },
  { icon: '🚴', text: 'Cycle early morning or evening' },
]
const HOT_CLOTHING = [
  { icon: '👕', text: 'T-shirt or vest top' },
  { icon: '🩳', text: 'Shorts' },
  { icon: '👗', text: 'Light summer dress or linen trousers' },
  { icon: '🕶',  text: 'Sunglasses' },
  { icon: '🧢', text: 'Sun hat or cap' },
  { icon: '👡', text: 'Sandals or flip-flops' },
  { icon: '🧴', text: 'Sunscreen (at least SPF 30)' },
  { icon: '👚', text: 'Light breathable shirt (linen or cotton)' },
]

const WARM_ACTIVITIES = [
  { icon: '⚽', text: 'Outdoor sports — football or cricket' },
  { icon: '🚶', text: 'Go on a long walk' },
  { icon: '🚲', text: 'Cycling' },
  { icon: '☕', text: 'Visit an outdoor café' },
  { icon: '👫', text: 'Meet up with friends' },
  { icon: '📸', text: 'Photography of any scenery' },
  { icon: '🎨', text: 'Drawing or painting outdoors' },
  { icon: '🥾', text: 'Go for a hike on a local trail' },
  { icon: '🏃', text: 'Morning run or jog' },
  { icon: '🛒', text: 'Visit a farmers market or street market' },
  { icon: '🐦', text: 'Birdwatching in a local park' },
  { icon: '🌳', text: 'Explore a nature reserve or woodland' },
  { icon: '🛹', text: 'Skateboarding or rollerblading' },
  { icon: '🧘', text: 'Outdoor yoga or stretching in the park' },
  { icon: '🎾', text: 'Tennis or badminton outdoors' },
]
const WARM_CLOTHING = [
  { icon: '🧥', text: 'Light jacket (take it off if it warms up)' },
  { icon: '👚', text: 'Long sleeve top or lightweight jumper' },
  { icon: '👖', text: 'Jeans or chinos' },
  { icon: '👟', text: 'Comfortable trainers' },
  { icon: '🧣', text: 'Light scarf for the breeze' },
  { icon: '🧥', text: 'Light hoodie for the evening' },
]

const COLD_ACTIVITIES = [
  { icon: '☕', text: 'Go for a hot chocolate / café hopping' },
  { icon: '🎬', text: 'Visit indoor attractions — cinema, bowling, arcade' },
  { icon: '🎮', text: 'Board games or card games' },
  { icon: '🍳', text: 'Cooking or baking at home' },
  { icon: '🏋️', text: 'Gym session or indoor sports' },
  { icon: '🚶', text: 'Go for a walk if dressed warmly enough' },
  { icon: '🎨', text: 'Visit a museum or art gallery' },
  { icon: '⛸',  text: 'Ice skating at a local rink' },
  { icon: '🛁', text: 'Spa or self-care day at home' },
  { icon: '🍲', text: 'Cook a hearty soup or stew' },
  { icon: '📱', text: 'Video call friends or family' },
  { icon: '🎭', text: 'See a show, theatre, or comedy night' },
  { icon: '📚', text: 'Catch up on reading or start a new book' },
  { icon: '🎵', text: 'Discover new music or listen to a podcast' },
]
const COLD_CLOTHING = [
  { icon: '🧥', text: 'Warm coat' },
  { icon: '👚', text: 'Jumper or thick knit' },
  { icon: '🧣', text: 'Scarf' },
  { icon: '🧤', text: 'Gloves' },
  { icon: '🔥', text: 'Thermal base layer' },
  { icon: '🧢', text: 'Woolly hat' },
  { icon: '🥾', text: 'Insulated boots' },
  { icon: '🧦', text: 'Thick thermal socks' },
  { icon: '🧶', text: 'Fleece or gilet for extra warmth' },
]

const RAIN_ACTIVITIES = [
  { icon: '☕', text: 'Visit a café or coffee shop' },
  { icon: '📚', text: 'Read a book or listen to podcasts indoors' },
  { icon: '🎬', text: 'Watch movies or a series' },
  { icon: '🏛',  text: 'Go to a museum, gallery, or library' },
  { icon: '🏋️', text: 'Gym session or indoor workout' },
  { icon: '🎮', text: 'Video games or board games' },
  { icon: '🧗', text: 'Indoor climbing wall' },
  { icon: '🎭', text: 'See a show, theatre, or comedy night' },
  { icon: '🍳', text: 'Try a new recipe or do some meal prep' },
  { icon: '🐟', text: 'Visit an aquarium or indoor attraction' },
  { icon: '🎨', text: 'Art, pottery, or a creative class' },
  { icon: '📓', text: 'Journaling or planning your week ahead' },
  { icon: '🛀', text: 'Self-care — bath, skincare, relax at home' },
  { icon: '📖', text: 'Start a new book or finish one you\'ve been meaning to' },
]
const RAIN_CLOTHING = [
  { icon: '🧥', text: 'Waterproof jacket' },
  { icon: '🌂', text: 'Raincoat' },
  { icon: '☂',  text: 'Umbrella' },
  { icon: '👟', text: 'Waterproof shoes or trainers' },
  { icon: '🥾', text: 'Wellington boots (if outdoors)' },
  { icon: '👖', text: 'Waterproof trousers (if outdoors)' },
]

const SNOW_ACTIVITIES = [
  { icon: '🚶', text: 'Walk in the snow' },
  { icon: '📸', text: 'Photography of snowy scenery' },
  { icon: '⛄', text: 'Build a snowman' },
  { icon: '🏠', text: 'Get cosy indoors and watch a film' },
  { icon: '🍳', text: 'Cooking or baking comfort food' },
  { icon: '☕', text: 'Visit a café or coffee shop' },
  { icon: '🏋️', text: 'Gym session indoors' },
  { icon: '🛷', text: 'Go sledding on a nearby hill' },
  { icon: '⛷',  text: 'Skiing or snowboarding if accessible' },
  { icon: '🍲', text: 'Make a hearty soup or stew' },
  { icon: '📖', text: 'Curl up with a good book' },
  { icon: '🎨', text: 'Indoor crafts, drawing, or art' },
]
const SNOW_CLOTHING = [
  { icon: '🧥', text: 'Winter coat (insulated)' },
  { icon: '👖', text: 'Thermal trousers or waterproof over-trousers' },
  { icon: '🧤', text: 'Waterproof gloves' },
  { icon: '🧣', text: 'Scarf or neck gaiter' },
  { icon: '🧢', text: 'Woolly hat covering the ears' },
  { icon: '🥾', text: 'Insulated waterproof boots' },
  { icon: '🧦', text: 'Thermal socks' },
  { icon: '🔥', text: 'Thermal base layer top and bottom' },
]

const STORM_ACTIVITIES = [
  { icon: '🏠', text: 'Stay indoors — it\'s dangerous outside' },
  { icon: '🎬', text: 'Watch movies or binge a series' },
  { icon: '📚', text: 'Read a book or catch up on podcasts' },
  { icon: '🎮', text: 'Video games or board games' },
  { icon: '🍳', text: 'Cooking or baking comfort food' },
  { icon: '📓', text: 'Journaling, planning, or goal-setting' },
  { icon: '📱', text: 'Video call friends or family' },
  { icon: '🎨', text: 'Draw, sketch, or do arts and crafts' },
  { icon: '🧘', text: 'Home yoga or stretching session' },
  { icon: '🎵', text: 'Listen to music or make a new playlist' },
]
const STORM_CLOTHING = [
  { icon: '🧥', text: 'Waterproof jacket — stay inside if possible' },
  { icon: '☂',  text: 'Sturdy umbrella' },
  { icon: '👟', text: 'Waterproof shoes' },
  { icon: '🌂', text: 'Raincoat with hood' },
]

const WINDY_EXTRAS_ACTIVITIES = [
  { icon: '📸', text: 'Photography of dramatic clouds and skies' },
  { icon: '🏬', text: 'Visit shopping centres or indoor markets' },
  { icon: '📚', text: 'Reading indoors' },
  { icon: '📺', text: 'Watch live sports or a documentary' },
  { icon: '🪁', text: 'Fly a kite (if wind isn\'t dangerously strong)' },
  { icon: '🧗', text: 'Indoor rock climbing' },
  { icon: '📖', text: 'Visit a library or bookshop' },
  { icon: '🎭', text: 'Catch an indoor show or event' },
]
const WINDY_EXTRAS_CLOTHING = [
  { icon: '💨', text: 'Wind-resistant jacket or outer layer' },
  { icon: '👖', text: 'Long trousers' },
  { icon: '🧢', text: 'Close-fitting hat that won\'t blow off' },
  { icon: '🧣', text: 'Scarf to protect your face' },
]

const HIGH_UV_ACTIVITIES = [
  { icon: '🌳', text: 'Relax in a park under shade' },
  { icon: '📖', text: 'Reading outdoors with protective clothing' },
  { icon: '☕', text: 'Outdoor café (sit in the shade)' },
  { icon: '🧘', text: 'Yoga or stretching outdoors — avoid midday' },
  { icon: '📸', text: 'Photography during morning or evening light' },
  { icon: '🏃', text: 'Early morning run before UV peaks (before 10am)' },
  { icon: '🌊', text: 'Beach activities — stay in the shade or water' },
  { icon: '🌿', text: 'Shaded botanical garden or woodland walk' },
]
const HIGH_UV_CLOTHING = [
  { icon: '🧴', text: 'Sunscreen — SPF 50 recommended, reapply every 2h' },
  { icon: '🧢', text: 'Wide-brim hat or cap' },
  { icon: '🕶',  text: 'UV-protective sunglasses' },
  { icon: '👚', text: 'Light long-sleeve shirt for UV coverage' },
]

const MILD_ACTIVITIES = [
  { icon: '🚶', text: 'Go for a walk' },
  { icon: '☕', text: 'Visit a café' },
  { icon: '📸', text: 'Photography outdoors' },
  { icon: '🚲', text: 'Cycling' },
  { icon: '📚', text: 'Read in a quiet spot' },
  { icon: '🌳', text: 'Explore a local park or nature trail' },
  { icon: '🏃', text: 'Go for a run' },
  { icon: '🛒', text: 'Visit a market or browse the shops' },
  { icon: '🎾', text: 'Hit the courts for some tennis' },
]
const MILD_CLOTHING = [
  { icon: '🧥', text: 'Light jacket' },
  { icon: '👖', text: 'Jeans or comfortable trousers' },
  { icon: '👟', text: 'Comfortable trainers' },
  { icon: '👚', text: 'Casual top or t-shirt' },
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
    else clothing = [...clothing, { icon: '👖', text: 'Long trousers' }, { icon: '🧢', text: 'Close-fitting hat that won\'t blow off' }]
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
    activities: dedup(activities).slice(0, 10),
    clothing:   dedup(clothing).slice(0, 10),
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
    const now    = Date.now()
    const cutoff = now + 12 * 60 * 60 * 1000

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

// ── build a plain-text weather summary for the AI ────────────────
export function buildWeatherSummary({ temp, feelsLike, windspeed, precipProb, weathercode, uvIndex, humidity, country }, locationName, primaryCondition) {
  return [
    `Location: ${locationName ?? 'unknown'}${country ? ` (${country})` : ''}`,
    `Condition: ${primaryCondition}`,
    `Temperature: ${Math.round(temp)}°C (feels like ${Math.round(feelsLike)}°C)`,
    `Humidity: ${humidity}%`,
    `Wind: ${Math.round(windspeed)} km/h`,
    `Rain chance (next 12h): ${precipProb}%`,
    `UV Index: ${uvIndex}`,
  ].join(' | ')
}
