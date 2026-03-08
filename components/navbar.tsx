import Link from "next/link"
import { Search, Heart, ShoppingBag, User, Menu } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6 flex h-16 items-center justify-between">
        
        {/* Left: Mobile Menu & Logo */}
        <div className="flex items-center gap-4">
          
          {/* Mobile Sidebar */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left font-bold text-2xl tracking-tight uppercase">
                  Shailoom<span className="text-primary text-3xl leading-none">.</span>
                </SheetTitle>
              </SheetHeader>
              
              <div className="py-6 flex flex-col gap-6">
                
                {/* Mobile Search Bar */}
                <div className="relative w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search Shailoom..."
                    className="h-9 w-full rounded-full bg-muted/50 pl-8 text-sm focus-visible:ring-primary transition-all"
                  />
                </div>

                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/new-arrivals" className="text-lg font-medium hover:text-primary transition-colors">
                    New Arrivals
                  </Link>
                  <Link href="/three-piece" className="text-lg font-medium hover:text-primary transition-colors">
                    Three-Piece
                  </Link>
                  <Link href="/saree" className="text-lg font-medium hover:text-primary transition-colors">
                    Saree
                  </Link>
                  <Link href="/sale" className="text-lg font-medium text-destructive hover:text-primary transition-colors">
                    Sale
                  </Link>
                  <Link href="/about-us" className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors">
                    About Us
                  </Link>
                  <Link href="/contact-us" className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors">
                    Contact Us
                  </Link>
                </nav>

                {/* Mobile Auth Buttons */}
                <div className="mt-4 pt-4 border-t flex flex-col gap-3">
                  <Button variant="outline" className="w-full rounded-full font-semibold shadow-sm transition-transform hover:scale-105">
                    Login
                  </Button>
                  <Button className="w-full rounded-full font-semibold shadow-sm transition-transform hover:scale-105">
                    Sign Up
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center">
            <span className="font-bold text-2xl md:text-3xl tracking-tight text-foreground uppercase">
              Shailoom<span className="text-primary text-3xl md:text-4xl leading-none">.</span>
            </span>
          </Link>
        </div>

        {/* Middle: Desktop Navigation Links */}
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
        <div className="flex items-center gap-1 sm:gap-2">
          
          {/* Small Search Bar */}
          <div className="relative hidden md:block">
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

          <div className="hidden sm:flex items-center gap-2 ml-1">
            <Button variant="ghost" className="rounded-full px-5 font-semibold transition-transform hover:scale-105">
              Login
            </Button>
            <Button className="rounded-full px-5 font-semibold shadow-sm transition-transform hover:scale-105">
              Sign Up
            </Button>
          </div>
          
        </div>
      </div>
    </header>
  )
}
