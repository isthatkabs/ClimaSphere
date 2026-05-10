const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const BASE = 'https://api.openweathermap.org/data/2.5'

export async function getCurrentWeather(city = 'London') {
  const res = await fetch(`${BASE}/weather?q=${city}&appid=${API_KEY}&units=metric`)
  return res.json()
}

export async function getForecast(city = 'London') {
  const res = await fetch(`${BASE}/forecast?q=${city}&appid=${API_KEY}&units=metric&cnt=40`)
  return res.json()
}