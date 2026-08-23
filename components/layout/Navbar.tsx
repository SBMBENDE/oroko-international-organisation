"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { MobileNav } from "./MobileNav";
import { useScrolled } from "@/hooks/useScrolled";
import { cn } from "@/lib/utils";
import type { NavLink } from "@/types";

const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Governance", href: "/governance" },
  { label: "Events", href: "/events" },
  { label: "Projects", href: "/projects" },
  { label: "Members", href: "/members" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const scrolled = useScrolled(40);
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Transparent hero navbar only on the homepage; everywhere else show solid immediately
  const isHomepage = pathname === "/";
  const solid = scrolled || !isHomepage;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          solid
            ? "bg-oroko-black/95 backdrop-blur-md border-b border-oroko-gold/10 py-3"
            : "bg-transparent py-5"
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Logo variant="light" size="md" />

          {/* Desktop nav links */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.comingSoon ? "#" : link.href}
                    aria-disabled={link.comingSoon}
                    className={cn(
                      "text-xs tracking-[0.15em] uppercase font-medium transition-colors duration-200 relative group",
                      link.comingSoon
                        ? "text-white/30 cursor-not-allowed"
                        : isActive
                          ? "text-oroko-gold"
                          : "text-white/80 hover:text-white"
                    )}
                  >
                    {link.label}
                    {!link.comingSoon && (
                      <span
                        className={cn(
                          "absolute -bottom-1 left-0 h-px bg-oroko-gold transition-all duration-300",
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        )}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/donate"
              className="text-xs tracking-[0.15em] uppercase font-medium text-white/70 hover:text-white transition-colors duration-200"
            >
              Donate
            </Link>
            <Link
              href="/auth/login"
              className="text-xs tracking-[0.15em] uppercase font-medium text-white/70 hover:text-white transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="text-xs tracking-[0.15em] uppercase font-semibold px-5 py-2.5 bg-oroko-gold text-oroko-black hover:bg-oroko-gold-light transition-colors duration-200 rounded-sm"
            >
              Join Us
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-white p-1.5 rounded"
            aria-label="Open navigation menu"
          >
            <Menu className="size-6" />
          </button>
        </nav>
      </header>

      <MobileNav
        links={navLinks}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}
