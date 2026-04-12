"use client"

import * as React from "react"
import {
  IconSearch,
  IconPlus,
  IconTrash,
  IconAlertTriangle,
  IconRefresh,
  IconBox,
  IconPackage,
  IconChevronLeft,
  IconChevronRight,
  IconUpload,
  IconX,
} from "@tabler/icons-react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useApiQuery, useApiMutation } from "@/hooks/use-api"
import { productService } from "@/lib/services/product-service"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Product {
  id: string | number
  name: string
  price?: number
  stock?: number
  category?: string
  image_url?: string
  images?: string[]
  status?: string
  description?: string
  fabric?: string
  sizes?: string | string[]
  colors?: string | string[]
  [key: string]: unknown
}

interface LowStockAlert {
  product_id: string | number
  product_name: string
  current_stock: number
  threshold: number
}

const addProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().positive("Price must be positive"),
  category: z.string().min(1, "Category is required"),
  stock: z.coerce.number().int().min(0, "Stock must be 0 or more"),
  sizes: z.string().min(1, 'Sizes required, e.g. S, M, L'),
  colors: z.string().min(1, 'Colors required, e.g. Red, Blue'),
})

type AddProductForm = z.infer<typeof addProductSchema>

function AddProductDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onSuccess: () => void
}) {
  const [imageFiles, setImageFiles] = React.useState<File[]>([])
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([])
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddProductForm>({
    resolver: zodResolver(addProductSchema),
  })

  const createMutation = useApiMutation(productService.createProduct, {
    onSuccess: () => {
      toast.success("Product created successfully")
      reset()
      setImageFiles([])
      setImagePreviews([])
      onOpenChange(false)
      onSuccess()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.detail ?? "Failed to create product")
    },
  })

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setImageFiles((prev) => [...prev, ...files])
    const previews = files.map((f) => URL.createObjectURL(f))
    setImagePreviews((prev) => [...prev, ...previews])
  }

  function removeImage(idx: number) {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx))
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[idx])
      return prev.filter((_, i) => i !== idx)
    })
  }

  function onSubmit(values: AddProductForm) {
    if (imageFiles.length === 0) {
      toast.error("Please upload at least one product image")
      return
    }

    const formData = new FormData()
    formData.append("name", values.name)
    formData.append("description", values.description)
    formData.append("price", String(values.price))
    formData.append("category", values.category)
    formData.append("stock", String(values.stock))

    const sizesArr = values.sizes.split(",").map((s) => s.trim()).filter(Boolean)
    const colorsArr = values.colors.split(",").map((c) => c.trim()).filter(Boolean)
    formData.append("sizes", JSON.stringify(sizesArr))
    formData.append("colors", JSON.stringify(colorsArr))

    imageFiles.forEach((file) => {
      formData.append("image_files", file)
    })

    createMutation.mutate(formData)
  }

  function handleClose() {
    if (createMutation.isPending) return
    reset()
    setImageFiles([])
    imagePreviews.forEach((url) => URL.revokeObjectURL(url))
    setImagePreviews([])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="rounded-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the details below. Images are uploaded to Cloudflare R2.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-2">
          {/* Name + Category row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. Linen Kurta"
                className="rounded-xl"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Input
                id="category"
                placeholder="e.g. Kurta, Panjabi"
                className="rounded-xl"
                {...register("category")}
              />
              {errors.category && (
                <p className="text-xs text-destructive">{errors.category.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Product description..."
              rows={3}
              className="rounded-xl resize-none"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Price + Stock row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="price">
                Price (৳) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                className="rounded-xl"
                {...register("price")}
              />
              {errors.price && (
                <p className="text-xs text-destructive">{errors.price.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stock">
                Stock <span className="text-destructive">*</span>
              </Label>
              <Input
                id="stock"
                type="number"
                min={0}
                step="1"
                placeholder="0"
                className="rounded-xl"
                {...register("stock")}
              />
              {errors.stock && (
                <p className="text-xs text-destructive">{errors.stock.message}</p>
              )}
            </div>
          </div>

          {/* Sizes + Colors row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="sizes">
                Sizes <span className="text-destructive">*</span>
              </Label>
              <Input
                id="sizes"
                placeholder="S, M, L, XL"
                className="rounded-xl"
                {...register("sizes")}
              />
              <p className="text-xs text-muted-foreground">Comma-separated → sent as JSON array</p>
              {errors.sizes && (
                <p className="text-xs text-destructive">{errors.sizes.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="colors">
                Colors <span className="text-destructive">*</span>
              </Label>
              <Input
                id="colors"
                placeholder="White, Black, Navy"
                className="rounded-xl"
                {...register("colors")}
              />
              <p className="text-xs text-muted-foreground">Comma-separated → sent as JSON array</p>
              {errors.colors && (
                <p className="text-xs text-destructive">{errors.colors.message}</p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>
              Images <span className="text-destructive">*</span>
            </Label>
            <div
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/25 p-6 transition-colors hover:border-primary/40 hover:bg-muted/30"
              onClick={() => fileInputRef.current?.click()}
            >
              <IconUpload className="size-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Click to upload images
              </p>
              <p className="text-xs text-muted-foreground/60">PNG, JPG, WEBP supported</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={src}
                      alt={`preview-${idx}`}
                      className="h-20 w-20 rounded-xl object-cover border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-destructive text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <IconX className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl cursor-pointer"
              onClick={handleClose}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl cursor-pointer"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Creating..." : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function ProductsPage() {
  const [search, setSearch] = React.useState("")
  const [deleteTarget, setDeleteTarget] = React.useState<Product | null>(null)
  const [addOpen, setAddOpen] = React.useState(false)
  const [page, setPage] = React.useState(0)

  const { data: products, isLoading, isError, error, refetch } = useApiQuery<Product[]>(
    ["adminProducts"],
    "/products",
    { limit: 50, sort_by: "newest" },
    { enabled: true, staleTime: 0, refetchOnMount: true }
  )

  const { data: lowStockAlerts } = useApiQuery<LowStockAlert[]>(
    ["lowStockAlerts"],
    "/admin/analytics/low-stock",
    undefined,
    { enabled: true }
  )

  const deleteMutation = useApiMutation(productService.deleteProduct, {
    onSuccess: () => {
      toast.success("Product deleted successfully")
      setDeleteTarget(null)
      refetch()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.detail ?? "Failed to delete product")
    },
  })

  const filteredProducts = React.useMemo(() => {
    if (!products) return []
    const normalized = products.map((p: any) => ({
      ...p,
      id: p.id ?? p._id,
    }))
    if (!search) return normalized
    const q = search.toLowerCase()
    return normalized.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    )
  }, [products, search])

  const inStockCount = React.useMemo(
    () => (products ?? []).filter((p) => (p.stock ?? 0) > 0).length,
    [products]
  )
  const outOfStockCount = React.useMemo(
    () => (products ?? []).filter((p) => (p.stock ?? 0) === 0).length,
    [products]
  )
  const lowStockCount = lowStockAlerts?.length ?? 0

  const pageSize = 10
  const totalPages = Math.ceil(filteredProducts.length / pageSize)
  const pagedProducts = filteredProducts.slice(page * pageSize, (page + 1) * pageSize)

  React.useEffect(() => {
    setPage(0)
  }, [search])

  return (
    <div className="flex flex-1 flex-col gap-6 pb-20 px-4 lg:px-6 mt-6">

      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Products</h2>
        <p className="text-sm text-muted-foreground">Manage your product catalogue</p>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card className="rounded-2xl border-none bg-card/60 shadow-lg shadow-black/5 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardDescription className="text-xs font-bold uppercase tracking-widest">Total Products</CardDescription>
              <IconPackage className="size-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{(products ?? []).length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none bg-card/60 shadow-lg shadow-black/5 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardDescription className="text-xs font-bold uppercase tracking-widest">In Stock</CardDescription>
              <div className="size-2 rounded-full bg-emerald-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{inStockCount}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none bg-card/60 shadow-lg shadow-black/5 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardDescription className="text-xs font-bold uppercase tracking-widest">Out of Stock</CardDescription>
              <div className="size-2 rounded-full bg-red-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{outOfStockCount}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none bg-card/60 shadow-lg shadow-black/5 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardDescription className="text-xs font-bold uppercase tracking-widest">Low Stock</CardDescription>
              <IconAlertTriangle className="size-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{lowStockCount}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Low Stock Alerts */}
      {lowStockAlerts && lowStockAlerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <IconAlertTriangle className="size-4 text-yellow-500" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-yellow-600 dark:text-yellow-400">
              Low Stock Alerts
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {lowStockAlerts.slice(0, 4).map((alert) => (
              <Card key={String(alert.product_id)} className="rounded-2xl border-yellow-200 bg-yellow-50/50 dark:border-yellow-900/40 dark:bg-yellow-900/10">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium truncate max-w-[160px]">{alert.product_name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Stock: <span className="font-bold text-yellow-600 dark:text-yellow-400">{alert.current_stock}</span> / {alert.threshold}
                      </p>
                    </div>
                    <IconAlertTriangle className="size-4 text-yellow-500 shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
        </p>
        <div className="flex items-center gap-3">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-64 rounded-xl pl-9"
            />
          </div>
          <Button
            className="h-10 rounded-xl shadow-sm cursor-pointer"
            onClick={() => setAddOpen(true)}
          >
            <IconPlus className="size-4 mr-2" />
            Add Product
          </Button>
          <Button variant="outline" size="icon" className="rounded-xl cursor-pointer" onClick={() => refetch()}>
            <IconRefresh className="size-4" />
          </Button>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <IconAlertTriangle className="size-4 shrink-0" />
          <span>Failed to load products: {(error as any)?.response?.data?.detail ?? (error as any)?.message ?? "Unknown error"}</span>
          <Button variant="ghost" size="sm" className="ml-auto rounded-lg" onClick={() => refetch()}>Retry</Button>
        </div>
      )}

      {/* Products Table */}
      <div className="overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-sm">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : pagedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <IconBox className="size-12 text-muted-foreground/40 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No products found</p>
            <p className="text-sm text-muted-foreground/70">Add your first product to get started</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="hidden sm:table-cell w-14">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden lg:table-cell">Sizes</TableHead>
                  <TableHead className="hidden lg:table-cell">Colors</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedProducts.map((product) => {
                  const mainImage =
                    product.image_url ||
                    (Array.isArray(product.images) ? product.images[0] : undefined)

                  const sizesDisplay = Array.isArray(product.sizes)
                    ? product.sizes.join(", ")
                    : typeof product.sizes === "string"
                    ? product.sizes
                    : "—"

                  const colorsDisplay = Array.isArray(product.colors)
                    ? product.colors.join(", ")
                    : typeof product.colors === "string"
                    ? product.colors
                    : "—"

                  return (
                    <TableRow key={String(product.id)} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="hidden sm:table-cell">
                        {mainImage ? (
                          <div className="h-10 w-10 rounded-lg overflow-hidden bg-muted">
                            <img src={mainImage} alt={product.name} className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center">
                            <IconBox className="size-4 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{product.name}</span>
                          {product.description && (
                            <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                              {product.description}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className="rounded-full text-xs">
                          {product.category || "—"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                        {sizesDisplay}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                        {colorsDisplay}
                      </TableCell>
                      <TableCell className="font-semibold">৳{product.price?.toLocaleString() ?? 0}</TableCell>
                      <TableCell>
                        <span className={cn(
                          "text-sm font-medium",
                          (product.stock ?? 0) === 0
                            ? "text-red-500"
                            : (product.stock ?? 0) <= 5
                            ? "text-yellow-500"
                            : "text-foreground"
                        )}>
                          {product.stock ?? 0}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-full text-xs border-none",
                            (product.stock ?? 0) > 0
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          )}
                        >
                          {(product.stock ?? 0) > 0 ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-lg text-destructive hover:bg-destructive/10 cursor-pointer"
                          onClick={() => setDeleteTarget(product)}
                        >
                          <IconTrash className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t px-4 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, filteredProducts.length)} of {filteredProducts.length}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 rounded-lg cursor-pointer"
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
                  className="size-8 rounded-lg cursor-pointer"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages - 1}
                >
                  <IconChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Product Dialog */}
      <AddProductDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSuccess={() => refetch()}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="rounded-xl cursor-pointer" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl cursor-pointer"
              disabled={deleteMutation.isPending}
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
