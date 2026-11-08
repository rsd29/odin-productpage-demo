import { CampaignBar } from "@/components/product/CampaignBar";
import { CompareSizesModal } from "@/components/product/CompareSizesModal";
import { EveryDetail } from "@/components/product/EveryDetail";
import { Faq } from "@/components/product/Faq";
import { Footer } from "@/components/product/Footer";
import { FounderStory } from "@/components/product/FounderStory";
import { Header } from "@/components/product/Header";
import { ProductProvider } from "@/components/product/ProductContext";
import { ProductHero } from "@/components/product/ProductHero";
import { Reviews } from "@/components/product/Reviews";
import { StickyBar } from "@/components/product/StickyBar";
import { TheScience } from "@/components/product/TheScience";
import { UgcVideos } from "@/components/product/UgcVideos";

export default function ProductPage() {
  return (
    <ProductProvider>
      <CampaignBar />
      <Header />
      <StickyBar />
      <main>
        <ProductHero />
        <UgcVideos />
        <EveryDetail />
        <TheScience />
        <Reviews />
        <FounderStory />
        <Faq />
      </main>
      <Footer />
      <CompareSizesModal />
    </ProductProvider>
  );
}
