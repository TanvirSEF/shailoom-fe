"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { loginSchema, type LoginValues } from "@/lib/validations/auth.schema"
import { useApiMutation } from "@/hooks/use-api"
import { authService } from "@/lib/services/auth-service"
import { useAuthStore } from "@/store/use-auth-store"
import { AuthResponse } from "@/types/auth"

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [showPassword, setShowPassword] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { mutate: login, isPending } = useApiMutation<AuthResponse, LoginValues>(
    authService.login,
    {
      onSuccess: (data) => {
        setAuth(data.access_token, data.role)
        toast.success("Welcome back!")
        router.push("/")
      },
      onError: (error: any) => {
        const message =
          error.response?.data?.detail || "Invalid email or password."
        toast.error(message)
      },
    }
  )

  const onSubmit = (data: LoginValues) => {
    login(data)
  }

  return (
    <div className="flex min-h-screen w-full bg-background overflow-hidden">
      {/* Left Side: Editorial Image (Hidden on Mobile) */}
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
          <h1 className="text-5xl font-bold tracking-tight italic font-serif">A Heritage of <br /> Elegance.</h1>
          <p className="max-w-md text-lg font-medium opacity-90">
             Experience the timeless allure of Handcrafted Tangail Saree, curated for the modern woman.
          </p>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex w-full flex-col justify-center lg:w-1/2">
        <div className="mx-auto w-full max-w-md px-8 py-12">
          {/* Logo / Back to Home */}
          <Link href="/" className="group mb-12 flex items-center text-sm font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to home
          </Link>

          <div className="space-y-8 animate-in slide-in-from-right duration-700">
            <div className="space-y-3">
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Welcome Back</h2>
              <p className="text-muted-foreground">Please enter your details to sign in.</p>
            </div>

            <div className="space-y-6">
              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <Label htmlFor="email" className={cn(errors.email && "text-destructive")}>Email Address</Label>
                  <div className="relative group">
                    <Mail className={cn(
                      "absolute left-3 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary",
                      errors.email && "text-destructive"
                    )} />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="name@example.com" 
                      {...register("email")}
                      className={cn(
                        "h-12 rounded-xl pl-10 border-border/50 focus-visible:ring-primary shadow-sm",
                        errors.email && "border-destructive focus-visible:ring-destructive"
                      )} 
                    />
                  </div>
                  {errors.email && <p className="text-xs font-semibold text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className={cn(errors.password && "text-destructive")}>Password</Label>
                    <Link href="#" className="text-xs font-bold text-primary hover:underline">Forgot password?</Link>
                  </div>
                  <div className="relative group">
                    <Lock className={cn(
                      "absolute left-3 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary",
                      errors.password && "text-destructive"
                    )} />
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      {...register("password")}
                      className={cn(
                        "h-12 rounded-xl pl-10 pr-10 border-border/50 focus-visible:ring-primary shadow-sm",
                        errors.password && "border-destructive focus-visible:ring-destructive"
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
                  {errors.password && <p className="text-xs font-semibold text-destructive">{errors.password.message}</p>}
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
                      <span className="relative z-10">Sign In</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="/signup" className="font-bold text-primary hover:underline underline-offset-4">
                    Sign up for free
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
