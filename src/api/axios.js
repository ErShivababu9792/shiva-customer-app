import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

const getCsrfTokenFromCookie = () => {
  const match = document.cookie.match(/(?:^|;\s*)shiva_csrf_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

api.interceptors.request.use((config) => {
  const method = (config.method || "get").toUpperCase();
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const token = getCsrfTokenFromCookie();
    if (token) config.headers["X-CSRF-Token"] = token;
  }
  return config;
});

export default api;