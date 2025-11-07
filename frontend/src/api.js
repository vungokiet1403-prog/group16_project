import axios from "axios";

const API_ROOT = process.env.REACT_APP_API_URL || "http://localhost:3001";
export const api = axios.create({ baseURL: `${API_ROOT}/api` });

api.interceptors.request.use(cfg => {
  const t = localStorage.getItem("token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

api.interceptors.response.use(
  r => r,
  e => {
    if (e?.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.assign("/login");
    }
    return Promise.reject(e);
  }
);

console.log("API base:", api.defaults.baseURL);

export const Auth = {
  forgot: (email) => api.post("/auth/forgot-password", { email }),
  reset:  (token, newPassword) => api.post("/auth/reset-password", { token, newPassword }),
  signup: (payload) => api.post("/auth/signup", payload),
  login:  (payload) => api.post("/auth/login", payload),
  me:     () => api.get("/auth/me"),
  logout: () => localStorage.removeItem("token"),

  updateMe: (payload) => api.put("/auth/me", payload),
  uploadAvatar: (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return api.post("/auth/upload-avatar", fd, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },
};

export const Profile = {
  get:    () => api.get("/profile"),
  update: (payload) => api.put("/profile", payload),
};
export const Users = {
  list: () => api.get("/users"),
  remove: (id) => api.delete(`/users/${id}`),
};
