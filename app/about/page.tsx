import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Scale,
  Users,
  Globe,
  Heart,
  BookOpen,
  Sprout,
  ShieldCheck,
  Eye,
  Handshake,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About | OROKO International",
  description:
    "OROKO International brings together Oroko sons and daughters across the globe under the principles of unity, democracy, transparency and mutual respect.",
};

const principles = [
  { icon: Scale, label: "Democracy", desc: "Every member has a voice in how the Organisation is run." },
  { icon: Eye, label: "Transparency", desc: "Our affairs are conducted openly and accountably." },
  { icon: ShieldCheck, label: "Accountability", desc: "Leadership remains answerable to the collective membership." },
  { icon: Users, label: "Inclusiveness", desc: "Every Oroko son and daughter belongs here, wherever they are." },
  { icon: Handshake, label: "Mutual Respect", desc: "Every opinion matters; every member is valued equally." },
  { icon: Globe, label: "Unity", desc: "Our diversity across borders is the foundation of our strength." },
];

const pillars = [
  {
    icon: BookOpen,
    title: "Cultural Heritage",
    desc: "Preserving and promoting the rich history, language, traditions and identity of the Oroko people for present and future generations.",
  },
  {
    icon: Users,
    title: "Global Community",
    desc: "Strengthening the bonds among our worldwide membership and building bridges between the Diaspora and communities in Oroko Land.",
  },
  {
    icon: Sprout,
    title: "Sustainable Development",
    desc: "Giving back to Orokoland through development projects, education, healthcare, infrastructure and community-led initiatives.",
  },
  {
    icon: Heart,
    title: "Youth & Humanitarian",
    desc: "Empowering younger generations and responding to humanitarian needs within the Oroko community.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">

        {/* Hero */}
        <section className="relative bg-oroko-black oroko-pattern overflow-hidden pt-32 pb-24">
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 55% at 50% 40%, oklch(0.265 0.067 155 / 0.35) 0%, transparent 70%)",
            }}
          />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="h-px w-10 bg-oroko-gold/60" />
              <span className="text-oroko-gold text-xs tracking-[0.35em] uppercase font-medium">
                Who We Are
              </span>
              <span className="h-px w-10 bg-oroko-gold/60" />
            </div>
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 text-balance">
              About OROKO{" "}
              <span className="text-gold-gradient">International</span>
            </h1>
            <p className="text-white/60 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
              Unity · Culture · Development
            </p>
          </div>
        </section>

        {/* Welcome statement */}
        <section className="bg-oroko-warm-white py-20 lg:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

              {/* Visual accent block */}
              <div className="relative order-2 lg:order-1">
                <div className="absolute -top-4 -left-4 w-full h-full bg-oroko-green/8 rounded-sm" />
                <div className="relative bg-oroko-green rounded-sm p-10 lg:p-12 oroko-pattern">
                  <div className="font-heading text-8xl leading-none text-oroko-gold/30 mb-4 select-none">
                    &ldquo;
                  </div>
                  <p className="font-heading text-white text-xl lg:text-2xl leading-relaxed italic font-light">
                    A strong organisation is built on a sound Constitution,
                    democratic governance, transparency in its affairs, and
                    respect for the rights and dignity of every member.
                  </p>
                  <div className="mt-8 flex items-center gap-3">
                    <span className="h-px w-8 bg-oroko-gold" />
                    <span className="text-oroko-gold text-xs tracking-[0.2em] uppercase">
                      OROKO International
                    </span>
                  </div>
                </div>
                <div className="absolute -bottom-3 -right-3 w-24 h-24 border-r-2 border-b-2 border-oroko-gold/40 rounded-sm" />
              </div>

              {/* Text */}
              <div className="order-1 lg:order-2 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-oroko-gold" />
                  <span className="text-oroko-gold text-xs tracking-[0.3em] uppercase font-medium">
                    Welcome
                  </span>
                </div>

                <h2 className="font-heading text-4xl lg:text-5xl font-bold text-oroko-black leading-tight text-balance">
                  A Platform Built for Every Oroko Voice
                </h2>

                <p className="text-muted-foreground leading-relaxed text-lg">
                  Welcome to <strong className="text-oroko-black font-semibold">OROKO INTERNATIONAL ORGANIZATION</strong>.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  This platform brings together Oroko sons and daughters across
                  the globe under the principles of unity, democracy,
                  transparency, accountability, inclusiveness, and mutual
                  respect.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  Here, every member has a voice, every opinion matters, and
                  leadership remains accountable to the people.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Governing principles */}
        <section className="bg-oroko-green py-20 lg:py-28 oroko-pattern">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="h-px w-8 bg-oroko-gold/60" />
                <span className="text-oroko-gold text-xs tracking-[0.3em] uppercase font-medium">
                  Our Foundation
                </span>
                <span className="h-px w-8 bg-oroko-gold/60" />
              </div>
              <h2 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-4">
                Governing Principles
              </h2>
              <p className="text-white/50 max-w-xl mx-auto">
                Six core principles that define how we govern ourselves and
                treat every member of the OROKO community.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {principles.map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-oroko-gold/30 rounded-sm p-7 transition-all duration-200"
                >
                  <div className="inline-flex p-3 rounded-sm bg-oroko-gold/10 border border-oroko-gold/20 mb-4">
                    <Icon className="size-5 text-oroko-gold" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-white mb-2">
                    {label}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="bg-oroko-warm-white py-20 lg:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="h-px w-8 bg-oroko-gold" />
                <span className="text-oroko-gold text-xs tracking-[0.3em] uppercase font-medium">
                  Our Mission
                </span>
                <span className="h-px w-8 bg-oroko-gold" />
              </div>
              <h2 className="font-heading text-4xl lg:text-5xl font-bold text-oroko-black mb-6 text-balance">
                What We Are Here to Do
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                Our mission is to preserve and promote the rich cultural
                heritage of the Oroko people, strengthen the bonds among our
                global community, and give back to Orokoland through
                sustainable development projects, education, youth
                empowerment, and humanitarian initiatives.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {pillars.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-white border border-border rounded-sm p-7 hover:border-oroko-gold/30 hover:shadow-sm transition-all"
                >
                  <div className="inline-flex p-3 rounded-sm bg-oroko-green/10 border border-oroko-green/20 mb-4">
                    <Icon className="size-5 text-oroko-green" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-oroko-black mb-2">
                    {title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Constitution callout */}
        <section className="bg-oroko-black py-20 lg:py-24 oroko-pattern">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="h-px w-8 bg-oroko-gold/60" />
              <span className="text-oroko-gold text-xs tracking-[0.3em] uppercase font-medium">
                Governance
              </span>
              <span className="h-px w-8 bg-oroko-gold/60" />
            </div>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-5 text-balance">
              Governed by a Sound Constitution
            </h2>
            <p className="text-white/50 leading-relaxed mb-10 max-w-2xl mx-auto">
              OROKO International is guided by a comprehensive Constitution
              that enshrines individual membership, democratic elections,
              financial transparency and the protection of every member&apos;s
              rights. Read the full text online.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/governance/constitution"
                className="group inline-flex items-center gap-2.5 px-8 py-4 bg-oroko-gold text-oroko-black text-xs tracking-[0.2em] uppercase font-bold hover:bg-oroko-gold-light transition-colors rounded-sm"
              >
                Read the Constitution
                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/governance"
                className="inline-flex items-center gap-2.5 px-8 py-4 border border-white/20 text-white text-xs tracking-[0.2em] uppercase font-medium hover:border-white/50 hover:bg-white/5 transition-colors rounded-sm"
              >
                Explore Governance
              </Link>
            </div>
          </div>
        </section>

        {/* CTA — Join */}
        <section className="bg-oroko-warm-white py-20 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-oroko-black mb-5 text-balance">
              Your Place Is Here
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto text-lg">
              Whether you are in Africa, Europe, the Americas or anywhere in
              the world — if you are an Oroko son or daughter, or connected to
              the Oroko community, OROKO International is your home.
            </p>
            <Link
              href="/auth/register"
              className="group inline-flex items-center gap-2.5 px-10 py-4 bg-oroko-green text-white text-xs tracking-[0.2em] uppercase font-bold hover:bg-oroko-green-light transition-colors rounded-sm"
            >
              Join OROKO International
              <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
