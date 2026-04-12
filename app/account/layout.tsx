"use client"

import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { AccountSidebar } from "@/components/account-sidebar"
import { useAuthStore } from "@/store/use-auth-store"

export default function AccountLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, token } = useAuthStore()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check authentication status
    if (!isAuthenticated || !token) {
      router.push("/login")
    } else {
      setIsChecking(false)
    }
  }, [isAuthenticated, token, router])

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="flex min-h-[70vh] w-full flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">Verifying your account...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10 md:py-16 min-h-[70vh]">
      <div className="flex flex-col gap-8 md:flex-row md:gap-10">
        <AccountSidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
