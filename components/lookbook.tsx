"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Lookbook() {
  return (
    <section className="w-full bg-background py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl text-center md:text-left">
            <p className="mb-4 text-sm font-medium tracking-[0.3em] text-primary uppercase">
              Brand Identity
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              The Heritage Edit <span className="italic font-serif text-primary">2026</span>
            </h2>
          </div>
          <Link
            href="/lookbook"
            className="group flex items-center gap-2 text-sm font-bold tracking-widest uppercase transition-colors hover:text-primary"
          >
            Explore Full Lookbook
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-2 lg:gap-6">
          {/* Main Editorial - lookbook-2.png */}
          <div className="relative overflow-hidden rounded-2xl md:col-span-12 lg:col-span-8 lg:row-span-2">
            <div className="aspect-[16/10] w-full overflow-hidden">
              <Image
                src="/images/lookbook/lookbook-2.png"
                alt="The Signature Look"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="mb-2 text-2xl font-bold md:text-3xl">Royal Muslin</h3>
              <p className="max-w-md text-sm text-gray-200 md:text-base">
                An ode to the timeless artisans who weave dreams into every thread.
              </p>
            </div>
          </div>

          {/* Texture Close-up - lookbook-1.png */}
          <div className="relative overflow-hidden rounded-2xl md:col-span-6 lg:col-span-4 lg:row-span-1">
            <div className="aspect-square w-full overflow-hidden">
              <Image
                src="/images/lookbook/lookbook-1.png"
                alt="Intricate Details"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-black/10 transition-colors hover:bg-transparent" />
            <div className="absolute top-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
              <span className="text-xs font-bold">1/3</span>
            </div>
          </div>

          {/* Artistic Shot - lookbook-3.png */}
          <div className="relative overflow-hidden rounded-2xl md:col-span-6 lg:col-span-4 lg:row-span-1">
            <div className="aspect-square w-full overflow-hidden">
              <Image
                src="/images/lookbook/lookbook-3.png"
                alt="Art of Draping"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-black/10 transition-colors hover:bg-transparent" />
            <div className="absolute bottom-6 right-6 text-white text-right">
              <p className="text-xs font-medium tracking-[0.2em] uppercase opacity-80">Collection</p>
              <h4 className="text-lg font-bold">Silk Symphony</h4>
            </div>
          </div>
        </div>

        {/* Philosophy Quote */}
        <div className="mt-20 border-t border-muted pt-12 text-center">
            <p className="mx-auto max-w-3xl text-xl font-medium italic leading-relaxed text-muted-foreground md:text-2xl">
                "We don't just sell clothes; we preserve a legacy that spans generations. Every stitch in a Shailoom creation is a promise of authenticity."
            </p>
            <p className="mt-4 text-sm font-bold tracking-[0.2em] text-primary uppercase">
                Artisans of Heritage
            </p>
        </div>
      </div>
    </section>
  )
}
