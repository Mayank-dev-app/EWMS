import axios from "axios";

const api = axios.create({
  baseURL: "https://ewms-537h.onrender.com/api",
});

// attach token from localStorage for each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

export default api;
