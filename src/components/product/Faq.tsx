"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { Container } from "../ui/Container";
import { SIZES, SIZE_ORDER, money, priceLabel, type SizeId } from "./data";

type Row = [string, ...string[]];

function Specs({ head, rows }: { head?: string[]; rows: Row[] }) {
  return (
    <div className="flex w-full flex-col">
      {head && (
        <div className="text-label-sm flex items-center pb-2 text-muted">
          <span className="w-[200px] shrink-0 max-lg:w-[104px]" />
          {head.map((h) => (
            <span key={h} className="min-w-0 flex-1">
              {h}
            </span>
          ))}
        </div>
      )}
      {rows.map(([label, ...values], i) => (
        <div
          key={label}
          className={`text-body flex items-center border-t-[0.5px] border-line py-[10px] ${
            i === rows.length - 1 ? "border-b-[0.5px]" : ""
          }`}
        >
          <span className="w-[200px] shrink-0 pr-3 text-muted max-lg:w-[104px] max-lg:text-[13px]">{label}</span>
          {values.map((v, j) => (
            <span key={j} className="min-w-0 flex-1 pr-4 text-odin-grey max-lg:pr-2 max-lg:text-[13px]">
              {v}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

const SIZE_HEAD = SIZE_ORDER.map((id) => SIZES[id].name.toUpperCase());
const perSize = (fn: (id: SizeId) => string) => SIZE_ORDER.map(fn);
/** Prose answer: one or more paragraphs at a readable measure. */
const Prose = ({ children }: { children: ReactNode }) => (
  <div className="text-body flex max-w-[760px] flex-col gap-3 text-olive-grey">{children}</div>
);
const CALL = (
  <a href="tel:1300888669" className="text-odin-grey underline">
    1300 888 669
  </a>
);

const QUESTIONS: { q: string; a: ReactNode }[] = [
  {
    q: "Will it fit in my space?",
    a: (
      <div className="flex items-start gap-10 max-lg:flex-col max-lg:gap-6">
        <div className="relative h-[190px] w-[280px] shrink-0 overflow-hidden rounded-[6px] bg-warm-off-white max-lg:w-full">
          <Image
            src="/products/niseko/10.webp"
            alt="Niseko Solo dimensions: 135 cm long, 64 cm wide, 76 cm deep, 260 L"
            fill
            sizes="280px"
            className="object-cover"
          />
          <span className="text-label-sm absolute left-4 top-4 text-muted">SOLO</span>
        </div>
        <div className="min-w-0 flex-1 max-lg:w-full">
          <Specs
            head={SIZE_HEAD}
            rows={[
              ["Size (W × L × D)", ...perSize((id) => `${SIZES[id].width} × ${SIZES[id].length} × ${SIZES[id].depth} cm`)],
              ["Capacity", ...perSize((id) => SIZES[id].capacity ?? "TBC")],
              ["Doorways", "Fits through standard door frames"],
              ["Placement", "Indoor/outdoor use"],
            ]}
          />
        </div>
      </div>
    ),
  },
  {
    q: "Which size is right for me?",
    a: (
      <Specs
        head={SIZE_HEAD}
        rows={[
          ["Best for", ...perSize((id) => SIZES[id].description)],
          ["Price (with 1HP chiller)", ...perSize((id) => priceLabel(SIZES[id].withChiller))],
          ["You save", ...perSize((id) => money(SIZES[id].withChiller.save))],
        ]}
      />
    ),
  },
  {
    q: "What's included in my purchase?",
    a: (
      <Specs
        rows={[
          ["Ice bath", "Your Niseko in the size you choose: Certified Canadian red cedar around a marine-grade 316 stainless steel tub"],
          ["Chiller", "Powerful 1HP chiller (3°C – 35°C) with a 23 L/min high-flow pump, ozone treatment and filtration (not included with Solo Tub Only)"],
          ["Cover", "Triple-insulated weather-shield cover"],
          ["Extras", "Premium cedar ice bath step and a comfortable headrest"],
          ["Support", "2-Year Warranty and Lifetime Concierge Service"],
        ]}
      />
    ),
  },
  {
    q: "How cold does it get?",
    a: (
      <Specs
        rows={[
          ["Temperature range", "Cools down to 3°C, heats up to 35°C"],
          ["Chiller", "Powerful 1 HP chiller unit"],
          ["Pump", "23 L/min advanced high-flow water pump"],
        ]}
      />
    ),
  },
  {
    q: "What is it made of?",
    a: (
      <Specs
        rows={[
          ["Exterior", "Sustainably sourced, Certified Canadian Red Cedar"],
          ["Tub", "Marine-grade 316 stainless steel"],
          ["Cover", "Triple-insulated weather-shield cover"],
          ["Extras", "Premium cedar ice bath step, comfortable headrest"],
        ]}
      />
    ),
  },
  {
    q: "What should I expect from the stainless steel finish?",
    a: (
      <Prose>
        <p>
          The tub is made from marine-grade 316 stainless steel, the grade used on boats and in coastal settings, so it
          stands up to constant contact with cold water and resists rust and corrosion.
        </p>
        <p>
          Expect a smooth, metallic finish that&rsquo;s easy to keep clean. Like any stainless steel, it can show water
          spots or fingerprints over time. A quick wipe with a soft, damp cloth keeps it looking new, and our Ice Bath
          Maintenance guide covers the rest.
        </p>
      </Prose>
    ),
  },
  {
    q: "How does the water stay clean?",
    a: (
      <Specs
        rows={[
          ["Ozone treatment", "Keeps your water purified and sanitised"],
          ["Filtration", "In-built filter captures particles and debris"],
          ["Replacement filters", `Ice Bath Chiller Filter (1HP), ${money(59.95)}`],
        ]}
      />
    ),
  },
  {
    q: "Can I control it from my phone?",
    a: (
      <Specs
        rows={[
          ["App", "WiFi, available on iOS and Android"],
          ["Controls", "Adjust temperature, monitor in real time, schedule sessions"],
        ]}
      />
    ),
  },
  {
    q: "What is the warranty?",
    a: (
      <Specs
        rows={[
          ["Standard", "2-Year Warranty"],
          ["Extended chiller", `1 Year Extended Chiller Warranty, ${money(495)}`],
          ["Extended ice bath", `5 Year Extended Ice Bath Warranty, ${money(495)}`],
        ]}
      />
    ),
  },
  {
    q: "Why should I buy a Niseko over other brands?",
    a: (
      <Specs
        rows={[
          ["Materials", "Certified Canadian red cedar and marine-grade 316 stainless steel, built for indoor or outdoor use"],
          ["Performance", "A 1HP chiller that cools to 3°C and heats to 35°C, so you can go hot or cold"],
          ["Clean water", "Ozone treatment and filtration, with a 23 L/min high-flow pump"],
          ["Control", "WiFi app on iOS and Android to set the temperature and schedule sessions"],
          ["Support", "2-Year Warranty, optional extended cover and Lifetime Concierge Service"],
          ["Trusted", "30,000+ happy customers and elite Australian athletes"],
        ]}
      />
    ),
  },
  {
    q: "How long will it take for my ice bath to arrive?",
    a: (
      <Prose>
        <p>
          Delivery times depend on your location and current stock. Once you&rsquo;ve ordered, our concierge team will
          confirm your delivery window and keep you updated until it arrives.
        </p>
        <p>Want an estimate before you buy? Call {CALL} or request a callback.</p>
      </Prose>
    ),
  },
  {
    q: "Can I get my Niseko Ice Bath delivered anywhere in Australia?",
    a: (
      <Prose>
        <p>
          We deliver to addresses across Australia. For regional and remote areas, timing and access can vary, so our
          concierge team will confirm the details for your address before dispatch.
        </p>
        <p>To check your postcode, call {CALL} or request a callback.</p>
      </Prose>
    ),
  },
  {
    q: "Are there any safety considerations when using an ice bath?",
    a: (
      <Specs
        rows={[
          ["Check with your doctor", "Especially if you're pregnant or have a heart condition, high blood pressure or Raynaud's"],
          ["Start gently", "Begin with short sessions at milder temperatures, then build up as your body adapts"],
          ["Don't plunge alone", "Have someone nearby, and never use the ice bath after alcohol"],
          ["Listen to your body", "Get out straight away if you feel dizzy, numb or unwell"],
          ["Warm up afterwards", "Dry off and rewarm gradually with light movement and warm layers"],
        ]}
      />
    ),
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-white pb-20 pt-[81px] max-lg:pb-14 max-lg:pt-14">
      <Container className="flex flex-col gap-5">
        <div className="flex flex-col gap-[14px]">
          <h2 className="text-h2 text-odin-grey">Niseko Ice Bath FAQs</h2>
          <p className="text-body text-muted">Your path to peak performance starts here.</p>
        </div>
        <a href="#" className="flex items-center gap-2 self-start hover:opacity-80">
          <span className="text-label-md whitespace-nowrap text-odin-grey">Download the spec sheet (PDF)</span>
          <Image src="/figma/faq/arrow-right.svg" alt="" width={16} height={16} />
        </a>
        <div className="flex flex-col border-b border-line">
          {QUESTIONS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="flex flex-col border-t border-line py-6 max-lg:py-5">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  className="flex w-full cursor-pointer items-center gap-4 text-left"
                >
                  <span className="text-h4 min-w-0 flex-1 text-odin-grey">{item.q}</span>
                  <svg
                    aria-hidden="true"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    className="shrink-0 text-odin-grey"
                  >
                    <path d="M3 10H17" />
                    <path
                      d="M10 3V17"
                      className={`origin-center transition-[transform,opacity] duration-300 ease-in-out motion-reduce:transition-none ${
                        isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                      }`}
                    />
                  </svg>
                </button>
                <div
                  id={`faq-${i}`}
                  aria-hidden={!isOpen}
                  inert={!isOpen}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="pt-5">{item.a}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
