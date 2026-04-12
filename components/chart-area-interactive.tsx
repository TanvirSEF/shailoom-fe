"use client"

import * as React from "react"
import { IconTrendingUp } from "@tabler/icons-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

interface RevenueDataPoint {
  date: string
  revenue?: number
  orders?: number
  desktop?: number
  mobile?: number
  amount?: number
}

interface ChartProps {
  data?: RevenueDataPoint[]
  isLoading?: boolean
  title?: string
  description?: string
  dataKey?: string
  secondaryDataKey?: string
}

const defaultChartConfig: ChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
  orders: {
    label: "Orders",
    color: "hsl(var(--muted-foreground))",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--primary))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--muted-foreground))",
  },
  amount: {
    label: "Amount",
    color: "hsl(var(--primary))",
  },
}

function ChartSkeleton() {
  return (
    <Card className="rounded-3xl border-none bg-card/60 shadow-2xl shadow-indigo-500/5 backdrop-blur-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <Skeleton className="aspect-auto h-[350px] w-full rounded-2xl" />
      </CardContent>
      <CardFooter className="flex-col items-start gap-3 border-t bg-muted/5 px-6 py-6 md:px-8">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-80" />
      </CardFooter>
    </Card>
  )
}

export function ChartAreaInteractive({
  data = [],
  isLoading = false,
  title = "Revenue Overview",
  description = "Revenue trends over time",
  dataKey = "revenue",
  secondaryDataKey,
}: ChartProps) {
  const [timeRange, setTimeRange] = React.useState("90d")

  if (isLoading) return <ChartSkeleton />

  const filteredData = data.filter((item) => {
    const date = new Date(item.date)
    const now = new Date()
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    now.setDate(now.getDate() - daysToSubtract)
    return date >= now
  })

  const primaryLabel = String(defaultChartConfig[dataKey as keyof typeof defaultChartConfig]?.label ?? dataKey)

  return (
    <Card className="rounded-3xl border-none bg-card/60 shadow-2xl shadow-indigo-500/5 backdrop-blur-xl transition-all hover:bg-card/80">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <div className="space-y-1.5">
          <CardTitle className="text-xl font-bold tracking-tight">{title}</CardTitle>
          <CardDescription className="text-sm font-medium opacity-60">
            {description}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-2xl bg-muted/40 border-none shadow-inner transition-all hover:bg-muted/60"
            aria-label="Select a time range"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-border/40 bg-background/95 backdrop-blur-lg">
            <SelectItem value="90d" className="rounded-xl">Last 3 months</SelectItem>
            <SelectItem value="30d" className="rounded-xl">Last 30 days</SelectItem>
            <SelectItem value="7d" className="rounded-xl">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={defaultChartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={`var(--color-${dataKey})`}
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-${dataKey})`}
                  stopOpacity={0.1}
                />
              </linearGradient>
              {secondaryDataKey && (
                <linearGradient id="fillSecondary" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={`var(--color-${secondaryDataKey})`}
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor={`var(--color-${secondaryDataKey})`}
                    stopOpacity={0.05}
                  />
                </linearGradient>
              )}
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                  className="rounded-2xl border-none shadow-2xl"
                />
              }
            />
            {secondaryDataKey && (
              <Area
                dataKey={secondaryDataKey}
                type="natural"
                fill="url(#fillSecondary)"
                stroke={`var(--color-${secondaryDataKey})`}
                stackId="a"
                strokeWidth={2}
              />
            )}
            <Area
              dataKey={dataKey}
              type="natural"
              fill="url(#fillPrimary)"
              stroke={`var(--color-${dataKey})`}
              stackId="a"
              strokeWidth={3}
              activeDot={{
                r: 6,
                fill: `var(--color-${dataKey})`,
                stroke: "white",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-3 border-t bg-muted/5 px-6 py-6 md:px-8">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary">
            <IconTrendingUp className="size-5" />
            {primaryLabel} trends
          </div>
          <div className="text-xs font-bold text-muted-foreground opacity-60">
            Updated just now
          </div>
        </div>
        <div className="text-xs font-medium leading-relaxed text-muted-foreground/80">
          Showing {primaryLabel.toLowerCase()} data based on the selected time range.
        </div>
      </CardFooter>
    </Card>
  )
}
