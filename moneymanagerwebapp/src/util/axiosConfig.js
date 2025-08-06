import axios from "axios";
import { BASE_URL } from "./apiEndpoints";  // Import BASE_URL from apiEndpoints

const axiosConfig = axios.create({
  baseURL: BASE_URL,  // Now properly defined
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  },
  timeout: 10000 // 10 seconds timeout
});

// List of endpoints that do not require authorization header
const excludeEndpoints = ["/login", "/register", "/status", "/activate", "/health"];

// Request interceptor
axiosConfig.interceptors.request.use(
  (config) => {
    const shouldSkipToken = excludeEndpoints.some((endpoint) => 
      config.url?.includes(endpoint)
    );
    
    if (!shouldSkipToken) {
      const accessToken = localStorage.getItem("token");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosConfig.interceptors.response.use(
  (response) => {
    return response.data;  // Directly return response data
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          window.location.href = "/login";
          break;
        case 403:
          console.error("Forbidden: You don't have permission");
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 500:
          console.error("Server Error. Please try again later");
          break;
        default:
          console.error(`Request failed with status ${error.response.status}`);
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Please try again.");
    } else {
      console.error("Request failed:", error.message);
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default axiosConfig;