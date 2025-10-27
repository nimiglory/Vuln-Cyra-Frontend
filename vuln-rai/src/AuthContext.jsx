// import { createContext, useState, useEffect, useContext } from "react";
// import api, { signin } from "./components/axios";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Check if user already logged in
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await api.get("api/me/"); // endpoint must return user info
//         setUser(res.data);
//       } catch {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, []);

//   const login = async (credentials) => {
//     const res = await signin(credentials); // returns tokens
//     localStorage.setItem("access", res.data.access);
//     localStorage.setItem("refresh", res.data.refresh);

//     // Fetch user info after login
//     const userRes = await api.get("api/me/");
//     setUser(userRes.data);
//   };

//   const logout = async () => {
//     await api.post("api/logout/"); // optional backend logout
//     localStorage.removeItem("access");
//     localStorage.removeItem("refresh");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import { createContext, useState, useEffect, useContext } from "react";
import api, { signin, signup } from "./components/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user already logged in
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access");
        console.log("🔍 Checking for stored token:", token ? "Found" : "Not found");
        
        if (token) {
          // Set the authorization header
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          console.log("🔄 Fetching user data...");
          const res = await api.get("/api/me/"); // Make sure this matches your backend
          console.log("✅ User data fetched:", res.data);
          setUser(res.data);
        } else {
          console.log("❌ No token found");
        }
      } catch (error) {
        console.error("❌ Failed to fetch user:", error.response?.data || error.message);
        // If token is invalid, clear it
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
      } finally {
        setLoading(false);
        console.log("🏁 Auth loading complete");
      }
    };
    fetchUser();
  }, []);

  const login = async (credentials) => {
    try {
      console.log("🔄 Attempting login with:", credentials);
      const res = await signin(credentials);
      console.log("✅ Login response:", res.data);
      
      // Store tokens (your backend returns 'access' and 'refresh')
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      console.log("💾 Tokens stored");

      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;

      // Fetch user info after login
      console.log("🔄 Fetching user data after login...");
      const userRes = await api.get("/api/me/");
      console.log("✅ User data after login:", userRes.data);
      setUser(userRes.data);
      
      return { success: true, message: res.data.message };
    } catch (error) {
      console.error("❌ Login failed:", error.response?.data || error.message);
      return { 
        success: false, 
        message: error.response?.data?.non_field_errors?.[0] || 
                 error.response?.data?.detail || 
                 'Invalid email or password' 
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log("🔄 Attempting signup with:", userData);
      const res = await signup(userData);
      console.log("✅ Signup response:", res.data);
      
      // Store tokens (your backend returns 'access' and 'refresh')
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      console.log("💾 Tokens stored after signup");

      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;

      // Fetch user info after signup
      console.log("🔄 Fetching user data after signup...");
      const userRes = await api.get("/api/me/");
      console.log("✅ User data after signup:", userRes.data);
      setUser(userRes.data);
      
      return { success: true, message: res.data.message };
    } catch (error) {
      console.error("❌ Signup failed:", error.response?.data || error.message);
      return { 
        success: false, 
        message: error.response?.data?.email?.[0] || 
                 error.response?.data?.detail || 
                 'Signup failed' 
      };
    }
  };

  const logout = async () => {
    try {
      console.log("🔄 Logging out...");
      // Note: Your backend doesn't have a logout endpoint, so we'll just do client-side logout
    } catch (error) {
      console.error("❌ Backend logout failed:", error);
    }
    
    // Clear tokens and state
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    console.log("✅ Logged out successfully");
  };

  // Debug log whenever user state changes
  useEffect(() => {
    console.log("👤 User state changed:", user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);