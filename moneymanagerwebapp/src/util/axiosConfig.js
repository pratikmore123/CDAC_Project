<<<<<<< HEAD
// src/util/axiosConfig.js
import axios from "axios";
import { BASE_URL } from "./apiEndpoints";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  // You can add other common headers here
  },
  timeout: 10000,
  // You can add other axios default configurations here
});

// Request interceptor for adding token
axiosInstance.interceptors.request.use(
  (config) => {
    // Avoid modifying the original config
    const newConfig = { ...config };
    
    const token = localStorage.getItem("token");
    if (token) {
      newConfig.headers.Authorization = `Bearer ${token}`;
    }
    return newConfig;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lies within the range of 2xx causes this function to trigger
    return response.data; // Typically you want to return just the data
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx causes this function to trigger
    if (error.response) {
      // The request was made and the server responded with a status code
      if (error.response.status === 401 || error.response.status === 403) {
        // Handle unauthorized or forbidden responses
        localStorage.removeItem("token");
        // Consider using a more framework-agnostic approach for redirection
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Request setup error:", error.message);
    }
    
=======
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
>>>>>>> 615710988a6ecef8bd4a45833db1a4f5089e5d3f
    return Promise.reject(error);
  }
);

<<<<<<< HEAD
export default axiosInstance;
=======
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
>>>>>>> 615710988a6ecef8bd4a45833db1a4f5089e5d3f
