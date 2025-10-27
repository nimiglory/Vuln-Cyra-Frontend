// import React, { useState, useRef, useEffect } from "react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Legend,
// } from "recharts";
// import { User, ChevronDown, LogOut } from "lucide-react";
// import { useNavigate, useLocation } from "react-router-dom";
// import "./Dashboard.css";
// import { CiSearch } from "react-icons/ci";
// import { RiColorFilterAiFill } from "react-icons/ri";
// import { useAuth } from "../AuthContext";
// import api from "./axios";

// function Dashboard() {
//   const [navQuery, setNavQuery] = useState("");
//   const [scanQuery, setScanQuery] = useState("");
//   const [isSearching, setIsSearching] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [scanData, setScanData] = useState([]);
//   const [currentScanId, setCurrentScanId] = useState(null);
//   const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [timeframe, setTimeframe] = useState("30d");
//   const [showTimeframe, setShowTimeframe] = useState(false);
//   const [activeActionRow, setActiveActionRow] = useState(null);
//   const [chartType, setChartType] = useState("pie");
//   const [selectedSite, setSelectedSite] = useState(null);
//   const [openReportId, setOpenReportId] = useState(null);
//   const progressRef = useRef(null);
//   const hasProcessedLocation = useRef(false);

//   const { user, logout, loading } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Theme handling
//   useEffect(() => {
//     document.documentElement.setAttribute("data-theme", theme);
//     localStorage.setItem("theme", theme);
//   }, [theme]);

//   const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

//   // Close profile dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (!e.target.closest(".profile-area")) setShowProfileMenu(false);
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Fetch findings for user with timeframe
//   const fetchFindings = async (tf = timeframe) => {
//     if (!user) {
//       console.log("⚠️ No user, skipping fetch");
//       setScanData([]);
//       return;
//     }

//     console.log(`📥 Fetching findings for timeframe: ${tf}`);

//     try {
//       const res = await api.get(`/api/findings/?timeframe=${tf}`);
//       const findings = Array.isArray(res.data) ? res.data : [];
//       setScanData(findings);
//       localStorage.setItem(`scanData_${user.id}_${tf}`, JSON.stringify(findings));
//     } catch (err) {
//       console.error("❌ Error fetching findings:", err);
//       const cached = localStorage.getItem(`scanData_${user.id}_${tf}`);
//       if (cached) {
//         setScanData(JSON.parse(cached));
//       } else {
//         setScanData([]);
//       }
//     }
//   };

//   // Fetch findings on mount and timeframe change
//   useEffect(() => {
//     if (user) fetchFindings(timeframe);
//   }, [user, timeframe]);

//   // Handle incoming scan from url.py
//   useEffect(() => {
//     if (!hasProcessedLocation.current && location.state?.scannedUrl) {
//       const incomingUrl = location.state.scannedUrl;
//       hasProcessedLocation.current = true;
//       setScanQuery(incomingUrl);
//       startScan(incomingUrl);
//       navigate(location.pathname, { replace: true, state: {} });
//     }
//   }, [location.state]);

//   useEffect(() => {
//     hasProcessedLocation.current = false;
//   }, [user]);

//   const normalizeFindings = (raw) => {
//     if (!Array.isArray(raw)) return [];
//     return raw.map((f, idx) => ({
//       id: f.id || `finding-${idx}`,
//       site: f.url || "Unknown Site",
//       vulnerability: f.vulnerability || "Unknown",
//       severity: f.severity || "Low",
//       recommendation: f.recommendation || "N/A",
//       created_at: f.created_at || null,
//     }));
//   };

//   const findings = normalizeFindings(scanData);
//   const filteredBySite = selectedSite ? findings.filter((f) => f.site === selectedSite) : findings;

//   const q = navQuery.trim().toLowerCase();
//   const searchFilteredFindings = q
//     ? filteredBySite.filter((f) =>
//         [f.site, f.vulnerability, f.severity, f.recommendation]
//           .join(" ")
//           .toLowerCase()
//           .includes(q)
//       )
//     : filteredBySite;

//   const displayedFindings = searchFilteredFindings;

//   const severityCounts = displayedFindings.reduce(
//     (acc, f) => {
//       const sev = (f.severity || "low").toLowerCase();
//       if (sev === "high") acc.high++;
//       else if (sev === "medium") acc.medium++;
//       else acc.low++;
//       return acc;
//     },
//     { high: 0, medium: 0, low: 0 }
//   );

//   const chartData = [
//     { name: "High", value: severityCounts.high, color: "#ff4d4f" },
//     { name: "Medium", value: severityCounts.medium, color: "#ff9900" },
//     { name: "Low", value: severityCounts.low, color: "#2aa952" },
//   ];

//   // Start scan
//   const startScan = async (incomingUrl) => {
//     const targetUrl = incomingUrl || scanQuery.trim();
//     if (!targetUrl) return alert("Please enter a URL to scan");

//     setIsSearching(true);
//     setProgress(0);

//     try {
//       const res = await api.post("/api/scan/", { url: targetUrl });
//       setCurrentScanId(res.data.scan_id);
//       pollScan(res.data.scan_id);
//     } catch (err) {
//       console.error("❌ Scan start failed:", err);
//       setIsSearching(false);
//       alert("Failed to start scan");
//     }
//   };

//   // Poll scan
//   const pollScan = (scanId) => {
//     let pollCount = 0;
//     const maxPolls = 60;

//     const interval = setInterval(async () => {
//       pollCount++;
//       try {
//         const res = await api.get(`/api/results/${scanId}/`);
//         const scan = res.data;
//         const statusStr = (scan.status || "").toLowerCase();

//         if (statusStr === "completed") {
//           clearInterval(interval);
//           setProgress(100);
//           await fetchFindings(timeframe);
//           setIsSearching(false);
//           setScanQuery("");
//           return;
//         }

