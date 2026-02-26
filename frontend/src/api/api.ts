// src/api/api.ts

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
 * Helper function to set or remove Authorization header
 */
export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common[
      "Authorization"
    ];
  }
}

/**
 * 🔥 IMPORTANT FIX
 * Automatically attach token on app start
 */
const token = localStorage.getItem("token");
if (token) {
  setAuthToken(token);
}

export default api;