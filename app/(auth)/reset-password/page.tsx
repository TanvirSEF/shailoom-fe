"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Lock, Eye, EyeOff, Loader2, KeyRound } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { resetPasswordSchema, type ResetPasswordValues } from "@/lib/validations/auth.schema"
import { useApiMutation } from "@/hooks/use-api"
import { authService } from "@/lib/services/auth-service"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

  const email = searchParams.get("email") || ""
  const token = searchParams.get("token") || ""

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email,
      token,
      new_password: "",
      confirm_password: "",
    },
  })

  const { mutate: resetPassword, isPending } = useApiMutation<{ message: string }, Omit<ResetPasswordValues, "confirm_password">>(
    authService.resetPassword,
    {
      onSuccess: () => {
        toast.success("Password reset successful! Please login with your new password.")
        router.push("/login")
      },
      onError: (error: any) => {
        const message = error.response?.data?.detail || "Invalid or expired token. Please try again."
        toast.error(message)
      },
    }
  )

  const onSubmit = (data: ResetPasswordValues) => {
    // Only send the fields the API expects
    const { confirm_password, ...payload } = data
    resetPassword(payload)
  }

  return (
    <div className="flex min-h-screen w-full bg-background overflow-hidden">
      {/* Left Side: Editorial Image */}
      <div className="relative hidden w-1/2 lg:block">
        <Image
          src="/images/auth/auth-editorial-saree.png"
          alt="Luxury Saree Editorial"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-12 left-12 right-12 space-y-4 text-white">
          <h1 className="text-5xl font-bold tracking-tight italic font-serif">Security first. <br /> Elegant always.</h1>
          <p className="max-w-md text-lg font-medium opacity-90">
             Choose a strong password to protect your curated Shailoom experience.
          </p>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex w-full flex-col justify-center lg:w-1/2">
        <div className="mx-auto w-full max-w-md px-8 py-12">
          {/* Back to Login */}
          <Link href="/login" className="group mb-12 flex items-center text-sm font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to login
          </Link>

          <div className="space-y-8 animate-in slide-in-from-right duration-700">
            <div className="space-y-3">
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Set New Password</h2>
              <p className="text-muted-foreground">Please enter your new password below.</p>
            </div>

            <div className="space-y-6">
              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                {/* Email (Hidden but needed for form validation/payload) */}
                <input type="hidden" {...register("email")} />
                <input type="hidden" {...register("token")} />

                {!token && (
                   <div className="space-y-2">
                   <Label htmlFor="token" className={cn(errors.token && "text-destructive")}>Reset Token</Label>
                   <div className="relative group">
                     <KeyRound className={cn(
                       "absolute left-3 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary",
                       errors.token && "text-destructive"
                     )} />
                     <Input 
                       id="token" 
                       placeholder="Enter the token from your email" 
                       {...register("token")}
                       className={cn(
                         "h-12 rounded-xl pl-10 border-border/50 focus-visible:ring-primary shadow-sm",
                         errors.token && "border-destructive focus-visible:ring-destructive"
                       )} 
                     />
                   </div>
                   {errors.token && <p className="text-xs font-semibold text-destructive">{errors.token.message}</p>}
                 </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="new_password" className={cn(errors.new_password && "text-destructive")}>New Password</Label>
                  <div className="relative group">
                    <Lock className={cn(
                      "absolute left-3 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary",
                      errors.new_password && "text-destructive"
                    )} />
                    <Input 
                      id="new_password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••"
                      {...register("new_password")}
                      className={cn(
                        "h-12 rounded-xl pl-10 pr-10 border-border/50 focus-visible:ring-primary shadow-sm",
                        errors.new_password && "border-destructive focus-visible:ring-destructive"
                      )} 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.new_password && <p className="text-xs font-semibold text-destructive">{errors.new_password.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm_password" className={cn(errors.confirm_password && "text-destructive")}>Confirm New Password</Label>
                  <div className="relative group">
                    <Lock className={cn(
                      "absolute left-3 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary",
                      errors.confirm_password && "text-destructive"
                    )} />
                    <Input 
                      id="confirm_password" 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="••••••••"
                      {...register("confirm_password")}
                      className={cn(
                        "h-12 rounded-xl pl-10 pr-10 border-border/50 focus-visible:ring-primary shadow-sm",
                        errors.confirm_password && "border-destructive focus-visible:ring-destructive"
                      )} 
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirm_password && <p className="text-xs font-semibold text-destructive">{errors.confirm_password.message}</p>}
                </div>

                <Button 
                  type="submit"
                  disabled={isPending}
                  className="w-full h-14 rounded-2xl text-lg font-bold uppercase tracking-[0.2em] shadow-xl transition-all hover:scale-[1.01] active:scale-[0.98] relative overflow-hidden group"
                >
                  {isPending ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      <span className="relative z-10">Reset Password</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
