"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const CATEGORIES = [
  {
    id: 1,
    name: "Elegant Sarees",
    image: "/images/categories/sarees.png",
    href: "/shop/sarees",
    description: "Timeless silk and Jamdani collection",
  },
  {
    id: 2,
    name: "Boutique 3-piece",
    image: "/images/categories/boutique.png",
    href: "/shop/boutique",
    description: "Exclusive designer salwar kameez",
  },
  {
    id: 3,
    name: "New Season Drop",
    image: "/images/categories/new-season.png",
    href: "/shop/new-arrivals",
    description: "Explore the latest trends and styles",
  },
]

export function Categories() {
  return (
    <section className="bg-background px-6 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center md:text-left">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Featured Categories
          </h2>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Explore our handpicked selections of the finest ethnic wear, crafted
            to perfection for every occasion.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-muted shadow-sm transition-all duration-500 hover:border-primary/50 hover:shadow-xl"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />
              </div>

              <div className="absolute right-0 bottom-0 left-0 transform p-8 text-white transition-transform duration-500">
                <p className="mb-1 text-sm font-medium tracking-wider uppercase opacity-80">
                  Shailoom Collection
                </p>
                <h3 className="mb-2 text-2xl font-bold transition-transform duration-500 group-hover:translate-x-2">
                  {category.name}
                </h3>
                <p className="mb-4 text-sm text-gray-200 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  {category.description}
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-white/90 transition-colors group-hover:text-white">
                  Shop Category <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
