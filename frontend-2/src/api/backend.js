import axios from "axios";

// Central API client – keep baseURL aligned with backend
const api = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

export default api;

