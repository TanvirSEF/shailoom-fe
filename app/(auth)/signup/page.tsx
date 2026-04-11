"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Mail, Lock, User, Eye, EyeOff, 
  ShieldCheck, Phone, Loader2 
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { signupSchema, type SignupValues } from "@/lib/validations/auth.schema";
import { useApiMutation } from "@/hooks/use-api";
import { authService } from "@/lib/services/auth-service";
import { AuthResponse } from "@/types/auth";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      phone_number: "",
    },
  });

  const { mutate: signup, isPending } = useApiMutation<AuthResponse, SignupValues>(
    authService.signup,
    {
      onSuccess: () => {
        toast.success("Account created successfully! Please sign in.");
        router.push("/login");
      },
      onError: (error: any) => {
        const message = error.response?.data?.detail || "Something went wrong. Please try again.";
        toast.error(message);
      },
    }
  );

  const onSubmit = (data: SignupValues) => {
    signup(data);
  };

  return (
    <div className="flex min-h-screen w-full bg-background overflow-hidden font-sans">
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
        <div className="absolute top-12 left-12">
          <Link href="/" className="text-3xl font-bold tracking-tight text-white uppercase">
            Shailoom<span className="text-primary">.</span>
          </Link>
        </div>
        <div className="absolute bottom-12 left-12 right-12 space-y-4 text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold tracking-tight italic font-serif"
          >
            Join the <br /> Heritage.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-md text-lg font-medium opacity-90"
          >
            Be the first to experience our new season drops and exclusive handloom collections.
          </motion.p>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex w-full flex-col justify-center lg:w-1/2 bg-card/30 backdrop-blur-sm shadow-2xl">
        <div className="mx-auto w-full max-w-md px-8 py-12">
          <Link href="/" className="group mb-8 flex items-center text-sm font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to home
          </Link>

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Create Account</h2>
              <p className="text-muted-foreground">Start your luxury shopping journey today.</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Username */}
              <div className="space-y-1.5">
                <Label htmlFor="username" className={cn(errors.username && "text-destructive")}>Username</Label>
                <div className="relative group">
                  <User className={cn(
                    "absolute left-3 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary",
                    errors.username && "text-destructive"
                  )} />
                  <Input 
                    id="username" 
                    placeholder="johndoe" 
                    {...register("username")}
                    className={cn(
                      "h-12 rounded-xl pl-10 border-border/50 focus-visible:ring-primary shadow-sm bg-background/50",
                      errors.username && "border-destructive focus-visible:ring-destructive"
                    )} 
                  />
                </div>
                {errors.username && <p className="text-xs font-semibold text-destructive">{errors.username.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
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
                      "h-12 rounded-xl pl-10 border-border/50 focus-visible:ring-primary shadow-sm bg-background/50",
                      errors.email && "border-destructive focus-visible:ring-destructive"
                    )} 
                  />
                </div>
                {errors.email && <p className="text-xs font-semibold text-destructive">{errors.email.message}</p>}
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <Label htmlFor="phone_number" className={cn(errors.phone_number && "text-destructive")}>Phone Number</Label>
                <div className="relative group">
                  <Phone className={cn(
                    "absolute left-3 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary",
                    errors.phone_number && "text-destructive"
                  )} />
                  <Input 
                    id="phone_number" 
                    placeholder="+880..." 
                    {...register("phone_number")}
                    className={cn(
                      "h-12 rounded-xl pl-10 border-border/50 focus-visible:ring-primary shadow-sm bg-background/50",
                      errors.phone_number && "border-destructive focus-visible:ring-destructive"
                    )} 
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className={cn(errors.password && "text-destructive")}>Password</Label>
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
                      "h-12 rounded-xl pl-10 pr-10 border-border/50 focus-visible:ring-primary shadow-sm bg-background/50",
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


              <div className="flex items-center space-x-2 py-2">
                <input type="checkbox" required id="terms" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <label htmlFor="terms" className="text-xs text-muted-foreground leading-none">
                  I agree to the <Link href="#" className="font-bold text-primary hover:underline">Terms of Service</Link> and <Link href="#" className="font-bold text-primary hover:underline">Privacy Policy</Link>
                </label>
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
                    <span className="relative z-10">Create Account</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </>
                )}
              </Button>

              <div className="flex items-center gap-2 text-[10px] text-muted-foreground justify-center uppercase tracking-widest font-bold">
                <ShieldCheck className="h-3 w-3 text-emerald-600" />
                Secure 256-bit SSL Encryption
              </div>

              <p className="text-center text-sm text-muted-foreground pt-2">
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
  );
}
