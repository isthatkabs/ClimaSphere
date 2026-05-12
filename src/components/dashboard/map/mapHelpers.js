import { API_KEY } from './mapConstants'

export function weatherEmoji(id) {
  if (!id) return '🌡️'
  if (id === 800)             return '☀️'
  if (id >= 801 && id <= 804) return '☁️'
  if (id >= 700)              return '🌫️'
  if (id >= 600)              return '❄️'
  if (id >= 500)              return '🌧️'
  if (id >= 300)              return '🌦️'
  if (id >= 200)              return '⛈️'
  return '🌡️'
}

export function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export async function fetchWeather(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  )
  return res.json()
}