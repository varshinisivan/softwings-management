import axios from "axios";

// Use your deployed backend URL in production
const API_URL = `${import.meta.env.VITE_API_URL}/api/clients`;

// ================= ADD CLIENT =================
export const addClient = async (clientData: any, token: string) => {
  try {
    const response = await axios.post(API_URL, clientData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Add Client Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to add client"
    );
  }
};

// ================= GET ALL CLIENTS =================
export const getAllClients = async (token: string) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Get All Clients Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch clients"
    );
  }
};

// ================= UPDATE CLIENT =================
export const updateClient = async (id: string, clientData: any, token: string) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, clientData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Update Client Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update client"
    );
  }
};

// ================= DELETE CLIENT =================
export const deleteClient = async (id: string, token: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Delete Client Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to delete client"
    );
  }
};