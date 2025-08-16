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
    
    return Promise.reject(error);
  }
);

export default axiosInstance;