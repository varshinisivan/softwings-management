import axios from "axios";

/**
 * Base API URL
 * 🔥 FIX: Use correct env variable + correct fallback
 */
const API_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://softwings-management-ram1.onrender.com"; // ✅ production fallback

console.log("API URL:", API_URL);

/**
 * Axios instance
 */
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 🔥 Attach token automatically BEFORE EVERY request
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * 🔥 Response interceptor to handle errors globally
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error Details:", error);

    if (error.response) {
      const status = error.response.status;
      const serverMessage =
        error.response.data?.message || error.response.statusText;

      // 🔥 Auto logout if unauthorized
      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/signin";
      }

      return Promise.reject(
        new Error(`Server Error (${status}): ${serverMessage}`)
      );
    } else if (error.request) {
      return Promise.reject(
        new Error(
          "No response from server. Please wait a few seconds and try again."
        )
      );
    } else {
      return Promise.reject(
        new Error(`Request setup error: ${error.message}`)
      );
    }
  }
);

export default api;