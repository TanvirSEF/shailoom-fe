import apiClient from "../api-client";

export const userService = {
  getProfile: () => apiClient.get("/users/me"),
  updateProfile: (data: any) => apiClient.put("/users/me", data),
  getWishlist: () => apiClient.get("/users/me/wishlist"),
  addToWishlist: (productId: string | number) => 
    apiClient.post(`/users/me/wishlist/${productId}`),
  removeFromWishlist: (productId: string | number) => 
    apiClient.delete(`/users/me/wishlist/${productId}`),
};
