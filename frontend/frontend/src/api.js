import axios from "axios";
const API_ROOT = process.env.REACT_APP_API_URL || "http://localhost:5000";
export const api = axios.create({
  baseURL: `${API_ROOT}/api`,
  headers: { "Content-Type": "application/json" },
});
