"use client";

import Image from "next/image";
import { useState, type KeyboardEvent } from "react";
import { Container } from "../ui/Container";
import { FramedImage, type Frame } from "../ui/FramedImage";

const IMG = "/products/niseko";

/** Fit the complete PNG with a 32px inset; hotspots share its frame and use source-image fractions. */
const PRODUCT_RATIO = 6324 / 2496;
const PRODUCT_WIDTH = `min(calc(100cqw - 64px), calc((100cqh - 64px) * ${PRODUCT_RATIO}))`;
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
    focus: `${IMG}/5.webp`,
    frame: { x: 0.55, y: 0.45, zoom: 1.25 },
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
  const d = DETAILS[active];
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
      className="flex h-svh max-h-[1140px] min-h-[780px] scroll-mt-[45px] bg-white py-20 max-lg:h-auto max-lg:max-h-none max-lg:min-h-0 max-lg:py-14"
    >
      <Container className="flex min-h-0 flex-col gap-8 max-lg:gap-6">
        <h2 className="text-h2 text-odin-grey">Every detail, up close.</h2>

        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-10 max-lg:grid-cols-1 max-lg:gap-6">
          {/* Keep the full cut-out visible, with hotspots pinned to the same image frame. */}
          <div className="relative min-h-0 overflow-hidden rounded-[8px] [container-type:size] max-lg:h-[220px]">
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
                      onClick={() => setActive(i)}
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
            <div className="flex min-h-0 flex-1 flex-col gap-5">
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
                      onClick={() => setActive(i)}
                      aria-pressed={on}
                      className={`relative flex w-full cursor-pointer items-center gap-[10px] border-t border-line py-3 text-left font-display font-medium leading-[1.3] transition-colors ${
                        on ? "text-odin-grey" : "text-muted hover:text-odin-grey"
                      }`}
                    >
                      <span
                        className={`absolute -top-px left-0 h-[2px] bg-odin-grey transition-all duration-300 ${
                          on ? "w-full" : "w-0"
                        }`}
                        aria-hidden
                      />
                      <span className="whitespace-nowrap text-[12px] tracking-[0.08em]">{s.n}</span>
                      <span className="min-w-0 flex-1 truncate text-[14px]">{s.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
