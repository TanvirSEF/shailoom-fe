"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Send } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="w-full border-t bg-muted/30 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          
          {/* Brand Section */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center">
              <span className="font-bold text-3xl tracking-tight text-foreground uppercase">
                Shailoom<span className="text-primary text-4xl leading-none">.</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground mt-2 max-w-sm">
              Discover the elegance of Shailoom. We craft premium threads, authentic handlooms, and contemporary ethnic wear designed for your every special moment.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg text-foreground mb-2">Explore</h3>
            <Link href="/new-arrivals" className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
              New Arrivals
            </Link>
            <Link href="/saree" className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
              Premium Sarees
            </Link>
            <Link href="/three-piece" className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
              Three-Piece Collections
            </Link>
            <Link href="/sale" className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
              Flash Sales & Offers
            </Link>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
              Our Story
            </Link>
          </div>

          {/* Customer Support */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg text-foreground mb-2">Support</h3>
            <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
              FAQs
            </Link>
            <Link href="/shipping" className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
              Shipping & Returns
            </Link>
            <Link href="/track-order" className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
              Track Order
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
              Terms & Conditions
            </Link>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg text-foreground mb-2">Stay Connected</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Subscribe to our newsletter for exclusive offers, new arrival alerts, and style inspiration.
            </p>
            <form className="flex flex-col sm:flex-row gap-2 mt-2" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Enter your email"
                className="max-w-lg flex-1 bg-background"
                required
              />
              <Button type="submit" className="w-full sm:w-auto shadow-sm transition-transform hover:scale-105 group">
                Subscribe
                <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Shailoom. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {/* Example Payment Icons - Usually you'd use SVGs/Images here */}
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Secure Checkout</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
