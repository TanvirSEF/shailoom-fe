"use client"

import Image from "next/image"
import { Heart, ShoppingBag, Star, X } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ProductQuickViewProps {
  product: any
  isOpen: boolean
  onClose: () => void
}

export function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Image */}
          <div className="relative aspect-square md:aspect-auto bg-muted">
            <Image
              src={product.image || "/images/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && <Badge className="bg-primary text-white">New</Badge>}
              {product.isHot && <Badge className="bg-destructive text-white">Hot</Badge>}
            </div>
          </div>

          {/* Right: Details */}
          <div className="p-8 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2 block">
                  {product.category}
                </span>
                <DialogTitle className="text-2xl font-bold text-foreground">
                  {product.name}
                </DialogTitle>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4 fill-current",
                      i < Math.floor(product.rating) ? "text-yellow-500" : "text-muted"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {product.rating} (12 reviews)
              </span>
            </div>

            <div className="text-3xl font-bold text-foreground mb-6">
              ৳{product.price.toLocaleString()}
              {product.originalPrice && (
                <span className="ml-3 text-lg font-medium text-muted-foreground line-through opacity-50">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8">
              Experience the unmatched luxury of Shailoom. This piece is meticulously crafted using 
              traditional techniques passed down through generations. Perfect for special occasions 
              where elegance and comfort meet.
            </p>

            {/* Quantity and Actions */}
            <div className="mt-auto space-y-4">
              <div className="flex items-center gap-4">
                <Button className="flex-1 h-12 text-lg font-semibold rounded-full shadow-lg">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-muted-foreground/20 hover:text-primary">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
              
              <Button variant="ghost" className="w-full text-muted-foreground hover:text-primary transition-colors">
                View Full Product Details &rarr;
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mb-1">Fabric</h4>
                <p className="text-sm font-medium">Premium Silk / Cotton</p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mb-1">SKU</h4>
                <p className="text-sm font-medium">SHL-2024-{product.id}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}
