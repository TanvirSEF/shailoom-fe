"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle2, ChevronRight, CreditCard, Truck, User, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCartStore } from "@/store/use-cart-store"

const STEPS = ["Account", "Shipping", "Payment"]

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [currentStep, setCurrentStep] = React.useState(0)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsSuccess(true)
      clearCart()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-6 text-center">
        <div className="rounded-full bg-emerald-100 p-8">
          <CheckCircle2 className="h-20 w-20 text-emerald-600 animate-in zoom-in duration-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Order Confirmed!</h1>
          <p className="max-w-md text-muted-foreground text-lg">
            Thank you for shopping with Shailoom. Your handcrafted Tangail treasures are being prepared for delivery.
          </p>
        </div>
        <div className="flex gap-4 pt-4">
           <a href="/" className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105">
              Back to Home
           </a>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 md:px-6">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Checkout</h1>
        <div className="mt-8 flex items-center justify-center gap-4">
          {STEPS.map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  index <= currentStep ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted text-muted-foreground'
                }`}>
                  {index < currentStep ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                </div>
                <span className={`text-sm font-bold uppercase tracking-widest ${
                  index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                }`}>{step}</span>
              </div>
              {index < STEPS.length - 1 && <div className="h-[2px] w-8 bg-muted" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Step Content */}
        <div className="space-y-8">
          {currentStep === 0 && (
            <div className="space-y-6 animate-in slide-in-from-left duration-300">
              <h2 className="text-2xl font-bold italic font-serif text-primary underline decoration-primary/20">Sign In or Guest Checkout</h2>
              <div className="grid gap-4">
                 <div className="grid gap-2">
                   <Label htmlFor="email">Email Address</Label>
                   <Input id="email" type="email" placeholder="hasan@example.com" className="h-12 rounded-xl" />
                 </div>
                 <div className="grid gap-2">
                   <Label htmlFor="password">Password (Optional)</Label>
                   <Input id="password" type="password" className="h-12 rounded-xl" />
                 </div>
                 <p className="text-xs text-muted-foreground">Don't have an account? No problem! Continue as a guest.</p>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Truck className="h-6 w-6 text-primary" /> Shipping Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                 <div className="grid gap-2">
                   <Label htmlFor="firstName">First Name</Label>
                   <Input id="firstName" className="h-12 rounded-xl" />
                 </div>
                 <div className="grid gap-2">
                   <Label htmlFor="lastName">Last Name</Label>
                   <Input id="lastName" className="h-12 rounded-xl" />
                 </div>
              </div>
              <div className="grid gap-2">
                 <Label htmlFor="address">Address</Label>
                 <Input id="address" placeholder="123 Street Name, Tangail" className="h-12 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="grid gap-2">
                   <Label htmlFor="city">City</Label>
                   <Input id="city" className="h-12 rounded-xl" />
                 </div>
                 <div className="grid gap-2">
                   <Label htmlFor="phone">Phone Number</Label>
                   <Input id="phone" defaultValue="+880" className="h-12 rounded-xl" />
                 </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                  <CreditCard className="h-6 w-6 text-primary" /> Select Payment Method
              </h2>
              <div className="grid gap-3">
                 {["Mobile Banking (bKash/Nagad)", "Credit/Debit Card", "Cash on Delivery"].map((p) => (
                   <label key={p} className="flex items-center justify-between rounded-2xl border border-border p-4 cursor-pointer hover:border-primary transition-colors group">
                     <span className="font-bold">{p}</span>
                     <div className="h-5 w-5 rounded-full border border-primary/30 group-hover:border-primary" />
                   </label>
                 ))}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                 <ShieldCheck className="h-5 w-5 text-emerald-600" />
                 Your transaction is 100% secure and encrypted.
              </div>
            </div>
          )}

          {/* Nav Buttons */}
          <div className="flex gap-4 pt-8">
            {currentStep > 0 && (
               <Button variant="ghost" onClick={handleBack} className="h-12 px-8 rounded-full font-bold">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
               </Button>
            )}
            <Button onClick={handleNext} className="h-12 flex-1 rounded-full font-bold shadow-lg shadow-primary/20 transition-transform active:scale-95">
               {currentStep === STEPS.length - 1 ? "Complete Order" : "Continue to Next Step"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <aside>
          <div className="rounded-3xl border border-border/50 bg-muted/30 p-8">
            <h2 className="mb-6 text-xl font-bold uppercase tracking-widest">Order Review</h2>
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                   <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-muted border">
                      <Image
                        src={typeof item.image === 'string' ? item.image : '/images/categories/sarees-new.png'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                   </div>
                   <div className="flex-1">
                      <h4 className="text-sm font-bold line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                   </div>
                   <span className="text-sm font-bold">৳{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="h-[1px] w-full bg-border" />
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>৳{getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                   <span>Shipping (Standard)</span>
                   <span className="text-emerald-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Total Due</span>
                  <span className="text-primary">৳{getTotalPrice().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
