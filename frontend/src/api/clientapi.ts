import axios from "axios";

/**
 * ✅ Use correct env variable with fallback
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://softwings-management-ram1.onrender.com";

if (!BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not defined");
}

/**
 * ✅ Correct baseURL (FIXED)
 */
const api = axios.create({
  baseURL: `${BASE_URL}/api`, // ✅ FIXED HERE
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
    const response = await api.post("/clients", clientData);
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
    const response = await api.get("/clients");
    return response.data;
  } catch (error: any) {
    handleError(error, "Failed to fetch clients");
  }
};

/**
 * ================= GET CLIENT BY ID =================
 */
export const getClientById = async (id: string) => {
  try {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  } catch (error: any) {
    handleError(error, "Failed to fetch client");
  }
};

/**
 * ================= UPDATE CLIENT =================
 */
export const updateClient = async (id: string, clientData: any) => {
  try {
    const response = await api.put(`/clients/${id}`, clientData);
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
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  } catch (error: any) {
    handleError(error, "Failed to delete client");
  }
};

/**
 * ================= UPDATE SERVICE =================
 */
export const updateService = async (clientId: string, serviceId: string, serviceData: any) => {
  try {
    const response = await api.put(`/clients/${clientId}/services/${serviceId}`, serviceData);
    return response.data;
  } catch (error: any) {
    handleError(error, "Failed to update service");
  }
};

/**
 * ================= DELETE SERVICE =================
 */
export const deleteService = async (clientId: string, serviceId: string) => {
  try {
    const response = await api.delete(`/clients/${clientId}/services/${serviceId}`);
    return response.data;
  } catch (error: any) {
    handleError(error, "Failed to delete service");
  }
};

/**
 * ================= ADD SERVICE =================
 */
export const addService = async (clientId: string, serviceData: any) => {
  try {
    const response = await api.post(`/clients/${clientId}/services`, serviceData);
    return response.data;
  } catch (error: any) {
    handleError(error, "Failed to add service");
  }
};

export default api;