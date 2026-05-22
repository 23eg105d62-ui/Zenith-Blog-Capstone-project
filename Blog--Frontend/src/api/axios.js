import axios from "axios";

// Create an axios instance with a base URL
const API = axios.create({
    // Use VITE_API_URL if provided, else use relative path (works for same-origin production)
    // In development, you might still want http://localhost:4000 if running separately
    baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:4000"),
    withCredentials: true,
});

export default API;
