import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ConstitutionViewer } from "@/components/governance/ConstitutionViewer";

export const metadata: Metadata = {
  title: "Constitution — OROKO International",
  description:
    "The supreme governing instrument of OROKO International Organisation — Unity, Culture & Development",
};

export default function ConstitutionPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/governance"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-oroko-black transition-colors mb-8"
      >
        <ArrowLeft className="size-3.5" /> Governance
      </Link>

      {/* Page hero */}
      <div className="bg-oroko-black oroko-pattern rounded-xl px-8 sm:px-12 py-12 mb-10 text-center">
        <p className="text-oroko-gold text-xs tracking-[0.4em] uppercase font-semibold mb-3">
          Official Document · Supreme Governing Instrument
        </p>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-3">
          Constitution of OROKO International
        </h1>
        <p className="font-heading text-xl italic text-oroko-gold/80">
          &ldquo;Unity, Culture &amp; Development&rdquo;
        </p>
        <p className="text-white/40 text-sm mt-4 max-w-xl mx-auto leading-relaxed">
          This Constitution is the supreme internal governing instrument of OROKO
          INTERNATIONAL, binding upon all members, officers, committees and organs.
        </p>
      </div>

      <ConstitutionViewer />
    </div>
  );
}
