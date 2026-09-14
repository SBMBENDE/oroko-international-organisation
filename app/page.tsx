import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { NewsFlashBannerClient } from "@/components/common/NewsFlashBannerClient";
import { getActiveNewsFlashes } from "@/lib/dal/newsflash";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { PillarsSection } from "@/components/sections/PillarsSection";
import { CTASection } from "@/components/sections/CTASection";

export default async function HomePage() {
  const flashes = await getActiveNewsFlashes();

  return (
    <>
      <Navbar forceSolid={flashes.length > 0} />
      {flashes.length > 0 && <NewsFlashBannerClient flashes={flashes} />}
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
