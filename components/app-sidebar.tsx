"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  IconDashboard,
  IconDatabase,
  IconChartBar,
  IconInnerShadowTop,
  IconListDetails,
  IconLogout,
  IconUsers,
  IconTicket,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { useAuthStore } from "@/store/use-auth-store"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: IconDashboard,
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: IconListDetails,
    },
    {
      title: "Inventory",
      url: "/admin/products",
      icon: IconDatabase,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: IconChartBar,
    },
    {
      title: "Customers",
      url: "/admin/users",
      icon: IconUsers,
    },
    {
      title: "Coupons",
      url: "/admin/coupons",
      icon: IconTicket,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/admin">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">Shailoom Admin</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Logout" className="cursor-pointer">
              <IconLogout />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
