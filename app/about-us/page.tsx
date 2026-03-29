"use client"

import * as React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Users, Sprout, Award, Heart, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ServiceFeatures } from "@/components/service-features"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      {/* Hero Section: Storytelling */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <Image
          src="/images/lookbook/lookbook-art.png"
          alt="Tangail Heritage Weaving"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background" />
        <div className="container relative flex h-full items-center px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl space-y-6 text-white"
          >
            <h1 className="text-6xl font-bold tracking-tight italic font-serif leading-tight text-white drop-shadow-lg">
               Threads of <br /> <span className="text-primary italic">Heritage.</span>
            </h1>
            <p className="text-xl font-medium opacity-90 leading-relaxed text-white drop-shadow-md">
               At Shailoom, we don't just sell sarees; we preserve a legacy. every thread tells a story of the master weavers of Tangail.
            </p>
            <Button size="lg" className="rounded-full px-8 font-bold uppercase tracking-widest shadow-2xl transition-all hover:scale-105">
               Our Heritage <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="container mx-auto px-4 py-24 md:px-6">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-primary">Our Journey</h2>
              <h3 className="text-4xl font-bold tracking-tight italic font-serif">Rediscovering the <br /> Traditional Loom.</h3>
            </div>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Founded in the heart of Tangail, Shailoom started with a simple vision: to bring back the timeless elegance of handloom sarees to the modern wardrobe. Our journey takes us through the winding streets of weaving villages, where the rhythm of the loom has echoed for generations.
              </p>
              <p>
                We collaborate directly with master artisans, ensuring that every Shailoom creation is a masterpiece of precision and passion. By removing the middleman, we provide fair wages to our weavers while offering you unparalleled quality.
              </p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square overflow-hidden rounded-[3rem] shadow-2xl"
          >
            <Image
              src="/images/categories/sarees-new.png"
              alt="Artisan at work"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Craftsmanship Section (Terracotta Theme) */}
      <section className="bg-primary/5 py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-16 text-center space-y-4">
            <h2 className="text-3xl font-bold italic font-serif">The Human Touch.</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
               Every Shailoom saree is handcrafted over a period of 5 to 15 days, depending on the complexity of the Jamdani motifs.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
             {[
               { icon: Users, title: "Master Weavers", desc: "Crafted by artisans with over 30 years of experience in handloom." },
               { icon: Sprout, title: "Pure Fibers", desc: "We use only high-grade organic cotton and pure mulberry silk." },
               { icon: Heart, title: "Ethical Fashion", desc: "100% fair trade practices that empower our local weaving communities." }
             ].map((item, idx) => (
               <motion.div 
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="rounded-3xl bg-background p-8 text-center shadow-lg transition-all hover:scale-105"
               >
                 <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xl">
                   <item.icon className="h-8 w-8" />
                 </div>
                 <h4 className="mb-3 text-xl font-bold">{item.title}</h4>
                 <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="container mx-auto px-4 py-24 md:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
           {[
             { label: "Master Artisans", value: "250+" },
             { label: "Villages Impacted", value: "12" },
             { label: "Sarees Handcrafted", value: "15k+" },
             { label: "Happy Customers", value: "85k+" }
           ].map((stat) => (
             <div key={stat.label} className="space-y-2">
                <span className="text-4xl font-bold text-primary">{stat.value}</span>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Service Features Section */}
      <ServiceFeatures />

      {/* Final Call to Action */}
      <section className="container mx-auto px-4 py-24 md:px-6">
         <div className="relative overflow-hidden rounded-[4rem] bg-stone-900 px-8 py-20 text-center text-white shadow-2xl">
            <div className="absolute inset-0 bg-[url('/images/lookbook/lookbook-texture.png')] opacity-20 mix-blend-overlay" />
            <div className="relative z-10 space-y-8">
               <h2 className="text-5xl font-bold tracking-tight italic font-serif text-white">Own a Piece of History.</h2>
               <p className="mx-auto max-w-2xl text-lg text-stone-300">
                  Join us in our mission to celebrate and sustain the heritage of Bangladeshi handlooms.
               </p>
               <div className="flex justify-center gap-4">
                  <Button size="lg" className="h-14 rounded-full bg-white px-10 font-bold text-stone-900 hover:bg-white/90">
                     Shop Entire Collection
                  </Button>
               </div>
            </div>
         </div>
      </section>
    </div>
  )
}
