"use client"

import { usePathname } from "next/navigation"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Hide Navbar/Footer on admin and auth routes
  const isExcludedRoute = pathname?.startsWith("/admin") || pathname?.startsWith("/login") || pathname?.startsWith("/signup")

  if (isExcludedRoute) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
