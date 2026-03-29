"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export default function SignupPage() {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <div className="flex min-h-screen w-full bg-background overflow-hidden font-sans">
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
        <div className="absolute top-12 left-12">
            <Link href="/" className="text-3xl font-bold tracking-tight text-white uppercase">
              Shailoom<span className="text-primary">.</span>
            </Link>
        </div>
        <div className="absolute bottom-12 left-12 right-12 space-y-4 text-white">
          <h1 className="text-5xl font-bold tracking-tight italic font-serif">Join the <br /> Heritage.</h1>
          <p className="max-w-md text-lg font-medium opacity-90">
             Be the first to experience our new season drops and exclusive handloom collections.
          </p>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex w-full flex-col justify-center lg:w-1/2">
        <div className="mx-auto w-full max-w-md px-8 py-12">
          {/* Back to Home */}
          <Link href="/" className="group mb-12 flex items-center text-sm font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to home
          </Link>

          <div className="space-y-8 animate-in slide-in-from-right duration-700">
            <div className="space-y-3">
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Create Account</h2>
              <p className="text-muted-foreground">Start your luxury shopping journey today.</p>
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative group">
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input id="name" placeholder="John Doe" className="h-12 rounded-xl pl-10 border-border/50 focus-visible:ring-primary shadow-sm" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative group">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input id="email" type="email" placeholder="name@example.com" className="h-12 rounded-xl pl-10 border-border/50 focus-visible:ring-primary shadow-sm" />
                </div>
              </div>

              <div className="space-y-2 text-sans">
                <Label htmlFor="password">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    className="h-12 rounded-xl pl-10 pr-10 border-border/50 focus-visible:ring-primary shadow-sm" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 py-2">
                 <input type="checkbox" id="terms" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                 <label htmlFor="terms" className="text-xs text-muted-foreground leading-none">
                   I agree to the <Link href="#" className="font-bold text-primary hover:underline">Terms of Service</Link> and <Link href="#" className="font-bold text-primary hover:underline">Privacy Policy</Link>
                 </label>
              </div>

              <Button className="w-full h-14 rounded-2xl text-lg font-bold uppercase tracking-[0.2em] shadow-xl transition-all hover:scale-[1.01] active:scale-[0.98]">
                Create Account
              </Button>

              <div className="flex items-center gap-2 text-[10px] text-muted-foreground justify-center uppercase tracking-widest font-bold">
                 <ShieldCheck className="h-3 w-3 text-emerald-600" />
                 Secure 256-bit SSL Encryption
              </div>

              <p className="text-center text-sm text-muted-foreground pt-4">
                Already have an account?{" "}
                <Link href="/login" className="font-bold text-primary hover:underline underline-offset-4">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
