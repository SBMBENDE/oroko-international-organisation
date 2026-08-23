import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="bg-oroko-black py-24 lg:py-32 oroko-pattern">
      {/* Gold top divider */}
      <div className="oroko-divider mb-0" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="h-px w-8 bg-oroko-gold/60" />
          <span className="text-oroko-gold text-xs tracking-[0.3em] uppercase font-medium">
            Membership
          </span>
          <span className="h-px w-8 bg-oroko-gold/60" />
        </div>

        <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white text-balance mb-6">
          Join the OROKO Family
        </h2>

        <p className="text-white/50 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
          Become an individual member of OROKO International Organization.
          Connect with a global community, participate in governance, attend
          exclusive events, and contribute to meaningful projects.
        </p>

        {/* Feature points */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-12">
          {[
            "Digital member profile",
            "OROKO Member ID",
            "Event access",
            "Voting rights",
            "Global network",
          ].map((feat) => (
            <span
              key={feat}
              className="flex items-center gap-2 text-sm text-white/50"
            >
              <span className="size-1 rounded-full bg-oroko-gold" />
              {feat}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/auth/register"
            className="group inline-flex items-center gap-2.5 px-10 py-4 bg-oroko-gold text-oroko-black text-xs tracking-[0.2em] uppercase font-bold hover:bg-oroko-gold-light transition-all duration-300 rounded-sm"
          >
            Become a Member
            <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2.5 px-10 py-4 border border-white/20 text-white text-xs tracking-[0.2em] uppercase font-medium hover:border-white/50 hover:bg-white/5 transition-all duration-300 rounded-sm"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
