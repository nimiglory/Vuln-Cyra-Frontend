import React, { useState } from 'react';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Signin.css';
import VC from "../assets/VC.png";
import rya from '../assets/rya.png';
import { SiGoogle } from "react-icons/si";
import { IoLogoGithub } from "react-icons/io";

const Signin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

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
    console.log('Sign in data:', formData);
    // call backend login API here
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
        <div className="nav-left">
          <img src={rya} alt="logo" className="logo" />
          <span className="brand">YRA</span>
        </div>
        
        <h1 className="signin-title">Sign in</h1>
        
        <form className="signin-form" onSubmit={handleSubmit}>
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
          
          <button type="submit" className="signin-btn">
            sign in
          </button>
        </form>
        
        <p className="signin-link">
          Don’t have an account? 
          <span className="link" onClick={() => navigate('/signup')}> Sign up</span>
        </p>

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

export default Signin;
