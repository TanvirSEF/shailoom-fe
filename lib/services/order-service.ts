import apiClient from "../api-client";

export const orderService = {
  placeOrder: (data: any) => apiClient.post("/orders", data),
  validateCoupon: (code: string) => 
    apiClient.get("/orders/validate-coupon", { params: { code } }),
  getMyOrders: () => apiClient.get("/orders/my-orders"),
  getOrderDetail: (trackingId: string) => 
    apiClient.get(`/orders/detail/${trackingId}`),
  cancelOrder: (trackingId: string) => 
    apiClient.patch(`/orders/${trackingId}/cancel`),
  trackOrder: (trackingId: string) => 
    apiClient.get(`/orders/track/${trackingId}`),
};
