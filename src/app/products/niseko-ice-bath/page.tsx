import type { Metadata } from "next";
import { CampaignBar } from "@/components/product/CampaignBar";
import { CompareSizesModal } from "@/components/product/CompareSizesModal";
import { EveryDetail } from "@/components/product/EveryDetail";
import { Faq } from "@/components/product/Faq";
import { FounderStory } from "@/components/product/FounderStory";
import { Header } from "@/components/product/Header";
import { ProductProvider } from "@/components/product/ProductContext";
import { ProductHero } from "@/components/product/ProductHero";
import { Reviews } from "@/components/product/Reviews";
import { StickyBar } from "@/components/product/StickyBar";
import { TheScience } from "@/components/product/TheScience";
import { TrustBar } from "@/components/product/TrustBar";
import { UgcVideos } from "@/components/product/UgcVideos";

export const metadata: Metadata = {
  title: "Niseko Ice Bath",
  description:
    "Push harder. Recover faster. Build resilience where others break. Niseko delivers cold-driven recovery for athletes and high-performers who demand more.",
};

export default function ProductPage() {
  return (
    <ProductProvider>
      <CampaignBar />
      <Header />
      <StickyBar />
      <main>
        <ProductHero />
        <TrustBar />
        <UgcVideos />
        <EveryDetail />
        <TheScience />
        <Reviews />
        <FounderStory />
        <Faq />
      </main>
      <CompareSizesModal />
    </ProductProvider>
  );
}
