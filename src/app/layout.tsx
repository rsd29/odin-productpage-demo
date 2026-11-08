import type { Metadata } from "next";
import localFont from "next/font/local";
import { Manrope } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

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
  title: "Niseko Ice Bath | ODIN",
  description:
    "Push harder. Recover faster. Build resilience where others break. Niseko delivers cold-driven recovery for athletes and high-performers who demand more.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} ${neueMontreal.variable} antialiased`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
