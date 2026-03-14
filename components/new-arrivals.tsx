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
    <section className="py-16 px-6 md:py-24 md:px-12 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="text-left">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">
              New Arrivals
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Freshly crafted pieces from our latest collection. 
              Be the first to wear the season's most exquisite designs.
            </p>
          </div>
          <Link 
            href="/shop/new-arrivals" 
            className="text-sm font-semibold text-primary hover:underline underline-offset-4"
          >
            View All New Arrivals &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="group relative flex flex-col bg-background rounded-xl overflow-hidden border border-border/50 hover:shadow-2xl transition-all duration-500"
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
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                  {product.isNew && (
                    <Badge className="bg-primary text-white border-none px-3 py-1 text-[10px] uppercase tracking-wider font-bold">
                      New
                    </Badge>
                  )}
                  {product.isHot && (
                    <Badge className="bg-destructive text-white border-none px-3 py-1 text-[10px] uppercase tracking-wider font-bold">
                      Hot
                    </Badge>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 z-10">
                  <Button size="icon" variant="secondary" className="rounded-full shadow-md hover:bg-primary hover:text-white">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="rounded-full shadow-md hover:bg-primary hover:text-white">
                    <ShoppingBag className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quick View Overlay (Mobile & Hover) */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/80 to-transparent">
                  <Button 
                    className="w-full bg-white text-black hover:bg-white/90 font-semibold rounded-full"
                    onClick={() => handleQuickView(product)}
                  >
                    Quick View
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex text-yellow-400">
                    <Star className="h-3 w-3 fill-current" />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground">{product.rating}</span>
                  <span className="mx-1 text-muted-foreground/30">|</span>
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-tighter">
                    {product.category}
                  </span>
                </div>
                
                <h3 className="font-bold text-base mb-2 text-foreground line-clamp-1 group-hover:text-primary transition-colors">
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
