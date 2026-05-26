import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://aircare-ai-5p92.onrender.com/api"
});
