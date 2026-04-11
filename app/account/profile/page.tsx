"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, ShieldCheck, Pencil, X, Phone, MapPin, Mail } from "lucide-react"

import { useApiQuery, useApiMutation } from "@/hooks/use-api"
import { userService } from "@/lib/services/user-service"
import { profileUpdateSchema, ProfileUpdateValues } from "@/lib/validations/user.schema"
import { User } from "@/types/auth"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/use-auth-store"

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | null }) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-border last:border-0">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
        <span className={cn("text-sm font-medium break-words", !value && "text-muted-foreground/60 italic")}>
          {value || "Not provided"}
        </span>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = React.useState(false)

  const [mounted, setMounted] = React.useState(false)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  React.useEffect(() => { setMounted(true) }, [])

  const isEnabled = mounted && isAuthenticated

  const { data: userProfile, isLoading: isFetching, refetch } = useApiQuery<User>(
    ['userProfile'],
    '/users/me',
    undefined,
    {
      enabled: isEnabled,
      staleTime: 0,
      refetchOnMount: true,
    }
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProfileUpdateValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: { username: "", phone_number: "", address: "" }
  })

  // Pre-fill form each time the user opens edit mode
  const handleStartEdit = () => {
    reset({
      username: userProfile?.username || "",
      phone_number: userProfile?.phone_number || "",
      address: userProfile?.address || "",
    })
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const { mutate: updateProfile, isPending } = useApiMutation<User, ProfileUpdateValues>(
    userService.updateProfile,
    {
      onSuccess: () => {
        // Invalidate the cache → triggers a fresh GET /users/me automatically
        queryClient.invalidateQueries({ queryKey: ['userProfile'] })
        toast.success("Profile Updated", {
          description: "Your profile information has been saved.",
        })
        // Return to read-only view
        setIsEditing(false)
      },
      onError: (error: any) => {
        toast.error("Update Failed", {
          description: error.response?.data?.message || "There was a problem updating your profile.",
        })
      }
    }
  )

  const onSubmit = (values: ProfileUpdateValues) => {
    updateProfile(values)
  }

  if (!mounted || isFetching) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center justify-between p-6 md:p-8 bg-muted/30 border-b">
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
            Profile Details <ShieldCheck className="h-5 w-5 text-primary" />
          </h3>
          <p className="text-sm text-muted-foreground">
            {isEditing
              ? "Make changes to your personal information below."
              : "Your personal information and delivery details."}
          </p>
        </div>

        {!isEditing ? (
          <Button
            onClick={handleStartEdit}
            size="sm"
            variant="outline"
            className="flex items-center gap-2 rounded-full"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit Profile
          </Button>
        ) : (
          <Button
            onClick={handleCancelEdit}
            size="sm"
            variant="ghost"
            className="flex items-center gap-2 rounded-full text-muted-foreground"
          >
            <X className="h-3.5 w-3.5" /> Cancel
          </Button>
        )}
      </div>

      <div className="p-6 md:p-8">
        {/* ── VIEW MODE ── */}
        {!isEditing && (
          <div className="max-w-xl">
            {/* Avatar + Name row */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-2xl font-bold">
                {userProfile?.username ? userProfile.username.charAt(0).toUpperCase() : "?"}
              </div>
              <div>
                <p className="text-lg font-bold">{userProfile?.username || "No name set"}</p>
                <p className="text-sm text-muted-foreground capitalize">{userProfile?.role || "customer"}</p>
              </div>
            </div>

            <InfoRow icon={Mail} label="Email Address" value={userProfile?.email} />
            <InfoRow icon={Phone} label="Phone Number" value={userProfile?.phone_number} />
            <InfoRow icon={MapPin} label="Delivery Address" value={userProfile?.address} />
          </div>
        )}

        {/* ── EDIT MODE ── */}
        {isEditing && (
          <>
            {/* Read-only email */}
            <div className="mb-6 grid gap-2 max-w-xl">
              <Label htmlFor="email" className="text-muted-foreground font-medium">Email Address</Label>
              <Input
                id="email"
                value={userProfile?.email || ""}
                disabled
                className="bg-muted text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-xl">
              <div className="grid gap-2">
                <Label htmlFor="username" className={cn("font-medium", errors.username && "text-destructive")}>
                  Full Name
                </Label>
                <Input
                  id="username"
                  placeholder="e.g. John Doe"
                  {...register("username")}
                  className={errors.username ? "border-destructive" : ""}
                />
                {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone_number" className={cn("font-medium", errors.phone_number && "text-destructive")}>
                  Phone Number
                </Label>
                <Input
                  id="phone_number"
                  placeholder="e.g. +8801700000000"
                  {...register("phone_number")}
                  className={errors.phone_number ? "border-destructive" : ""}
                />
                {errors.phone_number && <p className="text-sm text-destructive">{errors.phone_number.message}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address" className={cn("font-medium", errors.address && "text-destructive")}>
                  Delivery Address
                </Label>
                <Textarea
                  id="address"
                  placeholder="Enter your full delivery address"
                  className={cn("min-h-[110px] resize-none", errors.address && "border-destructive")}
                  {...register("address")}
                />
                {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="submit"
                  className="rounded-full px-8 font-semibold shadow-sm"
                  disabled={isPending}
                >
                  {isPending ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                  ) : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-full px-6"
                  onClick={handleCancelEdit}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
