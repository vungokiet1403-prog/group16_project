// src/api.js
import axios from "axios";

const BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:3001";
export const API = axios.create({ baseURL: `${BASE}/api` });

API.interceptors.request.use(cfg => {
  const t = localStorage.getItem("access");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
API.interceptors.response.use(r=>r, async err=>{
  const orig = err.config || {};
  if (err.response?.status === 401 && !orig._retry) {
    orig._retry = true;
    const refresh = localStorage.getItem("refresh");
    if (refresh) {
      const { data } = await API.post("/auth/refresh", { refresh });
      localStorage.setItem("access", data.access);
      if (data.refresh) localStorage.setItem("refresh", data.refresh);
      orig.headers = orig.headers || {};
      orig.headers.Authorization = `Bearer ${data.access}`;
      return API(orig);
    }
  }
  throw err;
});

export const Auth = {
  signup: (body) => API.post("/auth/signup", body),
  login:  (body) => API.post("/auth/login", body),
  me:     () => API.get("/auth/me"),
  logout: () => API.post("/auth/logout", { refresh: localStorage.getItem("refresh") }),
  forgot: (email) => API.post("/auth/forgot-password", { email }),
  resetByParam: (token, newPassword) => API.post(`/auth/reset-password/${token}`, { newPassword }),
  uploadAvatar: (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return API.post("/auth/upload-avatar", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  updateMe: (body) => API.put("/auth/me", body),
};

export const Users = {
  list:   () => API.get("/users"),
  remove: (id) => API.delete(`/users/${id}`),
  // >>> THÊM DÒNG NÀY <<<
  update: (id, body) => API.put(`/users/${id}`, body),
};
