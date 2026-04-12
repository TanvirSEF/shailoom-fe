"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { useAuthStore } from "@/store/use-auth-store"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, role, token, _hasHydrated } = useAuthStore()
  const [isChecking, setIsChecking] = React.useState(true)

  React.useEffect(() => {
    // Wait for the store to hydrate from localStorage
    if (!_hasHydrated) return;

    // Admin only Auth Guard
    if (!isAuthenticated || !token || role !== "admin") {
      router.push("/login")
    } else {
      setIsChecking(false)
    }
  }, [isAuthenticated, token, role, router, _hasHydrated])

  if (isChecking) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center space-y-4 bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-bold tracking-widest text-muted-foreground uppercase">Entering Secure Dashboard...</p>
      </div>
    )
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "18.5rem",
          "--header-height": "4rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-transparent">
             <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
                {children}
             </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
