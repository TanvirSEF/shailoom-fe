"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProductQuickView } from "@/components/product-quick-view"

const PRODUCTS = [
  {
    id: 1,
    name: "Classic Silk Jamdani Saree",
    category: "Saree",
    price: 12500,
    originalPrice: 15000,
    image: "/images/products/jamdani-1.png",
    rating: 4.8,
    isNew: true,
  },
  {
    id: 2,
    name: "Designer Boutique 3-Piece Suite",
    category: "Three-Piece",
    price: 5800,
    originalPrice: 7200,
    image: "/images/products/boutique-1.png",
    rating: 4.9,
    isHot: true,
  },
  {
    id: 3,
    name: "Royal Muslin Handloom Saree",
    category: "Saree",
    price: 22000,
    originalPrice: 25000,
    image: "/images/products/muslin-1.png",
    rating: 5.0,
    isNew: true,
  },
  {
    id: 4,
    name: "Floral Print Salwar Kameez",
    category: "Three-Piece",
    price: 4500,
    originalPrice: 5500,
    image: "/images/products/kameez-1.png",
    rating: 4.7,
  },
]

export function NewArrivals() {
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = React.useState(false)

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
            href="/shop/new-arrivals"
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            View All New Arrivals &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-background transition-all duration-500 hover:shadow-2xl"
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <Image
                  src={product.image || "/images/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                  {product.isNew && (
                    <Badge className="border-none bg-primary px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase">
                      New
                    </Badge>
                  )}
                  {product.isHot && (
                    <Badge className="border-none bg-destructive px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase">
                      Hot
                    </Badge>
                  )}
                </div>

                {/* Quick Actions */}
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

                {/* Quick View Overlay (Mobile & Hover) */}
                <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-4 transition-transform duration-500 group-hover:translate-y-0">
                  <Button
                    className="w-full rounded-full bg-white font-semibold text-black hover:bg-white/90"
                    onClick={() => handleQuickView(product)}
                  >
                    Quick View
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex items-center gap-1">
                  <div className="flex text-yellow-400">
                    <Star className="h-3 w-3 fill-current" />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground">
                    {product.rating}
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
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through opacity-60">
                      ৳{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
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
