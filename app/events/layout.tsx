import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { template: "%s | Events | OROKO International", default: "Events" },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background min-h-screen pt-20">{children}</main>
      <Footer />
    </>
  );
}
