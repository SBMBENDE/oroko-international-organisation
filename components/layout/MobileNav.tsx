"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { cn } from "@/lib/utils";
import type { NavLink } from "@/types";

type MobileNavProps = {
  links: NavLink[];
  open: boolean;
  onClose: () => void;
};

export function MobileNav({ links, open, onClose }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 z-50 w-[min(320px,100vw)] bg-oroko-black border-l border-oroko-gold/10 flex flex-col transition-transform duration-400 ease-in-out lg:hidden",
          open ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-oroko-gold/10">
          <Logo variant="light" size="sm" />
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-1.5"
            aria-label="Close navigation menu"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-6 py-8">
          <ul className="space-y-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.comingSoon ? "#" : link.href}
                    onClick={link.comingSoon ? undefined : onClose}
                    aria-disabled={link.comingSoon}
                    className={cn(
                      "flex items-center justify-between py-3.5 px-4 rounded-sm text-sm tracking-[0.12em] uppercase font-medium transition-colors duration-200",
                      link.comingSoon
                        ? "text-white/25 cursor-not-allowed"
                        : isActive
                          ? "bg-oroko-gold/10 text-oroko-gold border-l-2 border-oroko-gold pl-3"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {link.label}
                    {link.comingSoon && (
                      <span className="text-[9px] tracking-widest uppercase px-1.5 py-0.5 rounded-sm border border-white/10 text-white/25">
                        Soon
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer CTAs */}
        <div className="px-6 py-6 border-t border-oroko-gold/10 space-y-3">
          <Link
            href="/auth/register"
            onClick={onClose}
            className="block text-center text-xs tracking-[0.15em] uppercase font-semibold px-5 py-3 bg-oroko-gold text-oroko-black hover:bg-oroko-gold-light transition-colors duration-200 rounded-sm"
          >
            Join Us
          </Link>
          <Link
            href="/auth/login"
            onClick={onClose}
            className="block text-center text-xs tracking-[0.15em] uppercase font-medium px-5 py-3 border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors duration-200 rounded-sm"
          >
            Sign In
          </Link>
        </div>
      </div>
    </>
  );
}
