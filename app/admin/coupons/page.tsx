"use client"

import * as React from "react"
import { IconSearch, IconRefresh, IconPlus, IconTicket } from "@tabler/icons-react"
import { toast } from "sonner"
import { useApiQuery, useApiMutation } from "@/hooks/use-api"
import { adminService, type Coupon, type CreateCouponData } from "@/lib/services/admin-service"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2 } from "lucide-react"

export default function CouponsPage() {
  const [search, setSearch] = React.useState("")
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [deleteTarget, setDeleteTarget] = React.useState<Coupon | null>(null)

  // Form state
  const [formCode, setFormCode] = React.useState("")
  const [formType, setFormType] = React.useState<"percentage" | "fixed">("percentage")
  const [formValue, setFormValue] = React.useState("")
  const [formMinOrder, setFormMinOrder] = React.useState("")
  const [formMaxUses, setFormMaxUses] = React.useState("")
  const [formEndDate, setFormEndDate] = React.useState("")

  const { data: coupons, isLoading, refetch } = useApiQuery<Coupon[]>(
    ["adminCoupons"],
    "/admin/coupons"
  )

  const createMutation = useApiMutation<{ message: string }, CreateCouponData>(
    (data) => adminService.createCoupon(data).then((res) => res.data),
    {
      onSuccess: (data) => {
        toast.success(data.message || "Coupon created successfully")
        refetch()
        resetForm()
        setDialogOpen(false)
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail?.[0]?.msg || error.response?.data?.detail || "Failed to create coupon")
      },
    }
  )

  const deactivateMutation = useApiMutation<{ message: string }, string>(
    (code) => adminService.deactivateCoupon(code).then((res) => res.data),
    {
      onSuccess: (data) => {
        toast.success(data.message || "Coupon deactivated")
        refetch()
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || "Failed to deactivate coupon")
      },
    }
  )

  const activateMutation = useApiMutation<{ message: string }, string>(
    (code) => adminService.activateCoupon(code).then((res) => res.data),
    {
      onSuccess: (data) => {
        toast.success(data.message || "Coupon reactivated")
        refetch()
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || "Failed to activate coupon")
      },
    }
  )

  const deleteMutation = useApiMutation<{ message: string }, string>(
    (code) => adminService.deleteCoupon(code).then((res) => res.data),
    {
      onSuccess: (data) => {
        toast.success(data.message || "Coupon deleted")
        refetch()
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || "Failed to delete coupon")
      },
    }
  )

  const resetForm = () => {
    setFormCode("")
    setFormType("percentage")
    setFormValue("")
    setFormMinOrder("")
    setFormMaxUses("")
    setFormEndDate("")
  }

  const handleCreate = () => {
    if (!formCode.trim() || !formValue.trim() || !formEndDate) {
      toast.error("Code, discount value, and end date are required.")
      return
    }
    createMutation.mutate({
      code: formCode.trim().toUpperCase(),
      discount_type: formType,
      discount_value: Number(formValue),
      min_order_value: formMinOrder ? Number(formMinOrder) : undefined,
      usage_limit: formMaxUses ? Number(formMaxUses) : undefined,
      end_date: new Date(formEndDate).toISOString(),
    })
  }

  const filteredCoupons = React.useMemo(() => {
    if (!coupons) return []
    if (!search.trim()) return coupons
    const q = search.toLowerCase()
    return coupons.filter((c) => c.code.toLowerCase().includes(q))
  }, [coupons, search])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Coupons</h1>
          <p className="text-sm text-muted-foreground">Manage discount coupons for your store.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <IconPlus className="h-4 w-4" /> Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid gap-2">
                <Label>Coupon Code</Label>
                <Input
                  placeholder="e.g. SUMMER20"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                  className="uppercase"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Discount Type</Label>
                  <Select value={formType} onValueChange={(v) => setFormType(v as "percentage" | "fixed")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed (৳)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Discount Value</Label>
                  <Input
                    type="number"
                    placeholder="10"
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Min Order Value (৳)</Label>
                  <Input
                    type="number"
                    placeholder="Optional"
                    value={formMinOrder}
                    onChange={(e) => setFormMinOrder(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Max Uses</Label>
                  <Input
                    type="number"
                    placeholder="Optional"
                    value={formMaxUses}
                    onChange={(e) => setFormMaxUses(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>End Date</Label>
                <Input
                  type="datetime-local"
                  value={formEndDate}
                  onChange={(e) => setFormEndDate(e.target.value)}
                />
              </div>
              <Button
                onClick={handleCreate}
                disabled={createMutation.isPending}
                className="w-full"
              >
                {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Coupon"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search + Refresh */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <IconSearch className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search coupons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => refetch()}>
          <IconRefresh className="h-4 w-4" />
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              [...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(7)].map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            )}
            {!isLoading && filteredCoupons.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  <IconTicket className="mx-auto h-8 w-8 mb-2 opacity-40" />
                  No coupons found.
                </TableCell>
              </TableRow>
            )}
            {filteredCoupons.map((coupon) => (
              <TableRow key={coupon._id}>
                <TableCell className="font-bold font-mono uppercase">{coupon.code}</TableCell>
                <TableCell className="capitalize">{coupon.discount_type}</TableCell>
                <TableCell>
                  {coupon.discount_type === "percentage"
                    ? `${coupon.discount_value}%`
                    : `৳${coupon.discount_value}`}
                </TableCell>
                <TableCell>{coupon.used_count}{coupon.usage_limit ? ` / ${coupon.usage_limit}` : ""}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(coupon.end_date).toLocaleDateString("en-US", {
                    year: "numeric", month: "short", day: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] font-bold uppercase",
                      coupon.status === "active"
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                        : coupon.status === "scheduled"
                        ? "bg-blue-100 text-blue-700 border-blue-200"
                        : coupon.status === "expired"
                        ? "bg-amber-100 text-amber-700 border-amber-200"
                        : coupon.status === "used_up"
                        ? "bg-orange-100 text-orange-700 border-orange-200"
                        : "bg-red-100 text-red-700 border-red-200"
                    )}
                  >
                    {coupon.status === "active"
                      ? "Active"
                      : coupon.status === "scheduled"
                      ? "Scheduled"
                      : coupon.status === "expired"
                      ? "Expired"
                      : coupon.status === "used_up"
                      ? "Used Up"
                      : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {coupon.status === "active" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        disabled={deactivateMutation.isPending}
                        onClick={() => deactivateMutation.mutate(coupon.code)}
                      >
                        {deactivateMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Deactivate"}
                      </Button>
                    ) : coupon.status === "inactive" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald/10"
                        disabled={activateMutation.isPending}
                        onClick={() => activateMutation.mutate(coupon.code)}
                      >
                        {activateMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Reactivate"}
                      </Button>
                    ) : null}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteTarget(coupon)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Coupon</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete coupon{" "}
              <span className="font-bold font-mono uppercase">{deleteTarget?.code}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (deleteTarget) {
                  deleteMutation.mutate(deleteTarget.code, {
                    onSuccess: () => setDeleteTarget(null),
                  })
                }
              }}
            >
              {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
