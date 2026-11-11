"use client";

import Image from "next/image";
import { useEffect, type ReactNode } from "react";
import { Button } from "../ui/Button";
import { CampaignBadge } from "../ui/CampaignBadge";
import { FeatureIcon, type FeatureIconName } from "../ui/FeatureIcon";
import { FramedImage, type Frame } from "../ui/FramedImage";
import { preloadImages } from "../ui/preload";
import { AfterpayMark, PaymentMarks } from "../ui/PaymentMarks";
import { UspIcon, type UspIconName } from "../ui/UspIcon";
import {
  ADDONS,
  PRODUCT_NAME,
  SIZES,
  SIZE_ORDER,
  imageFor,
  money,
  priceLabel,
  pricingFor,
  variantName,
  type SizeId,
} from "./data";
import { useProduct } from "./ProductContext";
import { FinishSelector } from "./FinishSelector";
import { TechnicalDetails } from "./TechnicalDetails";

/** Key features above the size picker. The chiller ones drop out when "Tub only" is chosen. */
const HERO_FEATURES: { icon: FeatureIconName; title: string; body: string; colour: string; chiller?: boolean }[] = [
  { icon: "cedar", colour: "text-[#a0503a]", title: "Canadian red cedar", body: "Certified sustainable" },
  { icon: "steel", colour: "text-[#637585]", title: "Marine-grade 316 steel", body: "Premium stainless steel tub" },
  { icon: "chiller", colour: "text-[#397e9f]", title: "Powerful 1HP chiller", body: "Cools to 3°C, heats to 35°C", chiller: true },
  { icon: "flow", colour: "text-[#397f7a]", title: "23 L/min high-flow pump", body: "With ozone filtration", chiller: true },
];

// Each title is set on two lines so the three columns stay visually even.
const USPS: { icon: UspIconName; title: [string, string] }[] = [
  { icon: "delivery", title: ["Fast", "Delivery"] },
  { icon: "warranty", title: ["2-Year", "Warranty"] },
  { icon: "concierge", title: ["Lifetime", "Concierge Service"] },
];

/** Tub centre + zoom per cut-out (measured from each image's opaque pixels) so every tub fills ~85% of its card. */
const N = "/products/niseko";
const VARIANT_FRAME: Record<string, Frame> = {
  [`${N}/variant-solo.webp`]: { x: 0.415, y: 0.505, zoom: 1.25 },
  [`${N}/variant-solo-tub.webp`]: { x: 0.49, y: 0.5, zoom: 1.33 },
  [`${N}/variant-lux.webp`]: { x: 0.485, y: 0.535, zoom: 1.6 },
  [`${N}/variant-grande.webp`]: { x: 0.5, y: 0.5, zoom: 1.38 },
  [`${N}/black-1.webp`]: { x: 0.506, y: 0.5, zoom: 1.07 },
  [`${N}/black-2.webp`]: { x: 0.5, y: 0.5, zoom: 1.31 },
  [`${N}/black-3.webp`]: { x: 0.502, y: 0.5, zoom: 1.25 },
  [`${N}/black-4.webp`]: { x: 0.5, y: 0.5, zoom: 1.36 },
};

/** Radio / checkbox indicator matching the Figma radio (16px). */
function Indicator({ type, on }: { type: "radio" | "check"; on: boolean }) {
  if (type === "radio")
    return on ? (
      <Image src="/figma/hero/radio.svg" alt="" width={16} height={16} />
    ) : (
      <span className="size-4 shrink-0 rounded-full border-[1.5px] border-line bg-white" />
    );
  return (
    <span
      className={`flex size-4 shrink-0 items-center justify-center rounded-[4px] border-[1.5px] text-[10px] leading-none text-white ${
        on ? "border-odin-grey bg-odin-grey" : "border-line bg-white"
      }`}
    >
      {on ? "✓" : ""}
    </span>
  );
}

