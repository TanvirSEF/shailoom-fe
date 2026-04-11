import axios from "axios";
import { useAuthStore } from "@/store/use-auth-store";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the auth token if available
apiClient.interceptors.request.use(
  (config) => {
    // Get the token directly from the Zustand store's state
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle global errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling (e.g., redirect to login on 401)
    if (error.response?.status === 401) {
      // Clear token and redirect if needed
    }
    return Promise.reject(error);
  }
);

export default apiClient;
