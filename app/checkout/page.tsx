"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle2, CreditCard, Truck, ArrowLeft, ArrowRight, ShieldCheck, Loader2, Tag, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCartStore } from "@/store/use-cart-store"
import { useAuthStore } from "@/store/use-auth-store"
import { useApiMutation } from "@/hooks/use-api"
import { orderService } from "@/lib/services/order-service"

const STEPS = ["Shipping", "Payment"]

const shippingSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  phone_number: z.string().min(11, "Valid phone number is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
})

type ShippingValues = z.infer<typeof shippingSchema>

const SHIPPING_ZONES: Record<string, number> = {
  dhaka: 60,
  chittagong: 120,
  sylhet: 120,
  rajshahi: 120,
  khulna: 120,
  barishal: 120,
  rangpur: 130,
  mymensingh: 100,
  outside: 150,
}

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [currentStep, setCurrentStep] = React.useState(0)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [orderTrackingId, setOrderTrackingId] = React.useState("")
  const [mounted, setMounted] = React.useState(false)
  const [couponCode, setCouponCode] = React.useState("")
  const [couponDiscount, setCouponDiscount] = React.useState(0)
  const [couponMessage, setCouponMessage] = React.useState("")
  const [isValidatingCoupon, setIsValidatingCoupon] = React.useState(false)
  const [paymentMethod, setPaymentMethod] = React.useState("cod")

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ShippingValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      full_name: "",
      phone_number: "+880",
      address: "",
      city: "",
    },
  })

  const subtotal = getTotalPrice()
  const shippingZone = (() => {
    const city = (getValues("city") || "").toLowerCase()
    if (SHIPPING_ZONES[city] !== undefined) return { zone: city, cost: SHIPPING_ZONES[city] }
    return { zone: "outside", cost: SHIPPING_ZONES.outside }
  })()
  const totalAmount = subtotal - couponDiscount + shippingZone.cost

  const { mutate: placeOrder, isPending: isPlacingOrder } = useApiMutation<any, any>(
    async () => {
      const values = getValues()
      return orderService.placeOrder({
        shipping_address: `${values.address}, ${values.city}`,
        shipping_zone: shippingZone.zone,
        phone_number: values.phone_number,
        total_amount: totalAmount,
        payment_method: paymentMethod,
        coupon_code: couponCode || undefined,
        items: items.map((item) => ({
          product_id: String(item.id),
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: "free",
          color: "default",
        })),
      }).then((res) => res.data)
    },
    {
      onSuccess: (data) => {
        const trackingId = data?.tracking_id || data?.trackingId || data?.order_id || ""
        setOrderTrackingId(trackingId)
        setIsSuccess(true)
        clearCart()
        toast.success("Order placed successfully!")
      },
      onError: (error: any) => {
        const message = error.response?.data?.detail || "Failed to place order. Please try again."
        toast.error(typeof message === "string" ? message : "Failed to place order.")
      },
    }
  )

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setIsValidatingCoupon(true)
    setCouponMessage("")
    try {
      const res = await orderService.validateCoupon(couponCode.trim(), subtotal)
      const data = res.data
      const discount = data.discount_amount || data.discount || 0
      setCouponDiscount(discount)
      setCouponMessage(data.message || `Coupon applied! You save ৳${discount}`)
      toast.success(`Coupon applied! You save ৳${discount}`)
    } catch (error: any) {
      setCouponDiscount(0)
      setCouponMessage(error.response?.data?.detail || "Invalid coupon code")
      toast.error("Invalid coupon code")
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setCouponCode("")
    setCouponDiscount(0)
    setCouponMessage("")
  }

  if (!mounted) return null

  if (isSuccess) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-6 text-center">
        <div className="rounded-full bg-emerald-100 p-8">
          <CheckCircle2 className="h-20 w-20 text-emerald-600 animate-in zoom-in duration-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Order Confirmed!</h1>
          {orderTrackingId && (
            <p className="text-primary font-bold text-lg">Tracking ID: {orderTrackingId}</p>
          )}
          <p className="max-w-md text-muted-foreground text-lg">
            Thank you for shopping with Shailoom. Your handcrafted Tangail treasures are being prepared for delivery.
          </p>
        </div>
        <div className="flex gap-4 pt-4">
          {orderTrackingId && (
            <Link href={`/account/orders/${orderTrackingId}`} className="inline-flex h-12 items-center justify-center rounded-full border border-primary px-8 font-bold text-primary transition-transform hover:scale-105">
              Track Order
            </Link>
          )}
          <Link href="/" className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105">
            Back to Home
          </Link>
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
            <form
              className="space-y-6 animate-in slide-in-from-right duration-300"
              onSubmit={handleSubmit(() => setCurrentStep(1))}
            >
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Truck className="h-6 w-6 text-primary" /> Shipping Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    placeholder="John Doe"
                    className={cn("h-12 rounded-xl", errors.full_name && "border-destructive")}
                    {...register("full_name")}
                  />
                  {errors.full_name && <p className="text-xs font-semibold text-destructive">{errors.full_name.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    placeholder="+8801XXXXXXXXX"
                    className={cn("h-12 rounded-xl", errors.phone_number && "border-destructive")}
                    {...register("phone_number")}
                  />
                  {errors.phone_number && <p className="text-xs font-semibold text-destructive">{errors.phone_number.message}</p>}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Full Address</Label>
                <Input
                  id="address"
                  placeholder="House, Road, Area"
                  className={cn("h-12 rounded-xl", errors.address && "border-destructive")}
                  {...register("address")}
                />
                {errors.address && <p className="text-xs font-semibold text-destructive">{errors.address.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="dhaka, chittagong, sylhet..."
                  className={cn("h-12 rounded-xl", errors.city && "border-destructive")}
                  {...register("city")}
                />
                {errors.city && <p className="text-xs font-semibold text-destructive">{errors.city.message}</p>}
                <p className="text-xs text-muted-foreground">
                  Shipping inside Dhaka: ৳60 | Outside Dhaka: ৳120-150
                </p>
              </div>

              <Button type="submit" className="h-12 w-full rounded-full font-bold shadow-lg shadow-primary/20 transition-transform active:scale-95">
                Continue to Payment <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          )}

          {currentStep === 1 && (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-primary" /> Select Payment Method
              </h2>
              <div className="grid gap-3">
                {[
                  { id: "bkash", label: "Mobile Banking (bKash/Nagad)" },
                  { id: "card", label: "Credit/Debit Card" },
                  { id: "cod", label: "Cash on Delivery" },
                ].map((p) => (
                  <label
                    key={p.id}
                    className={cn(
                      "flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition-colors group",
                      paymentMethod === p.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    )}
                  >
                    <span className="font-bold">{p.label}</span>
                    <div className={cn(
                      "h-5 w-5 rounded-full border-2 transition-colors",
                      paymentMethod === p.id ? "border-primary bg-primary" : "border-muted-foreground/30"
                    )}>
                      {paymentMethod === p.id && <div className="flex h-full items-center justify-center"><CheckCircle2 className="h-3 w-3 text-primary-foreground" /></div>}
                    </div>
                    <input type="radio" name="payment" value={p.id} checked={paymentMethod === p.id} onChange={() => setPaymentMethod(p.id)} className="sr-only" />
                  </label>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                Your transaction is 100% secure and encrypted.
              </div>

              {/* Nav Buttons */}
              <div className="flex gap-4 pt-4">
                <Button variant="ghost" onClick={() => setCurrentStep(0)} className="h-12 px-8 rounded-full font-bold">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button
                  onClick={() => placeOrder(undefined as any)}
                  disabled={isPlacingOrder}
                  className="h-12 flex-1 rounded-full font-bold shadow-lg shadow-primary/20 transition-transform active:scale-95"
                >
                  {isPlacingOrder ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>Complete Order — ৳{totalAmount.toLocaleString()}</>
                  )}
                </Button>
              </div>
            </div>
          )}
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

              {/* Coupon */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="h-11 rounded-xl pl-9 text-sm"
                      disabled={couponDiscount > 0}
                    />
                  </div>
                  {couponDiscount > 0 ? (
                    <Button variant="ghost" size="icon" onClick={handleRemoveCoupon} className="h-11 w-11 shrink-0 rounded-xl">
                      <X className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={handleApplyCoupon}
                      disabled={isValidatingCoupon || !couponCode.trim()}
                      className="h-11 shrink-0 rounded-xl px-4 font-bold"
                    >
                      {isValidatingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                    </Button>
                  )}
                </div>
                {couponMessage && (
                  <p className={cn("text-xs font-medium", couponDiscount > 0 ? "text-emerald-600" : "text-destructive")}>
                    {couponMessage}
                  </p>
                )}
              </div>

              <div className="h-[1px] w-full bg-border" />
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600 font-medium">
                    <span>Coupon Discount</span>
                    <span>-৳{couponDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping ({shippingZone.zone})</span>
                  <span>৳{shippingZone.cost}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Total Due</span>
                  <span className="text-primary">৳{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function cn(...inputs: (string | false | undefined | null)[]) {
  return inputs.filter(Boolean).join(" ")
}
