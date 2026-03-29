"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/use-cart-store"

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (items.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-6 text-center">
        <div className="rounded-full bg-muted p-8">
          <ShoppingBag className="h-16 w-16 text-muted-foreground opacity-20" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Your cart is empty</h2>
          <p className="text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
        </div>
        <Link href="/shop/sarees">
          <Button size="lg" className="rounded-full px-8 font-bold uppercase tracking-widest">
            Continue Shopping
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 md:px-6">
      <h1 className="mb-12 text-4xl font-bold tracking-tight">Your <span className="italic font-serif text-primary">Cart</span></h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-8">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 border-b pb-8 last:border-0">
              <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-2xl bg-muted">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between space-y-4 text-center sm:text-left">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold hover:text-primary transition-colors">
                    <Link href={`/product/${item.id}`}>{item.name}</Link>
                  </h3>
                  <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium">
                    {item.fabric || "Premium Handloom"}
                  </p>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-6">
                  {/* Quantity Controls */}
                  <div className="flex items-center rounded-full border border-border/50 bg-muted/30 px-2 py-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-primary"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold">৳{(item.price * item.quantity).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">৳{item.price.toLocaleString()} each</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-3xl border border-border/50 bg-muted/30 p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-bold uppercase tracking-widest">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-medium text-foreground">৳{getTotalPrice().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Estimated Shipping</span>
                <span className="font-medium text-foreground">৳0</span>
              </div>
              <div className="h-[1px] w-full bg-border" />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-primary">৳{getTotalPrice().toLocaleString()}</span>
              </div>

              <div className="pt-6">
                <Link href="/checkout">
                  <Button className="w-full h-14 rounded-2xl text-lg font-bold uppercase tracking-widest shadow-2xl transition-all hover:scale-[1.02]">
                    Checkout Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              <p className="text-center text-xs text-muted-foreground mt-4">
                Taxes and actual shipping will be calculated at checkout.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
