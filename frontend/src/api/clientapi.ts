import axios from "axios";

const API_URL = "http://localhost:5000/api/clients";

export const addClient = async (clientData: any, token: string) => {
  return await axios.post(`${API_URL}/add`, clientData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getAllClients = async (token: string) => {
  return await axios.get(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// You can also add updateClient and deleteClient later