import apiClient from "../api-client"

import { User, UserUpdate } from "@/types/auth"
import type { Address } from "@/types/user"

export const userService = {
  getProfile: async () => {
    const response = await apiClient.get<User>("/users/me")
    return response.data
  },
  updateProfile: async (data: UserUpdate) => {
    const response = await apiClient.put<User>("/users/me", data)
    return response.data
  },
  getAddresses: async () => {
    const response = await apiClient.get<Address[]>("/users/me/addresses")
    return response.data
  },
  addAddress: async (address: Omit<Address, "id">) => {
    const response = await apiClient.post("/users/me/addresses", address)
    return response.data
  },
  setDefaultAddress: async (addressId: string) => {
    const response = await apiClient.patch(`/users/me/addresses/${addressId}`)
    return response.data
  },
  deleteAddress: async (addressId: string) => {
    const response = await apiClient.delete(`/users/me/addresses/${addressId}`)
    return response.data
  },
  getWishlist: async () => {
    const response = await apiClient.get("/users/me/wishlist")
    return response.data
  },
  addToWishlist: async (productId: string | number) => {
    const response = await apiClient.post(`/users/me/wishlist/${productId}`)
    return response.data
  },
  removeFromWishlist: async (productId: string | number) => {
    const response = await apiClient.delete(`/users/me/wishlist/${productId}`)
    return response.data
  },
}

