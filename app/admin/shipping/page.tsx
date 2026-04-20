"use client"

import * as React from "react"
import {
  IconTruck,
  IconRefresh,
  IconSearch,
  IconCopy,
  IconExternalLink,
  IconLoader,
  IconCoin,
  IconChecklist,
  IconPackage,
} from "@tabler/icons-react"
import { toast } from "sonner"
import { useApiQuery, useApiMutation } from "@/hooks/use-api"
import { adminService } from "@/lib/services/admin-service"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface SteadfastInfo {
  consignment_id: number
  tracking_code: string
  status: string
  created_at: string
}

interface Order {
  tracking_id: string
  user_email?: string
  customer_name?: string
  total_amount?: number
  status?: string
  phone_number?: string
  shipping_address?: string
  steadfast?: SteadfastInfo
  [key: string]: unknown
}

const courierStatusColors: Record<string, string> = {
  in_review: "bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  partial_delivered: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  hold: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  delivered_approval_pending: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  cancelled_approval_pending: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  unknown_approval_pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  unknown: "bg-gray-100 text-gray-700 dark:bg-gray-800/40 dark:text-gray-300",
}

const orderStatusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  processing: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

export default function ShippingPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [searchResult, setSearchResult] = React.useState<{ delivery_status: string; raw?: any } | null>(null)
  const [searchLoading, setSearchLoading] = React.useState(false)
  const [searchType, setSearchType] = React.useState<"order" | "consignment">("order")

  const { data: balanceData, isLoading: balanceLoading, refetch: refetchBalance } = useApiQuery<any>(
    ["steadfastBalance"],
    "/admin/steadfast/balance"
  )

  const { data: orders, isLoading: ordersLoading, refetch: refetchOrders } = useApiQuery<Order[]>(
    ["adminOrders"],
    "/admin/orders"
  )

  const syncMutation = useApiMutation(
    () => adminService.syncDeliveryStatuses(),
    {
      onSuccess: (res: any) => {
        toast.success(`Synced ${res.data?.synced ?? 0} shipments, ${res.data?.errors ?? 0} errors`)
        refetchOrders()
      },
      onError: () => {
        toast.error("Failed to sync statuses")
      },
    }
  )

  const shippedOrders = React.useMemo(() => {
    if (!orders) return []
    return orders.filter((o) => o.steadfast).sort((a, b) => {
      const dateA = a.steadfast?.created_at ? new Date(a.steadfast.created_at).getTime() : 0
      const dateB = b.steadfast?.created_at ? new Date(b.steadfast.created_at).getTime() : 0
      return dateB - dateA
    })
  }, [orders])

  const pendingShipments = React.useMemo(() => {
    return shippedOrders.filter(
      (o) => o.steadfast && !["delivered", "cancelled"].includes(o.steadfast.status)
    )
  }, [shippedOrders])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setSearchLoading(true)
    setSearchResult(null)
    try {
      if (searchType === "order") {
        const res = await adminService.getDeliveryStatus(searchQuery.trim())
        setSearchResult(res.data)
      } else {
        const res = await adminService.getConsignmentStatus(searchQuery.trim())
        setSearchResult(res.data)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Not found")
    } finally {
      setSearchLoading(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied!")
  }

  return (
    <div className="flex flex-1 flex-col gap-6 pb-20 px-4 lg:px-6 mt-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Shipping Management</h2>
        <p className="text-sm text-muted-foreground">
          Manage Steadfast courier shipments and delivery tracking
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <IconCoin className="size-4" /> Steadfast Balance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {balanceLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">
                  ৳{balanceData?.current_balance?.toLocaleString() ?? "—"}
                </p>
                <Button variant="ghost" size="icon" className="size-8" onClick={() => refetchBalance()}>
                  <IconRefresh className="size-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <IconTruck className="size-4" /> Total Shipments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{shippedOrders.length}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <IconChecklist className="size-4" /> Pending Delivery
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">{pendingShipments.length}</p>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs rounded-lg"
                onClick={() => syncMutation.mutate(undefined as any)}
                disabled={syncMutation.isPending}
              >
                {syncMutation.isPending ? (
                  <IconLoader className="size-3 mr-1 animate-spin" />
                ) : (
                  <IconRefresh className="size-3 mr-1" />
                )}
                Sync All
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Track Shipment */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Track Shipment</CardTitle>
          <CardDescription>Search by order tracking ID or Steadfast consignment ID</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <select
              className="h-10 rounded-xl border bg-background px-3 text-sm cursor-pointer"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as "order" | "consignment")}
            >
              <option value="order">Order ID</option>
              <option value="consignment">Consignment ID</option>
            </select>
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchType === "order" ? "Enter tracking ID (e.g. SHL-A1B2C3D4)" : "Enter consignment ID"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 rounded-xl pl-9"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button
              className="h-10 rounded-xl"
              onClick={handleSearch}
              disabled={searchLoading || !searchQuery.trim()}
            >
              {searchLoading ? <IconLoader className="size-4 animate-spin" /> : "Track"}
            </Button>
          </div>

          {searchResult && (
            <div className="mt-4 rounded-xl border bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Delivery Status</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold uppercase border-none",
                    courierStatusColors[searchResult.delivery_status] || "bg-muted text-muted-foreground"
                  )}
                >
                  {searchResult.delivery_status?.replace(/_/g, " ")}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shipments Table */}
      <div className="overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-sm">
        <div className="px-6 py-4 border-b">
          <h3 className="font-semibold">All Shipments</h3>
          <p className="text-xs text-muted-foreground">Orders dispatched via Steadfast Courier</p>
        </div>

        {ordersLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : shippedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <IconPackage className="size-12 text-muted-foreground/40 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No shipments yet</p>
            <p className="text-sm text-muted-foreground/70">
              Ship orders via Steadfast from the Orders page
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Consignment</TableHead>
                <TableHead>Tracking Code</TableHead>
                <TableHead>COD Amount</TableHead>
                <TableHead>Courier Status</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shippedOrders.map((order) => (
                <TableRow key={order.tracking_id}>
                  <TableCell className="font-mono text-sm font-medium">
                    {order.tracking_id}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {order.steadfast?.consignment_id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-sm">{order.steadfast?.tracking_code}</span>
                      <button
                        onClick={() => handleCopy(order.steadfast?.tracking_code || "")}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <IconCopy className="size-3" />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    ৳{order.total_amount?.toLocaleString() ?? 0}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border-none",
                        courierStatusColors[order.steadfast?.status || ""] || "bg-muted text-muted-foreground"
                      )}
                    >
                      {order.steadfast?.status?.replace(/_/g, " ") || "unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium border-none capitalize",
                        orderStatusColors[order.status?.toLowerCase() ?? ""] ?? "bg-muted text-muted-foreground"
                      )}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => {
                          setSearchQuery(order.tracking_id)
                          setSearchType("order")
                        }}
                        title="Check status"
                      >
                        <IconRefresh className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => window.open(`https://portal.packzy.com/track/${order.steadfast?.tracking_code}`, "_blank")}
                        title="Track on Steadfast"
                      >
                        <IconExternalLink className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
