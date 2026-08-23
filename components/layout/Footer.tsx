import Link from "next/link";
import { Logo } from "@/components/common/Logo";

const footerLinks = {
  Organization: [
    { label: "About OROKO", href: "/about" },
    { label: "Constitution", href: "/governance/constitution" },
    { label: "Leadership", href: "/governance/executive" },
    { label: "General Assembly", href: "/governance/assembly" },
    { label: "Committees", href: "/governance/committees" },
  ],
  Engage: [
    { label: "Events", href: "/events" },
    { label: "Projects", href: "/projects" },
    { label: "Donate", href: "/donate" },
    { label: "Gallery", href: "/gallery" },
    { label: "Announcements", href: "/announcements" },
  ],
  Members: [
    { label: "Join OROKO", href: "/auth/register" },
    { label: "Member Login", href: "/auth/login" },
    { label: "Member Directory", href: "/members" },
    { label: "Documents", href: "/documents" },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-oroko-black text-white">
      {/* Gold divider */}
      <div className="oroko-divider" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="space-y-5">
            <Logo variant="light" size="md" />
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              A premier international organization dedicated to unity,
              excellence, and global impact across our community.
            </p>
            <p className="text-oroko-gold text-xs tracking-[0.2em] uppercase font-medium">
              Unity · Excellence · Global Impact
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading} className="space-y-5">
              <h3 className="text-xs tracking-[0.2em] uppercase font-semibold text-oroko-gold">
                {heading}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs tracking-wider">
            &copy; {year} OROKO International Organization. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-white/30 hover:text-white/60 text-xs tracking-wider transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-white/30 hover:text-white/60 text-xs tracking-wider transition-colors"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
