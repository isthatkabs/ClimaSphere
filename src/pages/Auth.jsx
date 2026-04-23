import { useState } from "react";
import "../App.css";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-wrapper">
      {/* LEFT SIDE (Image) */}
      <div className="auth-left"></div>

      {/* RIGHT SIDE (Form) */}
      <div className="auth-right">
        <div className="auth-box">
          <h2>{isLogin ? "Login" : "Sign Up"}</h2>

          <form>
            <div className="input-group">
              <span>📧</span>
              <input type="email" placeholder="Email" />
            </div>

            <div className="input-group">
              <span>🔒</span>
              <input type="password" placeholder="Password" />
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