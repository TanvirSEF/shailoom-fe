"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Filter, ChevronDown, ShoppingBag, Heart, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/store/use-cart-store"
import { toast } from "sonner"

const PRODUCTS = [
  {
    id: 1,
    name: "Classic Tangail Handloom Tat",
    price: 3500,
    originalPrice: 4200,
    image: "/images/products/sarees/tangail-1.png",
    fabric: "Pure Cotton",
    tag: "Best Seller",
  },
  {
    id: 2,
    name: "Emerald Nakshikantha Half-Silk",
    price: 5800,
    originalPrice: null,
    image: "/images/products/sarees/tangail-2.png",
    fabric: "Half-Silk",
    tag: "New Arrival",
  },
  {
    id: 3,
    name: "Lavender Minimalist Tant",
    price: 2800,
    originalPrice: 3200,
    image: "/images/products/sarees/tangail-3.png",
    fabric: "Organic Cotton",
    tag: null,
  },
  {
    id: 4,
    name: "Royal Blue Zari Silk",
    price: 12500,
    originalPrice: 15000,
    image: "/images/products/sarees/tangail-4.png",
    fabric: "Premium Silk",
    tag: "Premium",
  },
]

export default function SareePage() {
  const addItem = useCartStore((state) => state.addItem)
  const triggerFly = useCartStore((state) => state.triggerFly)

  const handleAddToCart = (product: typeof PRODUCTS[0], e: React.MouseEvent) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      fabric: product.fabric,
      quantity: 1,
    })

    // Find the image container to animate from
    const cardElement = e.currentTarget.closest('.product-card-container') as HTMLElement
    if (cardElement) {
        triggerFly(product.image, cardElement)
    }

    toast.success("Added to cart", {
      description: `${product.name} has been added to your shopping bag.`,
    })
  }
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero Banner */}
      <section className="relative h-[400px] w-full overflow-hidden">
        <Image
          src="/images/products/sarees/tangail-hero.png"
          alt="Tangail Saree Collection"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
          <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-7xl">
            Tangail <span className="italic font-serif text-primary-foreground underline decoration-primary/50">Saree</span>
          </h1>
          <p className="max-w-xl text-lg opacity-90 md:text-xl">
            Experience the heritage of Tangail handloom. Exquisite craftsmanship inherited through generations, delivered to your doorstep.
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

              {/* Category Filter */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm uppercase text-muted-foreground">Fabric Type</h4>
                <div className="space-y-2">
                  {["Pure Cotton", "Half-Silk", "Premium Silk", "Handloom Tat"].map((type) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <div className="h-4 w-4 rounded border border-primary/30 group-hover:border-primary" />
                      <span className="text-sm text-foreground/80 group-hover:text-primary transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm uppercase text-muted-foreground">Price Range</h4>
                <div className="space-y-2">
                  {["Under ৳3,000", "৳3,000 - ৳7,000", "৳7,000 - ৳15,000", "Above ৳15,000"].map((range) => (
                    <label key={range} className="flex items-center gap-3 cursor-pointer group">
                      <div className="h-4 w-4 rounded-full border border-primary/30 group-hover:border-primary" />
                      <span className="text-sm text-foreground/80 group-hover:text-primary transition-colors">{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Color Palette */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm uppercase text-muted-foreground">Color Palette</h4>
                <div className="flex flex-wrap gap-2">
                   {["bg-red-500", "bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-amber-500", "bg-zinc-800"].map((color) => (
                     <div key={color} className={`h-6 w-6 rounded-full cursor-pointer ring-offset-2 hover:ring-2 ring-primary transition-all ${color}`} />
                   ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Top Bar */}
            <div className="mb-8 flex items-center justify-between border-b pb-6">
              <span className="text-sm text-muted-foreground">Showing <span className="font-bold text-foreground">4</span> Tangail Sarees</span>
              <div className="flex items-center gap-4">
                 <Button variant="ghost" size="sm" className="hidden sm:flex gap-2 text-xs font-bold uppercase tracking-widest">
                    Sort By <ChevronDown className="h-3 w-3" />
                 </Button>
                 <Button variant="outline" size="icon" className="lg:hidden">
                    <Filter className="h-4 w-4" />
                 </Button>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {PRODUCTS.map((product) => (
                <div key={product.id} className="product-card-container group relative flex flex-col space-y-4">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-muted transition-all duration-300 group-hover:shadow-2xl">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {product.tag && (
                      <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground font-bold tracking-widest uppercase text-[10px] px-3 py-1">
                        {product.tag}
                      </Badge>
                    )}

                    {/* Quick Actions Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                       <Button size="icon" variant="secondary" className="rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors">
                          <Eye className="h-5 w-5" />
                       </Button>
                       <Button size="icon" variant="secondary" className="rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors">
                          <Heart className="h-5 w-5" />
                       </Button>
                    </div>

                    {/* Desktop Add to Cart Button */}
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
                    <p className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">{product.fabric}</p>
                    <h3 className="text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                       <Link href={`/product/${product.id}`}>
                          {product.name}
                       </Link>
                    </h3>
                    <div className="flex items-center justify-center gap-2">
                       <span className="text-lg font-bold text-foreground">৳{product.price.toLocaleString()}</span>
                       {product.originalPrice && (
                         <span className="text-sm text-muted-foreground line-through decoration-primary/30">৳{product.originalPrice.toLocaleString()}</span>
                       )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Placeholder */}
            <div className="mt-16 flex justify-center">
               <Button variant="outline" className="rounded-full px-8 font-bold uppercase tracking-[0.2em] group">
                  Load More Patterns <ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
               </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
