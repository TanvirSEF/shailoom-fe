"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ShoppingBag,
  Heart,
  ChevronRight,
  Star,
  ShieldCheck,
  Truck,
  Phone,
  Loader2,
  Send,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ServiceFeatures } from "@/components/service-features"
import { useCartStore } from "@/store/use-cart-store"
import { useWishlistStore } from "@/store/use-wishlist-store"
import { useAuthStore } from "@/store/use-auth-store"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useApiQuery, useApiMutation } from "@/hooks/use-api"
import { productService } from "@/lib/services/product-service"

interface Product {
  id: number
  name: string
  price: number
  original_price?: number
  description?: string
  fabric?: string
  length?: string
  wash_care?: string
  images?: string[]
  image?: string
  rating?: number
  review_count?: number
  category?: string
  stock?: number
}

interface Review {
  id: number
  user: { username: string }
  rating: number
  comment: string
  created_at: string
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  const productId = resolvedParams.id
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)
  const triggerFly = useCartStore((state) => state.triggerFly)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [activeImage, setActiveImage] = React.useState(0)
  const [reviewRating, setReviewRating] = React.useState(5)
  const [reviewComment, setReviewComment] = React.useState("")
  const [wishlistLoading, setWishlistLoading] = React.useState(false)
  const imageRef = React.useRef<HTMLDivElement>(null)
  const { items: wishlistItems, fetchWishlist, addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()

  React.useEffect(() => {
    if (isAuthenticated) fetchWishlist()
  }, [isAuthenticated])

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to add to wishlist.")
      router.push("/login")
      return
    }
    setWishlistLoading(true)
    try {
      if (isInWishlist(productId)) {
        await removeFromWishlist(productId)
        toast.success("Removed from wishlist")
      } else {
        await addToWishlist(productId)
        toast.success("Added to wishlist")
      }
    } catch {
      toast.error("Failed to update wishlist")
    } finally {
      setWishlistLoading(false)
    }
  }

  // Fetch product data
  const { data: product, isLoading, error } = useApiQuery<Product>(
    ["product", productId],
    `/products/${productId}`
  )

  // Fetch reviews
  const { data: reviewsData, refetch: refetchReviews } = useApiQuery<{ reviews: Review[]; average_rating?: number; total_reviews?: number }>(
    ["productReviews", productId],
    `/products/${productId}/reviews`
  )

  // Submit review mutation
  const { mutate: submitReview, isPending: isSubmittingReview } = useApiMutation<
    { message: string },
    { rating: number; comment: string }
  >(
    async (data) => {
      const res = await productService.submitReview(productId, data)
      return res.data
    },
    {
      onSuccess: () => {
        toast.success("Review submitted successfully!")
        setReviewComment("")
        setReviewRating(5)
        refetchReviews()
      },
      onError: (error: any) => {
        const message = error.response?.data?.detail || "Failed to submit review."
        toast.error(message)
      },
    }
  )

  const images = product?.images || (product?.image ? [product.image] : [])
  const reviews = reviewsData?.reviews || []
  const avgRating = reviewsData?.average_rating || product?.rating || 0
  const totalReviews = reviewsData?.total_reviews || product?.review_count || reviews.length

  const handleAddToCart = () => {
    if (!product) return
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: images[0] || "/images/products/placeholder.png",
      fabric: product.fabric,
      quantity: 1,
    })

    if (imageRef.current) {
      triggerFly(images[0] || "", imageRef.current)
    }

    toast.success("Added to cart", {
      description: `${product.name} has been added to your shopping bag.`,
    })
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push("/cart")
  }

  const handleSubmitReview = () => {
    if (!reviewComment.trim()) {
      toast.error("Please write a comment before submitting.")
      return
    }
    submitReview({ rating: reviewRating, comment: reviewComment.trim() })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-lg font-medium text-muted-foreground">Product not found</p>
        <Link href="/shop/sarees">
          <Button variant="outline">Browse Sarees</Button>
        </Link>
      </div>
    )
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
          <li className="text-foreground font-bold">{product.name}</li>
        </ol>
      </nav>

      <main className="container mx-auto px-4 py-8 md:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">

          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <div ref={imageRef} className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-muted shadow-lg">
              {images[activeImage] ? (
                <Image
                  src={images[activeImage]}
                  alt={product.name}
                  fill
                  className="object-cover transition-all duration-500"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No image available
                </div>
              )}
              <div className="absolute top-4 right-4">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleToggleWishlist}
                  disabled={wishlistLoading}
                  className={cn(
                    "rounded-full backdrop-blur-md transition-all",
                    isInWishlist(productId)
                      ? "bg-red-50 hover:bg-red-100"
                      : "bg-white/50 hover:bg-white"
                  )}
                >
                  <Heart className={cn(
                    "h-5 w-5 transition-colors",
                    isInWishlist(productId)
                      ? "fill-red-500 text-red-500"
                      : "text-foreground"
                  )} />
                </Button>
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "relative aspect-square overflow-hidden rounded-xl border-2 transition-all",
                      activeImage === i ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-70 hover:opacity-100'
                    )}
                  >
                    <Image src={img} alt={`Detail ${i}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col space-y-8">
            <div className="space-y-4">
              {product.category && (
                <Badge className="bg-primary/10 text-primary font-bold uppercase tracking-widest text-[10px] px-3 py-1">
                  {product.category}
                </Badge>
              )}
              <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn(
                      "h-4 w-4",
                      i < Math.round(avgRating) ? 'fill-primary text-primary' : 'text-muted-foreground opacity-30'
                    )} />
                  ))}
                  <span className="ml-2 text-sm font-bold">{avgRating.toFixed(1)}</span>
                </div>
                <div className="h-4 w-[1px] bg-border" />
                <span className="text-sm text-muted-foreground">{totalReviews} Reviews</span>
              </div>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-foreground">৳{product.price.toLocaleString()}</span>
              {product.original_price && (
                <span className="text-xl text-muted-foreground line-through decoration-primary/30">
                  ৳{product.original_price.toLocaleString()}
                </span>
              )}
            </div>

            {product.description && (
              <p className="text-lg leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            )}

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
            {(product.fabric || product.length || product.wash_care) && (
              <div className="grid grid-cols-1 gap-6 rounded-2xl bg-muted/30 p-8 border border-border/50">
                {product.fabric && (
                  <div className="flex justify-between border-b border-border pb-4">
                    <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Fabric</span>
                    <span className="text-sm font-medium">{product.fabric}</span>
                  </div>
                )}
                {product.length && (
                  <div className="flex justify-between border-b border-border pb-4">
                    <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Length</span>
                    <span className="text-sm font-medium">{product.length}</span>
                  </div>
                )}
                {product.wash_care && (
                  <div className="flex justify-between">
                    <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Wash Care</span>
                    <span className="text-sm font-medium">{product.wash_care}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-6 pt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> 100% Authentic</div>
              <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Free Shipping</div>
            </div>
          </div>
        </div>
      </main>

      {/* Reviews Section */}
      <section className="container mx-auto px-4 py-16 md:px-6">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">
              Customer <span className="italic font-serif text-primary">Reviews</span>
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn(
                    "h-5 w-5",
                    i < Math.round(avgRating) ? 'fill-primary text-primary' : 'text-muted-foreground opacity-30'
                  )} />
                ))}
              </div>
              <span className="text-sm font-bold">{avgRating.toFixed(1)} out of 5</span>
              <span className="text-sm text-muted-foreground">({totalReviews} reviews)</span>
            </div>
          </div>

          {/* Write a Review */}
          {isAuthenticated && (
            <div className="rounded-2xl border bg-card p-6 space-y-4">
              <h3 className="text-lg font-bold">Write a Review</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Rating:</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setReviewRating(i + 1)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star className={cn(
                        "h-6 w-6",
                        i < reviewRating ? 'fill-primary text-primary' : 'text-muted-foreground opacity-30'
                      )} />
                    </button>
                  ))}
                </div>
              </div>
              <Textarea
                placeholder="Share your experience with this product..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="min-h-[100px] rounded-xl"
              />
              <Button
                onClick={handleSubmitReview}
                disabled={isSubmittingReview}
                className="rounded-xl px-6"
              >
                {isSubmittingReview ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Submit Review
              </Button>
            </div>
          )}

          {!isAuthenticated && (
            <div className="rounded-2xl border bg-muted/30 p-6 text-center">
              <p className="text-muted-foreground">
                <Link href="/login" className="font-bold text-primary hover:underline">Sign in</Link> to write a review.
              </p>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-2xl border bg-card p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {review.user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{review.user.username}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn(
                          "h-3.5 w-3.5",
                          i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground opacity-30'
                        )} />
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border bg-muted/30 p-12 text-center">
              <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </div>
      </section>

      <ServiceFeatures />

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
