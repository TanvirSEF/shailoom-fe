"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useWishlistStore } from "@/store/use-wishlist-store"
import { useCartStore } from "@/store/use-cart-store"

export default function WishlistPage() {
  const { items, isLoading, fetchWishlist, removeItem } = useWishlistStore()
  const addToCart = useCartStore((state) => state.addItem)
  const [mounted, setMounted] = React.useState(false)
  const [removingId, setRemovingId] = React.useState<string | null>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (mounted) fetchWishlist()
  }, [mounted])

  const handleRemove = async (productId: string) => {
    setRemovingId(productId)
    try {
      await removeItem(productId)
      toast.success("Removed from wishlist")
    } catch {
      toast.error("Failed to remove")
    } finally {
      setRemovingId(null)
    }
  }

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.images?.[0] || "",
      quantity: 1,
    })
    toast.success(`${item.name} added to cart`)
  }

  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">My Wishlist</h1>
        <span className="text-sm text-muted-foreground">{items.length} item{items.length !== 1 ? "s" : ""}</span>
      </div>

      {items.length === 0 && (
        <div className="rounded-2xl border bg-muted/30 p-12 text-center">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">Your wishlist is empty.</p>
          <p className="mt-1 text-sm text-muted-foreground">Save items you love for later.</p>
          <Link href="/shop/sarees">
            <Button className="mt-4 rounded-full">Browse Sarees</Button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item._id} className="group rounded-2xl border bg-card overflow-hidden transition-all hover:shadow-lg hover:border-primary/20">
            <Link href={`/product/${item._id}`}>
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                {item.images?.[0] ? (
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
            </Link>
            <div className="p-4 space-y-3">
              <Link href={`/product/${item._id}`}>
                <h3 className="font-bold truncate group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
              </Link>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">৳{item.price.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground capitalize">{item.category}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleAddToCart(item)}
                  className="flex-1 h-10 rounded-xl text-xs font-bold"
                >
                  <ShoppingBag className="mr-1.5 h-3.5 w-3.5" /> Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemove(item._id)}
                  disabled={removingId === item._id}
                  className="h-10 w-10 shrink-0 rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10"
                >
                  {removingId === item._id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
