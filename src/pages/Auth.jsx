import { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        // LOGIN
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/dashboard"); // ✅ goes to dashboard after login
      } else {
        // SIGN UP
        await createUserWithEmailAndPassword(auth, email, password);
        navigate("/dashboard"); // ✅ goes to dashboard after sign up
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* LEFT SIDE (Image) */}
      <div className="auth-left"></div>

      {/* RIGHT SIDE (Form) */}
      <div className="auth-right">
        <div className="auth-box">
          <h2>{isLogin ? "Login" : "Sign Up"}</h2>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
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