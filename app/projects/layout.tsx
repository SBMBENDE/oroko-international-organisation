import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: { template: "%s | Projects | OROKO International", default: "Projects" },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background min-h-screen pt-20">{children}</main>
      <Footer />
    </>
  );
}
