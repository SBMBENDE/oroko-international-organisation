"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { registerUser } from "@/actions/auth.actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);
    const result = await registerUser(data);

    if (!result.success) {
      setServerError(result.error ?? "Registration failed");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/auth/login?registered=true"), 1800);
  };

  if (success) {
    return (
      <div className="text-center py-6 space-y-3">
        <CheckCircle className="size-12 text-oroko-gold mx-auto" />
        <p className="text-white font-heading text-xl">Account Created!</p>
        <p className="text-white/50 text-sm">Redirecting you to sign in…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {serverError && (
        <div className="rounded-sm bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      {/* Name row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-white/70 text-xs tracking-wider uppercase">
            First Name
          </Label>
          <Input
            id="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="First name"
            {...register("firstName")}
            className={cn(
              "bg-white/5 border-white/15 text-white placeholder:text-white/30 focus-visible:border-oroko-gold focus-visible:ring-oroko-gold/20",
              errors.firstName && "border-destructive"
            )}
          />
          {errors.firstName && (
            <p className="text-destructive text-xs">{errors.firstName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-white/70 text-xs tracking-wider uppercase">
            Last Name
          </Label>
          <Input
            id="lastName"
            type="text"
            autoComplete="family-name"
            placeholder="Last name"
            {...register("lastName")}
            className={cn(
              "bg-white/5 border-white/15 text-white placeholder:text-white/30 focus-visible:border-oroko-gold focus-visible:ring-oroko-gold/20",
              errors.lastName && "border-destructive"
            )}
          />
          {errors.lastName && (
            <p className="text-destructive text-xs">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="reg-email" className="text-white/70 text-xs tracking-wider uppercase">
          Email Address
        </Label>
        <Input
          id="reg-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register("email")}
          className={cn(
            "bg-white/5 border-white/15 text-white placeholder:text-white/30 focus-visible:border-oroko-gold focus-visible:ring-oroko-gold/20",
            errors.email && "border-destructive"
          )}
        />
        {errors.email && (
          <p className="text-destructive text-xs">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="reg-password" className="text-white/70 text-xs tracking-wider uppercase">
          Password
        </Label>
        <div className="relative">
          <Input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            {...register("password")}
            className={cn(
              "bg-white/5 border-white/15 text-white placeholder:text-white/30 focus-visible:border-oroko-gold focus-visible:ring-oroko-gold/20 pr-10",
              errors.password && "border-destructive"
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-destructive text-xs">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-white/70 text-xs tracking-wider uppercase">
          Confirm Password
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Repeat your password"
            {...register("confirmPassword")}
            className={cn(
              "bg-white/5 border-white/15 text-white placeholder:text-white/30 focus-visible:border-oroko-gold focus-visible:ring-oroko-gold/20 pr-10",
              errors.confirmPassword && "border-destructive"
            )}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-destructive text-xs">{errors.confirmPassword.message}</p>
        )}
      </div>

      <p className="text-white/30 text-xs leading-relaxed">
        By creating an account you agree to OROKO&apos;s membership terms and conditions.
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2.5 py-3 bg-oroko-gold text-oroko-black text-xs tracking-[0.2em] uppercase font-bold hover:bg-oroko-gold-light disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 rounded-sm"
      >
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        {isSubmitting ? "Creating account…" : "Create Account"}
      </button>
    </form>
  );
}
