"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { NISEKO_HREF } from "../product/nav";
import { ButtonLink } from "../ui/Button";
import { Container } from "../ui/Container";

/**
 * Brand film: autoplays muted and loops (6s, product-led). Drop the file in /public and set its path
 * here; until then the poster frame shows on its own.
 */
const HERO_VIDEO: string | undefined = undefined;
const POSTER = "/images/home-hero.webp";

const CONTROL =
  "flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/40 bg-white/[0.16] backdrop-blur-[6px] transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export function HomeHero() {
  const video = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    const v = video.current;
    if (v) {
      if (v.paused) void v.play();
      else v.pause();
    }
    setPaused((p) => !p);
  };
  const toggleMute = () => {
    if (video.current) video.current.muted = !muted;
    setMuted((m) => !m);
  };

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
          ref={video}
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
            Forged in fire <br className="lg:hidden" />
            An Icon Reborn
          </h1>
          <p className="text-h3 text-white max-lg:text-body">Pro-level saunas and ice baths, built for the home</p>
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <ButtonLink href="#range" variant="inverse">
              Shop saunas
            </ButtonLink>
            <ButtonLink href={NISEKO_HREF} variant="inverse">Shop ice baths</ButtonLink>
          </div>
        </div>
        <div className="absolute bottom-[-4px] right-20 flex gap-3 max-lg:hidden">
          <button type="button" onClick={toggleMute} aria-label={muted ? "Turn sound on" : "Turn sound off"} className={CONTROL}>
            {muted ? (
              <Image src="/figma/home/sound-off.svg" alt="" width={18} height={18} />
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M3 7H6L10 4V14L6 11H3V7Z" />
                <path d="M12.5 6.5c.9.7 1.5 1.5 1.5 2.5s-.6 1.8-1.5 2.5" />
              </svg>
            )}
          </button>
          <button type="button" onClick={togglePlay} aria-label={paused ? "Play video" : "Pause video"} className={CONTROL}>
            {paused ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="white" aria-hidden>
                <path d="M5 3.5v9l7.5-4.5z" />
              </svg>
            ) : (
              <Image src="/figma/home/pause.svg" alt="" width={16} height={16} />
            )}
          </button>
        </div>
      </Container>

      {/* Playback progress */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-white/20">
        <div className="h-full origin-left bg-white/85" style={{ transform: `scaleX(${progress})` }} />
      </div>
    </section>
  );
}
