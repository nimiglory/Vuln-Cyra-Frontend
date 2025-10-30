import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 due to expired token and refresh exists
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");
      if (refresh) {
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/auth/token/refresh/`,
            { refresh }
          );

          const newAccess = res.data.access;
          localStorage.setItem("access", newAccess);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return api(originalRequest);
        } catch (err) {
          // Refresh failed → force logout
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          window.location.reload();
        }
      }
    }
    return Promise.reject(error);
  }
);

export const signup = (userData) => api.post("/api/signup/", userData);
export const signin = (credentials) => api.post("/api/signin/", credentials);

export default api;