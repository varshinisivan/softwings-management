import api from "./api"; // your axios instance

export const getDashboardOverview = async () => {
  const response = await api.get("/dashboard/overview");
  return response.data;
};