//         if (statusStr.startsWith("error")) {
//           clearInterval(interval);
//           setProgress(0);
//           setIsSearching(false);
//           alert("Scan failed");
//           return;
//         }

//         if (pollCount >= maxPolls) {
//           clearInterval(interval);
//           setProgress(100);
//           await fetchFindings(timeframe);
//           setIsSearching(false);
//           setScanQuery("");
//           return;
//         }

//         setProgress((p) => (p >= 95 ? 95 : p + Math.random() * 5 + 2));
//       } catch (err) {
//         clearInterval(interval);
//         setIsSearching(false);
//         alert("Connection error");
//       }
//     }, 2000);
//   };

//   // Timeframe
//   const handleTimeframeChange = async (newTimeframe) => {
//     setTimeframe(newTimeframe);
//     setShowTimeframe(false);
//     await fetchFindings(newTimeframe);
//   };

//   // Logout
//   const handleLogout = () => {
//     if (user?.id) {
//       Object.keys(localStorage).forEach((key) => {
//         if (key.startsWith(`scanData_${user.id}_`)) localStorage.removeItem(key);
//       });
//     }
//     setScanData([]);
//     logout();
//     navigate("/");
//   };

//   return (
//     <div className={`dashboard-root ${theme}`}>
//       {/* Topbar */}
//       <header className="topbar">
//         <div className="brand"  onClick={() => navigate("/")}>CYRA</div>
//         <div className="search-wrapper">
//           <input
//             value={navQuery}
//             onChange={(e) => setNavQuery(e.target.value)}
//             placeholder="Search reports, findings..."
//             className="search-input"
//           />
//           <button className="feature-btn">
//             <CiSearch />
//           </button>
//         </div>

//         <button className="feature-icon" onClick={() => setShowTimeframe(!showTimeframe)}>
//           <RiColorFilterAiFill />
//         </button>

//         <div className="profile-area">
//           <div className="profile-trigger" onClick={() => setShowProfileMenu(!showProfileMenu)}>
//             <User size={20} />
//             {user?.email && <span>{user.email}</span>}
//             {!loading && <ChevronDown size={16} />}
//           </div>

//           {showProfileMenu && (
//             <div className="profile-dropdown-menu">
//               {user && <div className="dropdown-header">{user.email}</div>}
//               <div className="dropdown-divider" />
//               <button className="dropdown-item" onClick={toggleTheme}>
//                 Theme
//               </button>
//               <button className="dropdown-item logout-btn" onClick={handleLogout}>
//                 <LogOut size={16} /> Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </header>
//          <div className="scan-controls">
//            {showTimeframe && (
//           <div className="timeframes-dropdown">
//             <button className="tf active">
//               {timeframe === "30d" ? "30 days" : timeframe === "1w" ? "1 week" : timeframe === "2d" ? "2 days" : "Last used"}
//             </button>
//             <div className="dropdown-menu">
//               <div className={`dropdown-item ${timeframe === "30d" ? "active" : ""}`} onClick={() => handleTimeframeChange("30d")}>
//                 30 days
//               </div>
//               <div className={`dropdown-item ${timeframe === "1w" ? "active" : ""}`} onClick={() => handleTimeframeChange("1w")}>
//                 1 week
//               </div>
//               <div className={`dropdown-item ${timeframe === "2d" ? "active" : ""}`} onClick={() => handleTimeframeChange("2d")}>
//                 2 days
//               </div>
//               <div className={`dropdown-item ${timeframe === "last" ? "active" : ""}`} onClick={() => handleTimeframeChange("last")}>
//                 Last used
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <main className="container">
//         {/* Welcome & Scan */}
//         <section className="welcome-card">
//           <h1>WELCOME BACK{user && `, ${user.email.split("@")[0].toUpperCase()}`}!</h1>
//           <div className="scan-row">
//             <input
//               value={scanQuery}
//               onChange={(e) => setScanQuery(e.target.value)}
//               placeholder="Enter URL to scan..."
//               className="url-input"
//               onKeyPress={(e) => e.key === "Enter" && startScan()}
//             />
//             <button className="scan-btn" onClick={() => startScan()} disabled={isSearching}>
//               {isSearching ? "Scanning..." : "Scan"}
//             </button>
//           </div>
           
//           {isSearching && (
//             <div className="progress-area">
//               <div className="progress-label">Scanning {scanQuery}</div>
//               <div className="progress-bar" ref={progressRef}>
//                 <div className="progress-fill" style={{ width: `${progress}%` }} />
//               </div>
//               <div className="progress-percent">{Math.floor(progress)}%</div>
//             </div>
//           )}
//         </section>

