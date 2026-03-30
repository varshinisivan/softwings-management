import api from "./api"; // your axios instance

export const getRenewals = async () => {
  const response = await api.get("/renewals");
  return response.data;
};