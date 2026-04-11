import apiClient from "../api-client";

export const productService = {
  getProducts: (params?: any) => apiClient.get("/products", { params }),
  createProduct: (data: any) => apiClient.post("/products", data),
  getSuggestions: (query: string) => 
    apiClient.get("/products/search/suggestions", { params: { query } }),
  deleteProduct: (productId: string | number) => 
    apiClient.delete(`/products/${productId}`),
  getReviews: (productId: string | number) => 
    apiClient.get(`/products/${productId}/reviews`),
  submitReview: (productId: string | number, data: any) => 
    apiClient.post(`/products/${productId}/reviews`, data),
};
