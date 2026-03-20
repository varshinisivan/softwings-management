import axios from "axios";

// Use your deployed backend URL in production
const API_URL = `${import.meta.env.VITE_API_URL}/api/clients`;

// ================= ADD CLIENT =================
export const addClient = async (clientData: any, token: string) => {
  return await axios.post(API_URL, clientData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ================= GET ALL CLIENTS =================
export const getAllClients = async (token: string) => {
  return await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ================= UPDATE CLIENT =================
export const updateClient = async (id: string, clientData: any, token: string) => {
  return await axios.put(`${API_URL}/${id}`, clientData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ================= DELETE CLIENT =================
export const deleteClient = async (id: string, token: string) => {
  return await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};