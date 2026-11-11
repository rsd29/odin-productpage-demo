"use client";

import { useRef } from "react";
import { ScrollDots } from "../ui/ScrollDots";
import { Container } from "../ui/Container";

type Testimonial = { quote: string; name: string; role: string };

// Source: masseusehealth.co/products/niseko-ice-bath ("Trusted By Elite Australian Athletes").
const ROWS: Testimonial[][] = [
  [
    { quote: "Got all I need for pre/post match recovery at home now.", name: "Jack Crisp", role: "AFL Player, Collingwood" },
    { quote: "Having the Niseko at home is perfect for me — I can go hot or cold.", name: "Clayton Faulalo", role: "NRL Player, Manly Sea Eagles" },
    { quote: "After a 53km ultra, it gets me ready for the next start line.", name: "Jacqui Bell", role: "Ultra-Marathon Runner" },
    { quote: "It helps me cool down to level up.", name: "Josh Battle", role: "AFL All-Australian" },
    { quote: "The hardest part is getting in. The best part is how I feel afterwards.", name: "Steph Toussat", role: "Hybrid Athlete" },
  ],
  [
    { quote: "It helps me reset, recover and feel ready to go again.", name: "Carly Remmos", role: "AFLW Player, Collingwood" },
    { quote: "How we recover shapes how we perform.", name: "Joshua Sykes & Michael Wearne", role: "Melbourne Tigers Basketball" },
    { quote: "It makes it easy to stay on top of recovery after training.", name: "John Noble", role: "AFL Player, Gold Coast" },
    { quote: "Things I do to protect my mental health: create a routine. Ice bath every day.", name: "Kaka Dembele", role: "PT & Biohacker" },
    { quote: "Having cold therapy at home makes recovery easy.", name: "Mitch Owen", role: "Professional Cricketer" },
  ],
];

const initials = (name: string) =>
  name
    .split(/\s+&\s+|\s+/)
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="flex w-[380px] shrink-0 flex-col justify-between gap-8 rounded-[8px] border border-white/[0.08] bg-white/[0.05] p-7 max-lg:w-[290px] max-lg:gap-6 max-lg:p-5">
      <blockquote className="text-h4 text-odin-cream">&ldquo;{t.quote}&rdquo;</blockquote>
      <figcaption className="flex items-center gap-3">
        <span className="text-label-sm flex size-10 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-odin-cream">
          {initials(t.name)}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="text-h5 truncate text-odin-cream">{t.name}</span>
          <span className="text-body truncate text-muted-on-dark">{t.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Desktop: one endlessly drifting row. The cards are rendered twice back to back (the copy hidden from
 * assistive tech) so translating the track by −50% loops seamlessly. Hover pauses it; reduced motion stops
 * it and lets the row scroll by hand instead.
 */
function MarqueeRow({ items, reverse, duration }: { items: Testimonial[]; reverse?: boolean; duration: number }) {
  return (
    <div className="overflow-hidden motion-reduce:overflow-x-auto [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
      <div
        className={`flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none ${
          reverse ? "[animation-direction:reverse]" : ""
        }`}
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 gap-4 pr-4">
            {items.map((t) => (
              <li key={t.name} className="flex">
                <Card t={t} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

/**
 * Phones: both rows in one swipeable block, so they move together, with a single set of dots. A two-row
 * grid filled column by column keeps each row's cards the same height.
 */
function SwipeRows() {
  const row = useRef<HTMLUListElement>(null);
  const columns = ROWS[0].map((t, i) => [t, ROWS[1][i]].filter(Boolean));
  return (
    <div className="flex flex-col gap-6">
      <ul
        ref={row}
        aria-label="Athlete reviews"
        className="grid auto-cols-[290px] grid-flow-col grid-rows-2 gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain snap-x snap-mandatory scroll-px-5 px-5 [scrollbar-width:none]"
      >
        {columns.flat().map((t) => (
          <li key={t.name} className="flex snap-start">
            <Card t={t} />
          </li>
        ))}
      </ul>
      <ScrollDots scroller={row} count={columns.length} tone="dark" />
    </div>
  );
}

export function Reviews() {
  return (
    <section id="reviews" data-header-theme="dark" className="overflow-hidden bg-olive-grey py-16 max-lg:py-10">
      <Container className="flex flex-col gap-14 max-lg:gap-10">
        <div className="flex flex-col gap-4">
          <h2 className="text-h2 text-white">Trusted by 30,000+ Happy Customers</h2>
          <p className="text-body text-muted-on-dark">And by elite Australian athletes.</p>
        </div>

      </Container>

      <div className="mt-16 flex flex-col gap-4 max-lg:hidden">
        <MarqueeRow items={ROWS[0]} duration={70} />
        <MarqueeRow items={ROWS[1]} duration={80} reverse />
      </div>
      <div className="mt-10 lg:hidden">
        <SwipeRows />
      </div>
    </section>
  );
}
