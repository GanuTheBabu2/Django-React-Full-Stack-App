import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons"; // ✅ Only keep Google

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const isLogin = method === "login";
  const title = isLogin ? "Welcome back" : "Create an account";
  const subtitle = isLogin
    ? "Please enter your details to sign in."
    : "Please enter your details to sign up.";
  const buttonText = isLogin ? "Sign in" : "Sign up";
  const footerText = isLogin
    ? "Don’t have an account yet? <a href='/register' className='form-link'>Sign Up</a>"
    : "Already have an account? <a href='/login' className='form-link'>Sign in</a>";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post(route, { username, password });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider) => {
    console.log(`${provider} login initiated`);
    // Placeholder for OAuth logic
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-logo">
        {/* Placeholder for custom logo; replace with actual SVG or image */}
        <span role="img" aria-label="Logo">
          🌐
        </span>
      </div>
      <h1>{title}</h1>
      <p
        className="form-subtitle"
        dangerouslySetInnerHTML={{ __html: subtitle }}
      ></p>

      {/* 🔻 START OF MODIFIED SECTION */}
      <div className="form-oauth">
        <button
          type="button"
          className="form-oauth-google"
          onClick={() => handleOAuthLogin("google")}
        >
          <FontAwesomeIcon icon={faGoogle} style={{ marginRight: "8px" }} />
          Sign in with Google
        </button>
      </div>
      {/* 🔺 END OF MODIFIED SECTION */}

      <div className="form-divider">OR</div>
      <input
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="E-Mail Address"
      />
      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {isLogin && (
        <div className="form-options">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>
          <a href="/forgot-password" className="form-link">
            Forgot password?
          </a>
        </div>
      )}
      {loading && <LoadingIndicator />}
      <button className="form-button" type="submit">
        {buttonText}
      </button>
      <p
        className="form-footer"
        dangerouslySetInnerHTML={{ __html: footerText }}
      ></p>
    </form>
  );
}

export default Form;
