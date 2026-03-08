import Link from "next/link"
import { Search, Heart, ShoppingBag, User } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6 flex h-16 items-center justify-between">
        
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="font-bold text-3xl tracking-tight text-foreground uppercase">
              Shailoom<span className="text-primary text-4xl leading-none">.</span>
            </span>
          </Link>
        </div>

        {/* Middle: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link
            href="/new-arrivals"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            New Arrivals
          </Link>
          <Link
            href="/three-piece"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Three-Piece
          </Link>
          <Link
            href="/saree"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Saree
          </Link>
          <Link
            href="/sale"
            className="text-sm font-medium text-destructive transition-colors hover:text-primary"
          >
            Sale
          </Link>
          <Link
            href="/about-us"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            About Us
          </Link>
          <Link
            href="/contact-us"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Contact Us
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Small Search Bar */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="h-9 w-32 rounded-full bg-muted/50 pl-8 text-sm focus-visible:ring-primary lg:w-48 transition-all"
            />
          </div>

          <Button variant="ghost" size="icon" className="hover:text-primary rounded-full transition-transform hover:scale-105">
            <Heart className="h-5 w-5" />
            <span className="sr-only">Wishlist</span>
          </Button>
          
          <Button variant="ghost" size="icon" className="hover:text-primary rounded-full transition-transform hover:scale-105">
            <ShoppingBag className="h-5 w-5" />
            <span className="sr-only">Cart</span>
          </Button>

          {/* Theme Toggle Button */}
          <ThemeToggle />

          <Button className="hidden sm:flex rounded-full px-6 font-semibold shadow-sm transition-transform hover:scale-105">
            Login
          </Button>
          
          {/* Mobile Menu Toggle could go here later */}
        </div>
      </div>
    </header>
  )
}
