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
  const hasFlash = flashes.length > 0;

  return (
    <>
      <Navbar forceSolid={hasFlash} />
      {hasFlash && <NewsFlashBannerClient flashes={flashes} />}
      {/* Hero normally sits under the transparent nav; with the flash banner fixed above it, push content below both */}
      <main className={hasFlash ? "flex-1 pt-26" : "flex-1"}>
        <HeroSection />
        <AboutSection />
        <PillarsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
