import type { Metadata } from "next";
import Link from "next/link";
import { Scale, Building2, Users, FileText, CalendarDays } from "lucide-react";

export const metadata: Metadata = { title: "Governance" };

const links = [
  {
    href: "/portal/governance/assembly",
    icon: Scale,
    label: "General Assembly",
    desc: "Sessions, agendas, resolutions and decisions",
  },
  {
    href: "/portal/governance/executive",
    icon: Building2,
    label: "Executive Council",
    desc: "Officer profiles and executive meetings",
  },
  {
    href: "/portal/governance/committees",
    icon: Users,
    label: "Committees",
    desc: "Working groups, meetings and reports",
  },
];

export default function PortalGovernancePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="h-px w-6 bg-oroko-gold" />
          <span className="text-oroko-gold text-xs tracking-[0.3em] uppercase font-medium">
            Governance Hub
          </span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-oroko-black">Governance</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Access meetings, documents, and governance information for all organs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {links.map(({ href, icon: Icon, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="group bg-white border border-border rounded-sm p-6 hover:border-oroko-gold/40 hover:shadow-sm transition-all"
          >
            <div className="p-2.5 rounded-sm bg-oroko-green/10 border border-oroko-green/20 inline-flex mb-4 group-hover:bg-oroko-green/20 transition-colors">
              <Icon className="size-4 text-oroko-green" />
            </div>
            <p className="font-semibold text-oroko-black text-sm">{label}</p>
            <p className="text-xs text-muted-foreground mt-1">{desc}</p>
          </Link>
        ))}
      </div>

      {/* Quick links to public pages */}
      <div className="bg-oroko-warm-gray border border-border rounded-sm p-5">
        <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
          Public governance pages
        </p>
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/governance", label: "Overview" },
            { href: "/governance/assembly", label: "Assembly (public)" },
            { href: "/governance/executive", label: "Executive (public)" },
            { href: "/governance/committees", label: "Committees (public)" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-xs text-oroko-green hover:text-oroko-gold transition-colors underline underline-offset-2"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
