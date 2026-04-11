import apiClient from "../api-client";

import { User, UserUpdate } from "@/types/auth";

export const userService = {
  getProfile: async () => {
    const response = await apiClient.get<User>("/users/me");
    return response.data;
  },
  updateProfile: async (data: UserUpdate) => {
    const response = await apiClient.put<User>("/users/me", data);
    return response.data;
  },
  getWishlist: async () => {
    const response = await apiClient.get("/users/me/wishlist");
    return response.data;
  },
  addToWishlist: async (productId: string | number) => {
    const response = await apiClient.post(`/users/me/wishlist/${productId}`);
    return response.data;
  },
  removeFromWishlist: async (productId: string | number) => {
    const response = await apiClient.delete(`/users/me/wishlist/${productId}`);
    return response.data;
  },
};

