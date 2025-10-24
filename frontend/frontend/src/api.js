// src/api.js
import axios from "axios";
const API_ROOT = process.env.REACT_APP_API_URL || "http://127.0.0.1:3001";
export const api = axios.create({ baseURL: `${API_ROOT}/api`, timeout: 10000 });

export const Users = {
  list:   ()        => api.get("/users"),
  add:    (payload) => api.post("/users", payload),
  update: (id,pay)  => api.put(`/users/${id}`, pay),
  remove: (id)      => api.delete(`/users/${id}`),
};
