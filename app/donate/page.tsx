import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DonationForm } from "@/components/donations/DonationForm";
import { Heart, ShieldCheck, Users, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Donate | OROKO International",
  description: "Support OROKO International and contribute to sustainable development in Oroko Land.",
};

const impacts = [
  { icon: Layers, label: "Fund development projects", desc: "Education, healthcare, infrastructure and more" },
  { icon: Users, label: "Empower our community", desc: "Programmes that uplift Oroko people worldwide" },
  { icon: ShieldCheck, label: "100% secure payments", desc: "Powered by Stripe. No card data stored." },
];

export default function DonatePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background min-h-screen pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex p-4 rounded-full bg-oroko-gold/10 border border-oroko-gold/20 mb-5">
              <Heart className="size-8 text-oroko-gold" />
            </div>
            <h1 className="font-heading text-5xl font-bold text-oroko-black mb-4">
              Make a Difference
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Your donation supports the OROKO International community and funds
              sustainable development projects in Oroko Land. Every contribution counts.
            </p>
          </div>

          {/* Impact points */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
            {impacts.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-white border border-border rounded-sm p-5 text-center">
                <Icon className="size-6 text-oroko-green mx-auto mb-3" strokeWidth={1.5} />
                <p className="font-semibold text-oroko-black text-sm mb-1">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          {/* Donation form */}
          <div className="max-w-md mx-auto">
            <div className="bg-white border border-border rounded-sm p-8">
              <h2 className="font-heading text-2xl font-bold text-oroko-black mb-6">
                General Donation
              </h2>
              <DonationForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