//         {/* Charts */}
//         <section className="widgets">
//           <div className="card charts">
//             <div className="chart-tog">
//               CHARTS
//               <button className="chart-toggle" onClick={() => setChartType(chartType === "pie" ? "bar" : "pie")}>
//                 {chartType === "pie" ? "Show Bar" : "Show Pie"}
//               </button>
//             </div>
//             <div className="chart-area">
//               {chartType === "pie" ? (
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart>
//                     <Pie data={chartData} dataKey="value" cx="50%" cy="50%" outerRadius="70%" label>
//                       {chartData.map((entry, idx) => (
//                         <Cell key={idx} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               ) : (
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={chartData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="value">
//                       {chartData.map((entry, idx) => (
//                         <Cell key={idx} fill={entry.color} />
//                       ))}
//                     </Bar>
//                   </BarChart>
//                 </ResponsiveContainer>
//               )}
//             </div>
//           </div>

//           <div className="card risks">
//             <div className="card-head">RISK LEVELS</div>
//             <div className="risk-chips">
//               <div className="chip high">High<br /><strong>{severityCounts.high}</strong></div>
//               <div className="chip medium">Medium<br /><strong>{severityCounts.medium}</strong></div>
//               <div className="chip low">Low<br /><strong>{severityCounts.low}</strong></div>
//             </div>
//           </div>
//         </section>

//         {/* Findings Table */}
//         <section className="findings">
//           <h2>
//             FINDINGS {displayedFindings.length > 0 && `(${displayedFindings.length})`} —{" "}
//             <small>{timeframe}</small>
//           </h2>

//           <table className="findings-table">
//             <thead>
//               <tr>
//                 <th>Site</th>
//                 <th>Vulnerability</th>
//                 <th>Severity</th>
//                 <th>Recommendation</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {displayedFindings.length === 0 && (
//                 <tr>
//                   <td colSpan={5}>No findings yet. Start a scan to see results.</td>
//                 </tr>
//               )}

//               {displayedFindings.map((f) => (
//                 <React.Fragment key={f.id}>
//                   <tr>
//                     <td title={f.site}>{f.site.length > 30 ? f.site.substring(0, 30) + "..." : f.site}</td>
//                     <td>{f.vulnerability}</td>
//                     <td className={`severity ${f.severity.toLowerCase()}`}>{f.severity}</td>
//                     <td title={f.recommendation}>
//                       {f.recommendation.length > 50 ? f.recommendation.substring(0, 50) + "..." : f.recommendation}
//                     </td>
//                     <td className="actions-cell">
//                       <button
//                         className="more"
//                         onClick={() => setActiveActionRow(activeActionRow === f.id ? null : f.id)}
//                       >
//                         ...
//                       </button>
//                       {activeActionRow === f.id && (
//                         <div className="action-menu">
//                           <button
//                             className="action-item"
//                             onClick={() => {
//                               setOpenReportId(openReportId === f.id ? null : f.id);
//                               setActiveActionRow(null);
//                             }}
//                           >
//                             View Report
//                           </button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>

//                   {/* Inline Info Box (replaces modal) */}
//                   {openReportId === f.id && (
//                     <tr className="report-row">
//                       <td colSpan={5}>
//                         <div className="report-box">
//                           <h3>{f.vulnerability}</h3>
//                           <p><strong>Site:</strong> {f.site}</p>
//                           <p>
//                             <strong>Severity:</strong>{" "}
//                             <span className={`severity ${f.severity.toLowerCase()}`}>
//                               {f.severity}
//                             </span>
//                           </p>
//                           <p><strong>Recommendation:</strong> {f.recommendation}</p>
//                           <button className="close-btn" onClick={() => setOpenReportId(null)}>
//                             Close
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </React.Fragment>
//               ))}
//             </tbody>
//           </table>
//         </section>
//       </main>

//       <footer className="foot">Cyra • 2025</footer>
//     </div>
//   );
// }

// export default Dashboard;



// // import React, { useState, useRef, useEffect } from "react";
// // import {
// //   PieChart,
// //   Pie,
// //   Cell,
// //   Tooltip,
// //   ResponsiveContainer,
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Legend,
// // } from "recharts";
// // import { User, ChevronDown, LogOut } from "lucide-react";
// // import { useNavigate, useLocation } from "react-router-dom";
// // import "./Dashboard.css";
// // import { CiSearch } from "react-icons/ci";
// // import { RiColorFilterAiFill } from "react-icons/ri";
// // import { useAuth } from "../AuthContext";
// // import api from "./axios";

// // function Dashboard() {
// //   const [navQuery, setNavQuery] = useState("");
// //   const [scanQuery, setScanQuery] = useState("");
// //   const [isSearching, setIsSearching] = useState(false);
// //   const [progress, setProgress] = useState(0);
// //   const [scanData, setScanData] = useState([]);
// //   const [currentScanId, setCurrentScanId] = useState(null);
// //   const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
// //   const [showProfileMenu, setShowProfileMenu] = useState(false);
// //   const [timeframe, setTimeframe] = useState("30d");
// //   const [showTimeframe, setShowTimeframe] = useState(false);
// //   const [activeActionRow, setActiveActionRow] = useState(null);
// //   const [chartType, setChartType] = useState("pie");
// //   const [selectedSite, setSelectedSite] = useState(null);
// //   const [openReportId, setOpenReportId] = useState(null);
// //   const progressRef = useRef(null);
// //   const hasProcessedLocation = useRef(false);
// //   const processedScanIds = useRef(new Set()); // Track processed scans to prevent duplicates

// //   const { user, logout, loading } = useAuth();
// //   const navigate = useNavigate();
// //   const location = useLocation();

// //   // Theme handling
// //   useEffect(() => {
// //     document.documentElement.setAttribute("data-theme", theme);
// //     localStorage.setItem("theme", theme);
// //   }, [theme]);

// //   const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

// //   // Close profile dropdown on outside click
// //   useEffect(() => {
// //     const handleClickOutside = (e) => {
// //       if (!e.target.closest(".profile-area")) setShowProfileMenu(false);
// //     };
// //     document.addEventListener("mousedown", handleClickOutside);
// //     return () => document.removeEventListener("mousedown", handleClickOutside);
// //   }, []);

// //   // Fetch ALL findings for user with timeframe
// //   const fetchFindings = async (tf = timeframe) => {
// //     if (!user) {
// //       console.log("⚠️ No user, skipping fetch");
// //       setScanData([]);
// //       return;
// //     }

// //     console.log(`📥 Fetching ALL findings for timeframe: ${tf}`);

// //     try {
// //       const res = await api.get(`/api/findings/?timeframe=${tf}`);
// //       const findings = Array.isArray(res.data) ? res.data : [];
      
// //       // Store findings and update processed IDs
// //       setScanData(findings);
      
// //       // Track all scan IDs we've loaded to prevent duplicates
// //       findings.forEach(f => {
// //         if (f.scan_id) processedScanIds.current.add(f.scan_id);
// //       });
      
// //       localStorage.setItem(`scanData_${user.id}_${tf}`, JSON.stringify(findings));
// //       console.log(`✅ Loaded ${findings.length} total findings`);
// //     } catch (err) {
// //       console.error("❌ Error fetching findings:", err);
// //       const cached = localStorage.getItem(`scanData_${user.id}_${tf}`);
// //       if (cached) {
// //         const cachedData = JSON.parse(cached);
// //         setScanData(cachedData);
// //         cachedData.forEach(f => {
// //           if (f.scan_id) processedScanIds.current.add(f.scan_id);
// //         });
// //       } else {
// //         setScanData([]);
// //       }
// //     }
// //   };

// //   // Add new scan results to existing data
// // const addNewScanResults = async (scanId) => {
// //   if (!scanId) return;

// //   if (processedScanIds.current.has(scanId)) {
// //     console.log(`⚠️ Skipping duplicate add for scan ID: ${scanId}`);
// //     return;
// //   }

// //   console.log(`📥 Fetching NEW scan result for scan ID: ${scanId}`);

// //   try {
// //     const res = await api.get(`/api/findings/?scan_id=${scanId}`);
// //     const newFindings = Array.isArray(res.data) ? res.data : [];

// //     if (newFindings.length > 0) {
// //       setScanData((prevData) => {
// //         const filtered = prevData.filter((f) => f.scan_id !== scanId);
// //         const updated = [...newFindings, ...filtered];

// //         if (user?.id) {
// //           localStorage.setItem(`scanData_${user.id}_${timeframe}`, JSON.stringify(updated));
// //         }

// //         processedScanIds.current.add(scanId);
// //         console.log(`✅ Added ${newFindings.length} new finding(s). Total: ${updated.length}`);
// //         return updated;
// //       });
// //     }
// //   } catch (err) {
// //     console.error("❌ Error fetching new scan result:", err);
// //   }
// // };


// //   // Initial load: Fetch all findings on mount
// //   useEffect(() => {
// //     if (user) {
// //       fetchFindings(timeframe);
// //     }
// //   }, [user, timeframe]);

// //   // Handle incoming scan from url.jsx
// //  useEffect(() => {
// //   const incomingUrl = location.state?.scannedUrl;

// //   if (incomingUrl && !hasProcessedLocation.current) {
// //     console.log("🔗 Incoming URL detected once:", incomingUrl);
// //     hasProcessedLocation.current = true;

// //     // Just set it — don’t scan immediately
// //     setScanQuery(incomingUrl);

// //     // Optional: auto-scan only if you want
// //     // startScan(incomingUrl);

// //     // Clean up the state after
// //     navigate(location.pathname, { replace: true, state: {} });
// //   }
// // }, [location.state, navigate]);

// //   // Reset the processed flag when user changes
// //   useEffect(() => {
// //     hasProcessedLocation.current = false;
// //   }, [user]);

// //   const normalizeFindings = (raw) => {
// //     if (!Array.isArray(raw)) return [];
// //     return raw.map((f, idx) => ({
// //       id: f.id || `finding-${idx}`,
// //       scan_id: f.scan_id || f.id,
// //       site: f.url || "Unknown Site",
// //       vulnerability: f.vulnerability || "Unknown",
// //       severity: f.severity || "Low",
// //       recommendation: f.recommendation || "N/A",
// //       created_at: f.created_at || null,
// //     }));
// //   };

// //   const findings = normalizeFindings(scanData);
// //   const filteredBySite = selectedSite ? findings.filter((f) => f.site === selectedSite) : findings;

// //   const q = navQuery.trim().toLowerCase();
// //   const searchFilteredFindings = q
// //     ? filteredBySite.filter((f) =>
// //         [f.site, f.vulnerability, f.severity, f.recommendation]
// //           .join(" ")
// //           .toLowerCase()
// //           .includes(q)
// //       )
// //     : filteredBySite;

// //   const displayedFindings = searchFilteredFindings;

// //   const severityCounts = displayedFindings.reduce(
// //     (acc, f) => {
// //       const sev = (f.severity || "low").toLowerCase();
// //       if (sev === "high") acc.high++;
// //       else if (sev === "medium") acc.medium++;
// //       else acc.low++;
// //       return acc;
// //     },
// //     { high: 0, medium: 0, low: 0 }
// //   );

// //   const chartData = [
// //     { name: "High", value: severityCounts.high, color: "#ff4d4f" },
// //     { name: "Medium", value: severityCounts.medium, color: "#ff9900" },
// //     { name: "Low", value: severityCounts.low, color: "#2aa952" },
// //   ];

// //   // Start scan
// //   const startScan = async (incomingUrl) => {
// //     const targetUrl = incomingUrl || scanQuery.trim();
// //     if (!targetUrl) return alert("Please enter a URL to scan");

// //     console.log("🚀 Starting scan for:", targetUrl);
// //     setIsSearching(true);
// //     setProgress(0);
// //     // DON'T clear scanData - keep existing history

// //     try {
// //       const res = await api.post("/api/scan/", { url: targetUrl });
// //       console.log("✅ Scan initiated, ID:", res.data.scan_id);
// //       setCurrentScanId(res.data.scan_id);
// //       pollScan(res.data.scan_id);
// //     } catch (err) {
// //       console.error("❌ Scan start failed:", err);
// //       setIsSearching(false);
// //       setCurrentScanId(null);
// //       alert("Failed to start scan");
// //     }
// //   };

// //   // Poll scan - ADD new results to existing data
// //   const pollScan = (scanId) => {
// //     let pollCount = 0;
// //     const maxPolls = 60;

// //     const interval = setInterval(async () => {
// //       pollCount++;
// //       try {
// //         const res = await api.get(`/api/results/${scanId}/`);
// //         const scan = res.data;
// //         const statusStr = (scan.status || "").toLowerCase();

// //         if (statusStr === "completed") {
// //           console.log("✅ Scan completed successfully");
// //           clearInterval(interval);
// //           setProgress(100);
          
// //           // Wait a moment then ADD this scan to existing results
// //           setTimeout(async () => {
// //             await addNewScanResults(scanId);
// //             setIsSearching(false);
// //             setScanQuery("");
// //             setCurrentScanId(null);
// //           }, 500);
// //           return;
// //         }

// //         if (statusStr.startsWith("error")) {
// //           console.error("❌ Scan failed with error status");
// //           clearInterval(interval);
// //           setProgress(0);
// //           setIsSearching(false);
// //           setCurrentScanId(null);
// //           alert("Scan failed");
// //           return;
// //         }

// //         if (pollCount >= maxPolls) {
// //           console.warn("⏰ Scan polling timeout reached");
// //           clearInterval(interval);
// //           setProgress(100);
          
// //           setTimeout(async () => {
// //             await addNewScanResults(scanId);
// //             setIsSearching(false);
// //             setScanQuery("");
// //             setCurrentScanId(null);
// //           }, 500);
// //           return;
// //         }

// //         setProgress((p) => (p >= 95 ? 95 : p + Math.random() * 5 + 2));
// //       } catch (err) {
// //         console.error("❌ Polling error:", err);
// //         clearInterval(interval);
// //         setIsSearching(false);
// //         setCurrentScanId(null);
// //         alert("Connection error");
// //       }
// //     }, 2000);
// //   };

// //   // Timeframe
// //   const handleTimeframeChange = async (newTimeframe) => {
// //     setTimeframe(newTimeframe);
// //     setShowTimeframe(false);
// //     setCurrentScanId(null);
// //     processedScanIds.current.clear(); // Clear tracked IDs when changing timeframe
// //     await fetchFindings(newTimeframe);
// //   };

// //   // Logout
// //   const handleLogout = () => {
// //     if (user?.id) {
// //       Object.keys(localStorage).forEach((key) => {
// //         if (key.startsWith(`scanData_${user.id}_`)) localStorage.removeItem(key);
// //       });
// //     }
// //     setScanData([]);
// //     processedScanIds.current.clear();
// //     logout();
// //     navigate("/");
// //   };

// //   return (
// //     <div className={`dashboard-root ${theme}`}>
// //       {/* Topbar */}
// //       <header className="topbar">
// //         <div className="brand" onClick={() => navigate("/")}>CYRA</div>
// //         <div className="search-wrapper">
// //           <input
// //             value={navQuery}
// //             onChange={(e) => setNavQuery(e.target.value)}
// //             placeholder="Search reports, findings..."
// //             className="search-input"
// //           />
// //           <button className="feature-btn">
// //             <CiSearch />
// //           </button>
// //         </div>

// //         <button className="feature-icon" onClick={() => setShowTimeframe(!showTimeframe)}>
// //           <RiColorFilterAiFill />
// //         </button>

// //         <div className="profile-area">
// //           <div className="profile-trigger" onClick={() => setShowProfileMenu(!showProfileMenu)}>
// //             <User size={20} />
// //             {user?.email && <span>{user.email}</span>}
// //             {!loading && <ChevronDown size={16} />}
// //           </div>

// //           {showProfileMenu && (
// //             <div className="profile-dropdown-menu">
// //               {user && <div className="dropdown-header">{user.email}</div>}
// //               <div className="dropdown-divider" />
// //               <button className="dropdown-item" onClick={toggleTheme}>
// //                 Theme
// //               </button>
// //               <button className="dropdown-item logout-btn" onClick={handleLogout}>
// //                 <LogOut size={16} /> Logout
// //               </button>
// //             </div>
// //           )}
// //         </div>
// //       </header>
      
// //       <div className="scan-controls">
// //         {showTimeframe && (
// //           <div className="timeframes-dropdown">
// //             <button className="tf active">
// //               {timeframe === "30d" ? "30 days" : timeframe === "1w" ? "1 week" : timeframe === "2d" ? "2 days" : "Last used"}
// //             </button>
// //             <div className="dropdown-menu">
// //               <div className={`dropdown-item ${timeframe === "30d" ? "active" : ""}`} onClick={() => handleTimeframeChange("30d")}>
// //                 30 days
// //               </div>
// //               <div className={`dropdown-item ${timeframe === "1w" ? "active" : ""}`} onClick={() => handleTimeframeChange("1w")}>
// //                 1 week
// //               </div>
// //               <div className={`dropdown-item ${timeframe === "2d" ? "active" : ""}`} onClick={() => handleTimeframeChange("2d")}>
// //                 2 days
// //               </div>
// //               <div className={`dropdown-item ${timeframe === "last" ? "active" : ""}`} onClick={() => handleTimeframeChange("last")}>
// //                 Last used
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       <main className="container">
// //         {/* Welcome & Scan */}
// //         <section className="welcome-card">
// //           <h1>WELCOME BACK{user && `, ${user.email.split("@")[0].toUpperCase()}`}!</h1>
// //           <div className="scan-row">
// //             <input
// //               value={scanQuery}
// //               onChange={(e) => setScanQuery(e.target.value)}
// //               placeholder="Enter URL to scan..."
// //               className="url-input"
// //               onKeyPress={(e) => e.key === "Enter" && startScan()}
// //             />
// //             <button className="scan-btn" onClick={() => startScan()} disabled={isSearching}>
// //               {isSearching ? "Scanning..." : "Scan"}
// //             </button>
// //           </div>
           
// //           {isSearching && (
// //             <div className="progress-area">
// //               <div className="progress-label">Scanning {scanQuery}</div>
// //               <div className="progress-bar" ref={progressRef}>
// //                 <div className="progress-fill" style={{ width: `${progress}%` }} />
// //               </div>
// //               <div className="progress-percent">{Math.floor(progress)}%</div>
// //             </div>
// //           )}
// //         </section>

// //         {/* Charts */}
// //         <section className="widgets">
// //           <div className="card charts">
// //             <div className="chart-tog">
// //               CHARTS
// //               <button className="chart-toggle" onClick={() => setChartType(chartType === "pie" ? "bar" : "pie")}>
// //                 {chartType === "pie" ? "Show Bar" : "Show Pie"}
// //               </button>
// //             </div>
// //             <div className="chart-area">
// //               {chartType === "pie" ? (
// //                 <ResponsiveContainer width="100%" height={300}>
// //                   <PieChart>
// //                     <Pie data={chartData} dataKey="value" cx="50%" cy="50%" outerRadius="70%" label>
// //                       {chartData.map((entry, idx) => (
// //                         <Cell key={idx} fill={entry.color} />
// //                       ))}
// //                     </Pie>
// //                     <Tooltip />
// //                   </PieChart>
// //                 </ResponsiveContainer>
// //               ) : (
// //                 <ResponsiveContainer width="100%" height={300}>
// //                   <BarChart data={chartData}>
// //                     <CartesianGrid strokeDasharray="3 3" />
// //                     <XAxis dataKey="name" />
// //                     <YAxis />
// //                     <Tooltip />
// //                     <Legend />
// //                     <Bar dataKey="value">
// //                       {chartData.map((entry, idx) => (
// //                         <Cell key={idx} fill={entry.color} />
// //                       ))}
// //                     </Bar>
// //                   </BarChart>
// //                 </ResponsiveContainer>
// //               )}
// //             </div>
// //           </div>

// //           <div className="card risks">
// //             <div className="card-head">RISK LEVELS</div>
// //             <div className="risk-chips">
// //               <div className="chip high">High<br /><strong>{severityCounts.high}</strong></div>
// //               <div className="chip medium">Medium<br /><strong>{severityCounts.medium}</strong></div>
// //               <div className="chip low">Low<br /><strong>{severityCounts.low}</strong></div>
// //             </div>
// //           </div>
// //         </section>

// //         {/* Findings Table */}
// //         <section className="findings">
// //           <h2>
// //             FINDINGS {displayedFindings.length > 0 && `(${displayedFindings.length})`} —{" "}
// //             <small>{timeframe}</small>
// //           </h2>

// //           <table className="findings-table">
// //             <thead>
// //               <tr>
// //                 <th>Site</th>
// //                 <th>Vulnerability</th>
// //                 <th>Severity</th>
// //                 <th>Recommendation</th>
// //                 <th>Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {displayedFindings.length === 0 && (
// //                 <tr>
// //                   <td colSpan={5}>No findings yet. Start a scan to see results.</td>
// //                 </tr>
// //               )}

// //               {displayedFindings.map((f) => (
// //                 <React.Fragment key={f.id}>
// //                   <tr>
// //                     <td title={f.site}>{f.site.length > 30 ? f.site.substring(0, 30) + "..." : f.site}</td>
// //                     <td>{f.vulnerability}</td>
// //                     <td className={`severity ${f.severity.toLowerCase()}`}>{f.severity}</td>
// //                     <td title={f.recommendation}>
// //                       {f.recommendation.length > 50 ? f.recommendation.substring(0, 50) + "..." : f.recommendation}
// //                     </td>
// //                     <td className="actions-cell">
// //                       <button
// //                         className="more"
// //                         onClick={() => setActiveActionRow(activeActionRow === f.id ? null : f.id)}
// //                       >
// //                         ...
// //                       </button>
// //                       {activeActionRow === f.id && (
// //                         <div className="action-menu">
// //                           <button
// //                             className="action-item"
// //                             onClick={() => {
// //                               setOpenReportId(openReportId === f.id ? null : f.id);
// //                               setActiveActionRow(null);
// //                             }}
// //                           >
// //                             View Report
// //                           </button>
// //                         </div>
// //                       )}
// //                     </td>
// //                   </tr>

// //                   {/* Inline Info Box */}
// //                   {openReportId === f.id && (
// //                     <tr className="report-row">
// //                       <td colSpan={5}>
// //                         <div className="report-box">
// //                           <h3>{f.vulnerability}</h3>
// //                           <p><strong>Site:</strong> {f.site}</p>
// //                           <p>
// //                             <strong>Severity:</strong>{" "}
// //                             <span className={`severity ${f.severity.toLowerCase()}`}>
// //                               {f.severity}
// //                             </span>
// //                           </p>
// //                           <p><strong>Recommendation:</strong> {f.recommendation}</p>
// //                           <button className="close-btn" onClick={() => setOpenReportId(null)}>
// //                             Close
// //                           </button>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   )}
// //                 </React.Fragment>
// //               ))}
// //             </tbody>
// //           </table>
// //         </section>
// //       </main>

// //       <footer className="foot">Cyra • 2025</footer>
// //     </div>
// //   );
// // }

// // export default Dashboard;

import React, { useState, useRef, useEffect } from "react";
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
import { User, ChevronDown, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Dashboard.css";
import { CiSearch } from "react-icons/ci";
import { RiColorFilterAiFill } from "react-icons/ri";
import { useAuth } from "../AuthContext";
import api from "./axios";

function Dashboard() {
  const [navQuery, setNavQuery] = useState("");
  const [scanQuery, setScanQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanData, setScanData] = useState([]);
  const [currentScanId, setCurrentScanId] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [timeframe, setTimeframe] = useState("30d");
  const [showTimeframe, setShowTimeframe] = useState(false);
  const [activeActionRow, setActiveActionRow] = useState(null);
  const [chartType, setChartType] = useState("pie");
  const [selectedSite, setSelectedSite] = useState(null);
  const [openReportId, setOpenReportId] = useState(null);
  const progressRef = useRef(null);
  const hasProcessedLocation = useRef(false);

  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Theme handling
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-area")) setShowProfileMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch findings for user with timeframe (SIMPLE VERSION - from first dashboard)
  const fetchFindings = async (tf = timeframe) => {
    if (!user) {
      console.log("⚠️ No user, skipping fetch");
      setScanData([]);
      return;
    }

    console.log(`📥 Fetching findings for timeframe: ${tf}`);

    try {
      const res = await api.get(`/api/findings/?timeframe=${tf}`);
      const findings = Array.isArray(res.data) ? res.data : [];
      setScanData(findings);
      localStorage.setItem(`scanData_${user.id}_${tf}`, JSON.stringify(findings));
      console.log(`✅ Loaded ${findings.length} findings for ${tf}`);
    } catch (err) {
      console.error("❌ Error fetching findings:", err);
      const cached = localStorage.getItem(`scanData_${user.id}_${tf}`);
      if (cached) {
        setScanData(JSON.parse(cached));
      } else {
        setScanData([]);
      }
    }
  };

  // Fetch findings on mount and timeframe change
  useEffect(() => {
    if (user) fetchFindings(timeframe);
  }, [user, timeframe]);

  // Handle incoming scan from url.jsx - just populate the input field
  useEffect(() => {
    const incomingUrl = location.state?.scannedUrl;

    if (incomingUrl && !hasProcessedLocation.current) {
      console.log("🔗 Incoming URL detected:", incomingUrl);
      hasProcessedLocation.current = true;
      
      // Just set the URL in the input field - don't auto-scan
      setScanQuery(incomingUrl);
      
      // Clear the location state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  // Reset processed flag when user changes
  useEffect(() => {
    hasProcessedLocation.current = false;
  }, [user]);

  const normalizeFindings = (raw) => {
    if (!Array.isArray(raw)) return [];
    return raw.map((f, idx) => ({
      id: f.id || `finding-${idx}`,
      site: f.url || "Unknown Site",
      vulnerability: f.vulnerability || "Unknown",
      severity: f.severity || "Low",
      recommendation: f.recommendation || "N/A",
      created_at: f.created_at || null,
    }));
  };

  const findings = normalizeFindings(scanData);
  const filteredBySite = selectedSite ? findings.filter((f) => f.site === selectedSite) : findings;

  const q = navQuery.trim().toLowerCase();
  const searchFilteredFindings = q
    ? filteredBySite.filter((f) =>
        [f.site, f.vulnerability, f.severity, f.recommendation]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
    : filteredBySite;

  const displayedFindings = searchFilteredFindings;

  const severityCounts = displayedFindings.reduce(
    (acc, f) => {
      const sev = (f.severity || "low").toLowerCase();
      if (sev === "high") acc.high++;
      else if (sev === "medium") acc.medium++;
      else acc.low++;
      return acc;
    },
    { high: 0, medium: 0, low: 0 }
  );

  const chartData = [
    { name: "High", value: severityCounts.high, color: "#ff4d4f" },
    { name: "Medium", value: severityCounts.medium, color: "#ff9900" },
    { name: "Low", value: severityCounts.low, color: "#2aa952" },
  ];

  // Start scan
  const startScan = async (incomingUrl) => {
    const targetUrl = incomingUrl || scanQuery.trim();
    if (!targetUrl) return alert("Please enter a URL to scan");

    console.log("🚀 Starting scan for:", targetUrl);
    setIsSearching(true);
    setProgress(0);

    try {
      const res = await api.post("/api/scan/", { url: targetUrl });
      console.log("✅ Scan initiated, ID:", res.data.scan_id);
      setCurrentScanId(res.data.scan_id);
      pollScan(res.data.scan_id);
    } catch (err) {
      console.error("❌ Scan start failed:", err);
      setIsSearching(false);
      alert("Failed to start scan");
    }
  };

  // Poll scan (SIMPLE VERSION - from first dashboard)
  const pollScan = (scanId) => {
    let pollCount = 0;
    const maxPolls = 60;

    const interval = setInterval(async () => {
      pollCount++;
      try {
        const res = await api.get(`/api/results/${scanId}/`);
        const scan = res.data;
        const statusStr = (scan.status || "").toLowerCase();

        if (statusStr === "completed") {
          console.log("✅ Scan completed");
          clearInterval(interval);
          setProgress(100);
          await fetchFindings(timeframe); // Refresh ALL findings
          setIsSearching(false);
          setScanQuery("");
          return;
        }

        if (statusStr.startsWith("error")) {
          console.error("❌ Scan failed");
          clearInterval(interval);
          setProgress(0);
          setIsSearching(false);
          alert("Scan failed");
          return;
        }

        if (pollCount >= maxPolls) {
          console.warn("⏰ Polling timeout");
          clearInterval(interval);
          setProgress(100);
          await fetchFindings(timeframe);
          setIsSearching(false);
          setScanQuery("");
          return;
        }

        setProgress((p) => (p >= 95 ? 95 : p + Math.random() * 5 + 2));
      } catch (err) {
        console.error("❌ Polling error:", err);
        clearInterval(interval);
        setIsSearching(false);
        alert("Connection error");
      }
    }, 2000);
  };

  // Timeframe change
  const handleTimeframeChange = async (newTimeframe) => {
    console.log(`🔄 Changing timeframe from ${timeframe} to ${newTimeframe}`);
    setTimeframe(newTimeframe);
    setShowTimeframe(false);
    await fetchFindings(newTimeframe);
  };

  // Logout
  const handleLogout = () => {
    if (user?.id) {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(`scanData_${user.id}_`)) localStorage.removeItem(key);
      });
    }
    setScanData([]);
    logout();
    navigate("/");
  };

  return (
    <div className={`dashboard-root ${theme}`}>
      {/* Topbar */}
      <header className="topbar">
        <div className="brand" onClick={() => navigate("/")}>CYRA</div>
        <div className="search-wrapper">
          <input
            value={navQuery}
            onChange={(e) => setNavQuery(e.target.value)}
            placeholder="Search reports, findings..."
            className="search-input"
          />
          <button className="feature-btn">
            <CiSearch />
          </button>
        </div>

        <button className="feature-icon" onClick={() => setShowTimeframe(!showTimeframe)}>
          <RiColorFilterAiFill />
        </button>

        <div className="profile-area">
          <div className="profile-trigger" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <User size={20} />
            {user?.email && <span>{user.email}</span>}
            {!loading && <ChevronDown size={16} />}
          </div>

          {showProfileMenu && (
            <div className="profile-dropdown-menu">
              {user && <div className="dropdown-header">{user.email}</div>}
              <div className="dropdown-divider" />
              <button className="dropdown-item" onClick={toggleTheme}>
                Theme
              </button>
              <button className="dropdown-item logout-btn" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="scan-controls">
        {showTimeframe && (
          <div className="timeframes-dropdown">
            <button className="tf active">
              {timeframe === "30d" ? "30 days" : timeframe === "1w" ? "1 week" : timeframe === "2d" ? "2 days" : "Last used"}
            </button>
            <div className="dropdown-menu">
              <div className={`dropdown-item ${timeframe === "30d" ? "active" : ""}`} onClick={() => handleTimeframeChange("30d")}>
                30 days
              </div>
              <div className={`dropdown-item ${timeframe === "1w" ? "active" : ""}`} onClick={() => handleTimeframeChange("1w")}>
                1 week
              </div>
              <div className={`dropdown-item ${timeframe === "2d" ? "active" : ""}`} onClick={() => handleTimeframeChange("2d")}>
                2 days
              </div>
              <div className={`dropdown-item ${timeframe === "last" ? "active" : ""}`} onClick={() => handleTimeframeChange("last")}>
                Last used
              </div>
            </div>
          </div>
        )}
      </div>

      <main className="container">
        {/* Welcome & Scan */}
        <section className="welcome-card">
          <h1>WELCOME BACK{user && `, ${user.email.split("@")[0].toUpperCase()}`}!</h1>
          <div className="scan-row">
            <input
              value={scanQuery}
              onChange={(e) => setScanQuery(e.target.value)}
              placeholder="Enter URL to scan..."
              className="url-input"
              onKeyPress={(e) => e.key === "Enter" && startScan()}
            />
            <button className="scan-btn" onClick={() => startScan()} disabled={isSearching}>
              {isSearching ? "Scanning..." : "Scan"}
            </button>
          </div>
           
          {isSearching && (
            <div className="progress-area">
              <div className="progress-label">Scanning {scanQuery}</div>
              <div className="progress-bar" ref={progressRef}>
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="progress-percent">{Math.floor(progress)}%</div>
            </div>
          )}
        </section>

        {/* Charts */}
        <section className="widgets">
          <div className="card charts">
            <div className="chart-tog">
              CHARTS
              <button className="chart-toggle" onClick={() => setChartType(chartType === "pie" ? "bar" : "pie")}>
                {chartType === "pie" ? "Show Bar" : "Show Pie"}
              </button>
            </div>
            <div className="chart-area">
              {chartType === "pie" ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={chartData} dataKey="value" cx="50%" cy="50%" outerRadius="70%" label>
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
                    <YAxis />
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
              <div className="chip high">High<br /><strong>{severityCounts.high}</strong></div>
              <div className="chip medium">Medium<br /><strong>{severityCounts.medium}</strong></div>
              <div className="chip low">Low<br /><strong>{severityCounts.low}</strong></div>
            </div>
          </div>
        </section>

        {/* Findings Table */}
        <section className="findings">
          <h2>
            FINDINGS {displayedFindings.length > 0 && `(${displayedFindings.length})`} —{" "}
            <small>{timeframe}</small>
          </h2>

          <table className="findings-table">
            <thead>
              <tr>
                <th>Site</th>
                <th>Vulnerability</th>
                <th>Severity</th>
                <th>Recommendation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedFindings.length === 0 && (
                <tr>
                  <td colSpan={5}>No findings yet. Start a scan to see results.</td>
                </tr>
              )}

              {displayedFindings.map((f) => (
                <React.Fragment key={f.id}>
                  <tr>
                    <td title={f.site}>{f.site.length > 30 ? f.site.substring(0, 30) + "..." : f.site}</td>
                    <td>{f.vulnerability}</td>
                    <td className={`severity ${f.severity.toLowerCase()}`}>{f.severity}</td>
                    <td title={f.recommendation}>
                      {f.recommendation.length > 50 ? f.recommendation.substring(0, 50) + "..." : f.recommendation}
                    </td>
                    <td className="actions-cell">
                      <button
                        className="more"
                        onClick={() => setActiveActionRow(activeActionRow === f.id ? null : f.id)}
                      >
                        ...
                      </button>
                      {activeActionRow === f.id && (
                        <div className="action-menu">
                          <button
                            className="action-item"
                            onClick={() => {
                              setOpenReportId(openReportId === f.id ? null : f.id);
                              setActiveActionRow(null);
                            }}
                          >
                            View Report
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>

                  {/* Inline Info Box */}
                  {openReportId === f.id && (
                    <tr className="report-row">
                      <td colSpan={5}>
                        <div className="report-box">
                          <h3>{f.vulnerability}</h3>
                          <p><strong>Site:</strong> {f.site}</p>
                          <p>
                            <strong>Severity:</strong>{" "}
                            <span className={`severity ${f.severity.toLowerCase()}`}>
                              {f.severity}
                            </span>
                          </p>
                          <p><strong>Recommendation:</strong> {f.recommendation}</p>
                          <button className="close-btn" onClick={() => setOpenReportId(null)}>
                            Close
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
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