import { useState } from "react";
import { updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import ProfileAvatar from "./ProfileAvatar";
import { useLocations } from "../context/LocationsContext";
import { profileStyles as s } from "../styles/profileStyles";

function memberSince(creationTime) {
  if (!creationTime) return "—";
  return new Date(creationTime).toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

function getProvider(user) {
  const id = user?.providerData?.[0]?.providerId;
  if (id === "google.com") return "Google";
  if (id === "password") return "Email";
  return id || "—";
}

function MetaItem({ label, value }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", color: "rgba(255,255,255,0.72)", textTransform: "uppercase" }}>
        {label}
      </span>
      <span style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>
        {value}
      </span>
    </div>
  );
}

export default function ProfileCard({ user, avatarURL, setAvatarURL }) {
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [editing,     setEditing]     = useState(false);
  const [uploading,   setUploading]   = useState(false);
  const [feedback,    setFeedback]    = useState({ msg: "", type: "" });
  const { locations } = useLocations();

  const showFeedback = (msg, type = "success") => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback({ msg: "", type: "" }), 3000);
  };

  const handleSaveName = async () => {
    try {
      await updateProfile(auth.currentUser, { displayName: displayName.trim() });
      setEditing(false);
      showFeedback("Name updated!");
    } catch {
      showFeedback("Failed to update name.", "error");
    }
  };

  return (
    <div style={s.card}>
      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
        <ProfileAvatar
          user={user}
          avatarURL={avatarURL}
          uploading={uploading}
          setAvatarURL={setAvatarURL}
          setUploading={setUploading}
          showFeedback={showFeedback}
        />

        <div style={{ flex: 1 }}>
          {editing ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <input
                style={{
                  background: "rgba(255,255,255,0.25)",
                  border: "1px solid rgba(255,255,255,0.4)",
                  borderRadius: 8, padding: "6px 10px",
                  color: "#fff", fontSize: 16, fontWeight: 600,
                  outline: "none", width: 180,
                }}
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                autoFocus
                onKeyDown={e => e.key === "Enter" && handleSaveName()}
              />
              <button style={{
                background: "linear-gradient(to right, #5a7cff, #6f86ff)",
                border: "none", borderRadius: 8, color: "#fff",
                padding: "6px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }} onClick={handleSaveName}>Save</button>
              <button style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 8, color: "rgba(255,255,255,0.7)",
                padding: "6px 10px", fontSize: 13, cursor: "pointer",
              }} onClick={() => setEditing(false)}>✕</button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#fff" }}>
                {displayName || "No name set"}
              </h2>
              <button style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 6, padding: "4px 6px", cursor: "pointer",
                color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center",
              }} onClick={() => setEditing(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            </div>
          )}
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
            {user?.email}
          </p>
        </div>
      </div>

      <div style={{
        marginTop: "1.1rem",
        paddingTop: "1rem",
        borderTop: "1px solid rgba(255,255,255,0.12)",
        display: "flex",
        gap: "1.5rem",
        flexWrap: "wrap",
      }}>
        <MetaItem label="Member since" value={memberSince(user?.metadata?.creationTime)} />
        <MetaItem label="Sign-in Method" value={getProvider(user)} />
        <MetaItem
          label="Email"
          value={
            user?.emailVerified
              ? <span style={{ color: "#4ade80", display: "flex", alignItems: "center", gap: 4 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Verified
                </span>
              : <span style={{ color: "#fbbf24" }}>Unverified</span>
          }
        />
        <MetaItem label="Saved locations" value={locations.length} />
      </div>

      {feedback.msg && (
        <div style={{
          ...s.feedback,
          background: feedback.type === "error" ? "rgba(255,80,80,0.15)" : "rgba(80,200,120,0.15)",
          color: feedback.type === "error" ? "#ff6b6b" : "#4ade80",
        }}>
          {feedback.msg}
        </div>
      )}
    </div>
  );
}