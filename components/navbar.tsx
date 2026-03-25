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
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
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
                <SheetTitle className="text-left text-2xl font-bold tracking-tight uppercase">
                  Shailoom
                  <span className="text-3xl leading-none text-primary">.</span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-6 py-6">
                {/* Mobile Search Bar */}
                <div className="relative w-full">
                  <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search Shailoom..."
                    className="h-9 w-full rounded-full bg-muted/50 pl-8 text-sm transition-all focus-visible:ring-primary"
                  />
                </div>

                <nav className="mt-8 flex flex-col gap-4">
                  <Link
                    href="/new-arrivals"
                    className="text-lg font-medium transition-colors hover:text-primary"
                  >
                    New Arrivals
                  </Link>
                  <Link
                    href="/three-piece"
                    className="text-lg font-medium transition-colors hover:text-primary"
                  >
                    Three-Piece
                  </Link>
                  <Link
                    href="/saree"
                    className="text-lg font-medium transition-colors hover:text-primary"
                  >
                    Saree
                  </Link>
                  <Link
                    href="/sale"
                    className="text-lg font-medium text-destructive transition-colors hover:text-primary"
                  >
                    Sale
                  </Link>
                  <Link
                    href="/about-us"
                    className="text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/contact-us"
                    className="text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    Contact Us
                  </Link>
                </nav>

                {/* Mobile Auth Buttons */}
                <div className="mt-4 flex flex-col gap-3 border-t pt-4">
                  <Button
                    variant="outline"
                    className="w-full rounded-full font-semibold shadow-sm transition-transform hover:scale-105"
                  >
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
            <span className="text-2xl font-bold tracking-tight text-foreground uppercase md:text-3xl">
              Shailoom
              <span className="text-3xl leading-none text-primary md:text-4xl">
                .
              </span>
            </span>
          </Link>
        </div>

        {/* Middle: Desktop Navigation Links */}
        <nav className="hidden items-center gap-6 md:flex lg:gap-8">
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
            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="h-9 w-32 rounded-full bg-muted/50 pl-8 text-sm transition-all focus-visible:ring-primary lg:w-48"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full transition-transform hover:scale-105 hover:text-primary"
          >
            <Heart className="h-5 w-5" />
            <span className="sr-only">Wishlist</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full transition-transform hover:scale-105 hover:text-primary"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="sr-only">Cart</span>
          </Button>

          {/* Theme Toggle Button */}
          <ThemeToggle />

          <div className="ml-1 hidden items-center gap-2 sm:flex">
            <Button
              variant="ghost"
              className="rounded-full px-5 font-semibold transition-transform hover:scale-105"
            >
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
