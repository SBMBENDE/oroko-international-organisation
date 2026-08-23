import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCurrentMember } from "@/lib/dal/profile";
import { logoutUser } from "@/actions/auth.actions";
import { User, CreditCard, Users, LogOut, ShieldCheck, AlertCircle } from "lucide-react";
import { getCountryName } from "@/lib/countries";

export const metadata: Metadata = { title: "Member Portal" };

const statusColors = {
  active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  pending: "bg-oroko-gold/10 text-amber-600 border-oroko-gold/20",
  suspended: "bg-destructive/10 text-destructive border-destructive/20",
  expired: "bg-muted text-muted-foreground border-border",
} as const;

export default async function PortalPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const data = await getCurrentMember();
  if (!data) redirect("/auth/login");

  const { user, membership } = data;
  const status = (membership?.status ?? "pending") as keyof typeof statusColors;
  const profileComplete =
    !!(user.bio && user.country && user.occupation && user.profilePhoto);

  const quickLinks = [
    { href: "/portal/profile", icon: User, label: "Edit Profile", sub: "Update your info and photo" },
    { href: "/portal/id-card", icon: CreditCard, label: "My ID Card", sub: "View your OROKO digital card" },
    { href: "/members", icon: Users, label: "Member Directory", sub: "Browse the OROKO community" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <span className="h-px w-6 bg-oroko-gold" />
          <span className="text-oroko-gold text-xs tracking-[0.3em] uppercase font-medium">Dashboard</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="font-heading text-3xl font-bold text-oroko-black">
            Welcome, {user.firstName}
          </h1>
          {user.isVerified && <ShieldCheck className="size-5 text-oroko-gold" />}
        </div>
        <p className="text-muted-foreground mt-1 text-sm">{user.email}</p>
      </div>

      {!profileComplete && (
        <div className="flex items-start gap-3 px-4 py-3.5 bg-amber-50 border border-oroko-gold/20 rounded-sm">
          <AlertCircle className="size-4 text-oroko-gold mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-oroko-black">Complete your profile</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Add your bio, country, occupation, and a photo to appear fully in the member directory.
            </p>
          </div>
          <Link
            href="/portal/profile"
            className="text-xs text-oroko-gold font-semibold hover:text-oroko-gold-light transition-colors whitespace-nowrap"
          >
            Complete →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Membership ID", value: membership?.orokoId ?? "Pending" },
          { label: "Status", value: membership?.status ?? "Pending", isStatus: true },
          { label: "Country", value: user.country ? getCountryName(user.country) : "Not set" },
          {
            label: "Member Since",
            value: membership?.memberSince
              ? new Date(membership.memberSince).toLocaleDateString("en-US", { year: "numeric", month: "short" })
              : "—",
          },
        ].map(({ label, value, isStatus }) => (
          <div key={label} className="bg-white border border-border rounded-sm p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
            {isStatus ? (
              <span className={`inline-block text-xs px-2 py-0.5 rounded-sm border font-semibold capitalize ${statusColors[status]}`}>
                {value}
              </span>
            ) : (
              <p className="text-sm font-semibold text-oroko-black truncate">{value}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickLinks.map(({ href, icon: Icon, label, sub }) => (
          <Link
            key={href}
            href={href}
            className="group bg-white border border-border rounded-sm p-5 hover:border-oroko-gold/40 hover:shadow-sm transition-all"
          >
            <div className="p-2.5 rounded-sm bg-oroko-green/10 border border-oroko-green/20 inline-flex mb-4 group-hover:bg-oroko-green/20 transition-colors">
              <Icon className="size-4 text-oroko-green" />
            </div>
            <p className="font-semibold text-oroko-black text-sm">{label}</p>
            <p className="text-xs text-muted-foreground mt-1">{sub}</p>
          </Link>
        ))}
      </div>

      <div className="pt-2">
        <form action={logoutUser}>
          <button type="submit" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-oroko-black transition-colors">
            <LogOut className="size-4" />
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
