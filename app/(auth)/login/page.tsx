"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Github, Chrome as Google, Facebook, Mail, Lock, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false)

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
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-12 rounded-xl transition-all hover:scale-[1.02]">
                  <Google className="mr-2 h-4 w-4" /> Google
                </Button>
                <Button variant="outline" className="h-12 rounded-xl transition-all hover:scale-[1.02]">
                  <Facebook className="mr-2 h-4 w-4 fill-blue-600 text-blue-600" /> Facebook
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-4 text-muted-foreground tracking-widest">Or continue with</span>
                </div>
              </div>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input id="email" type="email" placeholder="name@example.com" className="h-12 rounded-xl pl-10 border-border/50 focus-visible:ring-primary shadow-sm" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="text-xs font-bold text-primary hover:underline">Forgot password?</Link>
                  </div>
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

                <Button className="w-full h-14 rounded-2xl text-lg font-bold uppercase tracking-[0.2em] shadow-xl transition-all hover:scale-[1.01] active:scale-[0.98]">
                  Sign In
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
