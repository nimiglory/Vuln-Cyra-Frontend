// Dashboard.jsx
import React, { useState, useRef } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import "./Dashboard.css";

const dummyFindings = [
  { id: 1, vuln: "SQL Injection", severity: "High", rec: "Use prepared statements", date: "2025-09-01" },
  { id: 2, vuln: "Open Port", severity: "Medium", rec: "Close unnecessary ports", date: "2025-09-02" },
  { id: 3, vuln: "Missing Headers", severity: "Low", rec: "Add security headers", date: "2025-09-03" },
];

const chartData = [
  { name: "High", value: 40, color: "#ff4d4f" },
  { name: "Medium", value: 30, color: "#ff9900" },
  { name: "Low", value: 30, color: "#2aa952" },
];

function Dashboard() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = useState("light");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [timeframe, setTimeframe] = useState("30d");
  const [activeActionRow, setActiveActionRow] = useState(null);
  const [chartType, setChartType] = useState("pie");
  const progressRef = useRef(null);

  function startScan() {
    if (!query) return;
    setIsSearching(true);
    setProgress(0);

    let p = 0;
    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 15) + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => setIsSearching(false), 400);
      }
      setProgress(p);
    }, 400);
  }

  function toggleTheme() {
    const t = theme === "dark" ? "light" : "dark";
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
  }

  return (
    <div className={`dashboard-root ${theme}`}>
      {/* ===== Top Navbar ===== */}
      <header className="topbar">
        <div className="brand">CYRA</div>

        <div className="search-wrapper">
          <input
            className="search-input"
            placeholder="Enter URL..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="feature-btn">🔍</button>
        </div>

        <div className="profile-area">
          <div
            className="profile-icon"
            onClick={() => setShowProfileMenu((s) => !s)}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
              <path
                d="M4 20c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {showProfileMenu && (
            <div className="profile-menu">
              <div className="menu-item">
                <button className="menu-btn">My Profile</button>
              </div>
              <div className="menu-item">
                <button className="menu-btn">Settings</button>
              </div>
              <div className="menu-item theme-toggle">
                <label className="toggle-label">Dark Mode</label>
                <button
                  className={`toggle-btn ${theme === "dark" ? "on" : "off"}`}
                  onClick={toggleTheme}
                >
                  {theme === "dark" ? "On" : "Off"}
                </button>
              </div>
              <div className="menu-footer">
                <button className="menu-btn danger">Logout</button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ===== Main Content ===== */}
   <div className="scan-controls">
       <div className="timeframes-dropdown">
        <button className="tf active">{timeframe === "30d" ? "30 days" :
                                       timeframe === "1w" ? "1 week" :
                                    timeframe === "2d" ? "2 days" :
                                    "Last used"}</button>
           <div className="dropdown-menu">
           <div className={`dropdown-item ${timeframe === "30d" ? "active" : ""}`} onClick={() => setTimeframe("30d")}>30 days</div>
           <div className={`dropdown-item ${timeframe === "1w" ? "active" : ""}`} onClick={() => setTimeframe("1w")}>1 week</div>
           <div className={`dropdown-item ${timeframe === "2d" ? "active" : ""}`} onClick={() => setTimeframe("2d")}>2 days</div>
           <div className={`dropdown-item ${timeframe === "last" ? "active" : ""}`} onClick={() => setTimeframe("last")}>Last used</div>
           </div>
          </div>
    </div>


      <main className="container">
        {/* Welcome / Scan Card */}
        <section className="welcome-card">
          <h1>WELCOME BACK!</h1>
          <div className="scan-row">
            <input
              className="url-input"
              placeholder="enter more urls..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="scan-btn" onClick={startScan}>
              + Scan
            </button>
          </div>

          {isSearching && (
            <div className="progress-area">
              <div className="progress-label">Scanning {query}</div>
              <div className="progress-bar" ref={progressRef}>
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </section>

        {/* Charts + Risks */}
        <section className="widgets">
          <div className="card charts">
            <div className="card-head charts-head">
              Charts
              <button
                className="chart-toggle"
                onClick={() => setChartType(chartType === "pie" ? "bar" : "pie")}
              >
                {chartType === "pie" ? "Show Bar" : "Show Pie"}
              </button>
            </div>

            <div className="chart-area">
              {chartType === "pie" ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius="70%"
                      label
                    >
                      {chartData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value">
                      {chartData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="card risks">
            <div className="card-head">RISK LEVELS</div>
            <div className="risk-chips">
              <div className="chip high">
                High<br />
                <strong>8</strong>
              </div>
              <div className="chip medium">
                Medium<br />
                <strong>5</strong>
              </div>
              <div className="chip low">
                Low<br />
                <strong>2</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Findings */}
        <section className="findings">
          <h2>FINDINGS</h2>
          <table className="findings-table">
            <thead>
              <tr>
                <th>Vulnerability</th>
                <th>Severity</th>
                <th>Recommendation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dummyFindings.map((f) => (
                <tr key={f.id}>
                  <td>{f.vuln}</td>
                  <td className={`severity ${f.severity.toLowerCase()}`}>
                    {f.severity}
                  </td>
                  <td>{f.rec}</td>
                  <td className="actions-cell">
                    <button
                      className="more"
                      onClick={() =>
                        setActiveActionRow(activeActionRow === f.id ? null : f.id)
                      }
                    >
                      ...
                    </button>

                    {activeActionRow === f.id && (
                      <div className="action-menu">
                        <button className="action-item">View Report</button>
                        <button className="action-item">Export</button>
                        <button className="action-item">Save</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      <footer className="foot">Cyra • 2025</footer>
    </div>
  );
}

export default Dashboard;
