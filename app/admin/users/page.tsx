"use client"

import * as React from "react"
import {
  IconSearch,
  IconRefresh,
  IconUsers,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react"
import { toast } from "sonner"
import { useApiQuery, useApiMutation } from "@/hooks/use-api"
import { adminService } from "@/lib/services/admin-service"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface AdminUser {
  id?: string
  _id?: string
  username?: string
  email?: string
  phone_number?: string
  role?: string
  created_at?: string
  [key: string]: unknown
}

export default function UsersPage() {
  const [roleFilter, setRoleFilter] = React.useState("all")
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(0)

  const { data: users, isLoading, refetch } = useApiQuery<AdminUser[]>(
    ["adminUsers"],
    "/admin/users",
    undefined,
    { enabled: true }
  )

  const updateRoleMutation = useApiMutation(
    (params: { email: string; role: string }) =>
      adminService.updateUserRole(params.email, params.role),
    {
      onSuccess: () => {
        toast.success("User role updated")
        refetch()
      },
      onError: () => {
        toast.error("Failed to update role")
      },
  })

  const filteredUsers = React.useMemo(() => {
    if (!users) return []
    let result = [...users]
    if (roleFilter !== "all") {
      result = result.filter((u) => u.role?.toLowerCase() === roleFilter)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (u) =>
          u.username?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q)
      )
    }
    return result
  }, [users, roleFilter, search])

  const pageSize = 10
  const totalPages = Math.ceil(filteredUsers.length / pageSize)
  const pagedUsers = filteredUsers.slice(page * pageSize, (page + 1) * pageSize)

  React.useEffect(() => {
    setPage(0)
  }, [roleFilter, search])

  return (
    <div className="flex flex-1 flex-col gap-6 pb-20 px-4 lg:px-6 mt-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
          <p className="text-sm text-muted-foreground">
            {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-64 rounded-xl pl-9"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="h-10 w-36 rounded-xl">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="rounded-xl cursor-pointer" onClick={() => refetch()}>
            <IconRefresh className="size-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-sm">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : pagedUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <IconUsers className="size-12 text-muted-foreground/40 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No users found</p>
            <p className="text-sm text-muted-foreground/70">
              {search || roleFilter !== "all"
                ? "Try adjusting your filters"
                : "Users will appear here once they sign up"}
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden md:table-cell">Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden sm:table-cell">Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedUsers.map((user, index) => (
                  <TableRow key={user.id ?? user._id ?? user.email ?? index} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                          {user.username?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <span className="text-sm font-medium">{user.username || "—"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{user.email || "—"}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{user.phone_number || "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-xs font-medium border-none capitalize",
                          user.role === "admin"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {user.role || "user"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.role || "user"}
                        onValueChange={(value) =>
                          updateRoleMutation.mutate({ email: user.email!, role: value })
                        }
                      >
                        <SelectTrigger className="h-8 w-28 rounded-lg text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t px-4 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, filteredUsers.length)} of {filteredUsers.length}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 rounded-lg"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                >
                  <IconChevronLeft className="size-4" />
                </Button>
                <span className="text-sm font-medium px-2">
                  Page {page + 1} of {totalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 rounded-lg"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages - 1}
                >
                  <IconChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
