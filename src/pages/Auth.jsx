import { useState } from "react";
import '../App.css';
import { useNavigate, useLocation } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";

const googleProvider = new GoogleAuthProvider();

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please complete all required fields.");
      return;
    }

    if (!isLogin && !username.trim()) {
      setError("Please enter a username.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccess("You're logged in!");
        setTimeout(() => navigate(redirect === 'map' ? '/dashboard?page=Map' : '/dashboard'), 1500);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: username.trim() });
        setSuccess("You've signed up!");
        setTimeout(() => navigate(redirect === 'map' ? '/dashboard?page=Map' : '/dashboard'), 1500);
      }
    } catch (err) {
      const code = err.code;
      if (code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (code === "auth/user-not-found" || code === "auth/invalid-credential") {
        setError("No account found with this email. Please register first.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  const handleGoogle = async () => {
    setError("");
    setSuccess("");
    try {
      await signInWithPopup(auth, googleProvider);
      setSuccess("Signed in with Google!");
      setTimeout(() => navigate(redirect === 'map' ? '/dashboard?page=Map' : '/dashboard'), 1200);
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError("Google sign-in failed. Please try again.");
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <img src="/auth-bg.png" className="auth-bg" />
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <h2>{isLogin ? "Login" : "Sign Up"}</h2>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="input-group">
                <span>👤</span>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            )}

            <div className="input-group">
              <span>📧</span>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <span>🔒</span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {isLogin && (
              <p className="forgot">Forgot password?</p>
            )}

            <button type="submit" className="auth-btn">
              {isLogin ? "Log In" : "Create Account"}
            </button>
          </form>

          <div className="auth-divider">
            <span className="auth-divider-line" />
            <span className="auth-divider-text">or</span>
            <span className="auth-divider-line" />
          </div>

          <button className="google-btn" onClick={handleGoogle}>
            <svg width="18" height="18" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
              <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24c0 3.2.6 6.2 1.7 9l.6-1 4-7.3z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.5 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.2C9.7 37.1 16.3 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.9 2.4-2.5 4.5-4.5 6l6.2 5.2C40.5 36.2 44 30.5 44 24c0-1.3-.1-2.6-.4-3.9z"/>
            </svg>
            Continue with Google
          </button>

          <p className="toggle-text">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}
            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? " Sign up" : " Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;