function OptionRow({
  selected,
  disabled,
  onClick,
  indicator,
  title,
  note,
  aside,
  role,
  compact = false,
}: {
  selected: boolean;
  disabled?: boolean;
  onClick?: () => void;
  indicator: "radio" | "check";
  title: string;
  note?: string;
  aside: ReactNode;
  role: "radio" | "checkbox";
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={selected}
      disabled={disabled}
      onClick={onClick}
      className={`w-full gap-3 rounded-[6px] bg-white px-4 py-3 text-left ${
        compact
          ? "grid h-full min-w-0 grid-cols-[16px_minmax(0,1fr)] grid-rows-[1fr_auto] items-start border max-lg:gap-x-2 max-lg:px-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-odin-grey"
          : "flex items-center"
      } ${
        compact
          ? selected ? "border-odin-grey shadow-[inset_0_0_0_0.5px_var(--color-odin-grey)]" : "border-line"
          : selected ? "border-[1.5px] border-odin-grey" : "border border-line"
      } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-muted"}`}
    >
      <span className={compact ? "mt-[2px] flex" : "flex shrink-0"}>
        <Indicator type={indicator} on={selected} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
        <span className={`${compact ? "font-display text-[15px] font-medium leading-snug max-lg:text-[14px]" : "text-h5"} text-odin-grey`}>{title}</span>
        {note && <span className="text-body text-muted">{note}</span>}
      </span>
      <span className={`text-price whitespace-nowrap text-odin-grey ${compact ? "col-start-2 row-start-2" : ""}`}>{aside}</span>
    </button>
  );
}

function SizeCard({ id }: { id: SizeId }) {
  const { size, setSize, tubOnly, finish } = useProduct();
  const s = SIZES[id];
  const selected = size === id;
  const p = pricingFor(s, selected && tubOnly);
  const src = imageFor(s, selected && tubOnly, finish);
  return (
    <button
      type="button"
      onClick={() => setSize(id)}
      aria-pressed={selected}
      className={`flex min-w-0 flex-1 cursor-pointer flex-col items-start gap-1 overflow-hidden rounded-[6px] bg-white px-[18px] py-4 text-left max-lg:px-3 max-lg:py-3 ${
        selected ? "border-[1.5px] border-odin-grey" : "border border-line hover:border-muted"
      }`}
    >
      {/* Name, then price and saving on one line (stacked on phones, where three cards share the width). */}
      <span className="text-h5 text-odin-grey">{s.name}</span>
      <span className="flex flex-wrap items-baseline gap-x-2 max-lg:flex-col">
        <span className="text-price whitespace-nowrap text-odin-grey">{priceLabel(p)}</span>
        <span className="text-price whitespace-nowrap text-muted max-lg:text-[13px]">Save {money(p.save)}</span>
      </span>
      {/* Scale the normalised cut-outs by length relative to Grande, on a common baseline. */}
      <span className="relative -mx-[18px] -mb-4 mt-2 h-[145px] w-[calc(100%+36px)] shrink-0 overflow-hidden max-lg:-mx-3 max-lg:-mb-3 max-lg:h-[90px] max-lg:w-[calc(100%+24px)]">
        <span className="absolute inset-0 origin-bottom" style={{ transform: `scale(${s.length / SIZES.grande.length})` }}>
          <FramedImage src={src} alt={`Niseko ${s.name}`} sizes="320px" {...VARIANT_FRAME[src]} />
        </span>
      </span>
    </button>
  );
}

// Every size's cut-out in every finish, so changing colour swaps the size cards instantly.
const VARIANT_IMAGES = Object.keys(VARIANT_FRAME);

