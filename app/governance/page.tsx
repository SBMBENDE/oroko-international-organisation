import type { Metadata } from "next";
import Link from "next/link";
import { Scale, Users, Building2, ArrowRight, FileText } from "lucide-react";

export const metadata: Metadata = { title: "Governance" };

const organs = [
  {
    href: "/governance/assembly",
    icon: Scale,
    title: "General Assembly",
    description:
      "The supreme deliberative body of OROKO International, comprising all individual members. The General Assembly sets the strategic direction and adopts key resolutions.",
    color: "bg-oroko-green/8 border-oroko-green/20 hover:border-oroko-green/40",
    iconColor: "text-oroko-green bg-oroko-green/10",
  },
  {
    href: "/governance/executive",
    icon: Building2,
    title: "Executive Council",
    description:
      "The governing body responsible for implementing resolutions and managing the day-to-day affairs of the organization. Officers are elected by the General Assembly.",
    color: "bg-oroko-gold/8 border-oroko-gold/20 hover:border-oroko-gold/40",
    iconColor: "text-oroko-gold bg-oroko-gold/10",
  },
  {
    href: "/governance/committees",
    icon: Users,
    title: "Committees",
    description:
      "Specialized working groups responsible for specific mandates — from governance and finance to culture and development. Committees drive focused action.",
    color: "bg-blue-50 border-blue-200 hover:border-blue-300",
    iconColor: "text-blue-600 bg-blue-100",
  },
];

export default function GovernancePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="max-w-3xl mb-16">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-8 bg-oroko-gold" />
          <span className="text-oroko-gold text-xs tracking-[0.3em] uppercase font-medium">
            Organization Structure
          </span>
        </div>
        <h1 className="font-heading text-5xl lg:text-6xl font-bold text-oroko-black mb-6">
          Governance
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          OROKO International is governed through three interconnected organs that
          ensure democratic participation, effective leadership, and accountable
          administration.
        </p>
      </div>

      {/* Organs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {organs.map(({ href, icon: Icon, title, description, color, iconColor }) => (
          <Link
            key={href}
            href={href}
            className={`group block border rounded-sm p-8 transition-all duration-200 ${color}`}
          >
            <div className={`inline-flex p-3 rounded-sm mb-5 ${iconColor}`}>
              <Icon className="size-6" strokeWidth={1.5} />
            </div>
            <h2 className="font-heading text-2xl font-bold text-oroko-black mb-3">
              {title}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">{description}</p>
            <span className="inline-flex items-center gap-1.5 text-xs tracking-wider uppercase font-semibold text-oroko-green group-hover:gap-2.5 transition-all">
              Learn more <ArrowRight className="size-3" />
            </span>
          </Link>
        ))}
      </div>

      {/* Principles */}
      <div className="bg-oroko-black rounded-sm p-10 lg:p-14 oroko-pattern">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-8 bg-oroko-gold/60" />
            <span className="text-oroko-gold text-xs tracking-[0.3em] uppercase font-medium">
              Governance Principles
            </span>
            <span className="h-px w-8 bg-oroko-gold/60" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-white mb-4">
            Democratic · Transparent · Accountable
          </h2>
          <p className="text-white/50 leading-relaxed mb-8">
            Every governance decision at OROKO International is made through
            established processes, ensuring that all individual members have a voice
            and that leadership remains accountable to the broader community.
          </p>
          <Link
            href="/governance/constitution"
            className="inline-flex items-center gap-2 px-6 py-3 bg-oroko-gold text-oroko-black text-xs tracking-[0.2em] uppercase font-bold hover:bg-oroko-gold-light transition-colors rounded-sm"
          >
            <FileText className="size-3.5" />
            Read the Constitution
          </Link>
        </div>
      </div>
    </div>
  );
}
