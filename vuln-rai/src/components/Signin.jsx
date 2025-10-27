import React, { useState, useRef } from "react";
import { Eye, EyeOff, Mail, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "./Signin.css";
import VC from "../assets/VC.png";
import rya from "../assets/rya.png";
import { SiGoogle } from "react-icons/si";
import { IoLogoGithub } from "react-icons/io";
import { useAuth } from "../AuthContext";

const Signin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [emailTouched, setEmailTouched] = useState(false);

  const captchaRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
    if (error && error.includes("CAPTCHA")) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Email validation
    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Password validation
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    // Check if captcha is required but not completed
    if (showCaptcha && !captchaValue) {
      setError("Please complete the CAPTCHA verification");
      return;
    }

    setIsLoading(true);

    try {
      const loginData = {
        email: formData.email,
        password: formData.password,
      };

      // Add captcha if it's shown and completed
      if (showCaptcha && captchaValue) {
        loginData.captcha = captchaValue;
      }

      const result = await login(loginData);

      if (result.success) {
        navigate("/");
        setFailedAttempts(0);
        setShowCaptcha(false);
      } else {
        setError(result.message);
        
        // Show captcha after 2 failed attempts
        const newFailedAttempts = failedAttempts + 1;
        setFailedAttempts(newFailedAttempts);
        
        if (newFailedAttempts >= 2) {
          setShowCaptcha(true);
        }

        if (captchaRef.current) {
          captchaRef.current.reset();
          setCaptchaValue(null);
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please try again.");
      
      if (captchaRef.current) {
        captchaRef.current.reset();
        setCaptchaValue(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <div className="face-background">
        <img src={VC} alt="Hero face art" className="face-image" />
      </div>

      <div className="signin-card">
        <h1 className="signin-title">Sign in</h1>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {showCaptcha && !error && (
          <div className="warning-message">
            Multiple failed attempts detected. Please complete the verification below.
          </div>
        )}

        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleEmailBlur}
              className="form-input"
              required
              disabled={isLoading}
            />
            <Mail className="input-icon" size={20} />
          </div>

          {/* Email validation feedback */}
          {emailTouched && formData.email && (
            <div className={`email-validation ${isValidEmail(formData.email) ? 'valid' : 'invalid'}`}>
              {isValidEmail(formData.email) ? "Valid email" : "Invalid email format"}
            </div>
          )}

          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-input"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Show CAPTCHA after failed attempts */}
          {showCaptcha && (
            <div className="captcha-container">
              <ReCAPTCHA
                ref={captchaRef}
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={handleCaptchaChange}
                theme="dark"
                size="normal"
                disabled={isLoading}
              />
            </div>
          )}

          <button 
            type="submit" 
            className="signin-btn"
            disabled={
              isLoading || 
              (showCaptcha && !captchaValue) ||
              !isValidEmail(formData.email) ||
              formData.password.length < 8
            }
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="signin-link">
          Don't have an account?
          <span 
            className="link" 
            onClick={() => !isLoading && navigate("/signup")}
          >
            {" "}Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signin;