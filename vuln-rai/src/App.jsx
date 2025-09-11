// App.jsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./components/Home";
import Urls from "./components/Urls";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Dashboard from "./components/Dashboard";
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />       {/* Home page */}
        <Route path="/Urls" element={<Urls />} /> {/* Scanner page */}
         <Route path="/Signup" element={<Signup />} />
          <Route path="/Signin" element={<Signin />} />
        <Route path="/Dashboard" element={<Dashboard />} /> {/* Dashboard page */}
      </Routes>
    </Router>
  );
}

export default App;
