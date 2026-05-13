export const API_KEY = 'cb1b50442a576efad21fb25f1ea232fa'

export const TILE_URL =
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

export const TILE_OPTIONS = {
  maxZoom: 19,
  subdomains: 'abcd',
  attribution: '',
}

export const MAP_OPTIONS = {
  center: [20, 0],
  zoom: 2,
  minZoom: 2,
  maxZoom: 18,
  zoomControl: false,
  attributionControl: false,
  worldCopyJump: true,
}

export const CITIES = [
  { name: 'London',    lat: 51.51,  lon: -0.13  },
  { name: 'New York',  lat: 40.71,  lon: -74.01 },
  { name: 'Paris',     lat: 48.86,  lon:  2.35  },
  { name: 'Tokyo',     lat: 35.68,  lon: 139.69 },
  { name: 'Sydney',    lat: -33.87, lon: 151.21 },
  { name: 'Dubai',     lat: 25.20,  lon:  55.27 },
  { name: 'São Paulo', lat: -23.55, lon: -46.63 },
  { name: 'Mumbai',    lat:  19.08, lon:  72.88 },
  { name: 'Cairo',     lat:  30.04, lon:  31.24 },
  { name: 'Toronto',   lat:  43.65, lon: -79.38 },
  { name: 'Berlin',    lat:  52.52, lon:  13.40 },
  { name: 'Singapore', lat:   1.35, lon: 103.82 },
]

export const LEAFLET_CSS_URL =
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'

export const LEAFLET_OVERRIDES = `
  .cs-map-wrap .leaflet-control-zoom a {
    background: rgba(8,14,34,0.92) !important;
    color: rgba(226,234,252,0.7) !important;
    border: 1px solid rgba(124,58,237,0.3) !important;
    width: 32px !important; height: 32px !important;
    line-height: 30px !important;
    font-size: 16px !important;
    backdrop-filter: blur(12px);
    transition: all 0.15s;
  }
  .cs-map-wrap .leaflet-control-zoom a:hover {
    background: rgba(124,58,237,0.2) !important;
    color: #a78bfa !important;
    border-color: rgba(124,58,237,0.6) !important;
  }
  .cs-map-wrap .leaflet-control-zoom {
    border: none !important;
    box-shadow: 0 4px 24px rgba(0,0,0,0.4) !important;
    border-radius: 10px !important;
    overflow: hidden;
  }
  .cs-map-wrap .leaflet-control-zoom-in  { border-radius: 0 !important; }
  .cs-map-wrap .leaflet-control-zoom-out { border-radius: 0 !important; }
  .cs-map-wrap .leaflet-bar { border: none !important; }
  .cs-map-wrap .leaflet-control-attribution { display: none; }
  .cs-map-wrap .leaflet-pane { z-index: 1 !important; }
  .cs-map-wrap .leaflet-top,
  .cs-map-wrap .leaflet-bottom { z-index: 2 !important; }

  @keyframes cs-pulse {
    0%   { transform: scale(1);   opacity: 0.8; }
    70%  { transform: scale(2.2); opacity: 0; }
    100% { transform: scale(2.2); opacity: 0; }
  }
  @keyframes cs-panel-in {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes cs-spin {
    to { transform: rotate(360deg); }
  }
`