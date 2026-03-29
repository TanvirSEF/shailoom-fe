"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  ShoppingBag, 
  Heart, 
  Share2, 
  ChevronRight, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Phone 
} from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ServiceFeatures } from "@/components/service-features"
import { useCartStore } from "@/store/use-cart-store"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const PRODUCT_DATA = {
  id: 1,
  name: "Classic Tangail Handloom Tat Saree",
  price: 3500,
  originalPrice: 4200,
  description: "Experience the timeless beauty of our Classic Tangail Handloom Tat Saree. Traditionally hand-woven by master weavers of Tangail, this saree features intricate 'Tat' patterns and a wide, contrast border that defines its unique character. Made from 100% premium organic cotton, it's breathable, lightweight, and perfect for any occasion.",
  fabric: "100% Organic Handloom Cotton",
  length: "6.5 Meters (with unstitched blouse piece)",
  washCare: "Hand wash with mild detergent or Dry clean for longevity.",
  images: [
    "/images/products/sarees/tangail-1.png",
    "/images/products/sarees/tangail-detail-1.png",
    "/images/products/sarees/tangail-detail-2.png",
    "/images/products/sarees/tangail-detail-3.png",
  ],
  rating: 4.8,
  reviews: 124,
}

const RELATED_PRODUCTS = [
  { id: 2, name: "Emerald Half-Silk", price: 5800, image: "/images/products/sarees/tangail-2.png" },
  { id: 3, name: "Lavender Tant", price: 2800, image: "/images/products/sarees/tangail-3.png" },
  { id: 4, name: "Royal Blue Zari", price: 12500, image: "/images/products/sarees/tangail-4.png" },
]

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)
  const triggerFly = useCartStore((state) => state.triggerFly)
  const [activeImage, setActiveImage] = React.useState(PRODUCT_DATA.images[0])
  const imageRef = React.useRef<HTMLDivElement>(null)

  const handleAddToCart = () => {
    addItem({
      id: PRODUCT_DATA.id,
      name: PRODUCT_DATA.name,
      price: PRODUCT_DATA.price,
      image: PRODUCT_DATA.images[0],
      fabric: PRODUCT_DATA.fabric,
      quantity: 1,
    })
    
    // Trigger animation
    if (imageRef.current) {
      triggerFly(PRODUCT_DATA.images[0], imageRef.current)
    }

    toast.success("Added to cart", {
      description: `${PRODUCT_DATA.name} has been added to your shopping bag.`,
    })
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push("/cart")
  }

  return (
    <div className="flex min-h-screen flex-col bg-background" suppressHydrationWarning>
      {/* Breadcrumbs */}
      <nav className="container mx-auto px-4 py-4 md:px-6">
        <ol className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-widest">
          <li><Link href="/" className="hover:text-primary">Home</Link></li>
          <ChevronRight className="h-3 w-3" />
          <li><Link href="/shop/sarees" className="hover:text-primary">Sarees</Link></li>
          <ChevronRight className="h-3 w-3" />
          <li className="text-foreground font-bold">Tangail Saree</li>
        </ol>
      </nav>

      <main className="container mx-auto px-4 py-8 md:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <div ref={imageRef} className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-muted shadow-lg">
              <Image
                src={activeImage}
                alt={PRODUCT_DATA.name}
                fill
                className="object-cover transition-all duration-500"
                priority
              />
              <div className="absolute top-4 right-4">
                <Button size="icon" variant="ghost" className="rounded-full bg-white/50 backdrop-blur-md hover:bg-white">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {PRODUCT_DATA.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-all ${
                    activeImage === img ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Detail ${i}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col space-y-8">
            <div className="space-y-4">
              <Badge className="bg-primary/10 text-primary font-bold uppercase tracking-widest text-[10px] px-3 py-1">
                Tangail Handloom
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                {PRODUCT_DATA.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < 4 ? 'fill-primary text-primary' : 'text-muted-foreground opacity-30'}`} />
                    ))}
                    <span className="ml-2 text-sm font-bold">{PRODUCT_DATA.rating}</span>
                </div>
                <div className="h-4 w-[1px] bg-border" />
                <span className="text-sm text-muted-foreground">{PRODUCT_DATA.reviews} Reviews</span>
              </div>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-foreground">৳{PRODUCT_DATA.price.toLocaleString()}</span>
              {PRODUCT_DATA.originalPrice && (
                <span className="text-xl text-muted-foreground line-through decoration-primary/30">
                   ৳{PRODUCT_DATA.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-lg leading-relaxed text-muted-foreground">
              {PRODUCT_DATA.description}
            </p>

            {/* Actions */}
            <div className="space-y-4 pt-4">
              <div className="hidden md:flex flex-col gap-4 sm:flex-row">
                <Button 
                  onClick={handleAddToCart}
                  size="lg" 
                  className="h-14 flex-1 rounded-2xl text-base font-bold uppercase tracking-[0.2em] shadow-xl transition-all hover:scale-[1.02] active:scale-95"
                >
                   <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
                </Button>
                <Button 
                  onClick={handleBuyNow}
                  size="lg" 
                  variant="secondary" 
                  className="h-14 flex-1 rounded-2xl text-base font-bold uppercase tracking-[0.2em] border-2 border-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                >
                   Buy Now
                </Button>
              </div>
              <Button size="lg" variant="outline" className="h-14 w-full rounded-2xl text-base font-bold uppercase tracking-[0.1em] border-emerald-500/20 text-emerald-600 hover:bg-emerald-50 transition-all hover:scale-[1.01]">
                 <Phone className="mr-2 h-5 w-5" /> Order via WhatsApp
              </Button>
            </div>

            {/* Specifications */}
            <div className="grid grid-cols-1 gap-6 rounded-2xl bg-muted/30 p-8 border border-border/50">
                <div className="flex justify-between border-b border-border pb-4">
                    <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Fabric</span>
                    <span className="text-sm font-medium">{PRODUCT_DATA.fabric}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-4">
                    <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Length</span>
                    <span className="text-sm font-medium">{PRODUCT_DATA.length}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Wash Care</span>
                    <span className="text-sm font-medium">{PRODUCT_DATA.washCare}</span>
                </div>
            </div>

            <div className="flex items-center gap-6 pt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> 100% Authentic</div>
                <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Free Shipping</div>
            </div>
          </div>
        </div>
      </main>

      {/* Service Features Reused */}
      <ServiceFeatures />

      {/* Related Products */}
      <section className="container mx-auto px-4 py-24 md:px-6 pb-32 md:pb-24">
        <div className="mb-12 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">You May Also <span className="italic font-serif text-primary">Like</span></h2>
          <Link href="/shop/sarees" className="text-sm font-bold uppercase tracking-[0.2em] text-primary hover:underline">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {RELATED_PRODUCTS.map((item) => (
            <Link key={item.id} href={`/product/${item.id}`} className="group space-y-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted transition-transform duration-500 group-hover:scale-[1.02]">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="text-center">
                <h3 className="font-bold group-hover:text-primary transition-colors">{item.name}</h3>
                <p className="text-lg font-medium text-muted-foreground mt-1">৳{item.price.toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Sticky Mobile Buy Bar */}
      <div className="fixed bottom-0 left-0 z-50 flex w-full items-center gap-3 border-t bg-background/80 p-4 backdrop-blur-md md:hidden">
        <Button 
          onClick={handleAddToCart}
          variant="outline" 
          className="h-12 w-1/2 rounded-xl font-bold uppercase tracking-widest border-primary/20"
        >
           Add to Cart
        </Button>
        <Button 
          onClick={handleBuyNow}
          className="h-12 w-1/2 rounded-xl font-bold uppercase tracking-widest shadow-lg"
        >
           Buy Now
        </Button>
      </div>
    </div>
  )
}
