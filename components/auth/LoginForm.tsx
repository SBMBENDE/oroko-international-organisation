"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { loginUser } from "@/actions/auth.actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/portal";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    const result = await loginUser(data.email, data.password, callbackUrl);
    if (result && !result.success) {
      setServerError(result.error ?? "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {serverError && (
        <div className="rounded-sm bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white/70 text-xs tracking-wider uppercase">
          Email Address
        </Label>
        <Input
          id="email"
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
        <Label htmlFor="password" className="text-white/70 text-xs tracking-wider uppercase">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2.5 py-3 bg-oroko-gold text-oroko-black text-xs tracking-[0.2em] uppercase font-bold hover:bg-oroko-gold-light disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 rounded-sm mt-2"
      >
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        {isSubmitting ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
