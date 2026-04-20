import apiClient from "../api-client";

export interface Coupon {
  _id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_value: number;
  start_date: string;
  end_date: string;
  usage_limit: number;
  used_count: number;
  is_active: boolean;
  status: "active" | "inactive" | "expired" | "used_up" | "scheduled";
}

export interface CreateCouponData {
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_value?: number;
  usage_limit?: number;
  end_date: string;
}

export const adminService = {
  // Orders
  getAllOrders: () => apiClient.get("/admin/orders"),
  updateOrderStatus: (trackingId: string, status: string) => 
    apiClient.patch(`/admin/orders/${trackingId}`, { status }),

  // Analytics
  getSalesAnalytics: () => apiClient.get("/admin/analytics/sales"),
  getTopCustomers: () => apiClient.get("/admin/analytics/top-customers"),
  getRevenueChart: () => apiClient.get("/admin/analytics/revenue-chart"),
  getLowStockAlerts: () => apiClient.get("/admin/analytics/low-stock"),

  // Audit
  getAuditLogs: () => apiClient.get("/admin/audit-logs"),

  // Users
  getAllUsers: () => apiClient.get("/admin/users"),
  updateUserRole: (email: string, role: string) => 
    apiClient.patch(`/admin/users/${email}/role`, { role }),

  // Coupons
  getAllCoupons: () => apiClient.get("/admin/coupons"),
  createCoupon: (data: CreateCouponData) => apiClient.post("/admin/coupons", data),
  deactivateCoupon: (code: string) => apiClient.delete(`/admin/coupons/${code}`),
  activateCoupon: (code: string) => apiClient.patch(`/admin/coupons/${code}/activate`),
  deleteCoupon: (code: string) => apiClient.delete(`/admin/coupons/${code}/delete`),
};
