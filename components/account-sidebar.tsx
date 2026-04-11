"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Package, Heart, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/use-auth-store"
import { useRouter } from "next/navigation"

const sidebarLinks = [
  { href: "/account/profile", label: "Profile Details", icon: User },
  { href: "/account/orders", label: "My Orders", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
]

export function AccountSidebar() {
  const pathname = usePathname()
  const logout = useAuthStore((state) => state.logout)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="rounded-2xl border bg-card p-4 shadow-sm sticky top-24">
        <h2 className="mb-4 px-2 text-lg font-bold tracking-tight">My Account</h2>
        <nav className="flex flex-col gap-1 text-sm font-medium">
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200",
                  isActive 
                    ? "bg-primary/10 text-primary font-semibold" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive && "text-primary")} /> {link.label}
              </Link>
            )
          })}
          
          <div className="my-2 border-t border-border" />
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-destructive/10 text-destructive font-medium text-left"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </nav>
      </div>
    </aside>
  )
}
