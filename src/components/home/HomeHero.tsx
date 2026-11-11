"use client";

import Image from "next/image";
import { useState } from "react";
import { NISEKO_HREF } from "../product/nav";
import { ButtonLink } from "../ui/Button";
import { Container } from "../ui/Container";

/**
 * Brand film: autoplays muted and loops (6s, product-led). Drop the file in /public and set its path
 * here; until then the poster frame shows on its own.
 */
const HERO_VIDEO: string | undefined = undefined;
const POSTER = "/images/home-hero.webp";

export function HomeHero() {
  const [progress, setProgress] = useState(0);

  return (
    <section
      data-header-theme="dark"
      // Fills the screen below the promo bar, sliding up under the transparent header (hence the negative
      // margin, equal to the header's height), so the headline and buttons are always in view.
      className="relative isolate -mt-[75px] flex h-[calc(100svh-56px)] max-h-[1000px] min-h-[600px] flex-col justify-end overflow-hidden bg-olive-grey pb-16 max-lg:-mt-[60px] max-lg:h-[calc(100svh-48px)] max-lg:min-h-[560px] max-lg:pb-10"
    >
      <Image src={POSTER} alt="" fill priority sizes="(max-width: 1023px) 1800px, 100vw" className="-z-20 object-cover max-lg:object-[43%_center]" />
      {HERO_VIDEO && (
        <video
          src={HERO_VIDEO}
          poster={POSTER}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
          onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime / (e.currentTarget.duration || 1))}
          className="absolute inset-0 -z-20 size-full object-cover"
        />
      )}
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-[520px] bg-gradient-to-b from-[rgba(51,51,51,0)] to-[rgba(33,33,33,0.85)]" />
      {/* Soft shade under the transparent header, so its cream text reads against a bright sky. */}
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-[rgba(33,33,33,0.45)] to-transparent" />

      <Container className="relative">
        <div className="flex max-w-[720px] flex-col items-start gap-7 max-lg:gap-5">
          <h1 className="text-display animate-title-in text-odin-cream motion-reduce:animate-none">
            Forged In Fire. <br className="lg:hidden" />
            An Icon Reborn.
          </h1>
          <p className="text-h3 text-white max-lg:text-body">Pro-level saunas and ice baths, built for the home</p>
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <ButtonLink href="#range" variant="inverse">
              Shop Saunas
            </ButtonLink>
            <ButtonLink href={NISEKO_HREF} variant="inverseOutline">Shop Ice Baths</ButtonLink>
          </div>
        </div>
      </Container>

      {/* Playback progress */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-white/20">
        <div className="h-full origin-left bg-white/85" style={{ transform: `scaleX(${progress})` }} />
      </div>
    </section>
  );
}
