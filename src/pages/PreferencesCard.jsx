import { useSettings } from "../context/SettingsContext";
import { profileStyles as s } from "../styles/profileStyles";

function SegPicker({ options, value, onChange }) {
  return (
    <div style={{
      display: "flex", gap: 2,
      background: "rgba(0,0,0,0.18)", borderRadius: 7, padding: 2, flexShrink: 0,
    }}>
      {options.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)} style={{
          background: value === o.value ? "rgba(90,124,255,0.75)" : "transparent",
          border: `1px solid ${value === o.value ? "rgba(90,124,255,0.9)" : "transparent"}`,
          borderRadius: 5, padding: "4px 10px",
          color: value === o.value ? "#fff" : "rgba(255,255,255,0.9)",
          fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
          whiteSpace: "nowrap",
        }}>{o.label}</button>
      ))}
    </div>
  );
}

function SmallToggle({ on, onToggle }) {
  return (
    <div onClick={onToggle} style={{
      width: 38, height: 21, borderRadius: 11, flexShrink: 0, cursor: "pointer",
      background: on ? "rgba(90,124,255,0.8)" : "rgba(255,255,255,0.14)",
      border: `1px solid ${on ? "rgba(90,124,255,0.9)" : "rgba(255,255,255,0.2)"}`,
      position: "relative", transition: "background 0.2s, border 0.2s",
    }}>
      <div style={{
        position: "absolute", top: 2, left: on ? 19 : 2,
        width: 15, height: 15, borderRadius: "50%",
        background: "#fff", transition: "left 0.2s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
      }} />
    </div>
  );
}

function PrefRow({ icon, label, sub, children, last }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 0",
      borderBottom: last ? "none" : "1px solid rgba(255,255,255,0.07)",
    }}>
      <span style={{ fontSize: 16, width: 22, textAlign: "center", flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ color: "rgba(255,255,255,0.88)", fontSize: 11, marginTop: 1 }}>{sub}</div>}
      </div>
      {children}
    </div>
  );
}

export default function PreferencesCard() {
  const { settings, updateSetting } = useSettings();

  return (
    <div style={s.card}>
      <h3 style={s.sectionTitle}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ marginRight: 8 }}>
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
        Preferences
      </h3>

      <PrefRow icon="🌡" label="Temperature" sub="Display scale">
        <SegPicker
          options={[{ label: "°C", value: "C" }, { label: "°F", value: "F" }]}
          value={settings.tempUnit}
          onChange={v => updateSetting("tempUnit", v)}
        />
      </PrefRow>

      <PrefRow icon="💨" label="Wind Speed" sub="km/h or mph">
        <SegPicker
          options={[{ label: "km/h", value: "km" }, { label: "mph", value: "mi" }]}
          value={settings.distanceUnit}
          onChange={v => updateSetting("distanceUnit", v)}
        />
      </PrefRow>

      <PrefRow icon="🕐" label="Time Format" sub="12 or 24-hour clock">
        <SegPicker
          options={[{ label: "12h", value: "12" }, { label: "24h", value: "24" }]}
          value={settings.timeFormat}
          onChange={v => updateSetting("timeFormat", v)}
        />
      </PrefRow>

      <PrefRow icon="🔔" label="Notifications" sub="Clothing & weather alerts" last>
        <SmallToggle
          on={settings.notifications}
          onToggle={() => updateSetting("notifications", !settings.notifications)}
        />
      </PrefRow>
    </div>
  );
}
