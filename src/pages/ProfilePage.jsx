import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile, updatePassword, deleteUser, signOut } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../firebase";
import { useAuth } from "../context/AuthContext";

function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [editing, setEditing] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [feedback, setFeedback] = useState({ msg: "", type: "" });
  const [avatarURL, setAvatarURL] = useState(user?.photoURL || "");
  const [uploading, setUploading] = useState(false);

  const initials = displayName
    ? displayName.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || "?";

  const showFeedback = (msg, type = "success") => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback({ msg: "", type: "" }), 3000);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await updateProfile(auth.currentUser, { photoURL: url });
      setAvatarURL(url);
      showFeedback("Profile photo updated!");
    } catch {
      showFeedback("Photo upload failed.", "error");
    } finally {
      setUploading(false);
    }
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

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      showFeedback("Password must be at least 6 characters.", "error");
      return;
    }
    try {
      await updatePassword(auth.currentUser, newPassword);
      setNewPassword("");
      showFeedback("Password changed!");
    } catch (err) {
      if (err.code === "auth/requires-recent-login") {
        showFeedback("Please log out and back in first.", "error");
      } else {
        showFeedback("Failed to change password.", "error");
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Delete your account? This cannot be undone.")) return;
    try {
      await deleteUser(auth.currentUser);
      navigate("/");
    } catch (err) {
      if (err.code === "auth/requires-recent-login") {
        showFeedback("Please log out and back in first.", "error");
      } else {
        showFeedback("Failed to delete account.", "error");
      }
    }
  };

  return (
    <div style={styles.page}>
      {/* Back button */}
      <button style={styles.back} onClick={() => navigate(-1)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Back
      </button>

      <div style={styles.container}>

        {/* Profile card */}
        <div style={styles.card}>
          <div style={styles.avatarSection}>
            <div
              style={styles.avatarWrap}
              onClick={() => fileInputRef.current.click()}
              onMouseEnter={e => e.currentTarget.querySelector('.av-overlay').style.opacity = 1}
              onMouseLeave={e => e.currentTarget.querySelector('.av-overlay').style.opacity = 0}
            >
              {avatarURL ? (
                <img src={avatarURL} alt="avatar" style={styles.avatarImg} />
              ) : (
                <div style={styles.avatarInitials}>{initials}</div>
              )}
              <div className="av-overlay" style={styles.avatarOverlay}>
                {uploading ? (
                  <div style={styles.spinner} />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*"
                style={{ display: "none" }} onChange={handleAvatarUpload} />
            </div>

            <div style={styles.nameBlock}>
              {editing ? (
                <div style={styles.editRow}>
                  <input
                    style={styles.nameInput}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                  />
                  <button style={styles.saveBtn} onClick={handleSaveName}>Save</button>
                  <button style={styles.cancelBtn} onClick={() => setEditing(false)}>✕</button>
                </div>
              ) : (
                <div style={styles.editRow}>
                  <h2 style={styles.name}>{displayName || "No name set"}</h2>
                  <button style={styles.editIcon} onClick={() => setEditing(true)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                </div>
              )}
              <p style={styles.email}>{user?.email}</p>
            </div>
          </div>

          {feedback.msg && (
            <div style={{ ...styles.feedback, background: feedback.type === "error" ? "rgba(255,80,80,0.15)" : "rgba(80,200,120,0.15)", color: feedback.type === "error" ? "#ff6b6b" : "#4ade80" }}>
              {feedback.msg}
            </div>
          )}
        </div>

        <div style={styles.grid}>
          {/* Change Password */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Change Password
            </h3>
            <input
              style={styles.input}
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleChangePassword()}
            />
            <button style={styles.primaryBtn} onClick={handleChangePassword}>
              Update Password
            </button>
          </div>

          {/* Account */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Account
            </h3>
            <button style={styles.outlineBtn} onClick={handleLogout}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Log Out
            </button>
            <button style={styles.dangerBtn} onClick={handleDeleteAccount}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14H6L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4h6v2"/>
              </svg>
              Delete Account
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "url('/auth-bluebg.png') no-repeat center center / cover",
    padding: "2rem",
    fontFamily: "sans-serif",
  },
  back: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(255,255,255,0.2)",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: 8,
    color: "#fff",
    fontSize: 13,
    fontWeight: 500,
    padding: "7px 14px",
    cursor: "pointer",
    marginBottom: "1.5rem",
    backdropFilter: "blur(8px)",
    transition: "background 0.15s",
  },
  container: {
    maxWidth: 680,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  card: {
    background: "rgba(255,255,255,0.28)",
    border: "1px solid rgba(255,255,255,0.45)",
    borderRadius: 16,
    padding: "1.5rem",
    backdropFilter: "blur(12px)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
  },
  avatarSection: {
    display: "flex",
    alignItems: "center",
    gap: "1.25rem",
  },
  avatarWrap: {
    position: "relative",
    width: 72,
    height: 72,
    borderRadius: "50%",
    cursor: "pointer",
    flexShrink: 0,
  },
  avatarImg: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    objectFit: "cover",
    display: "block",
    border: "2px solid rgba(255,255,255,0.6)",
  },
  avatarInitials: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6f86ff, #5a7cff)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    fontWeight: 700,
    border: "2px solid rgba(255,255,255,0.6)",
  },
  avatarOverlay: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "opacity 0.15s",
  },
  spinner: {
    width: 18,
    height: 18,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
  },
  nameBlock: { flex: 1 },
  editRow: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  name: { margin: 0, fontSize: 20, fontWeight: 700, color: "#fff" },
  email: { margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.65)" },
  nameInput: {
    background: "rgba(255,255,255,0.25)",
    border: "1px solid rgba(255,255,255,0.4)",
    borderRadius: 8,
    padding: "6px 10px",
    color: "#fff",
    fontSize: 16,
    fontWeight: 600,
    outline: "none",
    width: 180,
  },
  editIcon: {
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: 6,
    padding: "4px 6px",
    cursor: "pointer",
    color: "rgba(255,255,255,0.8)",
    display: "flex",
    alignItems: "center",
  },
  saveBtn: {
    background: "linear-gradient(to right, #5a7cff, #6f86ff)",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    padding: "6px 14px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  cancelBtn: {
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 8,
    color: "rgba(255,255,255,0.7)",
    padding: "6px 10px",
    fontSize: 13,
    cursor: "pointer",
  },
  feedback: {
    marginTop: "1rem",
    padding: "8px 14px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
  },
  sectionTitle: {
    margin: "0 0 1rem",
    fontSize: 14,
    fontWeight: 600,
    color: "rgba(255,255,255,0.9)",
    display: "flex",
    alignItems: "center",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.2)",
    border: "1px solid rgba(255,255,255,0.35)",
    borderRadius: 8,
    padding: "10px 12px",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    marginBottom: "0.75rem",
    boxSizing: "border-box",
  },
  primaryBtn: {
    width: "100%",
    padding: "10px",
    background: "linear-gradient(to right, #5a7cff, #6f86ff)",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  outlineBtn: {
    width: "100%",
    padding: "10px",
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: 8,
    color: "#fff",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: "0.5rem",
  },
  dangerBtn: {
    width: "100%",
    padding: "10px",
    background: "rgba(255,80,80,0.15)",
    border: "1px solid rgba(255,80,80,0.3)",
    borderRadius: 8,
    color: "#ff6b6b",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
};

export default ProfilePage;