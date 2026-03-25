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
              <span className="text-3xl font-bold tracking-tight text-foreground uppercase">
                Shailoom
                <span className="text-4xl leading-none text-primary">.</span>
              </span>
            </Link>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Discover the elegance of Shailoom. We craft premium threads,
              authentic handlooms, and contemporary ethnic wear designed for
              your every special moment.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Explore
            </h3>
            <Link
              href="/new-arrivals"
              className="w-fit text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              New Arrivals
            </Link>
            <Link
              href="/saree"
              className="w-fit text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Premium Sarees
            </Link>
            <Link
              href="/three-piece"
              className="w-fit text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Three-Piece Collections
            </Link>
            <Link
              href="/sale"
              className="w-fit text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Flash Sales & Offers
            </Link>
            <Link
              href="/about"
              className="w-fit text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Our Story
            </Link>
          </div>

          {/* Customer Support */}
          <div className="flex flex-col gap-4">
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Support
            </h3>
            <Link
              href="/faq"
              className="w-fit text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              FAQs
            </Link>
            <Link
              href="/shipping"
              className="w-fit text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Shipping & Returns
            </Link>
            <Link
              href="/track-order"
              className="w-fit text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Track Order
            </Link>
            <Link
              href="/privacy"
              className="w-fit text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="w-fit text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Terms & Conditions
            </Link>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4">
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Stay Connected
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Subscribe to our newsletter for exclusive offers, new arrival
              alerts, and style inspiration.
            </p>
            <form
              className="mt-2 flex flex-col gap-2 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                type="email"
                placeholder="Enter your email"
                className="max-w-lg flex-1 bg-background"
                required
              />
              <Button
                type="submit"
                className="group w-full shadow-sm transition-transform hover:scale-105 sm:w-auto"
              >
                Subscribe
                <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Shailoom. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {/* Example Payment Icons - Usually you'd use SVGs/Images here */}
            <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Secure Checkout
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
