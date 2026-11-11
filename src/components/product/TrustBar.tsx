import Image from "next/image";
import { Container } from "../ui/Container";

// Source: masseusehealth.co/products/niseko-ice-bath ("Trusted By Elite Australian Athletes" trust bar).
// [file, label, intrinsic width, intrinsic height]
const LOGOS: [string, string, number, number][] = [
  ["afl.webp", "AFL", 400, 229],
  ["nrl.webp", "NRL", 200, 256],
  ["nbl.webp", "NBL", 256, 256],
  ["ufc.webp", "UFC", 400, 139],
  ["aoc.svg", "Australian Olympic Committee", 280, 280],
  ["auscycling.svg", "AusCycling", 665, 459],
  ["cricket-australia.webp", "Cricket Australia", 167, 256],
];

/** Optical sizing: every logo gets roughly the same area (wide marks shorter, tall ones taller), capped at 96px. */
const AREA = 9000;
const heightFor = (w: number, h: number) => Math.min(96, Math.round(Math.sqrt(AREA / (w / h))));

/**
 * Sport logos drifting in an endless loop, on the cream of the top fold. Each half of the track holds the
 * set twice, so a half is always wider than the screen and translating by −50% loops seamlessly. Even
 * spacing comes from padding on every logo (not a gap), so both halves measure exactly the same.
 * It keeps moving on hover; reduced motion stops it and lets the row scroll by hand.
 */
export function TrustBar() {
  return (
    <section className="overflow-hidden bg-warm-off-white py-14 max-lg:py-10">
      <Container className="pb-10 max-lg:pb-8">
        <h2 className="text-h2 text-odin-grey">Trusted by elite Australian athletes</h2>
      </Container>
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)] motion-reduce:overflow-x-auto">
        <div
          className="flex w-max animate-marquee motion-reduce:animate-none"
          style={{ "--marquee-duration": "45s" } as React.CSSProperties}
        >
          {[0, 1].map((half) => (
            <ul key={half} aria-hidden={half === 1} aria-label={half === 0 ? "Partner sports" : undefined} className="flex shrink-0 items-center">
              {[...LOGOS, ...LOGOS].map(([file, label, w, h], i) => (
                // Keep the coloured marks large enough to recognise on phones.
                <li key={`${file}-${i}`} className="flex h-24 shrink-0 items-center px-12 [--s:1] max-lg:h-20 max-lg:px-7 max-lg:[--s:0.75]">
                  <Image
                    src={`/brand/athletes/${file}`}
                    // Only the first copy is announced.
                    alt={half === 0 && i < LOGOS.length ? label : ""}
                    width={w}
                    height={h}
                    style={{ height: `calc(${heightFor(w, h)}px * var(--s))` }}
                    className="w-auto object-contain"
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
