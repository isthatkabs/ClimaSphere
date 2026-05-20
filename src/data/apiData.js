export const tiers = [
  {
    name: 'Free', price: '$0', period: 'forever',
    color: '#22c55e', border: 'rgba(34,197,94,0.25)', bg: 'rgba(34,197,94,0.05)',
    features: ['1,000 calls/day', '5-day forecast', 'Current conditions', 'City search', 'Community support'],
    url: 'https://openweathermap.org/api',
  },
  {
    name: 'Pro', price: '$12', period: 'per month',
    color: '#a78bfa', border: 'rgba(167,139,250,0.35)', bg: 'rgba(167,139,250,0.07)',
    badge: 'Most popular',
    features: ['100,000 calls/day', '14-day forecast', 'Hourly data', 'Air quality index', 'Radar & satellite', 'Email support'],
    cta: 'Start Free Trial',
    ctaStyle: { background: 'linear-gradient(135deg, #7c3aff, #5a7cff)', color: '#fff', border: 'none' },
    url: 'https://openweathermap.org/price',
  },
  {
    name: 'Enterprise', price: 'Custom', period: 'contact us',
    color: '#fbbf24', border: 'rgba(251,191,36,0.25)', bg: 'rgba(251,191,36,0.05)',
    features: ['Unlimited calls', 'All forecast models', 'Webhooks & streaming', 'SLA guarantee', 'Dedicated support', 'Custom endpoints'],
    cta: 'Contact Sales',
    ctaStyle: { background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' },
    url: 'https://openweathermap.org/enterprise',
  },
]

export const endpoints = [
  {
    method: 'GET', path: '/v1/current',
    desc: 'Returns real-time weather for any lat/lon — temperature, humidity, wind, pressure, and conditions.',
    url: 'https://openweathermap.org/current',
  },
  {
    method: 'GET', path: '/v1/forecast',
    desc: 'Hourly and daily forecasts up to 5 days. Includes precipitation probability and weather codes.',
    url: 'https://open-meteo.com/en/docs',
  },
  {
    method: 'GET', path: '/v1/alerts',
    desc: 'Active severe weather alerts (storms, snow, fog, extreme heat) for a given location.',
    url: 'https://openweathermap.org/triggers',
  },
  {
    method: 'GET', path: '/v1/air',
    desc: 'Air Quality Index (1–5 scale) plus individual pollutant readings: CO, NO₂, O₃, PM2.5, PM10.',
    url: 'https://openweathermap.org/api/air-pollution',
  },
  {
    method: 'GET', path: '/v1/search',
    desc: 'Geocode a city name into coordinates. Returns up to 5 matching cities with country and state.',
    url: 'https://openweathermap.org/api/geocoding-api',
  },
]

export const codeExample = `fetch('https://api.climasphere.io/v1/current?lat=51.5&lon=-0.12', {
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
})
.then(res => res.json())
.then(data => {
  console.log(data.temp)        // 18.4
  console.log(data.condition)   // "Partly cloudy"
  console.log(data.wind_kmh)    // 22
})`