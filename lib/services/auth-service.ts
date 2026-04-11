import { SignupValues, LoginValues } from "../validations/auth.schema";
import apiClient from "../api-client";
import { AuthResponse } from "@/types/auth";

export const authService = {
  signup: async (data: SignupValues) => {
    const response = await apiClient.post<AuthResponse>("/auth/signup", data);
    return response.data;
  },
  login: async (data: LoginValues) => {
    const formData = new URLSearchParams();
    formData.append("username", data.email);
    formData.append("password", data.password);
    
    const response = await apiClient.post<AuthResponse>("/auth/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  },
  refreshToken: async () => {
    const response = await apiClient.post<AuthResponse>("/auth/refresh");
    return response.data;
  },
  forgotPassword: async (email: string) => {
    const response = await apiClient.post<{ message: string }>("/auth/forgot-password", { email });
    return response.data;
  },
  resetPassword: async (data: any) => {
    const response = await apiClient.post<{ message: string }>("/auth/reset-password", data);
    return response.data;
  },
};
