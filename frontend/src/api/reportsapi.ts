import api from "./api";

// ✅ Get Profit Report
export const getProfitReport = async () => {
  const response = await api.get("/reports/profit");
  return response.data;
};