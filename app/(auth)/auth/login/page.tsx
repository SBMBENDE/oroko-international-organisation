import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "@/components/common/Logo";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  return (
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="bg-white/4 border border-white/10 rounded-sm p-8 sm:p-10 backdrop-blur-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo variant="light" size="lg" />
        </div>

        {/* Heading */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="font-heading text-3xl font-semibold text-white">
            Welcome Back
          </h1>
          <p className="text-white/40 text-sm">
            Sign in to your OROKO member account
          </p>
        </div>

        {/* Divider */}
        <div className="oroko-divider mb-8" />

        {/* Registered success notice */}
        <Suspense>
          <RegisteredNotice />
        </Suspense>

        {/* Form */}
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>

      {/* Footer link */}
      <p className="text-center text-white/40 text-sm mt-6">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/register"
          className="text-oroko-gold hover:text-oroko-gold-light transition-colors font-medium"
        >
          Create one
        </Link>
      </p>

      <p className="text-center mt-4">
        <Link
          href="/"
          className="text-white/25 hover:text-white/50 text-xs tracking-wider transition-colors"
        >
          ← Back to home
        </Link>
      </p>
    </div>
  );
}

async function RegisteredNotice() {
  return null; // populated by client searchParams — handled inside LoginForm
}
