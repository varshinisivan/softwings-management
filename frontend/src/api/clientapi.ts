import axios from "axios";

/**
 * ✅ Use correct env variable
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * ❌ If env is missing → fail early (important)
 */
if (!BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not defined in environment variables");
}

/**
 * ✅ Axios instance (clean + reusable)
 */
const api = axios.create({
  baseURL: `${BASE_URL}/api/clients`,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * ✅ Attach token automatically
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
 * ✅ Global error handler
 */
const handleError = (error: any, defaultMessage: string) => {
  console.error("API Error:", error);

  if (error.response) {
    const message =
      error.response.data?.message || error.response.statusText;

    if (error.response.status === 401) {
      // Optional: auto logout
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/signin";
    }

    throw new Error(message);
  } else if (error.request) {
    throw new Error("Server not responding. Try again later.");
  } else {
    throw new Error(error.message || defaultMessage);
  }
};

/**
 * ================= ADD CLIENT =================
 */
export const addClient = async (clientData: any) => {
  try {
    const response = await api.post("/", clientData);
    return response.data;
  } catch (error: any) {
    handleError(error, "Failed to add client");
  }
};

/**
 * ================= GET ALL CLIENTS =================
 */
export const getAllClients = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error: any) {
    handleError(error, "Failed to fetch clients");
  }
};

/**
 * ================= UPDATE CLIENT =================
 */
export const updateClient = async (id: string, clientData: any) => {
  try {
    const response = await api.put(`/${id}`, clientData);
    return response.data;
  } catch (error: any) {
    handleError(error, "Failed to update client");
  }
};

/**
 * ================= DELETE CLIENT =================
 */
export const deleteClient = async (id: string) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error: any) {
    handleError(error, "Failed to delete client");
  }
};