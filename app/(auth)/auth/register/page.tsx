import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Join OROKO" };

export default function RegisterPage() {
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
            Join OROKO
          </h1>
          <p className="text-white/40 text-sm">
            Create your individual member account
          </p>
        </div>

        {/* Divider */}
        <div className="oroko-divider mb-8" />

        {/* Form */}
        <RegisterForm />
      </div>

      {/* Footer link */}
      <p className="text-center text-white/40 text-sm mt-6">
        Already a member?{" "}
        <Link
          href="/auth/login"
          className="text-oroko-gold hover:text-oroko-gold-light transition-colors font-medium"
        >
          Sign in
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
