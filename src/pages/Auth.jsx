import { useState } from "react";
import '../App.css';
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Empty fields check
    if (!email || !password) {
      setError("Please complete all required fields.");
      return;
    }

    // Username required on sign up
    if (!isLogin && !username.trim()) {
      setError("Please enter a username.");
      return;
    }

    // Valid email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccess("You're logged in!");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: username.trim() });
        setSuccess("You've signed up!");
        setTimeout(() => navigate("/dashboard"), 1500);
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

            {/* Username — sign up only */}
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