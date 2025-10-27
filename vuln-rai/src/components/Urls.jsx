import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Urls.css";
import rya from "../assets/rya.png"; // kept in case you use it in the layout later
import VC from "../assets/VC.png";

export default function Urls() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Validate + normalize URL, return { ok: boolean, formatted?: string, message?: string }
  const validateAndFormatUrl = (input) => {
    const trimmed = input.trim();
    if (!trimmed) {
      return { ok: false, message: "Please enter a URL to scan." };
    }

    // basic URL pattern (allows optional http/https). Keeps it permissive but catches obvious junk
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;

    if (!urlPattern.test(trimmed)) {
      return { ok: false, message: "The input does not meet the requirements." };
    }

    const formatted = trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `https://${trimmed}`;

    return { ok: true, formatted };
  };

  const handleScan = () => {
    setError("");
    const { ok, formatted, message } = validateAndFormatUrl(url);

    if (!ok) {
      setError(message);
      return;
    }

    // Navigate to Dashboard and pass the validated URL for actual scanning
    navigate("/Dashboard", { state: { scannedUrl: formatted } });
  };

  // allow Enter to trigger scan; use onKeyDown because onKeyPress is deprecated
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleScan();
    }
  };

  // Mouse move effect for subtle card tilt (keeps your original interactive feel)
  useEffect(() => {
    const scannerCard = document.querySelector(".scanner-card");

    if (!scannerCard) return;

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
      scannerCard.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    };

    scannerCard.addEventListener("mousemove", handleMouseMove);
    scannerCard.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      scannerCard.removeEventListener("mousemove", handleMouseMove);
      scannerCard.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []); // run once on mount

  // Clear error when user types
  useEffect(() => {
    if (error && url.trim()) {
      // remove error as soon as user starts correcting
      setError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return (
    <div className="cyra-container">
      <div className="bg-elements">
        <div className="bg-element"></div>
        <div className="bg-element"></div>
        <div className="bg-element"></div>
      </div>

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
              type="text"
              className={`url-input ${error ? "url-input-error" : ""}`}
              placeholder="Enter your URL (e.g. example.com or https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Website URL"
              aria-invalid={!!error}
              aria-describedby="url-error"
            />
            <button className="scan-btn" onClick={handleScan}>
              Scan
            </button>
          </div>

          {/* Inline error (non-blocking, fits project style) */}
          <div
            id="url-error"
            className="url-error"
            role="status"
            aria-live="polite"
            style={{ minHeight: "1.2rem", marginTop: "8px" }}
          >
            {error && <span className="url-error-text">{error}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
