"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, User, CreditCard, Users, Scale, Heart, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

const portalLinks = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/portal/profile", label: "My Profile", icon: User, exact: false },
  { href: "/portal/id-card", label: "My ID Card", icon: CreditCard, exact: false },
  { href: "/portal/events", label: "My Events", icon: CalendarDays, exact: false },
  { href: "/members", label: "Members", icon: Users, exact: false },
  { href: "/portal/governance", label: "Governance", icon: Scale, exact: false },
  { href: "/portal/donations", label: "My Donations", icon: Heart, exact: false },
];

export function PortalNav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-border bg-white sticky top-18 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {portalLinks.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 px-3 py-3.5 text-xs tracking-wider uppercase font-medium border-b-2 whitespace-nowrap transition-colors duration-150",
                  isActive
                    ? "border-oroko-gold text-oroko-green"
                    : "border-transparent text-muted-foreground hover:text-oroko-black hover:border-border"
                )}
              >
                <Icon className="size-3.5" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
