// src/api/api.ts

import axios from "axios";

/**
 * Base API URL
 */
const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

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

export default api;