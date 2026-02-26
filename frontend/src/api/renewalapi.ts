import axios from "axios";

const API_URL = "http://localhost:5000/api/renewals";

export const getRenewals = async (token: string) => {
  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
};