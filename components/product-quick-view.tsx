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

export function ProductQuickView({
  product,
  isOpen,
  onClose,
}: ProductQuickViewProps) {
  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl overflow-hidden bg-background p-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Image */}
          <div className="relative aspect-square bg-muted md:aspect-auto">
            <Image
              src={product.image || "/images/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && (
                <Badge className="bg-primary text-white">New</Badge>
              )}
              {product.isHot && (
                <Badge className="bg-destructive text-white">Hot</Badge>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex flex-col p-8">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <span className="mb-2 block text-xs font-bold tracking-widest text-primary uppercase">
                  {product.category}
                </span>
                <DialogTitle className="text-2xl font-bold text-foreground">
                  {product.name}
                </DialogTitle>
              </div>
            </div>

            <div className="mb-6 flex items-center gap-2">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4 fill-current",
                      i < Math.floor(product.rating)
                        ? "text-yellow-500"
                        : "text-muted"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {product.rating} (12 reviews)
              </span>
            </div>

            <div className="mb-6 text-3xl font-bold text-foreground">
              ৳{product.price.toLocaleString()}
              {product.originalPrice && (
                <span className="ml-3 text-lg font-medium text-muted-foreground line-through opacity-50">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="mb-8 leading-relaxed text-muted-foreground">
              Experience the unmatched luxury of Shailoom. This piece is
              meticulously crafted using traditional techniques passed down
              through generations. Perfect for special occasions where elegance
              and comfort meet.
            </p>

            {/* Quantity and Actions */}
            <div className="mt-auto space-y-4">
              <div className="flex items-center gap-4">
                <Button className="h-12 flex-1 rounded-full text-lg font-semibold shadow-lg">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full border-muted-foreground/20 hover:text-primary"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              <Button
                variant="ghost"
                className="w-full text-muted-foreground transition-colors hover:text-primary"
              >
                View Full Product Details &rarr;
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 grid grid-cols-2 gap-4 border-t pt-8">
              <div>
                <h4 className="mb-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  Fabric
                </h4>
                <p className="text-sm font-medium">Premium Silk / Cotton</p>
              </div>
              <div>
                <h4 className="mb-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  SKU
                </h4>
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
