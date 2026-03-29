"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, Globe, Facebook, Instagram, Youtube } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Message Sent Successfully!", {
      description: "Our customer success team will contact you within 24 hours.",
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      {/* Header Section */}
      <section className="bg-primary/5 py-24 text-center">
         <div className="container mx-auto px-4 md:px-6">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
            >
                <h1 className="text-5xl font-bold tracking-tight italic font-serif leading-tight">We'd Love to <br /> <span className="text-primary italic">Hear From You.</span></h1>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                   Whether you have a question about our heritage sarees, international shipping, or corporate orders—our team is here to help.
                </p>
            </motion.div>
         </div>
      </section>

      {/* Main Contact Section */}
      <section className="container mx-auto px-4 py-24 md:px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="grid gap-8">
              <div className="flex items-start gap-4">
                 <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                    <MapPin className="h-6 w-6" />
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-xl font-bold">Showroom Address</h4>
                    <p className="text-muted-foreground">House 23, Road 14, Block G, Banani,<br />Dhaka 1213, Bangladesh.</p>
                 </div>
              </div>

              <div className="flex items-start gap-4">
                 <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                    <Phone className="h-6 w-6" />
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-xl font-bold">Call or WhatsApp</h4>
                    <p className="text-muted-foreground">+880 17XX-XXXXXX (General Inquiry)</p>
                    <p className="text-muted-foreground">+880 18XX-XXXXXX (Support)</p>
                 </div>
              </div>

              <div className="flex items-start gap-4">
                 <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                    <Mail className="h-6 w-6" />
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-xl font-bold">Email Support</h4>
                    <p className="text-muted-foreground">hello@shailoom.com</p>
                    <p className="text-muted-foreground">corporate@shailoom.com</p>
                 </div>
              </div>

              <div className="flex items-start gap-4">
                 <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                    <Clock className="h-6 w-6" />
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-xl font-bold">Support Hours</h4>
                    <p className="text-muted-foreground">Daily: 10:00 AM — 08:00 PM</p>
                    <p className="text-muted-foreground">Our online store is open 24/7.</p>
                 </div>
              </div>
            </div>

            <div className="space-y-4">
               <h4 className="text-lg font-bold">Connect With Us</h4>
               <div className="flex gap-4">
                  {[Facebook, Instagram, Youtube].map((Icon, idx) => (
                    <Button key={idx} variant="outline" size="icon" className="h-12 w-12 rounded-full border-border/50 hover:bg-primary hover:text-white transition-all transform hover:scale-110">
                       <Icon className="h-5 w-5" />
                    </Button>
                  ))}
               </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-[3rem] border border-border/50 bg-muted/30 p-8 shadow-2xl md:p-12"
          >
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                   <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="John Doe" className="h-12 rounded-xl border-border/50 focus-visible:ring-primary shadow-sm" required />
                   </div>
                   <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="john@example.com" className="h-12 rounded-xl border-border/50 focus-visible:ring-primary shadow-sm" required />
                   </div>
                </div>

                <div className="space-y-2">
                   <Label htmlFor="subject">Subject</Label>
                   <Input id="subject" placeholder="Inquiry about Jamdani Saree" className="h-12 rounded-xl border-border/50 focus-visible:ring-primary shadow-sm" required />
                </div>

                <div className="space-y-2">
                   <Label htmlFor="message">Your Message</Label>
                   <Textarea id="message" placeholder="How can we help you?" className="min-h-[150px] rounded-2xl border-border/50 focus-visible:ring-primary shadow-sm" required />
                </div>

                <Button type="submit" className="h-14 w-full rounded-2xl text-lg font-bold uppercase tracking-[0.2em] shadow-xl transition-all hover:scale-[1.01] active:scale-[0.98]">
                   Send Message <Send className="ml-2 h-4 w-4" />
                </Button>
             </form>
          </motion.div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="container mx-auto px-4 pb-24 md:px-6">
         <div className="relative h-[400px] w-full overflow-hidden rounded-[3rem] bg-muted shadow-lg ring-1 ring-border/50">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center grayscale opacity-40" />
            <div className="relative z-10 flex flex-col items-center justify-center p-8 bg-black/60 w-full h-full text-white">
                <Globe className="h-16 w-16 text-primary animate-pulse" />
                <h3 className="mt-4 text-2xl font-bold tracking-tight">Visit Our Showroom</h3>
                <p className="mt-2 text-stone-300">Banani G-Block, Dhaka.</p>
                <Button variant="outline" className="mt-8 border-white text-white rounded-full px-8 hover:bg-white hover:text-black">
                   Get Directions on Maps
                </Button>
            </div>
         </div>
      </section>

      {/* FAQ Preview */}
      <section className="bg-stone-900 py-24 text-white">
         <div className="container mx-auto px-4 text-center md:px-6">
            <h2 className="text-3xl font-bold italic font-serif">Frequently Asked Questions.</h2>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
               {[
                 { q: "Do you ship internationally?", a: "Yes, we ship to over 50 countries via DHL and FedEx." },
                 { q: "How long does delivery take?", a: "Inside Dhaka: 24-48h. Outside Dhaka: 3-5 days. Global: 7-10 days." },
                 { q: "What is your return policy?", a: "We offer a 7-day hassle-free return policy if the product is unworn." }
               ].map((faq, idx) => (
                 <div key={idx} className="rounded-3xl border border-white/10 bg-white/5 p-8 transition-colors hover:border-white/20">
                    <h5 className="mb-3 text-lg font-bold text-primary">{faq.q}</h5>
                    <p className="text-stone-400">{faq.a}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  )
}
