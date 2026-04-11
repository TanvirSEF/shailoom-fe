import { ReactNode } from "react"
import { AccountSidebar } from "@/components/account-sidebar"

export default function AccountLayout({ children }: { children: ReactNode }) {
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
