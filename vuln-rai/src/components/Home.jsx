import { useState } from "react";
import React from "react";
import { Sun, Moon, Instagram, Twitter, Facebook } from "lucide-react";
import VC from "../assets/VC.png";
import rya from "../assets/rya.png";
import "./Home.css";

function Home() {
  const [darkMode, setDarkMode] = useState(true);


  return (
    <div className={darkMode ? "dark" : "light"}>
      <div className="heading">
        {/* 🌍 NAVBAR */}
        <nav className="navbar">
          <div className="nav-left">
            <img src={rya} alt="logo" className="logo" />
            <span className="brand">YRA</span>
          </div>

          <div className="nav-right">
            <ul className="nav-links">
              <li>HOME</li>
              <li>ABOUT US</li>
              <li>SERVICES</li>
              <li>CONTACT US</li>
            </ul>

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
            <button className="try">Try now.</button>
          </div>

          <div className="hero-image">
            <img src={VC} alt="Hero face art" className="VC1" />
          </div>
        </section>

        {/* 🌍 ADVANTAGES SECTION */}
       {/* 🌍 ADVANTAGES SECTION */}
<section className="advantages">
  <div className="shields-container">
    {/* C — Clarity */}
    <div className="shield shield-c">
      <div className="shield-inner">
        <div className="shield-front">
          <h3>C — Clarity</h3>
        </div>
        <div className="shield-back">
          <p>
            CYRA offers a clean, user-friendly interface that makes scanning
            your website for vulnerabilities as simple as entering a URL and
            clicking "Scan." With no clutter or confusion, it delivers clarity
            from the very first input to the final insights.
          </p>
        </div>
      </div>
    </div>

    {/* Y — Yours Truly */}
    <div className="shield shield-y">
      <div className="shield-inner">
        <div className="shield-front">
          <h3>Y — Yours Truly</h3>
        </div>
        <div className="shield-back">
          <p>
            It’s not just a scan—it’s your scan. Security designed just for
            you—personal, exclusive, and in your control. With interactive
            charts, real-time progress, and personalized recommendations,
            you’re in full control of your web security.
          </p>
        </div>
      </div>
    </div>

    {/* R — Risk Radar */}
    <div className="shield shield-r">
      <div className="shield-inner">
        <div className="shield-front">
          <h3>R — Risk Radar</h3>
        </div>
        <div className="shield-back">
          <p>
            With Risk Radar, CYRA continuously scans for vulnerabilities like
            SQL injections, open ports, and XSS. It pinpoints weak spots and
            gives you prioritized alerts, so you can respond before risks
            become problems.
          </p>
        </div>
      </div>
    </div>

    {/* A — Assurance */}
    <div className="shield shield-a">
      <div className="shield-inner">
        <div className="shield-front">
          <h3>A — Assurance</h3>
        </div>
        <div className="shield-back">
          <p>
            CYRA doesn’t stop at detection. It arms you with practical advice
            and layered protection. Captcha validation. API security. Timeouts
            to prevent overload. We’ve thought it through, so you don’t have
            to worry.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

        {/* 🌍 CENTRALIZED TEXT */}
        <section className="center-text">
          <p>
            Security shouldn’t feel distant—it should feel like home.
            Perhaps it’s exactly what you’ve been needing all along.
          </p>
        </section>

        {/* 🌍 FOOTER */}
        <footer className="footer">
          <div className="footer-grid">
            {/* About */}
            <div>
              <h3>About Cyra</h3>
              <ul>
                <li>What is Celia</li>
                <li>Why choose us</li>
                <li>Our story</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3>Get in Touch</h3>
              <p>Lagos, Nigeria</p>
              <p>+2347037548999</p>
              <p>hello@celiastash.com</p>
            </div>

            {/* Stay Connected */}
            <div>
              <h3>Stay Connected</h3>
              <ul>
                <li>FAQs</li>
                <li>How to use Celia</li>
                <li>Report a bug</li>
                <li>Privacy & Terms</li>
              </ul>
            </div>

            {/* Logo + Socials */}
            <div className="footer-brand">
              <h2>CYRA</h2>
              <div className="socials">
                <Instagram className="icon" />
                <Twitter className="icon" />
                <Facebook className="icon" />
              </div>
              <p>Bringing clarity to every scan</p>
            </div>
          </div>

          <div className="footer-bottom">
            © 2025 Celia Inc. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
