import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteUser, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { profileStyles as s } from "../styles/profileStyles";

export default function AccountCard() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({ msg: "", type: "" });

  const showFeedback = (msg, type = "success") => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback({ msg: "", type: "" }), 3000);
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
    <div style={s.card}>
      <h3 style={s.sectionTitle}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ marginRight: 8 }}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        Account
      </h3>

      <button style={s.outlineBtn} onClick={handleLogout}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Log Out
      </button>

      <button style={s.dangerBtn} onClick={handleDeleteAccount}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14H6L5 6"/>
          <path d="M10 11v6M14 11v6"/>
          <path d="M9 6V4h6v2"/>
        </svg>
        Delete Account
      </button>

      {feedback.msg && (
        <div style={{
          ...s.feedback,
          marginTop: "0.75rem",
          background: "rgba(255,80,80,0.15)",
          color: "#ff6b6b",
        }}>
          {feedback.msg}
        </div>
      )}
    </div>
  );
}