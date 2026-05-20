import { useState } from "react";
import { updatePassword } from "firebase/auth";
import { auth } from "../firebase";
import { profileStyles as s } from "../styles/profileStyles";

export default function ChangePasswordCard() {
  const [newPassword, setNewPassword] = useState("");
  const [feedback,    setFeedback]    = useState({ msg: "", type: "" });

  const showFeedback = (msg, type = "success") => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback({ msg: "", type: "" }), 3000);
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

  return (
    <div style={s.card}>
      <h3 style={s.sectionTitle}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ marginRight: 8 }}>
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        Change Password
      </h3>

      <input
        style={s.input}
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleChangePassword()}
      />

      <button style={s.primaryBtn} onClick={handleChangePassword}>
        Update Password
      </button>

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