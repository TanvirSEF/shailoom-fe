import apiClient from "../api-client";

export const authService = {
  signup: (data: any) => apiClient.post("/auth/signup", data),
  login: (data: any) => apiClient.post("/auth/login", data),
  refreshToken: () => apiClient.post("/auth/refresh"),
  forgotPassword: (email: string) => apiClient.post("/auth/forgot-password", { email }),
  resetPassword: (data: any) => apiClient.post("/auth/reset-password", data),
};
