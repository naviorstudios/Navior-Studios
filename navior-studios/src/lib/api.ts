import axios from "axios";

// NAVIOR STATION HUB: Configuration
// This instance directs all missions to the dedicated Backend on Port 5000.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
