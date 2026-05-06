import apiClient from "../api-client";
import { PaginatedProductsResponse } from "@/types/product";

export const productService = {
  getProducts: (params?: Record<string, unknown>) =>
    apiClient.get<PaginatedProductsResponse>("/products", { params }),
  createProduct: (formData: FormData) =>
    apiClient.post("/products", formData, {
      headers: { "Content-Type": undefined },
    }),
  getSuggestions: (query: string) =>
    apiClient.get("/products/search/suggestions", { params: { q: query } }),
  deleteProduct: (productId: string | number) =>
    apiClient.delete(`/products/${productId}`),
  updateProduct: (productId: string | number, formData: FormData) =>
    apiClient.patch(`/products/${productId}`, formData, {
      headers: { "Content-Type": undefined },
    }),
  getReviews: (productId: string | number) => 
    apiClient.get(`/products/${productId}/reviews`),
  submitReview: (productId: string | number, data: any) => 
    apiClient.post(`/products/${productId}/reviews`, data),
};
