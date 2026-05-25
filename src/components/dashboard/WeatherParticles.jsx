import Particles, { ParticlesProvider } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

async function initEngine(engine) {
  await loadSlim(engine)
}

const BASE = {
  fullScreen:   { enable: false },
  background:   { color: 'transparent' },
  detectRetina: true,
  fpsLimit:     60,
}

// Square SVG bounding box with a thin vertical streak — renders as a rain line when tilted
const mkDrop = (color, w, h, opacity) =>
  `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='${h}' height='${h}'><rect x='${Math.round((h - w) / 2)}' y='0' width='${w}' height='${h}' rx='${Math.round(w / 2)}' fill='${encodeURIComponent(color)}' opacity='${opacity}'/></svg>`

const DROPS = {
  drizzle: mkDrop('#7dd3fc', 2, 12, 0.75),
  rain:    mkDrop('#38bdf8', 2, 18, 0.88),
}

// Zigzag lightning bolt with layered glow — thin white core + electric-blue glow strokes
const LIGHTNING_SVG = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='50' height='50'><polyline points='30,1 19,23 28,23 17,49' stroke='%2338bdf8' stroke-width='9' stroke-linecap='round' stroke-linejoin='round' stroke-opacity='0.18' fill='none'/><polyline points='30,1 19,23 28,23 17,49' stroke='%2393c5fd' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round' stroke-opacity='0.6' fill='none'/><polyline points='30,1 19,23 28,23 17,49' stroke='%23e0f2fe' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round' fill='none'/></svg>`

export function getWeatherEffect(wmoCode, iconCode) {
  if (wmoCode !== null && wmoCode !== undefined) {
    if (wmoCode === 0 || wmoCode === 1)                      return 'sunny'
    if (wmoCode === 2 || wmoCode === 3)                      return 'cloudy'
    if (wmoCode >= 45 && wmoCode <= 48)                      return 'fog'
    if (wmoCode >= 51 && wmoCode <= 57)                      return 'drizzle'
    if ((wmoCode >= 61 && wmoCode <= 67) || (wmoCode >= 80 && wmoCode <= 82)) return 'rain'
    if ((wmoCode >= 71 && wmoCode <= 77) || wmoCode === 85 || wmoCode === 86) return 'snow'
    if (wmoCode >= 95)                                       return 'storm'
  }
  const c = iconCode?.slice(0, 2)
  if (c === '01') return 'sunny'
  if (c === '02') return 'cloudy'
  if (c === '09') return 'drizzle'
  if (c === '10') return 'rain'
  if (c === '11') return 'storm'
  if (c === '13') return 'snow'
  if (c === '50') return 'fog'
  return null
}

const EFFECTS = {
  sunny: {
    ...BASE,
    particles: {
      number:  { value: 55 },
      color:   { value: ['#fde68a', '#fbbf24', '#f59e0b', '#fff7ed', '#ffffff'] },
      shape:   { type: 'circle' },
      opacity: { value: { min: 0.1, max: 0.65 }, animation: { enable: true, speed: 0.8, sync: false } },
      size:    { value: { min: 1, max: 3.5 } },
      move:    { enable: true, direction: 'top', speed: { min: 0.4, max: 1.2 }, random: true, straight: false, outModes: 'out' },
    },
  },
  cloudy: {
    ...BASE,
    particles: {
      number:  { value: 18 },
      color:   { value: ['#dde6f0', '#c8d8e8'] },
      shape:   { type: 'circle' },
      opacity: { value: { min: 0.04, max: 0.18 }, animation: { enable: true, speed: 0.3, sync: false } },
      size:    { value: { min: 2, max: 4 } },
      move:    { enable: true, direction: 'top', speed: { min: 0.15, max: 0.4 }, random: true, outModes: 'out' },
    },
  },
  drizzle: {
    ...BASE,
    particles: {
      number:  { value: 120 },
      shape:   { type: 'image', options: { image: { src: DROPS.drizzle, width: 12, height: 12 } } },
      opacity: { value: 0.7 },
      size:    { value: { min: 8, max: 13 } },
      rotate:  { value: 8, random: false, animation: { enable: false } },
      move:    { enable: true, direction: 'bottom', speed: { min: 9, max: 16 }, angle: { offset: 0, value: 6 }, random: false, outModes: 'out' },
    },
  },
  rain: {
    ...BASE,
    particles: {
      number:  { value: 220 },
      shape:   { type: 'image', options: { image: { src: DROPS.rain, width: 18, height: 18 } } },
      opacity: { value: 0.82 },
      size:    { value: { min: 10, max: 17 } },
      rotate:  { value: 13, random: false, animation: { enable: false } },
      move:    { enable: true, direction: 'bottom', speed: { min: 20, max: 35 }, angle: { offset: 0, value: 8 }, random: false, outModes: 'out' },
    },
  },
  storm: {
    ...BASE,
    particles: {
      number:  { value: 8 },
      shape:   { type: 'image', options: { image: { src: LIGHTNING_SVG, width: 50, height: 50 } } },
      opacity: { value: { min: 0, max: 0.95 }, animation: { enable: true, speed: 5, sync: false } },
      size:    { value: { min: 30, max: 65 } },
      rotate:  { value: 0, random: false, animation: { enable: false } },
      move:    { enable: false },
    },
  },
  snow: {
    ...BASE,
    particles: {
      number:  { value: 80 },
      color:   { value: ['#e2eafc', '#ffffff', '#dbeafe'] },
      shape:   { type: 'circle' },
      opacity: { value: { min: 0.5, max: 0.95 } },
      size:    { value: { min: 2.5, max: 6 } },
      move:    { enable: true, direction: 'bottom', speed: { min: 0.8, max: 3 }, random: true, straight: false, outModes: 'out' },
    },
  },
  fog: {
    ...BASE,
    particles: {
      number:  { value: 30 },
      color:   { value: ['#94a3b8', '#b8c8d8', '#cfd8e8'] },
      shape:   { type: 'circle' },
      opacity: { value: { min: 0.12, max: 0.32 }, animation: { enable: true, speed: 0.4, sync: false } },
      size:    { value: { min: 40, max: 90 } },
      move:    { enable: true, direction: 'right', speed: { min: 0.2, max: 0.6 }, random: true, outModes: 'out' },
    },
  },
}

export default function WeatherParticles({ wmoCode, iconCode }) {
  const effect  = getWeatherEffect(wmoCode, iconCode)
  const options = effect ? EFFECTS[effect] : null
  if (!options) return null

  return (
    <ParticlesProvider init={initEngine}>
      <Particles
        id="weather-particles"
        options={options}
        style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      />
    </ParticlesProvider>
  )
}
