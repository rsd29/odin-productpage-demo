"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { Button } from "../ui/Button";
import { CampaignBadge } from "../ui/CampaignBadge";
import { FramedImage, type Frame } from "../ui/FramedImage";
import { AfterpayMark, PaymentMarks } from "../ui/PaymentMarks";
import { UspIcon, type UspIconName } from "../ui/UspIcon";
import {
  ADDONS,
  PRODUCT_NAME,
  SIZES,
  SIZE_ORDER,
  dims,
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

const HERO_FEATURES = [
  ["Certified Canadian red cedar", "Sustainably sourced"],
  ["Marine-grade 316 steel", "Premium stainless steel tub"],
  ["Powerful 1HP chiller", "Cools to 3°C, heats to 35°C"],
  ["23 L/min high-flow pump", "Ozone treatment and filtration"],
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
}: {
  selected: boolean;
  disabled?: boolean;
  onClick?: () => void;
  indicator: "radio" | "check";
  title: string;
  note?: string;
  aside: ReactNode;
  role: "radio" | "checkbox";
}) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={selected}
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-[6px] bg-white px-4 py-[14px] text-left ${
        selected ? "border-[1.5px] border-odin-grey" : "border border-line"
      } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-muted"}`}
    >
      <Indicator type={indicator} on={selected} />
      <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
        <span className="text-h5 text-odin-grey">{title}</span>
        {note && <span className="text-body text-muted">{note}</span>}
      </span>
      <span className="text-price whitespace-nowrap text-odin-grey">{aside}</span>
    </button>
  );
}

function SizeCard({ id }: { id: SizeId }) {
  const { size, setSize, tubOnly } = useProduct();
  const s = SIZES[id];
  const selected = size === id;
  const p = pricingFor(s, selected && tubOnly);
  const src = imageFor(s, selected && tubOnly);
  return (
    <button
      type="button"
      onClick={() => setSize(id)}
      aria-pressed={selected}
      className={`flex min-w-0 flex-1 cursor-pointer flex-col items-start gap-[6px] overflow-hidden rounded-[6px] bg-white px-[18px] py-4 text-left max-xl:w-[168px] max-xl:flex-none max-xl:snap-start ${
        selected ? "border-[1.5px] border-odin-grey" : "border border-line hover:border-muted"
      }`}
    >
      <span className="flex w-full items-center gap-2">
        <span className="text-h5 text-odin-grey">{s.name}</span>
        <span className="flex-1" />
        <span className="text-price whitespace-nowrap text-odin-grey">{priceLabel(p)}</span>
      </span>
      <span className="text-price text-muted">Save {money(p.save)}</span>
      <span className="font-sans text-[12px] font-light leading-[1.4] text-balance text-muted">{dims(s)}</span>
      {/* Full-bleed to the card edges; each cut-out is cropped in around the tub so it fills the frame. */}
      <span className="relative -mx-[18px] -mb-4 mt-1 h-[145px] w-[calc(100%+36px)] shrink-0 overflow-hidden">
        <FramedImage
          src={src}
          alt={`Niseko ${s.name}`}
          sizes="320px"
          {...VARIANT_FRAME[src]}
        />
      </span>
    </button>
  );
}

export function BuyBox() {
  const { size, finish, tubOnly, setTubOnly, addons, toggleAddon, setCompareOpen, setCtaEl } = useProduct();
  const s = SIZES[size];
  const p = pricingFor(s, tubOnly);
  const addonTotal = ADDONS.filter((a) => addons.has(a.id)).reduce((sum, a) => sum + a.price, 0);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-[22px]">
      <h1 className="text-display text-odin-grey">{PRODUCT_NAME}</h1>

      <p className="text-body text-muted">
        Push harder. Recover faster. Build resilience where others break. Niseko delivers cold-driven
        recovery for athletes and high-performers who demand more.
      </p>

      {/* Price */}
      <div className="flex flex-col gap-[6px]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-h2 text-odin-grey">{priceLabel(p)}</span>
          {p.compareAt && <s className="text-h2 text-muted decoration-[1.5px]">{money(p.compareAt)}</s>}
          <CampaignBadge
            campaign={`Save ${money(p.save)}`}
            discount={p.discountPct ? `−${p.discountPct}%` : undefined}
          />
        </div>
        <p className="text-body flex min-h-[26px] items-center gap-[6px] text-muted">
          <span>From only $39 p/w with</span>
          <Image src="/brand/humm.svg" alt="humm" width={61} height={13} className="h-[13px] w-auto shrink-0" />
        </p>
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
      {/* Narrow buy box: the three cards swipe sideways (bleeding to the screen edge on phones). */}
      <div className="flex gap-3 max-xl:snap-x max-xl:snap-mandatory max-xl:overflow-x-auto max-xl:[scrollbar-width:none] max-lg:-mx-5 max-lg:scroll-px-5 max-lg:px-5">
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
        <OptionRow
          role="radio"
          indicator="radio"
          selected={tubOnly}
          disabled={!s.tubOnly}
          onClick={() => setTubOnly(true)}
          title="Tub only"
          note={s.tubOnly ? `Save ${money(s.tubOnly.save)}` : "Available on the Solo only"}
          aside={s.tubOnly ? priceLabel(s.tubOnly) : "—"}
        />
      </div>

      {/* Hero features */}
      <div className="grid grid-cols-2 gap-3">
        {HERO_FEATURES.map(([title, body]) => (
          <div key={title} className="flex flex-col gap-[6px] rounded-[6px] bg-warm-off-white p-5 max-lg:p-4">
            <p className="text-h5 text-odin-grey lg:whitespace-nowrap">{title}</p>
            <p className="text-body text-muted">{body}</p>
          </div>
        ))}
      </div>

      {/* Warranty + add-ons */}
      <div className="flex flex-col gap-[10px]">
        <div className="flex items-center">
          <h2 className="text-h5 text-odin-grey">Protect your purchase</h2>
          <span className="flex-1" />
          <a href="#" className="text-body text-muted underline">
            What&rsquo;s covered
          </a>
        </div>
        <OptionRow
          role="checkbox"
          indicator="radio"
          selected
          title="2-Year Warranty"
          note="Included with every Niseko"
          aside="Included"
        />
        {ADDONS.filter((a) => a.id !== "filter").map((a) => (
          <OptionRow
            key={a.id}
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
          <p className="text-label-md text-odin-grey">Now available. Order today!</p>
          <p className="text-body text-muted">Fast delivery. Delivery times TBC</p>
        </div>
        <a href="tel:1300888669" className="text-body whitespace-nowrap text-odin-grey hover:underline max-lg:text-[13px]">
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
              <span className="border-l border-odin-cream/20 pl-5 font-display text-[15px] font-medium leading-5 tabular-nums text-odin-cream/75">
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
        {/* Three columns on desktop; a stacked list on phones, where three columns would be too narrow. */}
        <div className="flex w-full items-start rounded-[6px] bg-warm-off-white px-2 py-[18px] max-lg:flex-col max-lg:items-stretch max-lg:px-4 max-lg:py-1">
          {USPS.map((u, i) => (
            <div key={u.icon} className="contents">
              {i > 0 && <div className="h-12 w-px shrink-0 self-center bg-line max-lg:h-px max-lg:w-full" />}
              <div className="flex min-w-0 flex-1 flex-col items-center gap-[10px] text-center max-lg:flex-row max-lg:gap-3 max-lg:py-3 max-lg:text-left">
                <UspIcon name={u.icon} />
                <p className="text-h5 whitespace-nowrap text-odin-grey">
                  {u.title[0]}
                  <br className="max-lg:hidden" /> {u.title[1]}
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
