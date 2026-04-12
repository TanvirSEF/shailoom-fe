"use client"

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface AnalyticsData {
  total_revenue?: number
  total_orders?: number
  total_customers?: number
  growth_rate?: number
  revenue_change?: number
  orders_change?: number
  customers_change?: number
  growth_change?: number
}

function CardSkeleton() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-32" />
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-48" />
      </CardFooter>
    </Card>
  )
}

export function SectionCards({ data, isLoading }: { data?: AnalyticsData; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 text-foreground">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    )
  }

  const totalRevenue = data?.total_revenue ?? 0
  const totalOrders = data?.total_orders ?? 0
  const totalCustomers = data?.total_customers ?? 0
  const growthRate = data?.growth_rate ?? 0

  const revenueChange = data?.revenue_change ?? 0
  const ordersChange = data?.orders_change ?? 0
  const customersChange = data?.customers_change ?? 0
  const growthChange = data?.growth_change ?? 0

  const cards = [
    {
      title: "Total Revenue",
      value: `৳${totalRevenue.toLocaleString()}`,
      change: revenueChange,
      up: revenueChange >= 0,
      footerLine: revenueChange >= 0 ? "Trending up this month" : "Revenue down this period",
      footerSub: "Total sales revenue",
    },
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString(),
      change: ordersChange,
      up: ordersChange >= 0,
      footerLine: ordersChange >= 0 ? "Orders increasing steadily" : "Orders need attention",
      footerSub: "All-time order count",
    },
    {
      title: "Total Customers",
      value: totalCustomers.toLocaleString(),
      change: customersChange,
      up: customersChange >= 0,
      footerLine: customersChange >= 0 ? "Strong user acquisition" : "Customer growth slowing",
      footerSub: "Registered users",
    },
    {
      title: "Growth Rate",
      value: `${growthRate.toFixed(1)}%`,
      change: growthChange,
      up: growthChange >= 0,
      footerLine: growthChange >= 0 ? "Steady performance" : "Declining growth rate",
      footerSub: "Month over month",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card text-foreground">
      {cards.map((card) => (
        <Card key={card.title} className="@container/card">
          <CardHeader>
            <CardDescription>{card.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {card.value}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {card.up ? <IconTrendingUp /> : <IconTrendingDown />}
                {card.change >= 0 ? "+" : ""}{card.change}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {card.footerLine}{" "}
              {card.up ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
            </div>
            <div className="text-muted-foreground">{card.footerSub}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
