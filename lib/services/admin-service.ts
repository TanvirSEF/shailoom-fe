import apiClient from "../api-client";

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
  createCoupon: (data: any) => apiClient.post("/admin/coupons", data),
  deactivateCoupon: (code: string) => apiClient.delete(`/admin/coupons/${code}`),
};
