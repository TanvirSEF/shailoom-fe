"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/validations/auth.schema"
import { useApiMutation } from "@/hooks/use-api"
import { authService } from "@/lib/services/auth-service"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [isSuccess, setIsSuccess] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const { mutate: forgotPassword, isPending } = useApiMutation<{ message: string }, ForgotPasswordValues>(
    authService.forgotPassword,
    {
      onSuccess: () => {
        setIsSuccess(true)
        toast.success("Reset link sent to your email!")
      },
      onError: (error: any) => {
        const message = error.response?.data?.detail || "Something went wrong. Please try again."
        toast.error(message)
      },
    }
  )

  const onSubmit = (data: ForgotPasswordValues) => {
    forgotPassword(data)
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
          <h1 className="text-5xl font-bold tracking-tight italic font-serif">Restore Your <br /> Access.</h1>
          <p className="max-w-md text-lg font-medium opacity-90">
             We&apos;ll help you get back to your heritage collection in just a few steps.
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
            {isSuccess ? (
              <div className="space-y-6 text-center lg:text-left">
                <div className="flex justify-center lg:justify-start">
                  <div className="rounded-full bg-primary/10 p-3">
                    <CheckCircle2 className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h2 className="text-4xl font-bold tracking-tight text-foreground">Check Your Email</h2>
                  <p className="text-muted-foreground text-lg">
                    We&apos;ve sent a password reset link to your email address. Please follow the instructions to reset your password.
                  </p>
                </div>
                <Button 
                  onClick={() => setIsSuccess(false)}
                  variant="outline"
                  className="h-12 rounded-xl px-8 font-bold uppercase tracking-widest transition-all"
                >
                  Resend Email
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <h2 className="text-4xl font-bold tracking-tight text-foreground">Forgot Password?</h2>
                  <p className="text-muted-foreground">Enter your email and we&apos;ll send you a link to reset your password.</p>
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

                    <Button 
                      type="submit"
                      disabled={isPending}
                      className="w-full h-14 rounded-2xl text-lg font-bold uppercase tracking-[0.2em] shadow-xl transition-all hover:scale-[1.01] active:scale-[0.98] relative overflow-hidden group"
                    >
                      {isPending ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <>
                          <span className="relative z-10">Send Reset Link</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
