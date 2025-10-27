import { useState, useEffect } from "react";
import React from "react";
import {
  Sun,
  Moon,
  Instagram,
  Twitter,
  Facebook,
  Menu,
  X,
  User,
  ChevronDown,
  LogOut,
  UserPlus,
  LogIn,
} from "lucide-react";
import VC from "../assets/VC.png";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import { useAuth } from "../AuthContext";

function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  // Handle Try Now button click
  const handleTryNow = () => {
    navigate('/Urls');
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    // Optionally redirect to home or show a message
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Smooth scroll to section
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  // Detect active section while scrolling
  useEffect(() => {
    const handleActiveSection = () => {
      const sections = document.querySelectorAll("section");
      let current = "home";
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          current = section.id;
        }
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleActiveSection);
    return () => window.removeEventListener("scroll", handleActiveSection);
  }, []);
useEffect(() => {
  const text = "Security shouldn't feel distant—it should feel like home. Perhaps it's exactly what you've been needing all along.";
  const element = document.getElementById("animated-text");
  if (!element) return;

  let index = 0;
  let timeoutId;

  function type() {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      timeoutId = setTimeout(type, 70);
    } else {
      timeoutId = setTimeout(() => {
        element.textContent = "";
        index = 0;
        type();
      }, 4000);
    }
  }

  type();

 
  return () => clearTimeout(timeoutId);
}, []);


  return (
    <div className={darkMode ? "dark" : "light"}>
      <div className="heading">
        {/* 🌍 NAVBAR */}
        <nav className="navbar">
            <span className="brand">CYRA</span>
         

          {/* Desktop Nav */}
          <div className="nav-right">
            <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
              {["home", "about", "services", "contact"].map((link) => (
                <li
                  key={link}
                  className={activeSection === link ? "active" : ""}
                  onClick={() => handleScroll(link)}
                >
                  {link.toUpperCase()}
                </li>
              ))}
            </ul>

            {/* 👤 Enhanced Profile Dropdown */}
            <div className="profile-dropdown">
              <div 
                className="profile-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <User className="profile-icon" size={20} />
                {user && (
                  <span className="profile-email">
                    {user.email}
                  </span>
                )}
                {!loading && <ChevronDown className="chevron-icon" size={16} />}
              </div>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="dropdown-menu">
                  {user ? (
                    <>
                      <div className="dropdown-header">
                        <span className="user-email">{user.email}</span>
                      </div>
                      <div className="dropdown-divider"></div>
                      <button 
                        className="dropdown-item logout-btn"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/Signin" 
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <LogIn size={16} />
                        Sign In
                      </Link>
                      <Link 
                        to="/Signup" 
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <UserPlus size={16} />
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="toggle-btn"
            >
              {darkMode ? (
                <Sun className="icon sun" />
              ) : (
                <Moon className="icon moon" />
              )}
            </button>
          </div>
        </nav>

        {/* 🌍 HERO SECTION */}
        <section id="home" className="hero">
          <div className="hero1">
            <h1 className="meetCyra">
              BRINGING <br /> <span>CLARITY TO</span> <br />
              <span>EVERY SCAN</span>
            </h1>
            <button className="try" onClick={handleTryNow}>
              {user ? "Try now" : "Try now."}
            </button>
          </div>

          <div className="hero-image">
            <img src={VC} alt="Hero face art" className="VC1" />
          </div>
        </section>

        {/* 🌍 ADVANTAGES SECTION */}
        <section id="about" className="advantages">
          <div className="shields-container">
            {/* C — Clarity */}
            <div className="shield shield-c">
              <div className="shield-inner">
                <div className="shield-front">
                  <h3 className="shield-title">Clarity</h3>
                </div>
                <div className="shield-back">
                  <p className="shield-description"> 
                    CYRA offers a clean, user-friendly interface that makes
                    scanning your website for vulnerabilities as simple as
                    entering a URL and clicking "Scan." With no clutter or
                    confusion, it delivers clarity from the very first input to
                    the final insights.
                  </p>
                </div>
              </div>
            </div>

            {/* Y — Yours Truly */}
            <div className="shield shield-y">
              <div className="shield-inner">
                <div className="shield-front">
                  <h3 className="shield-title">Yours Truly</h3>
                </div>
                <div className="shield-back">
                  <p className="shield-description">
                    It's not just a scan—it's your scan. Security designed just
                    for you—personal, exclusive, and in your control. With
                    interactive charts, real-time progress, and personalized
                    recommendations, you're in full control of your web
                    security.
                  </p>
                </div>
              </div>
            </div>

            {/* R — Risk Radar */}
            <div className="shield shield-r">
              <div className="shield-inner">
                <div className="shield-front">
                  <h3 className="shield-title">Risk Radar</h3>
                </div>
                <div className="shield-back">
                  <p className="shield-description">
                    With Risk Radar, CYRA continuously scans for vulnerabilities
                    like SQL injections, open ports, and XSS. It pinpoints weak
                    spots and gives you prioritized alerts, so you can respond
                    before risks become problems.
                  </p>
                </div>
              </div>
            </div>

            {/* A — Assurance */}
            <div className="shield shield-a">
              <div className="shield-inner">
                <div className="shield-front">
                  <h3 className="shield-title">Assurance</h3>
                </div>
                <div className="shield-back">
                  <p className="shield-description">
                    CYRA doesn't stop at detection. It arms you with practical
                    advice and layered protection. Captcha validation. API
                    security. Timeouts to prevent overload. We've thought it
                    through, so you don't have to worry.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 🌍 CENTRALIZED TEXT */}
          <section id="services" className="center-text">
      
            <p className="shield-description typewriter">
              <span id="animated-text"></span>
            </p>
          </section>
          <button className="try" onClick={handleTryNow}>
              {user ? "Try now" : "Scan now."}
            </button>
        </section>
         
          <div class="design-section">
            <footer class="footer-3">
                <div class="cyber-line"></div>

                <div class="footer-grid">
                    <div class="brand-box">
                        <h2>CYRA</h2>
                        <p class="tagline">
                            Advanced vulnerability scanning tool made just for you.
                        </p>
                        <div class="tech-badge">🔒 Enterprise Security</div>
                    </div>

                    <div class="link-group">
                        <h4>Scan</h4>
                        <ul>
                            <li>Quick Scan</li>
                            <li>Deep Analysis</li>
                            <li>Scheduled</li>
                            <li>Reports</li>
                        </ul>
                    </div>

                    <div class="link-group">
                        <h4>Learn</h4>
                        <ul>
                            <li>Docs</li>
                            <li>Guides</li>
                            <li>API</li>
                            <li>Blog</li>
                        </ul>
                    </div>

                    <div class="link-group">
                        <h4>Connect</h4>
                        <ul>
                            <li>Contact</li>
                            <li>Support</li>
                            <li>Community</li>
                            <li>Partners</li>
                        </ul>
                    </div>

                    <div class="link-group">
                        <h4>Legal</h4>
                        <ul>
                            <li>Privacy</li>
                            <li>Terms</li>
                            <li>License</li>
                            <li>Cookies</li>
                        </ul>
                    </div>
                </div>

                <div class="footer-bottom">
                    <div class="copyright">
                        © 2025 CYRA • Lagos, Nigeria • +234-703-754-8999
                    </div>
                    <div class="security-badge">
                        <div class="security-icon">✓</div>
                        <span>SOC 2 Compliant</span>
                    </div>
                </div>
            </footer>
        </div>


      </div>
    </div>
  );
}

export default Home;