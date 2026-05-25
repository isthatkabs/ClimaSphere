import { useNavigate } from "react-router-dom";
import { useLocations } from "../context/LocationsContext";
import { profileStyles as s } from "../styles/profileStyles";

export default function SavedLocationsCard() {
  const { locations, removeLocation, setHome } = useLocations();
  const navigate = useNavigate();

  return (
    <div style={s.card}>
      <h3 style={s.sectionTitle}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ marginRight: 8 }}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        Saved Locations
      </h3>

      {locations.length === 0 ? (
        <p style={{ color: "rgba(255,255,255,0.78)", fontSize: 13, margin: "0 0 1rem", fontStyle: "italic" }}>
          No locations saved yet.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: "0.75rem" }}>
          {locations.map(loc => (
            <div key={loc.id} style={{
              display: "flex", alignItems: "center", gap: 10,
              background: loc.isHome ? "rgba(90,124,255,0.12)" : "rgba(255,255,255,0.07)",
              border: `1px solid ${loc.isHome ? "rgba(90,124,255,0.4)" : "rgba(255,255,255,0.11)"}`,
              borderRadius: 10, padding: "8px 12px",
            }}>
              <span style={{ fontSize: 15, flexShrink: 0 }}>{loc.isHome ? "🏠" : "📍"}</span>
              <span style={{ flex: 1, color: "#fff", fontSize: 13, fontWeight: 500, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {loc.name}
              </span>
              {loc.isHome && (
                <span style={{
                  background: "rgba(90,124,255,0.22)", border: "1px solid rgba(90,124,255,0.5)",
                  borderRadius: 5, padding: "2px 8px", fontSize: 10, color: "#8fa8ff",
                  fontWeight: 700, letterSpacing: "0.06em", flexShrink: 0,
                }}>★ #1</span>
              )}
              {!loc.isHome && (
                <button
                  onClick={() => setHome(loc.id)}
                  title="Set as home"
                  style={{
                    background: "none", border: "none",
                    color: "rgba(255,255,255,0.28)", fontSize: 14,
                    cursor: "pointer", padding: "0 2px", lineHeight: 1, flexShrink: 0,
                  }}>
                  ★
                </button>
              )}
              <button
                onClick={() => removeLocation(loc.id)}
                title="Remove"
                style={{
                  background: "none", border: "none",
                  color: "rgba(255,255,255,0.28)", cursor: "pointer",
                  padding: 2, display: "flex", alignItems: "center", flexShrink: 0,
                }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        style={{ ...s.outlineBtn, marginBottom: 0 }}
        onClick={() => navigate("/dashboard?page=Locations")}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Manage Locations
      </button>
    </div>
  );
}
