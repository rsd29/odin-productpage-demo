"use client";

import Image from "next/image";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Container } from "../ui/Container";
import { FramedImage, type Frame } from "../ui/FramedImage";
import { ScrollDots } from "../ui/ScrollDots";

const IMG = "/products/niseko";

/**
 * Fit the complete PNG inside its box with an inset (`--inset`: 32px a side on desktop, 8px on phones);
 * hotspots share its frame and use source-image fractions.
 */
const PRODUCT_RATIO = 6324 / 2496;
const PRODUCT_WIDTH = `min(calc(100cqw - var(--inset)), calc((100cqh - var(--inset)) * ${PRODUCT_RATIO}))`;
/** Phones (below the lg breakpoint) open details in a bottom sheet instead of the side panel. */
const isPhone = () => window.matchMedia("(width < 64rem)").matches;

const Chevron = ({ dir = "right" }: { dir?: "left" | "right" }) => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" className={dir === "left" ? "rotate-180" : ""}>
    <path d="m6 3.5 4.5 4.5L6 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Phones: the details as a bottom sheet (like the Vital+ feature explorer). It opens on the tapped
 * detail, and swipes sideways between all six, with dots and arrows; the hotspot follows along.
 */
function DetailSheet({
  open,
  index,
  onIndex,
  onClose,
}: {
  open: boolean;
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const lenis = useLenis();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    // Only on opening does it jump to the tapped detail; swipes while open change `index` without re-jumping.
    if (open && !d.open) {
      d.showModal();
      const t = track.current;
      if (t) t.scrollTo({ left: index * t.clientWidth, behavior: "instant" });
    }
    if (!open && d.open) d.close();
  }, [open, index]);

  // Freeze the page behind the sheet.
  useEffect(() => {
    if (!lenis || !open) return;
    lenis.stop();
    return () => lenis.start();
  }, [open, lenis]);

  const go = (i: number) => {
    const t = track.current;
    if (!t) return;
    const next = Math.max(0, Math.min(DETAILS.length - 1, i));
    t.scrollTo({ left: next * t.clientWidth, behavior: "smooth" });
  };

  return (
    <dialog
      ref={ref}
      aria-label="Every detail, up close"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      data-lenis-prevent
      className="sheet mx-0 mb-0 mt-auto max-h-[88dvh] w-full max-w-none overflow-y-auto overscroll-contain rounded-t-[16px] bg-odin-cream p-0 lg:hidden"
    >
      {/* Handle + close, pinned while the sheet's content scrolls. */}
      <div className="sticky top-0 z-10 flex h-14 items-center justify-end bg-odin-cream px-4">
        <span aria-hidden className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-line" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-warm-off-white"
        >
          <Image src="/figma/compare/close.svg" alt="" width={18} height={18} />
        </button>
      </div>

      <ul
        ref={track}
        onScroll={(e) => {
          const t = e.currentTarget;
          const i = Math.round(t.scrollLeft / t.clientWidth);
          if (i !== index) onIndex(i);
        }}
        className="flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none]"
      >
        {DETAILS.map((d, i) => (
          <li
            key={d.n}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${DETAILS.length}: ${d.title}`}
            className="w-full shrink-0 snap-center px-5"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[8px] bg-warm-off-white">
              <FramedImage src={d.focus} alt={`${d.title} close-up`} sizes="100vw" {...d.frame} />
            </div>
            <div className="flex flex-col gap-3 pt-5">
              <span className="font-display text-[15px] font-medium leading-none tracking-[0.08em] text-muted">{d.n}</span>
              <h3 className="text-h3 text-odin-grey">{d.title}</h3>
              <p className="text-body text-olive-grey">{d.body}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Previous / dots / next */}
      <div className="flex items-center justify-between gap-4 px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-6">
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label="Previous detail"
          className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-line text-odin-grey disabled:cursor-default disabled:opacity-30"
        >
          <Chevron dir="left" />
        </button>
        <ScrollDots scroller={track} count={DETAILS.length} className="" />
        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={index === DETAILS.length - 1}
          aria-label="Next detail"
          className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-line text-odin-grey disabled:cursor-default disabled:opacity-30"
        >
          <Chevron />
        </button>
      </div>
    </dialog>
  );
}
const pos = (x: number, y: number) => ({ left: `${x * 100}%`, top: `${y * 100}%` });

type Detail = {
  n: string;
  title: string;
  at: [number, number];
  focus: string;
  /** Crops the close-up in on the product shown in it. */
  frame: Frame;
  body: string;
};

const DETAILS: Detail[] = [
  {
    n: "01",
    title: "Powerful 1HP chiller",
    at: [0.14, 0.7],
    focus: `${IMG}/6.webp`,
    frame: { x: 0.7, y: 0.5, zoom: 1.4 },
    body: "Cools down to 3°C and heats up to 35°C, with a high-flow 23 L/min pump.",
  },
  {
    n: "02",
    title: "Canadian red cedar",
    at: [0.49, 0.4],
    focus: "/images/cedar-detail.webp",
    frame: { x: 0.5, y: 0.5 },
    body: "Natural, sustainably sourced timber that’s naturally resistant to moisture and decay.",
  },
  {
    n: "03",
    title: "316 stainless steel",
    at: [0.62, 0.045],
    focus: `${IMG}/10.webp`,
    frame: { x: 0.6, y: 0.39, zoom: 1.3 },
    body: "A marine-grade 316 stainless steel tub. The Solo holds 260 L.",
  },
  {
    n: "04",
    title: "Ozone filtration",
    at: [0.025, 0.46],
    focus: `${IMG}/7.webp`,
    frame: {}, // infographic: labels run edge to edge, so show it whole
    body: "Ozone keeps your water purified and sanitised. The in-built filter captures particles and debris.",
  },
  {
    n: "05",
    title: "WiFi app control",
    at: [0.12, 0.51],
    focus: `${IMG}/9.webp`,
    frame: {}, // infographic: show it whole
    body: "Adjust the temperature, monitor performance in real time and schedule your session.",
  },
  {
    n: "06",
    title: "Weather-shield cover",
    at: [0.415, 0.04],
    focus: `${IMG}/4.webp`,
    frame: { x: 0.5, y: 0.445, zoom: 1.12 },
    body: "A triple-insulated weather-shield cover tops off the tub between sessions.",
  },
];

export function EveryDetail() {
  const [active, setActive] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const d = DETAILS[active];
  /** Select a detail; on phones that also opens the sheet. */
  const pick = (i: number) => {
    setActive(i);
    if (isPhone()) setSheetOpen(true);
  };
  const go = (delta: number) => setActive((i) => (i + delta + DETAILS.length) % DETAILS.length);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };

  return (
    // A full viewport tall, so the panels get as much height as the screen allows.
    <section
      id="details"
      onKeyDown={onKeyDown}
      // Phones: natural height, with the panels stacked.
      className="flex h-[85svh] max-h-[960px] min-h-[680px] scroll-mt-[45px] bg-white py-14 max-lg:h-auto max-lg:max-h-none max-lg:min-h-0 max-lg:py-10"
    >
      <Container className="flex min-h-0 flex-col gap-8 max-lg:gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-h2 text-odin-grey">Every detail, up close</h2>
          <p className="text-body text-muted lg:hidden">Tap a number to see each detail up close.</p>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-10 max-lg:grid-cols-1 max-lg:gap-6">
          {/* Keep the full cut-out visible, with hotspots pinned to the same image frame. */}
          {/* Phones: bleeds to the screen edge with a smaller inset, so the tub (and its numbers) are as big as possible. */}
          <div className="relative min-h-0 overflow-hidden rounded-[8px] [--inset:64px] [container-type:size] max-lg:-mx-5 max-lg:h-[200px] max-lg:rounded-none max-lg:[--inset:16px]">
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ width: PRODUCT_WIDTH, aspectRatio: "6324 / 2496" }}
            >
              <Image
                src={`${IMG}/niseko-detail.png`}
                alt="Niseko Ice Bath with chiller and cedar step"
                fill
                sizes="(min-width: 1440px) 763px, 60vw"
                className="object-contain"
              />

              {DETAILS.map((h, i) => {
                const on = active === i;
                return (
                  <div
                    key={h.n}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 ${on ? "z-10" : ""}`}
                    style={pos(...h.at)}
                  >
                    {on && (
                      <span className="absolute inset-0 animate-ping rounded-full bg-white/60" aria-hidden />
                    )}
                    <button
                      type="button"
                      onClick={() => pick(i)}
                      aria-label={`${h.n} ${h.title}`}
                      aria-pressed={on}
                      className={`text-eyebrow relative flex size-8 cursor-pointer max-lg:size-7 items-center justify-center rounded-full border text-[11px] shadow-[0_4px_12px_rgba(0,0,0,0.18)] backdrop-blur-[7px] transition-all duration-200 ${
                        on
                          ? "scale-110 border-white bg-white text-odin-grey"
                          : "border-white/40 bg-[rgba(51,51,51,0.6)] text-white hover:bg-[rgba(51,51,51,0.85)]"
                      }`}
                    >
                      {h.n}
                    </button>
                    {on && (
                      <span
                        key={h.n}
                        className="text-h5 pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 animate-fade-in whitespace-nowrap max-lg:hidden rounded-full bg-white px-3 py-[7px] text-odin-grey shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
                      >
                        {h.title}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Close-up + selectors */}
          <div className="flex min-h-0 flex-col gap-6">
            {/* Desktop only: on phones the close-up and copy open in the sheet. */}
            <div className="flex min-h-0 flex-1 flex-col gap-5 max-lg:hidden">
              <div
                key={d.focus}
                className="relative min-h-0 flex-1 animate-fade-in overflow-hidden rounded-[8px] bg-warm-off-white max-lg:h-[260px] max-lg:flex-none"
              >
                <FramedImage src={d.focus} alt={`${d.title} close-up`} sizes="640px" {...d.frame} />
              </div>
              <div key={d.n} className="flex animate-fade-in flex-col gap-2">
                <h3 className="text-h4 text-odin-grey">{d.title}</h3>
                <p className="text-body max-w-[440px] text-olive-grey">{d.body}</p>
              </div>
            </div>

            <ul className="grid grid-cols-2 gap-x-6 max-lg:grid-cols-1">
              {DETAILS.map((s, i) => {
                const on = active === i;
                return (
                  <li key={s.n}>
                    <button
                      type="button"
                      onClick={() => pick(i)}
                      aria-pressed={on}
                      className={`relative flex w-full cursor-pointer items-center gap-[10px] border-t border-line py-3 text-left font-display font-medium leading-[1.3] transition-colors ${
                        on ? "text-odin-grey" : "text-olive-grey hover:text-odin-grey"
                      }`}
                    >
                      <span
                        className={`absolute -top-px left-0 h-[2px] bg-odin-grey transition-all duration-300 ${
                          on ? "w-full" : "w-0"
                        }`}
                        aria-hidden
                      />
                      <span className="whitespace-nowrap text-[13px] tracking-[0.08em] text-muted">{s.n}</span>
                      {/* Readable at rest, not only once selected. */}
                      <span className="min-w-0 flex-1 truncate text-[17px]">{s.title}</span>
                      {/* Phones: each row opens the detail sheet. */}
                      <span className="text-muted lg:hidden">
                        <Chevron />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
      <DetailSheet open={sheetOpen} index={active} onIndex={setActive} onClose={() => setSheetOpen(false)} />
    </section>
  );
}
