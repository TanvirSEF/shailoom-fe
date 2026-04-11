"use client"

import Link from "next/link"
import { Search, Heart, ShoppingBag, User, Menu, LogOut, Package } from "lucide-react"
import * as React from "react"
import { useCartStore } from "@/store/use-cart-store"
import { useAuthStore } from "@/store/use-auth-store"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/navigation"

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
import { cn } from "@/lib/utils"
import { useApiQuery } from "@/hooks/use-api"
import { User as UserType } from "@/types/auth"

export function Navbar() {
  const router = useRouter()
  const itemCount = useCartStore((state) => 
    state.items.reduce((total, item) => total + item.quantity, 0)
  )
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const logout = useAuthStore((state) => state.logout)
  
  const [mounted, setMounted] = React.useState(false)
  const [isAnimating, setIsAnimating] = React.useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  
  // Close dropdown on outside click
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (itemCount > 0) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 300)
      return () => clearTimeout(timer)
    }
  }, [itemCount])

  const displayCount = mounted ? itemCount : 0
  const isUserLoggedIn = mounted ? isAuthenticated : false

  // Fetch the user profile dynamically if logged in
  const { data: userProfile } = useApiQuery<UserType>(
    ['userProfile'],
    '/users/me',
    undefined,
    { enabled: isUserLoggedIn }
  )

  const handleLogout = () => {
    logout()
    setIsDropdownOpen(false)
    router.push("/login")
  }

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

                {/* Mobile Auth Buttons / Profile Links */}
                <div className="mt-4 flex flex-col gap-3 border-t pt-4">
                  {isUserLoggedIn ? (
                    <>
                      <Link href="/account/profile" className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors py-2">
                        <User className="h-5 w-5" /> Profile
                      </Link>
                      <Link href="/account/orders" className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors py-2">
                        <Package className="h-5 w-5" /> My Orders
                      </Link>
                      <Link href="/account/wishlist" className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors py-2">
                        <Heart className="h-5 w-5" /> Wishlist
                      </Link>
                      <button onClick={handleLogout} className="flex items-center gap-2 text-lg font-medium text-destructive hover:opacity-80 transition-opacity py-2 text-left">
                        <LogOut className="h-5 w-5" /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="w-full">
                        <Button
                          variant="outline"
                          className="w-full rounded-full font-semibold shadow-sm transition-transform hover:scale-105"
                        >
                          Login
                        </Button>
                      </Link>
                      <Link href="/signup" className="w-full">
                        <Button className="w-full rounded-full font-semibold shadow-sm transition-transform hover:scale-105">
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
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
            href="/shop/sarees"
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

          <Link href="/cart">
            <Button
              id="cart-icon-nav"
              variant="ghost"
              size="icon"
              className="relative rounded-full transition-transform hover:scale-105 hover:text-primary"
            >
              <ShoppingBag className="h-5 w-5" />
              {displayCount > 0 && (
                <span className={cn(
                  "absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-lg transition-transform duration-300",
                  isAnimating ? "scale-125 bg-emerald-500" : "scale-100"
                )}>
                  {displayCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>

          {/* Theme Toggle Button */}
          <ThemeToggle />

          <div className="ml-1 hidden items-center gap-2 sm:flex relative" ref={dropdownRef}>
            {isUserLoggedIn ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={cn(
                    "flex items-center gap-2 rounded-full transition-all hover:bg-primary/10 pl-2 pr-4 py-2 hover:text-primary",
                    isDropdownOpen && "bg-primary/10 text-primary"
                  )}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-bold">
                    {userProfile?.username ? userProfile.username.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                  </div>
                  <span className="hidden sm:inline font-medium text-sm">
                    {userProfile?.username?.split(" ")[0] || "Profile"}
                  </span>
                </Button>
                
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-12 w-64 rounded-2xl border bg-card p-2 shadow-2xl"
                    >
                      <div className="mb-2 px-3 py-3 border-b border-border flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary text-lg font-bold">
                          {userProfile?.username ? userProfile.username.charAt(0).toUpperCase() : "..."}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p className="text-sm font-bold leading-none mb-1.5 truncate">
                            {userProfile?.username || "Loading..."}
                          </p>
                          <p className="text-xs text-muted-foreground leading-none truncate">
                            {userProfile?.email || "..."}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-1">
                        <Link href="/account/profile" onClick={() => setIsDropdownOpen(false)}>
                          <div className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary text-muted-foreground cursor-pointer">
                            <User className="h-4 w-4" /> Profile
                          </div>
                        </Link>
                        <Link href="/account/orders" onClick={() => setIsDropdownOpen(false)}>
                          <div className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary text-muted-foreground cursor-pointer">
                            <Package className="h-4 w-4" /> My Orders
                          </div>
                        </Link>
                        <Link href="/account/wishlist" onClick={() => setIsDropdownOpen(false)}>
                          <div className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary text-muted-foreground cursor-pointer">
                            <Heart className="h-4 w-4" /> Wishlist
                          </div>
                        </Link>
                        <div className="my-1 border-t border-border" />
                        <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-destructive/10 text-destructive cursor-pointer">
                          <LogOut className="h-4 w-4" /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="rounded-full px-5 font-semibold transition-transform hover:scale-105"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="rounded-full px-5 font-semibold shadow-sm transition-transform hover:scale-105">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
