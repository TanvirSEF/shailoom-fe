"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Filter,
  ChevronDown,
  ShoppingBag,
  Heart,
  Eye,
  Star,
  Loader2,
  X,
  Flame,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"
import { useCartStore } from "@/store/use-cart-store"
import { useApiQuery } from "@/hooks/use-api"
import { cn, getErrorMessage } from "@/lib/utils"
import { toast } from "sonner"
import type { Product, PaginatedProductsResponse } from "@/types/product"

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "top_rated", label: "Top Rated" },
]

const PRICE_RANGES: {
  label: string
  min: number | undefined
  max: number | undefined
}[] = [
  { label: "Under ৳2,000", min: undefined, max: 2000 },
  { label: "৳2,000 - ৳5,000", min: 2000, max: 5000 },
  { label: "৳5,000 - ৳10,000", min: 5000, max: 10000 },
  { label: "Above ৳10,000", min: 10000, max: undefined },
]

const CATEGORY_OPTIONS = [
  "Saree",
  "Three-Piece",
  "Kurta",
  "Panjabi",
  "Fatua",
  "Shirt",
  "Trousers",
  "Dupatta",
]

function isNewArrival(createdAt?: string): boolean {
  if (!createdAt) return false
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  return new Date(createdAt) > thirtyDaysAgo
}

