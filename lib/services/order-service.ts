import apiClient from "../api-client";

interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

interface PlaceOrderData {
  shipping_address: string;
  shipping_zone: string;
  phone_number: string;
  total_amount: number;
  payment_method: string;
  coupon_code?: string;
  items: OrderItem[];
}

export const orderService = {
  placeOrder: (data: PlaceOrderData) => apiClient.post("/orders", data),
  validateCoupon: (code: string, orderValue: number) =>
    apiClient.get("/orders/validate-coupon", {
      params: { code, order_value: orderValue },
    }),
  getMyOrders: () => apiClient.get("/orders/my-orders"),
  getOrderDetail: (trackingId: string) =>
    apiClient.get(`/orders/detail/${trackingId}`),
  cancelOrder: (trackingId: string) =>
    apiClient.patch(`/orders/${trackingId}/cancel`),
  trackOrder: (trackingId: string) =>
    apiClient.get(`/orders/track/${trackingId}`),
};
