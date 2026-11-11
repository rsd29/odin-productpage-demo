import type { Metadata } from "next";
import localFont from "next/font/local";
import { Manrope } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Footer } from "@/components/product/Footer";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "500", "600"],
});

const neueMontreal = localFont({
  variable: "--font-neue-montreal",
  src: [{ path: "../fonts/NeueMontreal-Medium.otf", weight: "500", style: "normal" }],
});

export const metadata: Metadata = {
  title: { template: "%s | ODIN", default: "ODIN | Saunas and ice baths, built for the home" },
  description: "Pro-level saunas and ice baths, built for the home.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} ${neueMontreal.variable} antialiased`}>
      <body>
        <SmoothScroll>
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
