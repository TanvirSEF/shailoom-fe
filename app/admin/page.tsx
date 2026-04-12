"use client"

import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { useApiQuery } from "@/hooks/use-api"
import { adminService } from "@/lib/services/admin-service"

interface SalesAnalytics {
  total_revenue: number
  total_orders: number
  total_customers: number
  growth_rate: number
  revenue_change: number
  orders_change: number
  customers_change: number
  growth_change: number
}

interface RevenueChartPoint {
  date: string
  revenue: number
  orders: number
}

export default function AdminPage() {
  const { data: analytics, isLoading: analyticsLoading } = useApiQuery<SalesAnalytics>(
    ["salesAnalytics"],
    "/admin/analytics/sales",
    undefined,
    { enabled: true }
  )

  const { data: revenueChart, isLoading: chartLoading } = useApiQuery<RevenueChartPoint[]>(
    ["revenueChart"],
    "/admin/analytics/revenue-chart",
    undefined,
    { enabled: true }
  )

  return (
    <div className="flex flex-1 flex-col pb-20">
      <div className="@container/main flex flex-1 flex-col gap-6">
        <div className="mt-6">
          <SectionCards data={analytics} isLoading={analyticsLoading} />
        </div>
        <div className="grid gap-6 px-4 lg:grid-cols-1 lg:px-6 @5xl/main:grid-cols-1">
          <ChartAreaInteractive
            data={revenueChart ?? []}
            isLoading={chartLoading}
          />
        </div>
      </div>
    </div>
  )
}
