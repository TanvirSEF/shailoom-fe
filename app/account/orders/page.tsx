"use client"

import * as React from "react"
import Link from "next/link"
import { Package, ChevronRight, Loader2, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useApiQuery } from "@/hooks/use-api"

interface Order {
  tracking_id: string
  status: string
  total_amount: number
  items: { name: string; quantity: number; price: number }[]
  created_at: string
  payment_method: string
}

const statusColor: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  processing: "bg-indigo-100 text-indigo-700 border-indigo-200",
  shipped: "bg-purple-100 text-purple-700 border-purple-200",
  delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
}

export default function OrdersPage() {
  const [searchId, setSearchId] = React.useState("")
  const { data: orders, isLoading, error } = useApiQuery<Order[]>(
    ["myOrders"],
    "/orders/my-orders"
  )

  const filteredOrders = React.useMemo(() => {
    if (!orders) return []
    if (!searchId.trim()) return orders
    return orders.filter((o) =>
      o.tracking_id.toLowerCase().includes(searchId.toLowerCase())
    )
  }, [orders, searchId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by tracking ID..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="h-10 rounded-xl pl-9 pr-9"
        />
        {searchId && (
          <button onClick={() => setSearchId("")} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border bg-destructive/5 p-8 text-center">
          <p className="text-muted-foreground">Failed to load orders. Please try again.</p>
        </div>
      )}

      {filteredOrders.length === 0 && !isLoading && (
        <div className="rounded-2xl border bg-muted/30 p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            {orders?.length === 0 ? "You haven't placed any orders yet." : "No orders found."}
          </p>
          {orders?.length === 0 && (
            <Link href="/shop/sarees">
              <Button className="mt-4 rounded-full">Start Shopping</Button>
            </Link>
          )}
        </div>
      )}

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Link
            key={order.tracking_id}
            href={`/account/orders/${order.tracking_id}`}
            className="group block"
          >
            <div className="rounded-2xl border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-primary">
                      {order.tracking_id}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold uppercase ${statusColor[order.status] || "bg-muted text-muted-foreground"}`}
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? "s" : ""}
                    {order.payment_method && ` • ${order.payment_method}`}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold">৳{Number(order.total_amount).toLocaleString()}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
