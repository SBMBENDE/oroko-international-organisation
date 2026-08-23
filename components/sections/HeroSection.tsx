"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ArrowRight, ChevronDown } from "lucide-react";

gsap.registerPlugin();

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-eyebrow", {
        opacity: 0,
        y: 20,
        duration: 0.7,
      })
        .from(
          ".hero-title-line",
          {
            opacity: 0,
            y: 60,
            stagger: 0.12,
            duration: 1,
          },
          "-=0.3"
        )
        .from(
          taglineRef.current,
          { opacity: 0, y: 25, duration: 0.8 },
          "-=0.4"
        )
        .from(
          ctaRef.current,
          { opacity: 0, y: 20, duration: 0.7 },
          "-=0.3"
        )
        .from(
          scrollRef.current,
          { opacity: 0, duration: 0.6 },
          "-=0.2"
        );
    },
    { scope: heroRef }
  );

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-center bg-oroko-black overflow-hidden oroko-pattern"
    >
      {/* Radial glow — deep green accent */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 40%, oklch(0.265 0.067 155 / 0.35) 0%, transparent 70%)",
        }}
      />

      {/* Gold corner accents */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-64 h-64 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top left, oklch(0.67 0.115 71 / 0.08) 0%, transparent 60%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at bottom right, oklch(0.67 0.115 71 / 0.08) 0%, transparent 60%)",
        }}
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 text-center">
        {/* Eyebrow */}
        <div className="hero-eyebrow inline-flex items-center gap-3 mb-10">
          <span className="h-px w-8 bg-oroko-gold" />
          <span className="text-oroko-gold text-xs tracking-[0.35em] uppercase font-medium">
            Vision &amp; Impact
          </span>
          <span className="h-px w-8 bg-oroko-gold" />
        </div>

        {/* Main heading */}
        <div ref={headingRef} className="overflow-hidden mb-2">
          <h1 className="font-heading font-bold text-white text-balance">
            <span className="hero-title-line block text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tight">
              OROKO
            </span>
            <span className="hero-title-line block text-xl sm:text-2xl md:text-3xl tracking-[0.3em] uppercase font-light mt-4 text-white/80">
              International Organization
            </span>
          </h1>
        </div>

        {/* Gold divider */}
        <div className="flex items-center justify-center gap-3 my-8">
          <span className="h-px w-16 bg-oroko-gold/60" />
          <span className="size-1.5 rounded-full bg-oroko-gold" />
          <span className="h-px w-16 bg-oroko-gold/60" />
        </div>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="text-white/60 text-lg sm:text-xl tracking-[0.12em] uppercase font-light mb-12"
        >
          Unity&nbsp;&nbsp;Culture&nbsp;&nbsp;Development
        </p>

        {/* CTAs */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/auth/register"
            className="group inline-flex items-center gap-2.5 px-8 py-4 bg-oroko-gold text-oroko-black text-xs tracking-[0.2em] uppercase font-bold hover:bg-oroko-gold-light transition-all duration-300 rounded-sm"
          >
            Join OROKO
            <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2.5 px-8 py-4 border border-white/25 text-white text-xs tracking-[0.2em] uppercase font-medium hover:border-white/60 hover:bg-white/5 transition-all duration-300 rounded-sm"
          >
            Discover OROKO
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <ChevronDown className="size-4 animate-bounce" />
      </div>
    </section>
  );
}
