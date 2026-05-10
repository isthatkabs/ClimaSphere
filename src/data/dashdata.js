/* ── mock data ── */
export const HOURLY = [
  { time: 'Now',   icon: '⛅', temp: 18, precip: 10 },
  { time: '2 PM',  icon: '🌤',  temp: 20, precip: 5  },
  { time: '3 PM',  icon: '☀️', temp: 22, precip: 0  },
  { time: '4 PM',  icon: '☀️', temp: 21, precip: 0  },
  { time: '5 PM',  icon: '🌤',  temp: 19, precip: 8  },
  { time: '6 PM',  icon: '🌦',  temp: 17, precip: 45 },
  { time: '7 PM',  icon: '🌧',  temp: 15, precip: 70 },
  { time: '8 PM',  icon: '🌧',  temp: 14, precip: 80 },
  { time: '9 PM',  icon: '🌦',  temp: 13, precip: 50 },
  { time: '10 PM', icon: '⛅', temp: 12, precip: 20 },
  { time: '11 PM', icon: '🌙', temp: 11, precip: 5  },
]

export const WEEKLY = [
  { day: 'Today', icon: '⛅', cond: 'Partly cloudy', precip: '10%', hi: 22, lo: 13, today: true },
  { day: 'Tue',   icon: '🌧', cond: 'Heavy rain',    precip: '85%', hi: 16, lo: 11 },
  { day: 'Wed',   icon: '🌦', cond: 'Showers',       precip: '60%', hi: 17, lo: 10 },
  { day: 'Thu',   icon: '☁️', cond: 'Overcast',      precip: '20%', hi: 14, lo: 9  },
  { day: 'Fri',   icon: '🌤',  cond: 'Mostly sunny',  precip: '5%',  hi: 19, lo: 10 },
]

export const METRICS = [
  { label: 'Humidity',   icon: '💧', val: '74%',     sub: 'High — feels sticky',  fill: 74, color: '#38bdf8' },
  { label: 'Wind',       icon: '💨', val: '18 km/h',  sub: 'SW · gusts 29 km/h',  fill: 36, color: '#a78bfa' },
  { label: 'UV Index',   icon: '☀️', val: '3',        sub: 'Moderate — some care', fill: 30, color: '#fbbf24' },
  { label: 'Visibility', icon: '👁',  val: '12 km',    sub: 'Good visibility',      fill: 80, color: '#22c55e' },
  { label: 'Pressure',   icon: '🌡',  val: '1013 hPa', sub: 'Rising slowly',        fill: 55, color: '#f87171' },
  { label: 'Dew Point',  icon: '🌫',  val: '13°C',     sub: 'Comfortable',          fill: 45, color: '#34d399' },
]

export const NAV = [
  { icon: '🏠', label: 'Overview',  active: true  },
  { icon: '🗺',  label: 'Map',       active: false },
  { icon: '📊', label: 'Analytics', active: false },
  { icon: '📍', label: 'Locations', active: false },
  { icon: '🔔', label: 'Alerts',    active: false },
  { icon: '⚙️', label: 'Settings',  active: false },
]

/* ── helpers ── */
export function getInitials(email) {
  try {
    if (!email) return 'U'
    if (typeof email !== 'string') return 'U'
    const parts = email.split('@')
    if (!parts[0]) return 'U'
    return parts[0].slice(0, 2).toUpperCase()
  } catch (e) {
    return 'U'
  }
}

export function getNow() {
  try {
    return new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch (e) {
    return 'Today'
  }
}

export function getGreeting(user) {
  try {
    const h = new Date().getHours()
    let name = 'there'

    // Safety check: ensure user exists
    if (!user) {
      const part = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
      return `${part} 👋`
    }

    // Try displayName first
    if (user.displayName) {
      if (typeof user.displayName === 'string' && user.displayName.trim()) {
        name = user.displayName
      }
    }
    // Otherwise try email
    else if (user.email) {
      if (typeof user.email === 'string' && user.email.includes('@')) {
        const emailParts = user.email.split('@')
        if (emailParts[0]) {
          name = emailParts[0]
        }
      }
    }

    const part = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
    return `${part}, ${name} 👋`
  } catch (e) {
    const h = new Date().getHours()
    const part = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
    return `${part} 👋`
  }
}