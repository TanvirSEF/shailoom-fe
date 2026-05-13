"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag, Star, X } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useCartStore } from "@/store/use-cart-store"
import { useAuthStore } from "@/store/use-auth-store"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

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
  const addItem = useCartStore((s) => s.addItem)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const router = useRouter()

  if (!product) return null

  const image = product.images?.[0] || product.image || "/images/placeholder.png"

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image,
      fabric: product.fabric,
      quantity: 1,
    })
    toast.success(`${product.name} added to cart`)
    onClose()
  }

  const handleWishlist = () => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/")
      return
    }
    // TODO: integrate wishlist API
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl overflow-hidden bg-background p-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Image */}
          <div className="relative aspect-square bg-muted md:aspect-auto md:min-h-[500px]">
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.is_new_arrival && (
                <Badge className="bg-primary text-white">New</Badge>
              )}
              {product.is_on_sale && (
                <Badge className="bg-destructive text-white">Sale</Badge>
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

            {product.average_rating != null && (
              <div className="mb-6 flex items-center gap-2">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4 fill-current",
                        i < Math.floor(product.average_rating)
                          ? "text-yellow-500"
                          : "text-muted"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {product.average_rating} ({product.review_count ?? 0} reviews)
                </span>
              </div>
            )}

            <div className="mb-6 text-3xl font-bold text-foreground">
              ৳{product.price?.toLocaleString()}
              {product.original_price && (
                <span className="ml-3 text-lg font-medium text-muted-foreground line-through opacity-50">
                  ৳{product.original_price.toLocaleString()}
                </span>
              )}
            </div>

            {product.description && (
              <p className="mb-8 line-clamp-4 leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            )}

            {/* Fabric & Stock Info */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              {product.fabric && (
                <div>
                  <h4 className="mb-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                    Fabric
                  </h4>
                  <p className="text-sm font-medium">{product.fabric}</p>
                </div>
              )}
              <div>
                <h4 className="mb-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  Availability
                </h4>
                <p className={cn("text-sm font-medium", product.stock > 0 ? "text-emerald-600" : "text-destructive")}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  className="h-12 flex-1 rounded-full text-lg font-semibold shadow-lg"
                  onClick={handleAddToCart}
                  disabled={!product.stock || product.stock <= 0}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full border-muted-foreground/20 hover:text-primary"
                  onClick={handleWishlist}
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              <Link href={`/product/${product.id}`} onClick={onClose}>
                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground transition-colors hover:text-primary"
                >
                  View Full Product Details &rarr;
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
