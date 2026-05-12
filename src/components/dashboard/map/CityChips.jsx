import { CITIES } from './mapConstants'

export default function CityChips({ selectedCityName, onSelect }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 7,
      marginTop: 4,
    }}>
      {CITIES.map(city => {
        const isSelected = selectedCityName === city.name
        return (
          <button
            key={city.name}
            onClick={() => onSelect(city)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 11px',
              background: isSelected ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${isSelected ? 'rgba(124,58,237,0.45)' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 9, cursor: 'pointer',
              color: 'inherit', fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
            }}
            onMouseLeave={e => {
              if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
            }}
          >
            <span style={{
              width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
              background: isSelected ? '#a78bfa' : '#7c3aed',
              boxShadow: isSelected ? '0 0 6px rgba(167,139,250,0.6)' : 'none',
            }} />
            <span style={{
              fontSize: 11, fontWeight: 500,
              flex: 1, textAlign: 'left',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              color: isSelected ? '#e2eafc' : 'rgba(226,234,252,0.6)',
            }}>
              {city.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}