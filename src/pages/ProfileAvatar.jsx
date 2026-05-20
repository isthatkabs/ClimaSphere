import { useRef } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { auth, storage } from "../firebase";

const avatarWrap = {
  position: "relative",
  width: 72,
  height: 72,
  borderRadius: "50%",
  cursor: "pointer",
  flexShrink: 0,
};

const avatarImg = {
  width: 72,
  height: 72,
  borderRadius: "50%",
  objectFit: "cover",
  display: "block",
  border: "2px solid rgba(255,255,255,0.6)",
};

const avatarInitials = {
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
};

const avatarOverlay = {
  position: "absolute",
  inset: 0,
  borderRadius: "50%",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  opacity: 0,
  transition: "opacity 0.15s",
};

const spinner = {
  width: 18,
  height: 18,
  border: "2px solid rgba(255,255,255,0.3)",
  borderTop: "2px solid #fff",
  borderRadius: "50%",
  animation: "spin 0.6s linear infinite",
};

export default function ProfileAvatar({ user, avatarURL, uploading, setAvatarURL, setUploading, showFeedback }) {
  const fileInputRef = useRef();

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

  const initials = user?.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || "?";

  return (
    <div
      style={avatarWrap}
      onClick={() => fileInputRef.current.click()}
      onMouseEnter={e => e.currentTarget.querySelector('.av-overlay').style.opacity = 1}
      onMouseLeave={e => e.currentTarget.querySelector('.av-overlay').style.opacity = 0}
    >
      {avatarURL ? (
        <img src={avatarURL} alt="avatar" referrerPolicy="no-referrer" style={avatarImg} />
      ) : (
        <div style={avatarInitials}>{initials}</div>
      )}

      <div className="av-overlay" style={avatarOverlay}>
        {uploading ? (
          <div style={spinner} />
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleAvatarUpload}
      />
    </div>
  );
}