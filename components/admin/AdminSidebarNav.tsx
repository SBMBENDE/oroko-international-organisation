"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { AdminNavItem } from "@/lib/admin-nav";

interface AdminSidebarNavProps {
  items: AdminNavItem[];
  collapsed?: boolean;
  onNavigate?: () => void;
}

export function AdminSidebarNav({ items, collapsed, onNavigate }: AdminSidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-0.5">
      {items.map(({ href, label, icon: Icon }) => {
        const isActive = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            className={cn(
              "flex items-center gap-3 rounded-sm px-3 py-2.5 text-xs tracking-wide font-medium transition-colors duration-150",
              collapsed && "justify-center px-2",
              isActive
                ? "bg-oroko-gold/15 text-oroko-gold border-l-2 border-oroko-gold"
                : "text-white/60 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
            )}
          >
            <Icon className="size-4 shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