function getDiscountPercent(price: number, originalPrice?: number): number | null {
  if (!originalPrice || originalPrice <= price) return null
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

function FilterControls({
  selectedCategory,
  minPrice,
  maxPrice,
  updateParams,
}: {
  selectedCategory: string | undefined
  minPrice: number | undefined
  maxPrice: number | undefined
  updateParams: (updates: Record<string, string | undefined>) => void
}) {
  const activeRangeIndex = PRICE_RANGES.findIndex(
    (r) => r.min === minPrice && r.max === maxPrice
  )

  return (
    <div className="space-y-8">
      {/* Category */}
      <div className="space-y-4">
        <h4 className="font-bold text-sm uppercase text-muted-foreground">
          Category
        </h4>
        <div className="space-y-2">
          {CATEGORY_OPTIONS.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => {
                updateParams({
                  category: selectedCategory === cat ? undefined : cat,
                })
              }}
            >
              <div
                className={cn(
                  "h-4 w-4 rounded border transition-colors",
                  selectedCategory === cat
                    ? "bg-primary border-primary"
                    : "border-primary/30 group-hover:border-primary"
                )}
              />
              <span
                className={cn(
                  "text-sm transition-colors",
                  selectedCategory === cat
                    ? "text-primary font-medium"
                    : "text-foreground/80 group-hover:text-primary"
                )}
              >
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <h4 className="font-bold text-sm uppercase text-muted-foreground">
          Price Range
        </h4>
        <div className="space-y-2">
          {PRICE_RANGES.map((range, index) => (
            <label
              key={range.label}
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => {
                if (activeRangeIndex === index) {
                  updateParams({ min_price: undefined, max_price: undefined })
                } else {
                  updateParams({
                    min_price: range.min?.toString(),
                    max_price: range.max?.toString(),
                  })
                }
              }}
            >
              <div
                className={cn(
                  "h-4 w-4 rounded-full border-2 transition-colors",
                  activeRangeIndex === index
                    ? "bg-primary border-primary"
                    : "border-primary/30 group-hover:border-primary"
                )}
              />
              <span
                className={cn(
                  "text-sm transition-colors",
                  activeRangeIndex === index
                    ? "text-primary font-medium"
                    : "text-foreground/80 group-hover:text-primary"
                )}
              >
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProductCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
      <div className="space-y-2 text-center">
        <Skeleton className="mx-auto h-3 w-16" />
        <Skeleton className="mx-auto h-5 w-48" />
        <Skeleton className="mx-auto h-5 w-24" />
      </div>
    </div>
  )
}

export default function SalePageWrapper() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen flex-col bg-background">
          <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <SalePage />
    </React.Suspense>
  )
}

function SalePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const addItem = useCartStore((state) => state.addItem)
  const triggerFly = useCartStore((state) => state.triggerFly)

  const page = Number(searchParams.get("page") || "1")
  const sortBy = searchParams.get("sort_by") || "newest"
  const selectedCategory = searchParams.get("category") || undefined
  const minPrice = searchParams.get("min_price") ? Number(searchParams.get("min_price")) : undefined
  const maxPrice = searchParams.get("max_price") ? Number(searchParams.get("max_price")) : undefined

  const [filterDrawerOpen, setFilterDrawerOpen] = React.useState(false)
  const [allProducts, setAllProducts] = React.useState<Product[]>([])

  const apiParams: Record<string, unknown> = {
    is_on_sale: true,
    page,
    limit: 12,
    sort_by: sortBy,
  }
  if (selectedCategory) apiParams.category = selectedCategory
  if (minPrice !== undefined) apiParams.min_price = minPrice
  if (maxPrice !== undefined) apiParams.max_price = maxPrice

  const { data, isLoading, isError, error, refetch } =
    useApiQuery<PaginatedProductsResponse>(
      [
        "products",
        "sale",
        String(page),
        sortBy,
        selectedCategory || "",
        String(minPrice),
        String(maxPrice),
      ],
      "/products",
      apiParams
    )

  React.useEffect(() => {
    if (data?.products) {
      if (page === 1) {
        setAllProducts(data.products)
      } else {
        setAllProducts((prev) => [...prev, ...data.products])
      }
    }
  }, [data, page])

  React.useEffect(() => {
    setAllProducts([])
  }, [sortBy, selectedCategory, minPrice, maxPrice])

  function updateParams(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    if (!("page" in updates)) {
      params.set("page", "1")
    }
    router.push(`/sale?${params.toString()}`, { scroll: false })
  }

  function handleAddToCart(product: Product, e: React.MouseEvent) {
    const imageUrl = product.images?.[0] || "/images/products/sarees/tangail-1.png"

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: imageUrl,
      fabric: product.fabric || "",
      quantity: 1,
    })

    const cardElement = e.currentTarget.closest(".product-card-container") as HTMLElement
    if (cardElement) {
      triggerFly(imageUrl, cardElement)
    }

    toast.success("Added to cart", {
      description: `${product.name} has been added to your shopping bag.`,
    })
  }

  const hasMore = data?.pagination ? page < data.pagination.total_pages : false
  const totalCount = data?.pagination?.total || 0
  const isLoadMoreLoading = isLoading && page > 1

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero Banner */}
      <section className="relative h-[400px] w-full overflow-hidden">
        <Image
          src="/images/home/shailoombanner1.png"
          alt="Sale Collection"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
          <div className="mb-4 flex items-center gap-2">
            <Flame className="h-6 w-6 text-primary" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Limited Time
            </span>
            <Flame className="h-6 w-6 text-primary" />
          </div>
          <h1 className="mb-3 text-5xl font-bold tracking-tight md:text-7xl">
            Hot{" "}
            <span className="italic font-serif text-primary-foreground underline decoration-primary/50">
              Sale
            </span>
          </h1>
          <p className="max-w-xl text-lg opacity-90 md:text-xl">
            Grab exclusive deals on handcrafted pieces. Limited stock, unbeatable prices.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden w-64 flex-shrink-0 lg:block">
            <div className="sticky top-24 space-y-8">
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold uppercase tracking-widest">
                  <Filter className="h-4 w-4 text-primary" /> Filters
                </h3>
                <div className="h-1 w-12 bg-primary" />
              </div>

              <FilterControls
                selectedCategory={selectedCategory}
                minPrice={minPrice}
                maxPrice={maxPrice}
                updateParams={updateParams}
              />

              {(selectedCategory || minPrice !== undefined || maxPrice !== undefined) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-muted-foreground hover:text-destructive"
                  onClick={() => router.push("/sale")}
                >
                  <X className="mr-1 h-3 w-3" /> Clear All Filters
                </Button>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Top Bar */}
            <div className="mb-8 flex items-center justify-between border-b pb-6">
              <span className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-bold text-foreground">{allProducts.length}</span>{" "}
                of{" "}
                <span className="font-bold text-foreground">{totalCount}</span>{" "}
                sale items
              </span>
              <div className="flex items-center gap-4">
                <Select
                  value={sortBy}
                  onValueChange={(value) => updateParams({ sort_by: value })}
                >
                  <SelectTrigger className="hidden sm:flex gap-2 text-xs font-bold uppercase tracking-widest w-auto border-none shadow-none h-auto p-0">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setFilterDrawerOpen(true)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Error */}
            {isError && (
              <div className="mb-8 flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                <span>
                  Failed to load products.{" "}
                  {getErrorMessage(error, "")}
                </span>
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            )}

            {/* Loading */}
            {isLoading && page === 1 && (
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Empty */}
            {!isLoading && allProducts.length === 0 && !isError && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-6" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  No sale items found
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  No products are currently on sale. Check back soon for deals!
                </p>
                <Button
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="rounded-full"
                >
                  Browse All Products
                </Button>
              </div>
            )}

            {/* Product Grid */}
            {allProducts.length > 0 && (
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                {allProducts.map((product) => {
                  const imageUrl = product.images?.[0] || "/images/products/sarees/tangail-1.png"
                  const discount = getDiscountPercent(product.price, product.original_price)
                  const isNew = isNewArrival(product.created_at)

                  return (
                    <div
                      key={String(product.id)}
                      className="product-card-container group relative flex flex-col space-y-4"
                    >
                      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-muted transition-all duration-300 group-hover:shadow-2xl">
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Badges */}
                        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                          <Badge className="bg-destructive text-white font-bold tracking-widest uppercase text-[10px] px-3 py-1">
                            Sale
                          </Badge>
                          {isNew && (
                            <Badge className="bg-primary text-primary-foreground font-bold tracking-widest uppercase text-[10px] px-3 py-1">
                              New
                            </Badge>
                          )}
                        </div>
                        {discount && (
                          <Badge className="absolute top-4 right-4 bg-black/70 text-white font-bold text-[10px] px-3 py-1">
                            -{discount}%
                          </Badge>
                        )}

                        {/* Quick Actions */}
                        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <Button
                            size="icon"
                            variant="secondary"
                            asChild
                            className="rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors"
                          >
                            <Link href={`/product/${product.id}`}>
                              <Eye className="h-5 w-5" />
                            </Link>
                          </Button>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors"
                          >
                            <Heart className="h-5 w-5" />
                          </Button>
                        </div>

                        {/* Add to Cart */}
                        <div className="absolute bottom-0 w-full translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
                          <Button
                            onClick={(e) => handleAddToCart(product, e)}
                            className="w-full rounded-xl font-bold uppercase tracking-widest shadow-2xl"
                          >
                            <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 space-y-1 text-center">
                        {product.fabric && (
                          <p className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
                            {product.fabric}
                          </p>
                        )}
                        <h3 className="text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                          <Link href={`/product/${product.id}`}>
                            {product.name}
                          </Link>
                        </h3>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-lg font-bold text-foreground">
                            ৳{product.price.toLocaleString()}
                          </span>
                          {product.original_price && product.original_price > product.price && (
                            <span className="text-sm text-muted-foreground line-through decoration-primary/30">
                              ৳{product.original_price.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {(product.average_rating ?? 0) > 0 && (
                          <div className="flex items-center justify-center gap-1 pt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-3 w-3",
                                  i < Math.round(product.average_rating ?? 0)
                                    ? "fill-primary text-primary"
                                    : "text-muted-foreground opacity-30"
                                )}
                              />
                            ))}
                            <span className="ml-1 text-xs text-muted-foreground">
                              ({product.review_count ?? 0})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Load More */}
            {allProducts.length > 0 && (
              <div className="mt-16 flex flex-col items-center gap-3">
                {isLoadMoreLoading && (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                )}
                {hasMore && !isLoadMoreLoading && (
                  <Button
                    variant="outline"
                    onClick={() => updateParams({ page: String(page + 1) })}
                    className="rounded-full px-8 font-bold uppercase tracking-[0.2em] group"
                  >
                    Load More{" "}
                    <ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
                  </Button>
                )}
                {!hasMore && allProducts.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    You&apos;ve reached the end of the sale
                  </p>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <Sheet open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen}>
        <SheetContent side="left" className="w-[300px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-lg font-bold uppercase tracking-widest">
              <Filter className="h-4 w-4 text-primary" /> Filters
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterControls
              selectedCategory={selectedCategory}
              minPrice={minPrice}
              maxPrice={maxPrice}
              updateParams={(updates) => {
                updateParams(updates)
                setFilterDrawerOpen(false)
              }}
            />
          </div>
          {(selectedCategory || minPrice !== undefined || maxPrice !== undefined) && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-6 text-xs text-muted-foreground hover:text-destructive"
              onClick={() => {
                router.push("/sale")
                setFilterDrawerOpen(false)
              }}
            >
              <X className="mr-1 h-3 w-3" /> Clear All Filters
            </Button>
          )}
          <SheetClose asChild>
            <Button className="w-full mt-6 rounded-xl">Apply Filters</Button>
          </SheetClose>
        </SheetContent>
      </Sheet>
    </div>
  )
}
