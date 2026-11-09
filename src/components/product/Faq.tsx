"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { Container } from "../ui/Container";

/** Prose answer: roomy line spacing and paragraph gaps at a readable measure. */
const Prose = ({ children }: { children: ReactNode }) => (
  <div className="flex max-w-[720px] flex-col gap-4 font-sans text-[15px] font-light leading-[1.7] text-olive-grey">{children}</div>
);
/** The key point of an answer, set heavier and darker so it can be skimmed. (Turns white in the open panel.) */
const B = ({ children }: { children: ReactNode }) => <strong className="font-medium text-odin-grey">{children}</strong>;

// Source: masseusehealth.co/products/niseko-ice-bath ("Niseko Ice Bath FAQs"). "Why buy" is rewritten for ODIN.
const QUESTIONS: { q: string; a: ReactNode }[] = [
  {
    q: "What's included in my purchase?",
    a: (
      <Prose>
        <p>
          Your Niseko Ice Bath arrives with <B>everything you need for powerful, hassle-free recovery</B>:
        </p>
        <ul className="flex list-disc flex-col gap-3 pl-5 marker:text-muted">
          <li>
            <B>The Niseko Ice Bath with triple-insulated cover</B>, engineered for lasting temperature control and rugged
            durability.
          </li>
          <li>
            <B>A 1HP chiller unit and continuous ozone filtration system</B>, that&rsquo;s designed for
            performance-driven cooling and crystal-clear, self-cleaning water.
          </li>
          <li>
            <B>A step and headrest</B> for comfortable, controlled plunging.
          </li>
          <li>
            <B>Complete connection kit and hosing</B> simplifies setup so you can get started fast.
          </li>
          <li>
            <B>A user manual</B> that offers clear guidance for optimal performance and care.
          </li>
          <li>
            <B>White-glove delivery and packaging removal.</B> Delivered where you want it, with zero hassle or mess.
          </li>
          <li>
            <B>A comprehensive two-year warranty</B> for your confidence and peace of mind.
          </li>
        </ul>
      </Prose>
    ),
  },
  {
    q: "What should I expect from the stainless steel finish?",
    a: (
      <Prose>
        <p>
          Every Niseko Ice Bath is crafted from <B>marine-grade 316 stainless steel</B>, which is shaped, joined, welded,
          sanded and finished to create its rounded form.
        </p>
        <p>
          As a result, you may notice subtle differences in the appearance of the steel, particularly around joins and
          other worked areas. These are an expected part of the manufacturing and finishing process and{" "}
          <B>do not affect the quality, durability or performance</B> of your ice bath.
        </p>
      </Prose>
    ),
  },
  {
    q: "Why should I buy an ODIN ice bath over other brands?",
    a: (
      <Prose>
        <p>
          ODIN was started by Michael Clark, who built his own recovery routine around hot and cold, and kept running into
          gear that was never quite cold and never quite clean. Every ODIN is built to fix that:{" "}
          <B>properly cold, easy to keep clean, and made to last.</B>
        </p>
        <p>
          You deal with real people who know the products, from choosing your size through to delivery day and beyond,
          with <B>Lifetime Concierge Service</B> and a <B>comprehensive two-year warranty</B> for your peace of mind.
        </p>
        <p>
          And with flexible payment options, including <B>Afterpay and humm</B>, elite performance and recovery is within
          reach.
        </p>
      </Prose>
    ),
  },
  {
    q: "How long will it take for my ice bath to arrive?",
    a: (
      <Prose>
        <p>
          If your Niseko Ice Bath is in stock, <B>we&rsquo;ll process and ship it the next business day.</B>
        </p>
        <p>
          Most customers receive their delivery <B>within just a few days</B>, so you can start your recovery routine
          asap.
        </p>
      </Prose>
    ),
  },
  {
    q: "Can I get my Niseko Ice Bath delivered anywhere in Australia?",
    a: (
      <Prose>
        <p>
          <B>Yes! We deliver Australia-wide</B> using trusted couriers to ensure your Niseko Ice Bath arrives safely and
          on time.
        </p>
        <p>
          After you place your order, our team will contact you to <B>arrange a convenient delivery date and time</B>.
          Delivery times may vary depending on your location.
        </p>
      </Prose>
    ),
  },
  {
    q: "Are there any safety considerations when using an ice bath?",
    a: (
      <Prose>
        <p>
          Like any serious recovery tool, ice baths should be used with care.{" "}
          <B>Always read the safety info in your user manual first.</B>
        </p>
        <p>
          If you&rsquo;re new to cold therapy, <B>start slow</B> and gradually increase your exposure. And if you have any
          medical concerns, <B>check with a professional</B> before plunging in.
        </p>
      </Prose>
    ),
  },
];

const ON_DARK =
  "[--color-odin-grey:var(--color-white)] [--color-olive-grey:var(--color-muted-on-dark)] [--color-muted:var(--color-muted-on-dark)] [--color-line:var(--color-olive-grey-line)]";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-white pb-20 pt-[81px] max-lg:pb-14 max-lg:pt-14">
      <Container className="flex flex-col gap-5">
        <div className="flex flex-col gap-[14px]">
          <h2 className="text-h2 text-odin-grey max-lg:text-[22px]">Niseko Ice Bath FAQs</h2>
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
              <div
                key={item.q}
                // The open question becomes an Odin-grey panel. Bled into the gutter so the text doesn't shift.
                className={`-mx-6 rounded-[8px] px-6 transition-colors duration-300 ease-in-out motion-reduce:transition-none max-lg:-mx-4 max-lg:px-4 ${
                  isOpen ? "bg-odin-grey" : ""
                }`}
              >
              {/* Inside the open panel the colour tokens flip to their on-dark values, so answers recolour themselves. */}
              {/* Hairlines sit inside the padding, so they line up with the column rather than the panel. */}
              <div
                className={`flex flex-col border-t py-6 transition-colors duration-300 motion-reduce:transition-none max-lg:py-5 ${
                  isOpen ? `border-transparent ${ON_DARK}` : "border-line"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  className="flex w-full cursor-pointer items-center gap-4 text-left"
                >
                  <span className="text-h4 min-w-0 flex-1 text-odin-grey max-lg:text-[16px]">{item.q}</span>
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
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
