"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductQuickView } from "@/components/product-quick-view"
import { useApiQuery } from "@/hooks/use-api"
import type { Product } from "@/types/product"

export function NewArrivals() {
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = React.useState(false)

  const { data, isLoading } = useApiQuery<{ products: Product[] }>(
    ["newArrivals"],
    "/products?is_new_arrival=true&sort_by=newest&limit=8"
  )

  const products = data?.products ?? []

  const handleQuickView = (product: any) => {
    setSelectedProduct(product)
    setIsQuickViewOpen(true)
  }

  return (
    <section className="bg-muted/20 px-6 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-end justify-between gap-4 md:flex-row">
          <div className="text-left">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              New Arrivals
            </h2>
            <p className="max-w-xl text-lg text-muted-foreground">
              Freshly crafted pieces from our latest collection. Be the first to
              wear the season's most exquisite designs.
            </p>
          </div>
          <Link
            href="/new-arrivals"
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            View All New Arrivals &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col overflow-hidden rounded-xl border">
                  <Skeleton className="aspect-[3/4] w-full" />
                  <div className="space-y-3 p-5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
              ))
            : products.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-background transition-all duration-500 hover:shadow-2xl"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                    <Image
                      src={product.images?.[0] || product.image || "/images/placeholder.png"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {product.is_on_sale && (
                      <Badge className="absolute top-3 left-3 z-10 border-none bg-destructive px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase">
                        Sale
                      </Badge>
                    )}

                    <div className="absolute top-3 right-3 z-10 flex translate-x-12 flex-col gap-2 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full shadow-md hover:bg-primary hover:text-white"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full shadow-md hover:bg-primary hover:text-white"
                      >
                        <ShoppingBag className="h-4 w-4" />
                      </Button>
                    </div>

                    <div
                      className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-4 transition-transform duration-500 group-hover:translate-y-0"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleQuickView(product)
                      }}
                    >
                      <Button className="w-full rounded-full bg-white font-semibold text-black hover:bg-white/90">
                        Quick View
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-2 flex items-center gap-1">
                      <div className="flex text-yellow-400">
                        <Star className="h-3 w-3 fill-current" />
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground">
                        {product.average_rating ?? product.rating ?? "—"}
                      </span>
                      <span className="mx-1 text-muted-foreground/30">|</span>
                      <span className="text-[10px] font-medium tracking-tighter text-muted-foreground uppercase">
                        {product.category}
                      </span>
                    </div>

                    <h3 className="mb-2 line-clamp-1 text-base font-bold text-foreground transition-colors group-hover:text-primary">
                      {product.name}
                    </h3>

                    <div className="mt-auto flex items-center gap-3">
                      <span className="text-lg font-bold text-foreground">
                        ৳{product.price.toLocaleString()}
                      </span>
                      {product.original_price && (
                        <span className="text-sm text-muted-foreground line-through opacity-60">
                          ৳{product.original_price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>

      <ProductQuickView
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </section>
  )
}