export function BuyBox() {
  useEffect(() => preloadImages(VARIANT_IMAGES, "320px"), []);
  const { size, finish, tubOnly, setTubOnly, addons, toggleAddon, setCompareOpen, setCtaEl } = useProduct();
  const s = SIZES[size];
  const p = pricingFor(s, tubOnly);
  const addonTotal = ADDONS.filter((a) => addons.has(a.id)).reduce((sum, a) => sum + a.price, 0);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-[18px]">
      <h1 className="text-display text-odin-grey">{PRODUCT_NAME}</h1>

      <p className="text-body text-muted">
        Push harder. Recover faster. Build resilience where others break. Niseko delivers cold-driven
        recovery for athletes and high-performers who demand more.
      </p>

      {/* Price */}
      <div className="flex flex-col gap-[6px]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-h2 text-odin-grey">{priceLabel(p)}</span>
          {p.compareAt && <s className="text-h4 text-muted decoration-[1.5px]">{money(p.compareAt)}</s>}
          <CampaignBadge
            campaign={`Save ${money(p.save)}`}
            discount={p.discountPct ? `−${p.discountPct}%` : undefined}
          />
        </div>
        {/* Buy now, pay later: weightier than body copy so it reads as an offer, without being a heading. */}
        <p className="text-label-md flex min-h-[26px] items-center gap-[6px] text-odin-grey">
          <span>
            From only <span className="font-display text-[16px] font-medium">$39 p/w</span> with
          </span>
          <Image src="/brand/humm.svg" alt="humm" width={61} height={13} className="h-[15px] w-auto shrink-0" />
        </p>
      </div>

      {/* Phones: buy straight from the price, rather than scrolling past every option to reach the cart. */}
      <Button
        className="h-14 w-full justify-between! gap-3 px-5 py-0 lg:hidden"
        aria-label={`Add to Cart: ${PRODUCT_NAME}, ${variantName(s, tubOnly, finish)}${p.price ? `, ${money(p.price + addonTotal)}` : ""}`}
      >
        <span>Add to Cart</span>
        {p.price && <span className="font-display text-[22px] font-medium tabular-nums">{money(p.price + addonTotal)}</span>}
      </Button>

      {/* Key features (the chiller ones drop out for "Tub only"). */}
      {/* Two across when each box has room for one-line copy (≥ 240px), otherwise one column. */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
        {HERO_FEATURES.filter((f) => !(tubOnly && f.chiller)).map((f) => (
          // Compact type so every title and description sits on one line, keeping the four boxes even.
          <div key={f.title} className="flex items-center gap-3 rounded-[6px] bg-warm-off-white px-4 py-3">
            <span className={`flex size-9 shrink-0 items-center justify-center rounded-full bg-white ${f.colour}`}>
              <FeatureIcon name={f.icon} size={20} />
            </span>
            <span className="flex min-w-0 flex-col gap-[2px]">
              <span className="font-display text-[14px] font-medium leading-[1.3] whitespace-nowrap text-odin-grey">{f.title}</span>
              <span className="font-sans text-[13px] font-light leading-[1.4] text-muted">{f.body}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="h-px w-full bg-line" />

      {/* Size */}
      <div className="flex items-center gap-2">
        <h2 className="text-h5 text-odin-grey">Size</h2>
        <span className="flex-1" />
        <button
          type="button"
          onClick={() => setCompareOpen(true)}
          className="text-body cursor-pointer text-odin-grey hover:underline"
        >
          Which one fits you best?
        </button>
      </div>
      {/* All three sizes always fit across, phones included (no sideways scrolling). */}
      <div className="flex gap-3 max-lg:gap-2">
        {SIZE_ORDER.map((id) => (
          <SizeCard key={id} id={id} />
        ))}
      </div>

      <FinishSelector />

      {/* Chiller */}
      <div className="flex flex-col gap-[10px]" role="radiogroup" aria-label="Chiller">
        <h2 className="text-h5 text-odin-grey">Chiller</h2>
        <OptionRow
          role="radio"
          indicator="radio"
          selected={!tubOnly}
          onClick={() => setTubOnly(false)}
          title="With 1HP chiller"
          note="Cools down to 3°C, heats up to 35°C"
          aside={priceLabel(s.withChiller)}
        />
        {/* Only the Solo comes as a tub on its own; Lux and Grande don't offer the option at all. */}
        {s.tubOnly && (
          <OptionRow
            role="radio"
            indicator="radio"
            selected={tubOnly}
            onClick={() => setTubOnly(true)}
            title="Tub only"
            note={`Save ${money(s.tubOnly.save)}`}
            aside={priceLabel(s.tubOnly)}
          />
        )}
      </div>

      {/* Warranty + add-ons */}
      <div className="flex flex-col gap-[10px]">
        <h2 className="text-h5 text-odin-grey">Protect your purchase</h2>
        <OptionRow
          role="checkbox"
          indicator="radio"
          selected
          title="2-Year Warranty"
          note="Included with every Niseko"
          aside="Included"
        />
        <div className="grid grid-cols-2 gap-3 max-lg:gap-2">
          {ADDONS.filter((a) => a.id !== "filter").map((a) => (
            <OptionRow
              key={a.id}
              compact
              role="checkbox"
              indicator="check"
              selected={addons.has(a.id)}
              disabled={a.needsChiller && tubOnly}
              onClick={() => toggleAddon(a.id)}
              title={a.name}
              note={a.needsChiller && tubOnly ? "Requires the 1HP chiller" : undefined}
              aside={money(a.price)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-[10px]">
        <h2 className="text-h5 text-odin-grey">Add filters</h2>
        {ADDONS.filter((a) => a.id === "filter").map((a) => (
          <OptionRow
            key={a.id}
            role="checkbox"
            indicator="check"
            selected={addons.has(a.id)}
            disabled={tubOnly}
            onClick={() => toggleAddon(a.id)}
            title={a.name}
            note={tubOnly ? "Requires the 1HP chiller" : undefined}
            aside={money(a.price)}
          />
        ))}
      </div>

      {/* Availability */}
      <div className="flex items-center gap-[14px] rounded-[6px] border border-line bg-white px-4 py-[14px]">
        <Image src="/figma/hero/truck.svg" alt="" width={22} height={22} />
        <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
          <p className="text-label-md whitespace-nowrap text-odin-grey">Now available. Order today!</p>
          <p className="text-body text-muted">Fast delivery. Delivery times TBC</p>
          <a href="tel:1300888669" className="text-body mt-1 self-start text-[13px] text-odin-grey underline lg:hidden">
            Request a callback
          </a>
        </div>
        <a href="tel:1300888669" className="text-body whitespace-nowrap text-odin-grey hover:underline max-lg:hidden">
          Request a callback
        </a>
      </div>

      {/* CTAs */}
      <div className="flex flex-col items-center gap-[14px]">
        <div ref={setCtaEl} className="w-full">
          <Button
            className="h-14 w-full justify-between! gap-4 px-6 py-0 duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-odin-grey motion-reduce:transition-none"
            aria-label={`Add to Cart: ${PRODUCT_NAME}, ${variantName(s, tubOnly, finish)}${p.price ? `, ${money(p.price + addonTotal)}` : ""}`}
          >
            <span className="font-display text-[16px] font-medium leading-none">Add to Cart</span>
            {p.price && (
              <span className="border-l border-odin-cream/30 pl-5 font-display text-[20px] font-medium leading-none tabular-nums text-odin-cream">
                {money(p.price + addonTotal)}
              </span>
            )}
          </Button>
        </div>
        <p className="text-body flex flex-wrap items-center justify-center gap-[6px] text-center text-muted">
          <span>4 interest-free payments with</span>
          <AfterpayMark height={15} />
        </p>
        {/* Afterpay is named in the line above, so it's not repeated here. */}
        <PaymentMarks tone="muted" omit={["Afterpay"]} />
        {/* Three columns on one line, phones included (smaller type there so the columns fit). */}
        <div className="flex w-full items-start rounded-[6px] bg-warm-off-white px-2 py-4 max-lg:px-1 max-lg:py-3">
          {USPS.map((u, i) => (
            <div key={u.icon} className="contents">
              {i > 0 && <div className="h-14 w-px shrink-0 self-center bg-line" />}
              <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 text-center">
                <UspIcon name={u.icon} size={30} />
                <p className="text-h5 text-odin-grey max-lg:text-[13px] max-lg:leading-[1.3]">
                  {u.title[0]}
                  <br /> {u.title[1]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TechnicalDetails />
    </div>
  );
}
