"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ShoppingBag,
  Heart,
  Eye,
  Star,
  Loader2,
  ChevronDown,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useCartStore } from "@/store/use-cart-store"
import { useApiQuery } from "@/hooks/use-api"
import { cn, getErrorMessage } from "@/lib/utils"
import { toast } from "sonner"
import type { Product, PaginatedProductsResponse } from "@/types/product"

// --- Helpers ---

function isNewArrival(createdAt?: string): boolean {
  if (!createdAt) return false
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  return new Date(createdAt) > thirtyDaysAgo
}

function getDiscountPercent(
  price: number,
  originalPrice?: number
): number | null {
  if (!originalPrice || originalPrice <= price) return null
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

// --- Skeleton ---

function ProductCardSkeleton() {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-background">
      <Skeleton className="aspect-[3/4] w-full rounded-none" />
      <div className="flex flex-1 flex-col p-5 space-y-2">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-5 w-20 mt-auto" />
      </div>
    </div>
  )
}

// --- Main Page ---

export default function NewArrivalsPageWrapper() {
  return (
    <React.Suspense
      fallback={
        <div className="bg-muted/20 px-6 py-16 md:px-12 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <NewArrivalsPage />
    </React.Suspense>
  )
}

function NewArrivalsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const addItem = useCartStore((state) => state.addItem)
  const triggerFly = useCartStore((state) => state.triggerFly)

  const page = Number(searchParams.get("page") || "1")

  // Accumulated products for load more
  const [allProducts, setAllProducts] = React.useState<Product[]>([])

  // Fetch products sorted by newest
  const { data, isLoading, isError, error, refetch } =
    useApiQuery<PaginatedProductsResponse>(
      ["newArrivals", String(page)],
      "/products",
      { sort_by: "newest", page, limit: 12, is_new_arrival: true }
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

  const hasMore = data?.pagination ? page < data.pagination.total_pages : false
  const totalCount = data?.pagination?.total || 0

  function handleAddToCart(product: Product, e: React.MouseEvent) {
    const imageUrl =
      product.images?.[0] || "/images/products/sarees/tangail-1.png"

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: imageUrl,
      fabric: product.fabric || "",
      quantity: 1,
    })

    const cardElement = e.currentTarget.closest(
      ".product-card-container"
    ) as HTMLElement
    if (cardElement) {
      triggerFly(imageUrl, cardElement)
    }

    toast.success("Added to cart", {
      description: `${product.name} has been added to your shopping bag.`,
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero Banner */}
      <section className="relative h-[350px] w-full overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="absolute inset-0 bg-[url('/images/products/sarees/tangail-hero.png')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Just Dropped
            </span>
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-6xl">
            New{" "}
            <span className="italic font-serif text-primary">Arrivals</span>
          </h1>
          <p className="max-w-lg text-muted-foreground md:text-lg">
            Fresh from the loom — our latest handcrafted Tangail sarees, just
            added to the collection.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-12">
        {/* Top Bar */}
        <div className="mb-8 flex items-center justify-between border-b pb-6">
          <span className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-bold text-foreground">
              {allProducts.length}
            </span>{" "}
            of{" "}
            <span className="font-bold text-foreground">{totalCount}</span>{" "}
            products
          </span>
          <Link
            href="/shop/sarees"
            className="text-sm font-medium text-primary hover:underline"
          >
            Browse All Sarees
          </Link>
        </div>

        {/* Error */}
        {isError && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <span>
              Failed to load products.{" "}
              {getErrorMessage(error, "")}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && page === 1 && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && allProducts.length === 0 && !isError && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-6" />
            <h3 className="text-xl font-bold text-foreground mb-2">
              No new arrivals yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Check back soon for new additions to our collection.
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/shop/sarees")}
              className="rounded-full"
            >
              Browse Collection
            </Button>
          </div>
        )}

        {/* Product Grid */}
        {allProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {allProducts.map((product) => {
              const imageUrl =
                product.images?.[0] ||
                "/images/products/sarees/tangail-1.png"
              const discount = getDiscountPercent(
                product.price,
                product.original_price
              )
              const isNew = product.is_new_arrival !== false

              return (
                <div
                  key={String(product.id)}
                  className="product-card-container group relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-background transition-all duration-500 hover:shadow-2xl"
                >
                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Badges */}
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

                    {/* Quick Action Buttons */}
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
                      >
                        <ShoppingBag
                          className="h-4 w-4"
                          onClick={(e) => handleAddToCart(product, e)}
                        />
                      </Button>
                    </div>

                    {/* Quick View Overlay */}
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

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5">
                    {/* Rating + Category */}
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

                    {/* Name */}
                    <h3 className="line-clamp-1 text-base font-bold text-foreground transition-colors group-hover:text-primary">
                      <Link href={`/product/${product.id}`}>
                        {product.name}
                      </Link>
                    </h3>

                    {/* Price */}
                    <div className="mt-auto flex items-center gap-2 pt-3">
                      <span className="text-base font-bold text-foreground">
                        ৳{product.price.toLocaleString()}
                      </span>
                      {product.original_price &&
                        product.original_price > product.price && (
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
                onClick={() => {
                  const params = new URLSearchParams(
                    searchParams.toString()
                  )
                  params.set("page", String(page + 1))
                  router.push(`/new-arrivals?${params.toString()}`, {
                    scroll: false,
                  })
                }}
                className="rounded-full px-8 font-bold uppercase tracking-[0.2em] group"
              >
                Load More{" "}
                <ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
              </Button>
            )}
            {!hasMore && allProducts.length > 0 && (
              <p className="text-sm text-muted-foreground">
                You&apos;ve seen all new arrivals
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
