import axios from "axios";
const API_ROOT = process.env.REACT_APP_API_URL || "http://127.0.0.1:3001";

export const api = axios.create({
  baseURL: `${API_ROOT}/api`,
  timeout: 10000,
});

// Log để nhìn URL thật (tạm thời, có thể xóa sau)
console.log("API baseURL =", api.defaults.baseURL);

export const Users = {
  list:   () => api.get("/users"),
  add:    (payload)     => api.post(`/users`, payload),
  update: (id, payload) => api.put(`/users/${id}`, payload),
  remove: (id)          => api.delete(`/users/${id}`),
};
