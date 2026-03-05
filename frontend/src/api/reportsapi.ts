import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ✅ Get Profit Report
export const getProfitReport = async () => {
  const response = await API.get("/reports/profit");
  return response.data;
};