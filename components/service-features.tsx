"use client"

import { Truck, ShieldCheck, RotateCcw, Gem } from "lucide-react"

const FEATURES = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On all orders over ৳5,000",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "100% protected transactions",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "7-day hassle-free policy",
  },
  {
    icon: Gem,
    title: "Authentic Quality",
    description: "Certified handloom fabrics",
  },
]

export function ServiceFeatures() {
  return (
    <section className="w-full bg-muted/20 border-y py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-2 text-lg font-bold tracking-tight text-foreground uppercase italic">
                {feature.title}
              </h3>
              <p className="max-w-[200px] text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
