"use client"

import * as React from "react"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"

const BANNERS = [
  {
    id: 1,
    src: "/images/home/shailoombanner1.png",
    title: "Timeless Elegance",
    description: "Discover the finest collection of premium ethnic wear.",
  },
  {
    id: 2,
    src: "/images/home/shailoombanner2.png",
    title: "Exquisite Craftsmanship",
    description: "Handcrafted details that define luxury and tradition.",
  },
  {
    id: 3,
    src: "/images/home/shailoombanner3.png",
    title: "A Touch of Heritage",
    description:
      "Celebrating our culture through intricate designs and vibrant colors.",
  },
  {
    id: 4,
    src: "/images/home/shailoombanner4.png",
    title: "Modern Sophistication",
    description: "Classic styles reimagined for the contemporary lifestyle.",
  },
  {
    id: 5,
    src: "/images/home/shailoombanner5.png",
    title: "Ultimate Comfort",
    description:
      "Experience the perfect blend of style and luxury in every thread.",
  },
]

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden">
      <Carousel
        plugins={
          [
            Autoplay({
              delay: 5000,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ] as any
        }
        className="w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent className="-ml-0">
          {BANNERS.map((banner) => (
            <CarouselItem
              key={banner.id}
              className="relative aspect-[21/9] min-h-[500px] w-full pl-0"
            >
              <div className="absolute inset-0 z-10 bg-black/20" />
              <Image
                src={banner.src}
                alt={banner.title}
                fill
                priority={banner.id === 1}
                className="object-cover"
              />
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center text-white md:p-16">
                <div className="animate-in duration-1000 fade-in slide-in-from-bottom-4">
                  <h1 className="mb-4 text-4xl font-bold tracking-tight [text-shadow:_0_2px_4px_rgba(0,0,0,0.8)] md:text-6xl lg:text-7xl">
                    {banner.title}
                  </h1>
                  <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-100 [text-shadow:_0_1px_2px_rgba(0,0,0,0.8)] md:text-xl lg:text-2xl">
                    {banner.description}
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button
                      size="lg"
                      className="h-12 px-8 text-lg font-semibold shadow-lg"
                    >
                      Shop New Arrivals
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-12 border-white/20 bg-white/10 px-8 text-lg font-semibold text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-white hover:text-black"
                    >
                      View Collections
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
