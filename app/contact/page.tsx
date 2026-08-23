import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/contact/ContactForm";
import { MapPin, Phone, Mail, MessageCircle, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact | OROKO International",
  description:
    "Get in touch with OROKO International Organisation. Head office in France. We'd love to hear from you.",
};

const socials = [
  { label: "Facebook", href: "https://facebook.com", icon: "f" },
  { label: "Instagram", href: "https://instagram.com", icon: "in" },
  { label: "YouTube", href: "https://youtube.com", icon: "yt" },
  { label: "WhatsApp", href: "https://wa.me/33955551976", icon: "wa" },
  { label: "Twitter / X", href: "https://x.com", icon: "x" },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background">

        {/* Hero */}
        <section className="relative bg-oroko-black oroko-pattern overflow-hidden pt-32 pb-20">
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 55% at 50% 40%, oklch(0.265 0.067 155 / 0.3) 0%, transparent 70%)",
            }}
          />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-8 bg-oroko-gold/60" />
              <span className="text-oroko-gold text-xs tracking-[0.35em] uppercase font-medium">
                Reach Out
              </span>
              <span className="h-px w-8 bg-oroko-gold/60" />
            </div>
            <h1 className="font-heading text-5xl sm:text-6xl font-bold text-white mb-4">
              Get In Touch
            </h1>
            <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
              We&apos;re here to answer your questions, support your membership,
              and connect you with the OROKO community.
            </p>
          </div>
        </section>

        {/* Main content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            {/* Left — contact info + map */}
            <div className="space-y-6">

              {/* Address */}
              <div className="bg-white border border-border rounded-sm p-6 flex items-start gap-4">
                <div className="p-3 rounded-sm bg-oroko-green/10 border border-oroko-green/20 shrink-0">
                  <MapPin className="size-5 text-oroko-green" />
                </div>
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-oroko-gold font-semibold mb-2">
                    Head Office
                  </p>
                  <p className="font-heading text-lg font-semibold text-oroko-black">
                    OROKO International
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed mt-1">
                    48 Rue du Président Poincaré<br />
                    77220 Tournan-en-Brie<br />
                    France 🇫🇷
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-white border border-border rounded-sm p-6 flex items-start gap-4">
                <div className="p-3 rounded-sm bg-oroko-gold/10 border border-oroko-gold/20 shrink-0">
                  <Phone className="size-5 text-oroko-gold" />
                </div>
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-oroko-gold font-semibold mb-2">
                    Telephone
                  </p>
                  <a
                    href="tel:+33955551976"
                    className="font-heading text-lg font-semibold text-oroko-black hover:text-oroko-green transition-colors"
                  >
                    +33 9 55 55 19 76
                  </a>
                </div>
              </div>

              {/* Emails */}
              <div className="bg-white border border-border rounded-sm p-6 flex items-start gap-4">
                <div className="p-3 rounded-sm bg-blue-50 border border-blue-200 shrink-0">
                  <Mail className="size-5 text-blue-600" />
                </div>
                <div className="space-y-3">
                  <p className="text-xs tracking-[0.2em] uppercase text-oroko-gold font-semibold">
                    Email
                  </p>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                      General Enquiries
                    </p>
                    <a
                      href="mailto:info@orokointernational.com"
                      className="text-oroko-green hover:text-oroko-gold transition-colors font-medium text-sm"
                    >
                      info@orokointernational.com
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                      Member Support
                    </p>
                    <a
                      href="mailto:support@orokointernational.com"
                      className="text-oroko-green hover:text-oroko-gold transition-colors font-medium text-sm"
                    >
                      support@orokointernational.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="bg-white border border-border rounded-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="size-4 text-oroko-gold" />
                  <p className="text-xs tracking-[0.2em] uppercase text-oroko-gold font-semibold">
                    Follow Us
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={s.label}
                      className="size-10 rounded-sm bg-oroko-black flex items-center justify-center text-oroko-gold text-xs font-bold tracking-wider hover:bg-oroko-green transition-colors"
                    >
                      {s.icon.toUpperCase()}
                    </a>
                  ))}
                </div>
              </div>

              {/* Google Maps */}
              <div className="rounded-sm overflow-hidden border border-border shadow-sm">
                <iframe
                  src="https://maps.google.com/maps?q=48+Rue+du+Président+Poincaré,+77220+Tournan-en-Brie,+France&output=embed&z=15"
                  width="100%"
                  height="280"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="OROKO International Head Office"
                />
              </div>
            </div>

            {/* Right — contact form */}
            <div>
              <div className="bg-white border border-border rounded-sm p-7 sm:p-10">
                <div className="mb-7">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="h-px w-6 bg-oroko-gold" />
                    <span className="text-oroko-gold text-xs tracking-[0.3em] uppercase font-medium">
                      Send a Message
                    </span>
                  </div>
                  <h2 className="font-heading text-3xl font-bold text-oroko-black">
                    We&apos;d Love to Hear from You
                  </h2>
                  <p className="text-muted-foreground text-sm mt-2">
                    Fill in the form and we will respond as quickly as possible.
                  </p>
                </div>
                <div className="oroko-divider mb-7" />
                <ContactForm />
              </div>

              {/* Response time note */}
              <div className="flex items-start gap-3 mt-5 px-2">
                <MessageCircle className="size-4 text-oroko-gold shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We typically respond within 2–3 business days. For urgent matters
                  please call or WhatsApp{" "}
                  <a href="tel:+33955551976" className="text-oroko-green font-medium">
                    +33 9 55 55 19 76
                  </a>.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
