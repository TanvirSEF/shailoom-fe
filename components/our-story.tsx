"use client"

import * as React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function OurStory() {
  return (
    <section className="bg-background px-6 py-20 md:px-12 md:py-32">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row lg:gap-24">
        {/* Image Grid Side */}
        <div className="relative flex h-[500px] w-full items-center justify-center sm:h-[600px] lg:w-1/2">
          <div className="absolute top-0 left-0 z-10 h-4/5 w-2/3 overflow-hidden rounded-2xl border border-border/50 shadow-2xl transition-all duration-500 hover:z-30 hover:scale-105">
            <Image
              src="/images/home/shailoombanner3.png"
              alt="Craftsmanship detail"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute right-0 bottom-0 z-20 h-3/4 w-2/3 overflow-hidden rounded-2xl border border-border/50 shadow-2xl transition-all duration-500 hover:z-30 hover:scale-105">
            <Image
              src="/images/home/shailoombanner5.png"
              alt="Weaving loom"
              fill
              className="object-cover"
            />
          </div>
          {/* Decorative Elements */}
          <div className="absolute -top-6 -left-6 -z-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
          <div className="absolute -right-8 -bottom-8 -z-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
        </div>

        {/* Text Side */}
        <div className="w-full space-y-6 text-center lg:w-1/2 lg:space-y-8 lg:text-left">
          <div className="inline-block">
            <span className="border-b border-primary pb-1 text-sm font-bold tracking-[0.15em] text-primary uppercase">
              Our Heritage
            </span>
          </div>

          <h2 className="text-3xl leading-tight font-bold tracking-tight text-foreground md:text-5xl">
            The Art of Exquisite{" "}
            <span className="font-serif text-primary italic">
              Craftsmanship
            </span>
          </h2>

          <div className="space-y-4 text-lg text-muted-foreground">
            <p>
              At Shailoom, every thread weaves a tale of tradition and elegance.
              We partner directly with master artisans across Bangladesh to
              bring you authentic, ethically crafted Jamdani, Muslin, and Silk.
            </p>
            <p>
              Our pieces go beyond seasonal trends. They are heirlooms—timeless
              creations meticulously crafted by hands that have inherited
              generations of weaving techniques. When you drape a Shailoom
              creation, you wear a piece of our heritage.
            </p>
          </div>

          <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row lg:justify-start">
            <Button
              size="lg"
              className="h-12 rounded-full px-8 font-semibold shadow-lg"
              asChild
            >
              <Link href="/about">Read Our Story</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
