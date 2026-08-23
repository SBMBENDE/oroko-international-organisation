import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import { AlertTriangle } from "lucide-react";

export const metadata: Metadata = { title: "Authentication Error" };

const errorMessages: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to access this resource.",
  Verification: "The verification link is invalid or has expired.",
  Default: "An unexpected authentication error occurred. Please try again.",
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message =
    errorMessages[error ?? "Default"] ?? errorMessages["Default"];

  return (
    <div className="w-full max-w-md">
      <div className="bg-white/4 border border-white/10 rounded-sm p-8 sm:p-10 backdrop-blur-sm text-center">
        <div className="flex justify-center mb-8">
          <Logo variant="light" size="lg" />
        </div>

        <div className="flex justify-center mb-5">
          <div className="p-4 rounded-full bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="size-8 text-destructive" />
          </div>
        </div>

        <h1 className="font-heading text-2xl font-semibold text-white mb-3">
          Authentication Error
        </h1>
        <p className="text-white/50 text-sm mb-8">{message}</p>

        <div className="flex flex-col gap-3">
          <Link
            href="/auth/login"
            className="block text-center py-3 bg-oroko-gold text-oroko-black text-xs tracking-[0.2em] uppercase font-bold hover:bg-oroko-gold-light transition-colors rounded-sm"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="block text-center py-3 border border-white/15 text-white/60 hover:text-white hover:border-white/30 text-xs tracking-[0.2em] uppercase transition-colors rounded-sm"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
