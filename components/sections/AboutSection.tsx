import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function AboutSection() {
  return (
    <section className="bg-oroko-warm-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left — visual block */}
          <div className="relative order-2 lg:order-1">
            {/* Stacked card design */}
            <div className="relative">
              {/* Background card */}
              <div className="absolute -top-4 -left-4 w-full h-full bg-oroko-green/10 rounded-sm" />
              {/* Main card */}
              <div className="relative bg-oroko-green rounded-sm p-10 lg:p-12 oroko-pattern">
                {/* Gold quote mark */}
                <div className="font-heading text-oroko-gold text-8xl leading-none mb-6 opacity-40">
                  &ldquo;
                </div>
                <blockquote className="font-heading text-white text-xl lg:text-2xl leading-relaxed italic font-light">
                  An organization built on the pillars of unity, excellence,
                  and service — connecting individuals who share a commitment
                  to collective progress.
                </blockquote>
                <div className="mt-8 flex items-center gap-3">
                  <span className="h-px w-8 bg-oroko-gold" />
                  <span className="text-oroko-gold text-xs tracking-[0.2em] uppercase">
                    OROKO Charter
                  </span>
                </div>
              </div>
              {/* Gold accent border */}
              <div className="absolute -bottom-3 -right-3 w-24 h-24 border-r-2 border-b-2 border-oroko-gold/40 rounded-sm" />
            </div>

            {/* Stat chips */}
            <div className="flex gap-4 mt-8">
              {[
                { n: "500+", label: "Members" },
                { n: "15+", label: "Countries" },
                { n: "10+", label: "Years" },
              ].map(({ n, label }) => (
                <div
                  key={label}
                  className="flex-1 text-center py-4 px-3 bg-white border border-border rounded-sm shadow-sm"
                >
                  <div className="font-heading text-2xl font-bold text-oroko-green">
                    {n}
                  </div>
                  <div className="text-xs text-muted-foreground tracking-wider uppercase mt-1">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — text */}
          <div className="order-1 lg:order-2 space-y-6">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-oroko-gold" />
              <span className="text-oroko-gold text-xs tracking-[0.3em] uppercase font-medium">
                About the Organization
              </span>
            </div>

            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-oroko-black leading-tight text-balance">
              A Community Built on{" "}
              <span className="text-gold-gradient">Shared Purpose</span>
            </h2>

            <p className="text-muted-foreground leading-relaxed">
              OROKO International Organization is a membership-driven body
              bringing together individuals from across the globe under the
              values of unity, excellence, and service. We are committed to
              the growth and empowerment of every member.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Through robust governance, impactful events, meaningful projects,
              and a strong member community, OROKO creates lasting connections
              and drives collective progress at the international level.
            </p>

            <div className="pt-2">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 text-oroko-green font-semibold text-sm tracking-wide hover:text-oroko-gold transition-colors duration-200"
              >
                Learn more about OROKO
                <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
