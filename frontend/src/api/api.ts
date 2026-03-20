import axios from "axios";

/**
 * Base API URL
 */
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

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
    // Log full error in console for debugging
    console.error("API Error:", error);

    // Provide a friendly error message for frontend
    const message =
      error.response?.data?.message ||
      error.message ||
      "Network or server error. Please try again later.";

    return Promise.reject(new Error(message));
  }
);

export default api;