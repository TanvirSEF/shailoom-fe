"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"

const LOOKS = [
  {
    id: "look-01",
    title: "The Rajbari Grace",
    description: "Our signature white Jamdani, inspired by the timeless architecture of ancient Bengal. A tribute to heritage and elegance.",
    image: "/images/lookbook/lookbook-2.png",
    type: "editorial",
  },
  {
    id: "look-02",
    title: "Golden Threads",
    description: "Macro details of hand-woven patterns. Every flower is a testament to days of patient craftsmanship.",
    image: "/images/lookbook/lookbook-1.png",
    type: "detail",
  },
  {
    id: "look-03",
    title: "Morning in the Aangan",
    description: "Pastel hues for serene mornings. A blend of comfort and tradition, perfect for cherished family moments.",
    image: "/images/lookbook/lookbook-4.png",
    type: "editorial",
  },
  {
    id: "look-04",
    title: "Art of the Drape",
    description: "The fluidity of Silk. A symphony of colors and shadows that defines the Shailoom woman.",
    image: "/images/lookbook/lookbook-3.png",
    type: "art",
  },
  {
    id: "look-05",
    title: "The Final Touch",
    description: "Hand-knotted tassels and delicate border work. True luxury lies in the smallest details.",
    image: "/images/lookbook/lookbook-5.png",
    type: "detail",
  },
]

export default function LookbookPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navigation / Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <span className="text-xs font-bold tracking-[0.4em] uppercase text-muted-foreground">
            Lookbook <span className="text-primary italic font-serif mx-1">2026</span>
          </span>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </header>

      <main className="flex-1">
        {/* Intro Section */}
        <section className="container mx-auto py-20 px-4 text-center">
          <p className="mb-4 text-sm font-medium tracking-[0.3em] text-primary uppercase">Editorial</p>
          <h1 className="mb-8 text-5xl font-bold tracking-tight text-foreground md:text-7xl lg:text-8xl">
            Sutli & <span className="italic font-serif text-primary">Shadows</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
            A journey through the whispers of history and the vibrant threads of the present. 
            Discover the Shailoom Heritage collection.
          </p>
        </section>

        {/* Gallery Sections */}
        {LOOKS.map((look, index) => (
          <section 
            key={look.id} 
            className={`py-12 md:py-24 ${index % 2 === 0 ? 'bg-muted/10' : 'bg-background'}`}
          >
            <div className="container mx-auto px-4">
              <div className={`grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center ${index % 2 !== 0 ? 'lg:direction-rtl' : ''}`}>
                <div className={`relative overflow-hidden rounded-3xl ${index % 2 !== 0 ? 'lg:order-last' : ''}`}>
                   <div className={`${look.type === 'editorial' ? 'aspect-[4/5]' : 'aspect-square'} w-full relative`}>
                        <Image
                            src={look.image}
                            alt={look.title}
                            fill
                            className="object-cover transition-transform duration-1000 hover:scale-110"
                            priority={index === 0}
                        />
                   </div>
                </div>
                <div className="max-w-md mx-auto lg:mx-0">
                  <span className="mb-2 block text-xs font-bold tracking-widest text-primary uppercase italic">Look {index + 1}</span>
                  <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-5xl">{look.title}</h2>
                  <p className="mb-10 text-lg leading-relaxed text-muted-foreground">{look.description}</p>
                  
                  <div className="flex flex-wrap gap-4">
                    <Button size="lg" className="rounded-full px-8">
                       <ShoppingBag className="mr-2 h-4 w-4" /> Shop the Look
                    </Button>
                    <Button variant="outline" size="lg" className="rounded-full px-8">
                       View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Closing Section */}
        <section className="border-t bg-secondary py-24 text-center text-secondary-foreground">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-4xl font-bold tracking-tight md:text-6xl italic font-serif underline decoration-primary/30">
              The Artisan's Promise
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-lg opacity-80 md:text-xl">
              Every creation you see here is hand-finished and certified by our local artisans. 
              We believe in sustainable fashion that respects tradition.
            </p>
            <Button size="lg" variant="secondary" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-12 h-14 text-lg font-bold">
               Explore Full Collection <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      {/* Quick Footer for Lookbook */}
      <footer className="border-t py-12 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>© 2026 Shailoom Heritage. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  )
}
