"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronsLeft, ChevronsRight, Menu, X, LogOut, Bell, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminSidebarNav } from "./AdminSidebarNav";
import { ADMIN_NAV_ITEMS } from "@/lib/admin-nav";
import { logoutUser } from "@/actions/auth.actions";
import { ROLE_LABELS, hasPermission } from "@/lib/permissions";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface AdminShellProps {
  userName: string;
  userRole: string;
  notificationCount: number;
  children: React.ReactNode;
}

export function AdminShell({
  userName,
  userRole,
  notificationCount,
  children,
}: AdminShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  // Icons aren't serializable across the server/client boundary, so nav items
  // (which include Lucide icon components) are filtered here rather than passed as a prop.
  const navItems = ADMIN_NAV_ITEMS.filter((item) => hasPermission(userRole, item.permission));

  return (
    <div className="min-h-screen bg-oroko-warm-white flex">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-oroko-black border-r border-oroko-gold/10 transition-all duration-200 sticky top-0 h-screen",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-oroko-gold/10">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2 min-w-0">
              <div className="relative shrink-0 rounded-full overflow-hidden ring-1 ring-oroko-gold/30">
                <Image src="/images/logo.jpeg" alt="OROKO" width={28} height={28} className="object-cover" />
              </div>
              <span className="font-heading font-bold tracking-widest uppercase text-sm text-oroko-warm-white truncate">
                Admin
              </span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="text-white/60 hover:text-white p-1 rounded-sm shrink-0"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
          </button>
        </div>
        <AdminSidebarNav items={navItems} collapsed={collapsed} />
        <div className="border-t border-oroko-gold/10 p-3">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2 text-white/40 hover:text-white/70 text-[11px] tracking-wide uppercase transition-colors",
              collapsed && "justify-center"
            )}
          >
            <ExternalLink className="size-3.5 shrink-0" />
            {!collapsed && "View public site"}
          </Link>
        </div>
      </aside>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="bg-oroko-black border-oroko-gold/10 p-0 w-3/4 sm:max-w-xs" showCloseButton={false}>
          <SheetHeader className="flex-row items-center justify-between border-b border-oroko-gold/10 p-4">
            <SheetTitle className="text-oroko-warm-white font-heading uppercase tracking-widest text-sm">
              OROKO Admin
            </SheetTitle>
            <button onClick={() => setMobileOpen(false)} className="text-white/60 hover:text-white" aria-label="Close menu">
              <X className="size-5" />
            </button>
          </SheetHeader>
          <AdminSidebarNav items={navItems} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-white border-b border-border flex items-center justify-between px-4 sm:px-6 py-3 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-oroko-black p-1.5 -ml-1.5"
              aria-label="Open navigation menu"
            >
              <Menu className="size-5" />
            </button>
            <h1 className="font-heading text-lg font-semibold text-oroko-black truncate">
              OROKO International — Admin
            </h1>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/admin/applications"
              className="relative text-muted-foreground hover:text-oroko-black p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Notifications"
            >
              <Bell className="size-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-destructive text-[10px] font-semibold text-white">
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </Link>

            <div className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full hover:bg-muted transition-colors px-2 py-1.5"
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-oroko-green text-oroko-warm-white text-xs font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-xs font-medium text-oroko-black">{userName}</span>
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {ROLE_LABELS[userRole] ?? userRole}
                  </span>
                </span>
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-white ring-1 ring-foreground/10 shadow-lg z-20 overflow-hidden">
                    <Link
                      href="/portal/profile"
                      className="block px-4 py-2.5 text-sm text-oroko-black hover:bg-muted"
                      onClick={() => setProfileOpen(false)}
                    >
                      My Profile
                    </Link>
                    <form action={logoutUser}>
                      <button
                        type="submit"
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 text-left"
                      >
                        <LogOut className="size-4" />
                        Log out
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
