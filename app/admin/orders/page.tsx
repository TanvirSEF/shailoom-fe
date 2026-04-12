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

interface Order {
  tracking_id: string
  customer_name?: string
  customer_email?: string
  items?: Array<{ name: string; quantity: number; price: number }>
  total_amount?: number
  status?: string
  created_at?: string
  address?: string
  phone?: string
  [key: string]: unknown
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(0)
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null)

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
          o.customer_email?.toLowerCase().includes(q)
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
                        onClick={() => setSelectedOrder(order)}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        #{order.tracking_id?.slice(0, 8)}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{order.customer_name || "—"}</span>
                        <span className="text-xs text-muted-foreground">{order.customer_email || ""}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {order.items?.length ?? 0} item{((order.items?.length ?? 0) !== 1) ? "s" : ""}
                    </TableCell>
                    <TableCell className="font-semibold">
                      ৳{order.total_amount?.toLocaleString() ?? 0}
                    </TableCell>
                    <TableCell>
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
      <Sheet open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
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

                <div>
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-2 block">Customer</Label>
                  <div className="rounded-xl bg-muted/30 p-4 space-y-1">
                    <p className="text-sm font-medium">{selectedOrder.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{selectedOrder.customer_email}</p>
                    {selectedOrder.phone && <p className="text-xs text-muted-foreground">{selectedOrder.phone}</p>}
                    {selectedOrder.address && <p className="text-xs text-muted-foreground">{selectedOrder.address}</p>}
                  </div>
                </div>

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
