import { ContrastTherapy } from "@/components/home/ContrastTherapy";
import { HeatOrCold } from "@/components/home/HeatOrCold";
import { HomeHero } from "@/components/home/HomeHero";
import { OdinPromise } from "@/components/home/OdinPromise";
import { Research } from "@/components/home/Research";
import { TalkToUs } from "@/components/home/TalkToUs";
import { TitleReveal } from "@/components/home/TitleReveal";
import { CampaignBar } from "@/components/product/CampaignBar";
import { Footer } from "@/components/product/Footer";
import { FounderStory } from "@/components/product/FounderStory";
import { Header } from "@/components/product/Header";
import { Reviews } from "@/components/product/Reviews";
import { UgcVideos } from "@/components/product/UgcVideos";

// Figma: "Homepage - Revised" (ODIN Homepage / HF · Revised). Header, campaign bar, stories, founder
// story and footer are shared with the product page.
export default function HomePage() {
  return (
    <>
      <CampaignBar />
      {/* Transparent over the hero until scrolled. */}
      <Header overlay />
      <main>
        <HomeHero />
        <HeatOrCold />
        <UgcVideos product="Glow+" />
        <OdinPromise />
        <ContrastTherapy />
        <Research />
        {/* Same reviews section as the product page. */}
        <Reviews />
        <FounderStory />
        <TalkToUs />
      </main>
      <Footer />
      {/* Section titles fade in as they scroll into view. */}
      <TitleReveal />
    </>
  );
}
