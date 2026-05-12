export function makeCityIcon(L, selected = false, clicked = false) {
  const color = clicked  ? '#f87171'
              : selected ? '#a78bfa'
              : '#7c3aed'
  const glow  = clicked  ? 'rgba(248,113,113,0.6)'
              : selected ? 'rgba(167,139,250,0.5)'
              : 'rgba(124,58,237,0.5)'
  const size  = selected || clicked ? 13 : 9

  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:${size}px;height:${size}px;cursor:pointer">
        <div style="
          position:absolute;inset:0;border-radius:50%;
          background:${color};
          border:2px solid rgba(255,255,255,0.25);
          box-shadow:0 0 10px ${glow},0 0 20px ${glow};
        "></div>
        ${selected || clicked ? `<div style="
          position:absolute;inset:0;border-radius:50%;
          background:${color};
          animation:cs-pulse 1.8s ease-out infinite;
        "></div>` : ''}
      </div>`,
    iconSize:   [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

export function makeClickIcon(L) {
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:18px;height:18px">
        <div style="
          position:absolute;inset:0;border-radius:50%;
          background:#f87171;border:2px solid rgba(255,255,255,0.3);
          box-shadow:0 0 12px rgba(248,113,113,0.7),0 0 28px rgba(248,113,113,0.4);
        "></div>
        <div style="
          position:absolute;inset:0;border-radius:50%;
          background:#f87171;
          animation:cs-pulse 1.5s ease-out infinite;
        "></div>
      </div>`,
    iconSize:   [18, 18],
    iconAnchor: [9, 9],
  })
}