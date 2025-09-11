// CyraScanner.jsx
import React, { useState, useEffect } from 'react';
import './Urls.css';
import rya from '../assets/rya.png'; // Make sure this path matches your logo file location
import VC from '../assets/VC.png'

export default function Urls() {
  const [url, setUrl] = useState('');

  const handleScan = () => {
    if (url) {
      console.log('Scanning:', url);
      alert('Scanning: ' + url);
    } else {
      alert('Please enter a URL to scan');
    }
  };

  useEffect(() => {
    // Mouse move effect for subtle card tilt
    const scannerCard = document.querySelector('.scanner-card');
    
    const handleMouseMove = (e) => {
      const rect = scannerCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      scannerCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };
    
    const handleMouseLeave = () => {
      scannerCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    };
    
    if (scannerCard) {
      scannerCard.addEventListener('mousemove', handleMouseMove);
      scannerCard.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (scannerCard) {
        scannerCard.removeEventListener('mousemove', handleMouseMove);
        scannerCard.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div className="cyra-container">
      <div className="bg-elements">
        <div className="bg-element"></div>
        <div className="bg-element"></div>
        <div className="bg-element"></div>
      </div>

      {/* Navbar */}
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
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <div className="scanner-card">
          <div className="floating-elements">
            <div className="floating-ring ring-1"></div>
            <div className="floating-ring ring-2"></div>
            <div className="floating-ring ring-3"></div>
          </div>
          
           <img src={VC} alt="Hero face art" className="VC" />
          <h2 className="scanner-title">WEBSITE SECURITY SCANNER</h2>
          
          <div className="scanner-form">
            <input 
              type="url" 
              className="url-input" 
              placeholder="Enter your URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleScan()}
            />
            <button className="scan-btn" onClick={handleScan}>
              Scan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
