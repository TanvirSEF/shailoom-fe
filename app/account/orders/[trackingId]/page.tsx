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
  Copy,
  ExternalLink,
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

interface SteadfastInfo {
  consignment_id: number
  tracking_code: string
  status: string
  created_at: string
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
  steadfast?: SteadfastInfo
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

const courierStatusLabels: Record<string, string> = {
  in_review: "Under Review",
  pending: "In Transit",
  delivered: "Delivered",
  partial_delivered: "Partially Delivered",
  cancelled: "Cancelled",
  hold: "On Hold",
  delivered_approval_pending: "Delivered (Pending Approval)",
  cancelled_approval_pending: "Cancelled (Pending Approval)",
  unknown_approval_pending: "Pending Review",
  unknown: "Unknown",
}

const courierStatusColors: Record<string, string> = {
  in_review: "bg-slate-100 text-slate-700 border-slate-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
  partial_delivered: "bg-blue-100 text-blue-700 border-blue-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
  hold: "bg-orange-100 text-orange-700 border-orange-200",
  delivered_approval_pending: "bg-teal-100 text-teal-700 border-teal-200",
  cancelled_approval_pending: "bg-rose-100 text-rose-700 border-rose-200",
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
  const hasCourier = !!order?.steadfast

  const handleCopyTrackingCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success("Tracking code copied!")
  }

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

      {/* Courier Tracking Info */}
      {hasCourier && (
        <div className="rounded-2xl border border-purple-200 dark:border-purple-800/30 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold flex items-center gap-2">
              <Truck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Courier Tracking
            </h2>
            <Badge
              variant="outline"
              className={`text-[10px] font-bold uppercase ${courierStatusColors[order.steadfast!.status] || "bg-muted text-muted-foreground"}`}
            >
              {courierStatusLabels[order.steadfast!.status] || order.steadfast!.status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-white/60 dark:bg-background/60 p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Courier</p>
              <p className="text-sm font-semibold mt-0.5">Steadfast Express</p>
            </div>
            <div className="rounded-xl bg-white/60 dark:bg-background/60 p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tracking Code</p>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-sm font-mono font-semibold">{order.steadfast!.tracking_code}</p>
                <button
                  onClick={() => handleCopyTrackingCode(order.steadfast!.tracking_code)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="rounded-xl bg-white/60 dark:bg-background/60 p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Consignment</p>
              <p className="text-sm font-mono font-semibold mt-0.5">{order.steadfast!.consignment_id}</p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs rounded-lg"
              onClick={() => window.open(`https://portal.packzy.com/track/${order.steadfast!.tracking_code}`, "_blank")}
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              Track on Steadfast
            </Button>
          </div>
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
