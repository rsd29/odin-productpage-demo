"use client";

import Image from "next/image";
import { useLenis } from "lenis/react";
import { useEffect, useRef, type ReactNode } from "react";
import { Button } from "../ui/Button";
import { CampaignBadge } from "../ui/CampaignBadge";
import { FINISHES, SIZES, SIZE_ORDER, dims, money, priceLabel, type SizeId } from "./data";
import { useProduct } from "./ProductContext";

const ROWS: [string, (id: SizeId) => ReactNode][] = [
  ["Best for", (id) => SIZES[id].description],
  ["Size", (id) => dims(SIZES[id])],
  ["Capacity", (id) => SIZES[id].capacity ?? "TBC"],
  ["Finishes", () => FINISHES.join(", ")],
  ["Chiller", (id) => {
    const t = SIZES[id].tubOnly;
    return t?.price ? `1HP, or tub only (${money(t.price)})` : "1HP";
  }],
  ["Temperature", () => "3°C – 35°C"],
  ["Pump", () => "23 L/min high-flow"],
  // Same save chips as the buy box (stacked on phones, where the columns are narrow).
  ["You save", (id) => {
    const p = SIZES[id].withChiller;
    return (
      <CampaignBadge
        campaign={`Save ${money(p.save)}`}
        discount={p.discountPct ? `−${p.discountPct}%` : undefined}
        className="self-start max-lg:flex-col"
      />
    );
  }],
];

export function CompareSizesModal() {
  const { compareOpen, setCompareOpen, size, setSize } = useProduct();
  const ref = useRef<HTMLDialogElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (compareOpen && !d.open) d.showModal();
    if (!compareOpen && d.open) d.close();
  }, [compareOpen]);

  // Freeze the page behind the modal.
  useEffect(() => {
    if (!lenis) return;
    if (compareOpen) lenis.stop();
    else lenis.start();
  }, [compareOpen, lenis]);

  const choose = (id: SizeId) => {
    setSize(id);
    setCompareOpen(false);
  };

  return (
    <dialog
      ref={ref}
      onClose={() => setCompareOpen(false)}
      onClick={(e) => e.target === e.currentTarget && setCompareOpen(false)}
      aria-labelledby="compare-title"
      data-lenis-prevent
      className="m-auto max-h-[calc(100dvh-32px)] w-[940px] max-w-[calc(100vw-32px)] overflow-y-auto overscroll-contain rounded-[8px] bg-white p-0 shadow-[0_24px_64px_rgba(0,0,0,0.2)] modal-fade"
    >
      <div className="flex flex-col gap-7 px-12 py-10 max-lg:gap-5 max-lg:px-5 max-lg:py-6">
        <div className="flex items-start gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <h2 id="compare-title" className="text-h5 text-odin-grey">
              Niseko Ice Bath Sizes: Solo, Lux &amp; Grande
            </h2>
            <p className="text-body text-muted">
              You’re pursuing greatness. Demand a recovery space that can keep up.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCompareOpen(false)}
            aria-label="Close"
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-warm-off-white"
          >
            <Image src="/figma/compare/close.svg" alt="" width={20} height={20} />
          </button>
        </div>

        <div className="flex items-start gap-6 max-lg:gap-3">
          <div className="w-[160px] shrink-0 max-lg:hidden" />
          {SIZE_ORDER.map((id) => (
            <div key={id} className="flex min-w-0 flex-1 flex-col gap-[10px]">
              <div className="relative h-[150px] w-full overflow-hidden rounded-[8px] max-lg:h-[90px]">
                <Image src={SIZES[id].image} alt={`Niseko ${SIZES[id].name}`} fill sizes="220px" className="object-cover" />
                {size === id && (
                  <span className="text-label-sm absolute left-[10px] top-[10px] rounded-[4px] bg-odin-grey px-2 py-1 text-odin-cream">
                    SELECTED
                  </span>
                )}
              </div>
              <p className="text-h3 text-odin-grey">Niseko {SIZES[id].name}</p>
              <p className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-price text-odin-grey">{priceLabel(SIZES[id].withChiller)}</span>
                {SIZES[id].withChiller.compareAt && (
                  <s className="text-price text-muted">{money(SIZES[id].withChiller.compareAt)}</s>
                )}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col border-b border-line">
          {ROWS.map(([label, value]) => (
            <div key={label} className="flex items-center gap-6 border-t border-line py-3 max-lg:flex-wrap max-lg:gap-x-3 max-lg:gap-y-1">
              <span className="text-body w-[160px] shrink-0 text-muted max-lg:w-full max-lg:text-[12px]">{label}</span>
              {SIZE_ORDER.map((id) => (
                <div key={id} className="text-body flex min-w-0 flex-1 text-odin-grey max-lg:text-[13px] max-lg:leading-[1.4]">
                  {value(id)}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="flex items-start gap-6 max-lg:gap-3">
          <div className="w-[160px] shrink-0 max-lg:hidden" />
          {SIZE_ORDER.map((id) => (
            <Button
              key={id}
              variant={size === id ? "primary" : "secondary"}
              className="min-w-0 flex-1 max-lg:px-2 max-lg:py-3 max-lg:text-[13px]"
              onClick={() => choose(id)}
            >
              Choose {SIZES[id].name}
            </Button>
          ))}
        </div>
      </div>
    </dialog>
  );
}
