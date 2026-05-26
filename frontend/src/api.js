import axios from "axios";

export const api = axios.create({
  baseURL: "https://aircare-ai-5p92.onrender.com/api"
});