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
    <section className="py-16 px-6 md:py-24 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">
            Featured Categories
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Explore our handpicked selections of the finest ethnic wear, 
            crafted to perfection for every occasion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-muted border border-border/50 hover:border-primary/50 transition-all duration-500 shadow-sm hover:shadow-xl"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform transition-transform duration-500">
                <p className="text-sm font-medium mb-1 opacity-80 uppercase tracking-wider">
                  Shailoom Collection
                </p>
                <h3 className="text-2xl font-bold mb-2 group-hover:translate-x-2 transition-transform duration-500">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-200 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {category.description}
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
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
