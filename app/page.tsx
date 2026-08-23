import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { PillarsSection } from "@/components/sections/PillarsSection";
import { CTASection } from "@/components/sections/CTASection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <PillarsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
