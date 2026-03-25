"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PromotionalBanner() {
  return (
    <section className="relative w-full overflow-hidden py-20 md:py-32">
      {/* Background Image Setup */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/home/shailoombanner2.png" // Reusing an existing banner for now
          alt="The Signature Collection"
          fill
          className="object-cover object-center"
        />
        {/* Elegant Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 md:px-12">
        <div className="max-w-xl animate-in text-white duration-1000 fade-in slide-in-from-left-8">
          <p className="mb-4 text-sm font-medium tracking-[0.2em] text-primary-foreground/80 uppercase md:text-base">
            Limited Edition
          </p>
          <h2 className="mb-6 text-4xl leading-tight font-bold tracking-tight [text-shadow:_0_2px_4px_rgba(0,0,0,0.5)] md:text-5xl lg:text-6xl">
            The Signature <br className="hidden md:block" /> Collection
          </h2>
          <p className="mb-8 text-lg text-gray-200 [text-shadow:_0_1px_2px_rgba(0,0,0,0.5)] md:text-xl">
            Discover the artistry of handwoven Jamdani and Royal Muslin,
            exclusively curated for your most cherished moments.
          </p>

          <Button
            asChild
            size="lg"
            className="h-14 px-8 text-base font-semibold shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <Link href="/shop/collections/signature">
              Explore Collection <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
