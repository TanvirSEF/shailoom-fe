"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  CreditCard,
  Phone,
  CheckCircle2,
  Circle,
  Loader2,
  XCircle,
  Clock,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useApiQuery, useApiMutation } from "@/hooks/use-api"
import { orderService } from "@/lib/services/order-service"
import { toast } from "sonner"

interface OrderItem {
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
  image?: string
}

interface TrackingStep {
  status: string
  label: string
  date?: string
  completed: boolean
}

interface OrderDetail {
  tracking_id: string
  status: string
  total_amount: number
  shipping_address: string
  shipping_zone: string
  phone_number: string
  payment_method: string
  items: OrderItem[]
  created_at: string
  updated_at?: string
  coupon_code?: string
  discount_amount?: number
  tracking_history?: { status: string; timestamp: string; note?: string }[]
}

const statusSteps: TrackingStep[] = [
  { status: "pending", label: "Order Placed", completed: false },
  { status: "confirmed", label: "Confirmed", completed: false },
  { status: "processing", label: "Processing", completed: false },
  { status: "shipped", label: "Shipped", completed: false },
  { status: "delivered", label: "Delivered", completed: false },
]

const statusColor: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  processing: "bg-indigo-100 text-indigo-700 border-indigo-200",
  shipped: "bg-purple-100 text-purple-700 border-purple-200",
  delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
}

function getStepIndex(status: string): number {
  const idx = statusSteps.findIndex((s) => s.status === status)
  return idx >= 0 ? idx : 0
}

export default function OrderDetailPage({ params }: { params: Promise<{ trackingId: string }> }) {
  const { trackingId } = React.use(params)
  const router = useRouter()

  const { data: order, isLoading, error, refetch } = useApiQuery<OrderDetail>(
    ["orderDetail", trackingId],
    `/orders/detail/${trackingId}`
  )

  const { data: trackingData } = useApiQuery<any>(
    ["orderTracking", trackingId],
    `/orders/track/${trackingId}`
  )

  const { mutate: cancelOrder, isPending: isCancelling } = useApiMutation<any, void>(
    async () => {
      const res = await orderService.cancelOrder(trackingId)
      return res.data
    },
    {
      onSuccess: () => {
        toast.success("Order cancelled successfully.")
        refetch()
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || "Failed to cancel order.")
      },
    }
  )

  const canCancel =
    order &&
    !["cancelled", "delivered", "shipped"].includes(order.status)

  const currentStep = order ? getStepIndex(order.status) : 0
  const isCancelled = order?.status === "cancelled"

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Package className="h-12 w-12 text-muted-foreground/50" />
        <p className="text-muted-foreground">Order not found.</p>
        <Button variant="outline" onClick={() => router.push("/account/orders")}>
          Back to Orders
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/account/orders")} className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Order {order.tracking_id}</h1>
            <Badge
              variant="outline"
              className={`text-xs font-bold uppercase ${statusColor[order.status] || "bg-muted text-muted-foreground"}`}
            >
              {order.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Placed on {new Date(order.created_at).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric",
            })}
          </p>
        </div>
        {canCancel && (
          <Button
            variant="outline"
            onClick={() => cancelOrder(undefined as any)}
            disabled={isCancelling}
            className="border-destructive/30 text-destructive hover:bg-destructive/10 shrink-0"
          >
            {isCancelling ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
            Cancel Order
          </Button>
        )}
      </div>

      {/* Tracking Timeline */}
      {!isCancelled && (
        <div className="rounded-2xl border bg-card p-6">
          <h2 className="mb-6 font-bold flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" /> Order Tracking
          </h2>
          <div className="flex items-center justify-between">
            {statusSteps.map((step, i) => {
              const isCompleted = i <= currentStep
              const isCurrent = i === currentStep
              return (
                <div key={step.status} className="flex flex-col items-center gap-2 flex-1">
                  <div className="flex items-center w-full">
                    {i > 0 && (
                      <div className={`flex-1 h-[2px] ${i <= currentStep ? "bg-primary" : "bg-muted"}`} />
                    )}
                    <div className={`
                      flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold
                      ${isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}
                      ${isCurrent ? "ring-4 ring-primary/20" : ""}
                    `}>
                      {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-3 w-3" />}
                    </div>
                    {i < statusSteps.length - 1 && (
                      <div className={`flex-1 h-[2px] ${i < currentStep ? "bg-primary" : "bg-muted"}`} />
                    )}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isCompleted ? "text-primary" : "text-muted-foreground"}`}>
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
          {trackingData?.estimated_delivery && (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              <Clock className="inline h-3 w-3 mr-1" />
              Estimated delivery: {new Date(trackingData.estimated_delivery).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </p>
          )}
        </div>
      )}

      {isCancelled && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center">
          <XCircle className="mx-auto h-8 w-8 text-destructive" />
          <p className="mt-2 font-bold text-destructive">This order has been cancelled.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Items */}
        <div className="rounded-2xl border bg-card p-6">
          <h2 className="mb-4 font-bold">Items</h2>
          <div className="space-y-4">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity}
                    {item.size && ` • Size: ${item.size}`}
                    {item.color && ` • Color: ${item.color}`}
                  </p>
                </div>
                <span className="font-bold">৳{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t space-y-2">
            {(order.discount_amount ?? 0) > 0 && (
              <div className="flex justify-between text-sm text-emerald-600">
                <span>Discount</span>
                <span>-৳{Number(order.discount_amount).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">৳{Number(order.total_amount).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Info */}
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="mb-4 font-bold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Shipping
            </h2>
            <p className="text-sm">{order.shipping_address}</p>
            <p className="text-xs text-muted-foreground mt-1">Zone: {order.shipping_zone}</p>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <h2 className="mb-4 font-bold flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" /> Contact
            </h2>
            <p className="text-sm">{order.phone_number}</p>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <h2 className="mb-4 font-bold flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" /> Payment
            </h2>
            <p className="text-sm capitalize">{order.payment_method?.replace("_", " ")}</p>
            {order.coupon_code && (
              <p className="text-xs text-emerald-600 mt-1">Coupon: {order.coupon_code}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
