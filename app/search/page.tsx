"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Search,
  ShoppingBag,
  Heart,
  Eye,
  Star,
  Loader2,
  ChevronDown,
  ArrowLeft,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCartStore } from "@/store/use-cart-store"
import { useApiQuery } from "@/hooks/use-api"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { Product, PaginatedProductsResponse } from "@/types/product"

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "top_rated", label: "Top Rated" },
]

function getDiscountPercent(price: number, originalPrice?: number): number | null {
  if (!originalPrice || originalPrice <= price) return null
  return Math.round(((originalPrice - price) / originalPrice) * 100)
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

export default function SearchPageWrapper() {
  return (
    <React.Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <SearchPage />
    </React.Suspense>
  )
}

function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const page = Number(searchParams.get("page") || "1")
  const sortBy = searchParams.get("sort_by") || "newest"

  const addItem = useCartStore((state) => state.addItem)
  const triggerFly = useCartStore((state) => state.triggerFly)

  const [localQuery, setLocalQuery] = React.useState(query)
  const [allProducts, setAllProducts] = React.useState<Product[]>([])

  React.useEffect(() => {
    setLocalQuery(query)
  }, [query])

  const { data, isLoading, isError, error, refetch } =
    useApiQuery<PaginatedProductsResponse>(
      ["search", query, String(page), sortBy],
      "/products",
      { search: query, sort_by: sortBy, page, limit: 12 },
      { enabled: !!query }
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
  }, [query, sortBy])

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
    router.push(`/search?${params.toString()}`, { scroll: false })
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (localQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(localQuery.trim())}`)
    }
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

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-6 md:px-12">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  placeholder="Search products..."
                  className="h-12 rounded-xl pl-12 pr-4 text-base"
                  autoFocus
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 md:px-12">
        {/* No query */}
        {!query && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Search className="h-16 w-16 text-muted-foreground/30 mb-6" />
            <h2 className="text-xl font-bold mb-2">Search for products</h2>
            <p className="text-muted-foreground max-w-md">
              Type something in the search bar to find sarees, fabrics, and more.
            </p>
          </div>
        )}

        {/* Results header */}
        {query && (
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Results for &ldquo;{query}&rdquo;
              </h1>
              {!isLoading && (
                <p className="text-sm text-muted-foreground mt-1">
                  {totalCount} product{totalCount !== 1 ? "s" : ""} found
                </p>
              )}
            </div>
            <Select
              value={sortBy}
              onValueChange={(value) => updateParams({ sort_by: value })}
            >
              <SelectTrigger className="w-[200px] rounded-xl">
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
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <span>Failed to search. {(error as any)?.message || ""}</span>
            <Button variant="ghost" size="sm" className="ml-auto" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        )}

        {/* Loading */}
        {isLoading && page === 1 && query && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* No results */}
        {!isLoading && query && allProducts.length === 0 && !isError && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Search className="h-16 w-16 text-muted-foreground/30 mb-6" />
            <h3 className="text-xl font-bold mb-2">No results found</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              We couldn&apos;t find any products matching &ldquo;{query}&rdquo;.
              Try a different search term.
            </p>
            <Button variant="outline" asChild className="rounded-full">
              <Link href="/shop/sarees">Browse All Sarees</Link>
            </Button>
          </div>
        )}

        {/* Product Grid */}
        {allProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {allProducts.map((product) => {
              const imageUrl = product.images?.[0] || "/images/products/sarees/tangail-1.png"
              const discount = getDiscountPercent(product.price, product.original_price)
              const isNew = product.is_new_arrival !== false

              return (
                <div
                  key={String(product.id)}
                  className="product-card-container group relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-background transition-all duration-500 hover:shadow-2xl"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {isNew && (
                      <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground font-bold tracking-widest uppercase text-[10px] px-3 py-1 rounded-full">
                        New
                      </Badge>
                    )}
                    {discount && (
                      <Badge className="absolute top-3 right-3 bg-destructive text-white font-bold text-[10px] px-3 py-1 rounded-full">
                        -{discount}%
                      </Badge>
                    )}

                    <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors"
                        onClick={(e) => handleAddToCart(product, e)}
                      >
                        <ShoppingBag className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                      <Button
                        asChild
                        variant="secondary"
                        className="w-full rounded-full font-bold uppercase tracking-widest text-xs shadow-lg"
                      >
                        <Link href={`/product/${product.id}`}>
                          <Eye className="mr-2 h-3 w-3" /> Quick View
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-2 flex items-center gap-2">
                      {(product.average_rating ?? 0) > 0 && (
                        <div className="flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-primary text-primary" />
                          <span className="text-xs font-medium">
                            {product.average_rating?.toFixed(1)}
                          </span>
                        </div>
                      )}
                      {product.category && (
                        <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                          {product.category}
                        </span>
                      )}
                    </div>

                    <h3 className="line-clamp-1 text-base font-bold text-foreground transition-colors group-hover:text-primary">
                      <Link href={`/product/${product.id}`}>{product.name}</Link>
                    </h3>

                    {product.fabric && (
                      <p className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase mt-1">
                        {product.fabric}
                      </p>
                    )}

                    <div className="mt-auto flex items-center gap-2 pt-3">
                      <span className="text-base font-bold text-foreground">
                        ৳{product.price.toLocaleString()}
                      </span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-sm text-muted-foreground line-through decoration-primary/30">
                          ৳{product.original_price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Load More */}
        {allProducts.length > 0 && (
          <div className="mt-16 flex flex-col items-center gap-3">
            {isLoading && page > 1 && (
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            )}
            {hasMore && !(isLoading && page > 1) && (
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
                Showing all {totalCount} results
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
