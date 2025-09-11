import React, { useState } from 'react';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import VC from "../assets/VC.png";
import rya from '../assets/rya.png';
import { SiGoogle } from "react-icons/si";
import { IoLogoGithub } from "react-icons/io";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    repeatPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.repeatPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Sign up data:', formData);
    // call backend signup API here
  };

  return (
    <div className="signup-container">
      {/* Background shapes */}
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>
        
      {/* Face background */}
      <div className="face-background">
        <img src={VC} alt="Hero face art" className="face-image" />
      </div>

      {/* Signup card */}
      <div className="signup-card">
        <div className="nav-left">
          <img src={rya} alt="logo" className="logo" />
          <span className="brand">YRA</span>
        </div>
        
        <h1 className="signup-title">Sign up</h1>
        
        <form className="signup-form" onSubmit={handleSubmit}>
          {/* Email input */}
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            <Mail className="input-icon" size={20} />
          </div>
          
          {/* Password input */}
          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          {/* Repeat password input */}
          <div className="input-group">
            <input
              type={showRepeatPassword ? 'text' : 'password'}
              name="repeatPassword"
              placeholder="repeat password"
              value={formData.repeatPassword}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowRepeatPassword(!showRepeatPassword)}
            >
              {showRepeatPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          {/* Submit button */}
          <button type="submit" className="signin-btn">
            sign up
          </button>
        </form>
        
        {/* Navigation to signin */}
        <p className="signup-link">
          Already have an account? 
          <span className="link" onClick={() => navigate('/signin')}> Sign in</span>
        </p>

        {/* Social login */}
        <div className="social-login">
          <p>or connect with</p>
          <div className="social-icons">
            <button className="social-btn"><SiGoogle /></button>
            <button className="social-btn"><IoLogoGithub /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
