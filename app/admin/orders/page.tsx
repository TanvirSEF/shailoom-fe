"use client"

import * as React from "react"
import {
  IconSearch,
  IconCircleCheckFilled,
  IconLoader,
  IconPackage,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconRefresh,
  IconTruck,
  IconExternalLink,
  IconCopy,
} from "@tabler/icons-react"
import { toast } from "sonner"
import { useApiQuery, useApiMutation } from "@/hooks/use-api"
import { adminService } from "@/lib/services/admin-service"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"

interface SteadfastInfo {
  consignment_id: number
  tracking_code: string
  status: string
  created_at: string
}

interface Order {
  tracking_id: string
  customer_name?: string
  customer_email?: string
  user_email?: string
  items?: Array<{ name: string; quantity: number; price: number }>
  total_amount?: number
  status?: string
  created_at?: string
  address?: string
  phone?: string
  phone_number?: string
  shipping_address?: string
  shipping_zone?: string
  steadfast?: SteadfastInfo
  [key: string]: unknown
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  processing: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
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
}

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(0)
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null)
  const [courierStatusLoading, setCourierStatusLoading] = React.useState(false)
  const [liveCourierStatus, setLiveCourierStatus] = React.useState<string | null>(null)

  const { data: orders, isLoading, refetch } = useApiQuery<Order[]>(
    ["adminOrders"],
    "/admin/orders",
    undefined,
    { enabled: true }
  )

  const updateStatusMutation = useApiMutation(
    (params: { trackingId: string; status: string }) =>
      adminService.updateOrderStatus(params.trackingId, params.status),
    {
      onSuccess: () => {
        toast.success("Order status updated")
        refetch()
      },
      onError: () => {
        toast.error("Failed to update status")
      },
    }
  )

  const createConsignmentMutation = useApiMutation(
    (trackingId: string) => adminService.createConsignment(trackingId),
    {
      onSuccess: () => {
        toast.success("Consignment created — order shipped via Steadfast")
        refetch()
        setSelectedOrder(null)
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || "Failed to create consignment")
      },
    }
  )

  const filteredOrders = React.useMemo(() => {
    if (!orders) return []
    let result = [...orders]
    if (statusFilter !== "all") {
      result = result.filter((o) => o.status?.toLowerCase() === statusFilter)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (o) =>
          o.tracking_id?.toLowerCase().includes(q) ||
          o.customer_name?.toLowerCase().includes(q) ||
          o.customer_email?.toLowerCase().includes(q) ||
          o.user_email?.toLowerCase().includes(q)
      )
    }
    return result
  }, [orders, statusFilter, search])

  const pageSize = 10
  const totalPages = Math.ceil(filteredOrders.length / pageSize)
  const pagedOrders = filteredOrders.slice(page * pageSize, (page + 1) * pageSize)

  React.useEffect(() => {
    setPage(0)
  }, [statusFilter, search])

  const handleCheckCourierStatus = async (trackingId: string) => {
    setCourierStatusLoading(true)
    setLiveCourierStatus(null)
    try {
      const res = await adminService.getDeliveryStatus(trackingId)
      setLiveCourierStatus(res.data?.delivery_status || "unknown")
      refetch()
    } catch {
      toast.error("Failed to fetch courier status")
    } finally {
      setCourierStatusLoading(false)
    }
  }

  const handleCopyTrackingCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success("Tracking code copied!")
  }

  return (
    <div className="flex flex-1 flex-col gap-6 pb-20 px-4 lg:px-6 mt-6">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">All Orders</h2>
          <p className="text-sm text-muted-foreground">
            {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-64 rounded-xl pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 w-40 rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="rounded-xl cursor-pointer" onClick={() => refetch()}>
            <IconRefresh className="size-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-sm">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : pagedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <IconPackage className="size-12 text-muted-foreground/40 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No orders found</p>
            <p className="text-sm text-muted-foreground/70">
              {search || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Orders will appear here once customers start purchasing"}
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedOrders.map((order) => (
                  <TableRow key={order.tracking_id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <button
                        onClick={() => { setSelectedOrder(order); setLiveCourierStatus(null) }}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        #{order.tracking_id?.slice(0, 8)}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{order.customer_name || order.user_email?.split("@")[0] || "—"}</span>
                        <span className="text-xs text-muted-foreground">{order.customer_email || order.user_email || ""}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {order.items?.length ?? 0} item{((order.items?.length ?? 0) !== 1) ? "s" : ""}
                    </TableCell>
                    <TableCell className="font-semibold">
                      ৳{order.total_amount?.toLocaleString() ?? 0}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-medium border-none capitalize",
                            statusColors[order.status?.toLowerCase() ?? ""] ?? "bg-muted text-muted-foreground"
                          )}
                        >
                          {order.status?.toLowerCase() === "delivered" ? (
                            <IconCircleCheckFilled className="size-3 mr-1 fill-current" />
                          ) : order.status?.toLowerCase() === "processing" ? (
                            <IconLoader className="size-3 mr-1 animate-spin" />
                          ) : null}
                          {order.status ?? "Unknown"}
                        </Badge>
                        {order.steadfast && (
                          <IconTruck className="size-3.5 text-purple-500" title="Shipped via Steadfast" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) =>
                          updateStatusMutation.mutate({ trackingId: order.tracking_id, status: value })
                        }
                      >
                        <SelectTrigger className="h-8 w-28 rounded-lg text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t px-4 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, filteredOrders.length)} of {filteredOrders.length}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 rounded-lg"
                  onClick={() => setPage(0)}
                  disabled={page === 0}
                >
                  <IconChevronsLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 rounded-lg"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                >
                  <IconChevronLeft className="size-4" />
                </Button>
                <span className="text-sm font-medium px-2">
                  Page {page + 1} of {totalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 rounded-lg"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages - 1}
                >
                  <IconChevronRight className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 rounded-lg"
                  onClick={() => setPage(totalPages - 1)}
                  disabled={page >= totalPages - 1}
                >
                  <IconChevronsRight className="size-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Order Detail Sheet */}
      <Sheet open={!!selectedOrder} onOpenChange={() => { setSelectedOrder(null); setLiveCourierStatus(null) }}>
        <SheetContent className="w-[450px] sm:w-[500px] overflow-y-auto">
          {selectedOrder && (
            <>
              <SheetHeader className="space-y-1 border-b pb-6">
                <SheetTitle className="text-2xl font-bold">
                  Order #{selectedOrder.tracking_id?.slice(0, 8)}
                </SheetTitle>
                <SheetDescription>
                  {selectedOrder.created_at
                    ? new Date(selectedOrder.created_at).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : ""}
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-6 py-6">
                {/* Status */}
                <div>
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-2 block">Status</Label>
                  <Badge
                    variant="outline"
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium border-none capitalize",
                      statusColors[selectedOrder.status?.toLowerCase() ?? ""] ?? "bg-muted text-muted-foreground"
                    )}
                  >
                    {selectedOrder.status}
                  </Badge>
                </div>

                {/* Courier Section */}
                <div>
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-2 block">
                    <IconTruck className="inline size-3.5 mr-1" /> Courier
                  </Label>

                  {selectedOrder.steadfast ? (
                    <div className="rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/30 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Steadfast Courier</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border-none",
                            courierStatusColors[selectedOrder.steadfast.status] || "bg-muted text-muted-foreground"
                          )}
                        >
                          {liveCourierStatus || selectedOrder.steadfast.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Consignment</p>
                          <p className="font-mono font-medium">{selectedOrder.steadfast.consignment_id}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Tracking Code</p>
                          <div className="flex items-center gap-1">
                            <p className="font-mono font-medium">{selectedOrder.steadfast.tracking_code}</p>
                            <button
                              onClick={() => handleCopyTrackingCode(selectedOrder.steadfast!.tracking_code)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <IconCopy className="size-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs rounded-lg flex-1"
                          onClick={() => handleCheckCourierStatus(selectedOrder.tracking_id)}
                          disabled={courierStatusLoading}
                        >
                          {courierStatusLoading ? (
                            <IconLoader className="size-3 mr-1 animate-spin" />
                          ) : (
                            <IconRefresh className="size-3 mr-1" />
                          )}
                          {courierStatusLoading ? "Checking..." : "Refresh Status"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs rounded-lg"
                          onClick={() => window.open(`https://portal.packzy.com/track/${selectedOrder.steadfast!.tracking_code}`, "_blank")}
                        >
                          <IconExternalLink className="size-3 mr-1" />
                          Track
                        </Button>
                      </div>
                    </div>
                  ) : ["confirmed", "processing"].includes(selectedOrder.status?.toLowerCase() || "") ? (
                    <div className="rounded-xl border border-dashed border-purple-300 dark:border-purple-700/50 bg-purple-50/50 dark:bg-purple-950/10 p-4">
                      <p className="text-xs text-muted-foreground mb-3">
                        This order is ready to be dispatched. Create a Steadfast consignment to ship it.
                      </p>
                      <Button
                        size="sm"
                        className="h-8 text-xs rounded-lg bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={() => createConsignmentMutation.mutate(selectedOrder.tracking_id)}
                        disabled={createConsignmentMutation.isPending}
                      >
                        {createConsignmentMutation.isPending ? (
                          <IconLoader className="size-3.5 mr-1.5 animate-spin" />
                        ) : (
                          <IconTruck className="size-3.5 mr-1.5" />
                        )}
                        {createConsignmentMutation.isPending ? "Creating..." : "Ship via Steadfast"}
                      </Button>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground rounded-xl bg-muted/30 p-4">
                      {selectedOrder.status?.toLowerCase() === "pending"
                        ? "Confirm this order first before shipping."
                        : "No courier assigned yet."}
                    </p>
                  )}
                </div>

                {/* Customer */}
                <div>
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-2 block">Customer</Label>
                  <div className="rounded-xl bg-muted/30 p-4 space-y-1">
                    <p className="text-sm font-medium">{selectedOrder.customer_name || selectedOrder.user_email?.split("@")[0]}</p>
                    <p className="text-xs text-muted-foreground">{selectedOrder.customer_email || selectedOrder.user_email}</p>
                    {(selectedOrder.phone || selectedOrder.phone_number) && <p className="text-xs text-muted-foreground">{selectedOrder.phone || selectedOrder.phone_number}</p>}
                    {(selectedOrder.address || selectedOrder.shipping_address) && <p className="text-xs text-muted-foreground">{selectedOrder.address || selectedOrder.shipping_address}</p>}
                  </div>
                </div>

                {/* Items */}
                <div>
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-2 block">Items</Label>
                  <div className="rounded-xl bg-muted/30 p-4 space-y-3">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold">৳{item.price.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">Total</span>
                    <span className="text-xl font-bold text-primary">
                      ৳{selectedOrder.total_amount?.toLocaleString() ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
