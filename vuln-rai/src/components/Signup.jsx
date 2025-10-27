import React, { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, Mail, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "./Signup.css";
import VC from "../assets/VC.png";
import rya from "../assets/rya.png";
import { SiGoogle } from "react-icons/si";
import { IoLogoGithub } from "react-icons/io";
import { useAuth } from "../AuthContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [emailTouched, setEmailTouched] = useState(false);
  
  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    isValid: false,
    message: ""
  });

  const captchaRef = useRef(null);
  const navigate = useNavigate();
  const { register } = useAuth();

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Validate password strength in real-time
  useEffect(() => {
    const password = formData.password;
    
    if (!password) {
      setPasswordStrength({ isValid: false, message: "" });
      return;
    }

    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    const allValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

    if (allValid) {
      setPasswordStrength({ isValid: true, message: "Strong password!" });
    } else {
      setPasswordStrength({ isValid: false, message: "Password is not strong enough" });
    }
  }, [formData.password]);

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
    if (!passwordStrength.isValid) {
      setError("Password does not meet security requirements");
      return;
    }

    if (formData.password !== formData.repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!captchaValue) {
      setError("Please complete the CAPTCHA verification");
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        captcha: captchaValue,
      });

      if (result.success) {
        navigate("/");
      } else {
        setError(result.message);
        if (captchaRef.current) {
          captchaRef.current.reset();
          setCaptchaValue(null);
        }
      }
    } catch (error) {
      console.error("Signup failed:", error);
      setError("Signup failed. Please try again.");
      if (captchaRef.current) {
        captchaRef.current.reset();
        setCaptchaValue(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <div className="face-background">
        <img src={VC} alt="Hero face art" className="face-image" />
      </div>

      <div className="signup-card">
        <h1 className="signup-title">Sign up</h1>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form className="signup-form" onSubmit={handleSubmit}>
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

          {/* Simple password strength message */}
          {formData.password && (
            <div className={`password-strength ${passwordStrength.isValid ? 'strong' : 'weak'}`}>
              {passwordStrength.message}
            </div>
          )}

          <div className="input-group">
            <input
              type={showRepeatPassword ? "text" : "password"}
              name="repeatPassword"
              placeholder="repeat password"
              value={formData.repeatPassword}
              onChange={handleInputChange}
              className="form-input"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowRepeatPassword(!showRepeatPassword)}
              disabled={isLoading}
            >
              {showRepeatPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Password match message */}
          {formData.repeatPassword && (
            <div className={`password-match ${formData.password === formData.repeatPassword ? 'match' : 'no-match'}`}>
              {formData.password === formData.repeatPassword ? "Passwords match" : "Passwords do not match"}
            </div>
          )}

          {/* reCAPTCHA */}
          <div className="captcha-container">
            <ReCAPTCHA
              ref={captchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={handleCaptchaChange}
              theme="dark"
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className="signin-btn"
            disabled={
              isLoading || 
              !captchaValue || 
              !passwordStrength.isValid || 
              formData.password !== formData.repeatPassword ||
              !isValidEmail(formData.email)
            }
          >
            {isLoading ? "Signing up..." : "Sign up"}
          </button>
        </form>

        <p className="signup-link">
          Already have an account?
          <span 
            className="link" 
            onClick={() => !isLoading && navigate("/signin")}
          >
            {" "}Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;