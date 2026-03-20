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
    console.error("API Error Details:", error);

    // Friendly and more descriptive error messages for live
    if (error.response) {
      // Server responded with a status outside 2xx
      const status = error.response.status;
      const serverMessage = error.response.data?.message || error.response.statusText;
      return Promise.reject(new Error(`Server Error (${status}): ${serverMessage}`));
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject(new Error("No response from server. Please check your network or try again later."));
    } else {
      // Something else happened while setting up the request
      return Promise.reject(new Error(`Request setup error: ${error.message}`));
    }
  }
);

export default api;