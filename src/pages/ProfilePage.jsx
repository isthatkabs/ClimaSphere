import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileCard      from "./ProfileCard";
import ChangePasswordCard from "./ChangePasswordCard";
import AccountCard      from "./AccountCard";
import { profileStyles as s } from "../styles/profileStyles";

export default function ProfilePage() {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const [avatarURL, setAvatarURL] = useState(user?.photoURL || "");

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate(-1)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Back
      </button>

      <div style={s.container}>
        <ProfileCard
          user={user}
          avatarURL={avatarURL}
          setAvatarURL={setAvatarURL}
        />

        <div style={s.grid}>
          <ChangePasswordCard />
          <AccountCard />
        </div>
      </div>
    </div>
  );
}