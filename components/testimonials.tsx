"use client"

import * as React from "react"
import { Star, CheckCircle2, Quote } from "lucide-react"
import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const REVIEWS = [
  {
    id: 1,
    name: "Nusrat Jahan",
    location: "Dhaka",
    text: "Received the Jamdani saree today. The handwork is just beautiful and feels very premium. Delivery took 3 days instead of 2, but the quality made up for it!",
    rating: 4,
  },
  {
    id: 2,
    name: "Sadia Rahman",
    location: "Chittagong",
    text: "Got a three-piece for my sister. The fabric is very soft and perfect for the weather. The packaging was so elegant that I didn't even need to wrap it for gifting.",
    rating: 5,
  },
  {
    id: 3,
    name: "Farhana Ahmed",
    location: "Sylhet",
    text: "Ordered from the Silk Symphony collection. The saree drapes perfectly. The color is slightly darker than the photo, but it actually looks even more elegant in person.",
    rating: 4,
  },
  {
    id: 4,
    name: "Zarin Tasnim",
    location: "Dublin",
    text: "Was worried about international shipping, but it arrived in Ireland within a week! The color is exactly like the website. Feels like I've brought a piece of home back.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="bg-muted/10 py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 text-center">
          <p className="mb-4 text-sm font-medium tracking-[0.3em] text-primary uppercase">
            Social Proof
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            What Our <span className="font-serif text-primary italic">Customers Say</span>
          </h2>
        </div>

        <Carousel
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ] as any}
          className="mx-auto w-full max-w-5xl"
          opts={{
            align: "center",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-4">
            {REVIEWS.map((review) => (
              <CarouselItem key={review.id} className="pl-4 md:basis-1/2 lg:basis-1/2">
                <div className="relative h-full overflow-hidden rounded-3xl bg-background p-8 md:p-12 border border-border/50 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/20">
                  <Quote className="absolute -top-4 -left-4 h-24 w-24 text-primary/5 opacity-20" />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Stars */}
                    <div className="mb-6 flex gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="mb-8 flex-1 text-lg leading-relaxed text-muted-foreground italic">
                      "{review.text}"
                    </p>

                    {/* Customer Info */}
                    <div className="flex items-center justify-between border-t pt-6">
                      <div>
                        <h4 className="font-bold text-foreground text-lg">{review.name}</h4>
                        <p className="text-sm text-muted-foreground opacity-80">{review.location}</p>
                      </div>
                      <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold tracking-widest text-primary uppercase">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified Buyer
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="-left-12 h-12 w-12 border-primary/20 hover:bg-primary hover:text-white" />
            <CarouselNext className="-right-12 h-12 w-12 border-primary/20 hover:bg-primary hover:text-white" />
          </div>
        </Carousel>

        {/* Brand Reassurance */}
        <div className="mt-20 flex flex-wrap justify-center gap-8 text-center opacity-60 grayscale transition-all hover:grayscale-0">
             <div className="flex flex-col items-center gap-2">
                <span className="text-2xl font-bold">4.9/5</span>
                <span className="text-xs uppercase tracking-widest font-bold">Average Rating</span>
             </div>
             <div className="h-12 w-[1px] bg-border hidden sm:block" />
             <div className="flex flex-col items-center gap-2">
                <span className="text-2xl font-bold">1k+</span>
                <span className="text-xs uppercase tracking-widest font-bold">Happy Customers</span>
             </div>
             <div className="h-12 w-[1px] bg-border hidden sm:block" />
             <div className="flex flex-col items-center gap-2">
                <span className="text-2xl font-bold">10+</span>
                <span className="text-xs uppercase tracking-widest font-bold">Master Artisans</span>
             </div>
        </div>
      </div>
    </section>
  )
}
