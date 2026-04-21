"use client"

import * as React from "react"
import {
  IconTrendingUp,
  IconTrendingDown,
  IconShoppingCart,
  IconUsers,
  IconAlertTriangle,
  IconClock,
} from "@tabler/icons-react"
import { useApiQuery } from "@/hooks/use-api"
import { cn } from "@/lib/utils"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface AnalyticsOverview {
  total_revenue?: number
  total_orders?: number
  avg_order_value?: number
  conversion_rate?: number
  revenue_change?: number
  orders_change?: number
}

interface TopCustomer {
  name?: string
  email?: string
  total_spent?: number
  orders_count?: number
}

interface LowStockAlert {
  product_name?: string
  current_stock?: number
  threshold?: number
}

interface AuditLog {
  action?: string
  user?: string
  timestamp?: string
  details?: string
}

interface RevenueChartPoint {
  date: string
  revenue: number
  orders: number
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
}: {
  title: string
  value: string
  change?: number
  icon: React.ElementType
}) {
  return (
    <Card className="rounded-3xl border-none bg-card/60 shadow-2xl shadow-indigo-500/5 backdrop-blur-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardDescription className="text-xs font-bold uppercase tracking-widest">{title}</CardDescription>
        <Icon className="size-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            {change >= 0 ? (
              <IconTrendingUp className="size-3.5 text-emerald-500" />
            ) : (
              <IconTrendingDown className="size-3.5 text-red-500" />
            )}
            <span className={cn("text-xs font-medium", change >= 0 ? "text-emerald-500" : "text-red-500")}>
              {change >= 0 ? "+" : ""}{change}%
            </span>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function AnalyticsPage() {
  const { data: salesAnalytics, isLoading: salesLoading } = useApiQuery<AnalyticsOverview>(
    ["analyticsSales"],
    "/admin/analytics/sales",
    undefined,
    { enabled: true }
  )

  const { data: revenueChart, isLoading: chartLoading } = useApiQuery<RevenueChartPoint[]>(
    ["analyticsRevenueChart"],
    "/admin/analytics/revenue-chart",
    undefined,
    { enabled: true }
  )

  const { data: topCustomers, isLoading: customersLoading } = useApiQuery<TopCustomer[]>(
    ["topCustomers"],
    "/admin/analytics/top-customers",
    undefined,
    { enabled: true }
  )

  const { data: lowStockAlerts, isLoading: stockLoading } = useApiQuery<LowStockAlert[]>(
    ["analyticsLowStock"],
    "/admin/analytics/low-stock",
    undefined,
    { enabled: true }
  )

  const { data: auditLogs, isLoading: logsLoading } = useApiQuery<AuditLog[]>(
    ["auditLogs"],
    "/admin/audit-logs",
    undefined,
    { enabled: true }
  )

  return (
    <div className="flex flex-1 flex-col gap-8 pb-20 px-4 lg:px-6 mt-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Track your store&apos;s performance and growth
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {salesLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-3xl" />
          ))
        ) : (
          <>
            <StatCard
              title="Total Revenue"
              value={`৳${(salesAnalytics?.total_revenue ?? 0).toLocaleString()}`}
              change={salesAnalytics?.revenue_change}
              icon={IconShoppingCart}
            />
            <StatCard
              title="Total Orders"
              value={(salesAnalytics?.total_orders ?? 0).toLocaleString()}
              change={salesAnalytics?.orders_change}
              icon={IconShoppingCart}
            />
            <StatCard
              title="Avg. Order Value"
              value={`৳${(salesAnalytics?.avg_order_value ?? 0).toLocaleString()}`}
              icon={IconTrendingUp}
            />
            <StatCard
              title="Conversion Rate"
              value={`${salesAnalytics?.conversion_rate ?? 0}%`}
              icon={IconUsers}
            />
          </>
        )}
      </div>

      {/* Revenue Chart */}
      <ChartAreaInteractive
        data={revenueChart ?? []}
        isLoading={chartLoading}
        title="Revenue & Orders Trend"
        description="Revenue and order volume over time"
        dataKey="revenue"
        secondaryDataKey="orders"
      />

      {/* Two Column: Top Customers + Low Stock */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Customers */}
        <Card className="rounded-3xl border-none bg-card/60 shadow-2xl shadow-indigo-500/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold tracking-tight">Top Customers</CardTitle>
            <CardDescription>Highest spending customers</CardDescription>
          </CardHeader>
          <CardContent>
            {customersLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-xl" />
                ))}
              </div>
            ) : !topCustomers?.length ? (
              <p className="text-sm text-muted-foreground text-center py-8">No customer data yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Spent</TableHead>
                    <TableHead className="text-right">Orders</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCustomers.slice(0, 5).map((customer, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{customer.name || "—"}</span>
                          <span className="text-xs text-muted-foreground">{customer.email || ""}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">৳{(customer.total_spent ?? 0).toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">{customer.orders_count ?? 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="rounded-3xl border-none bg-card/60 shadow-2xl shadow-indigo-500/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold tracking-tight flex items-center gap-2">
              <IconAlertTriangle className="size-5 text-yellow-500" />
              Low Stock Alerts
            </CardTitle>
            <CardDescription>Products that need restocking</CardDescription>
          </CardHeader>
          <CardContent>
            {stockLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-xl" />
                ))}
              </div>
            ) : !lowStockAlerts?.length ? (
              <div className="flex flex-col items-center py-8 text-center">
                <IconAlertTriangle className="size-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">All products are well-stocked</p>
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockAlerts.slice(0, 6).map((alert, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-xl bg-muted/30 p-3">
                    <div>
                      <p className="text-sm font-medium">{alert.product_name || "—"}</p>
                      <p className="text-xs text-muted-foreground">
                        Threshold: {alert.threshold ?? 0}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="rounded-full text-xs border-none bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    >
                      {alert.current_stock ?? 0} left
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs */}
      <Card className="rounded-3xl border-none bg-card/60 shadow-2xl shadow-indigo-500/5 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold tracking-tight flex items-center gap-2">
            <IconClock className="size-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest admin actions and system events</CardDescription>
        </CardHeader>
        <CardContent>
          {logsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-xl" />
              ))}
            </div>
          ) : !auditLogs?.length ? (
            <p className="text-sm text-muted-foreground text-center py-8">No activity logs yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="hidden sm:table-cell">Details</TableHead>
                  <TableHead className="text-right">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.slice(0, 10).map((log, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Badge variant="outline" className="rounded-full text-xs capitalize">
                        {log.action || "—"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{log.user || "System"}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground max-w-[300px] truncate">
                      {log.details ? (typeof log.details === "string" ? log.details : JSON.stringify(log.details)) : "—"}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {log.timestamp
                        ? new Date(log.timestamp).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
