import { Container } from "../ui/Container";

type Testimonial = { quote: string; name: string; role: string };

// Source: masseusehealth.co/products/niseko-ice-bath ("Trusted By Elite Australian Athletes").
const FEATURED: Testimonial = {
  quote: "The Niseko Ice Bath is a non-negotiable in my recovery.",
  name: "Tom Stewart",
  role: "5× AFL All-Australian",
};

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
 * One endlessly drifting row. The cards are rendered twice back to back (the copy hidden from assistive
 * tech) so translating the track by −50% loops seamlessly. Hover pauses it; reduced motion stops it and
 * lets the row scroll by hand instead. On phones it's a plain swipeable row (one copy, snapping to each
 * card), so every card that runs off the screen can be reached by touch.
 */
function MarqueeRow({ items, reverse, duration }: { items: Testimonial[]; reverse?: boolean; duration: number }) {
  return (
    <div className="overflow-hidden motion-reduce:overflow-x-auto [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)] max-lg:snap-x max-lg:snap-mandatory max-lg:scroll-px-5 max-lg:overflow-x-auto max-lg:[mask-image:none] max-lg:[scrollbar-width:none]">
      <div
        className={`flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none max-lg:animate-none max-lg:px-5 ${
          reverse ? "[animation-direction:reverse]" : ""
        }`}
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1}
            className={`flex shrink-0 gap-4 pr-4 max-lg:pr-0 ${copy === 1 ? "max-lg:hidden" : ""}`}
          >
            {items.map((t) => (
              <li key={t.name} className="flex max-lg:snap-start">
                <Card t={t} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export function Reviews() {
  return (
    <section id="reviews" data-header-theme="dark" className="overflow-hidden bg-olive-grey pb-28 pt-[84px] max-lg:pb-16 max-lg:pt-14">
      <Container className="flex flex-col gap-14 max-lg:gap-10">
        <div className="flex flex-col gap-4">
          <h2 className="text-h2 text-white">Trusted by 30,000+ happy customers.</h2>
          <p className="text-body text-muted-on-dark">And by elite Australian athletes.</p>
        </div>

        {/* Featured pull-quote */}
        {/* Sits below the h2 in the hierarchy: h3 size, one step down from the heading. */}
        <figure className="flex max-w-[640px] flex-col gap-5">
          {/* Hanging punctuation: the opening mark sits in the margin so the words align with the heading. */}
          <blockquote className="text-h3 text-odin-cream [text-indent:-0.4em]">
            <span className="text-odin-blue">&ldquo;</span>
            {FEATURED.quote}
            <span className="text-odin-blue">&rdquo;</span>
          </blockquote>
          <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="h-px w-8 bg-muted-on-dark" aria-hidden />
            <span className="text-h5 text-odin-cream">{FEATURED.name}</span>
            <span className="text-body text-muted-on-dark">{FEATURED.role}</span>
          </figcaption>
        </figure>
      </Container>

      <div className="mt-16 flex flex-col gap-4 max-lg:mt-10">
        <MarqueeRow items={ROWS[0]} duration={70} />
        <MarqueeRow items={ROWS[1]} duration={80} reverse />
      </div>
    </section>
  );
}
