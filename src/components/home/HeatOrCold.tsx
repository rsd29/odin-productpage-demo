import Image from "next/image";
import { NISEKO_HREF } from "../product/nav";
import { SIZES, money, type Pricing } from "../product/data";
import { CampaignBadge } from "../ui/CampaignBadge";
import { ButtonLink } from "../ui/Button";
import { Container } from "../ui/Container";
import { FramedImage, type Frame } from "../ui/FramedImage";
import { SwipeRow } from "../ui/SwipeRow";

type Tile = {
  eyebrow: string;
  name: string;
  promise: string;
  /** Black Friday "from" pricing: sale price, original price and saving. */
  pricing: Pricing;
  cta: string;
  href?: string;
  /** Shown over the warm gradient (so a cut-out sits on it). */
  img?: string;
  /** Crop for the image: focus point, zoom and source ratio (width ÷ height). Default: centred cover. */
  frame?: Frame & { ratio?: number };
};

// The homepage range: Glow+ Infrared Indoor Sauna, PureLight Outdoor Sauna and the Niseko Ice Bath.
// Glow+ and PureLight Black Friday prices are from masseusehealth.co (PureLight is listed there as an indoor
// model); the Niseko's come from the product data, so they always match its product page.
const TILES: Tile[] = [
  {
    eyebrow: "INFRARED INDOOR SAUNA",
    name: "Glow+",
    promise: "Heat that helps you recover.",
    pricing: { price: 3877, compareAt: 5995, save: 2118, discountPct: 35 },
    cta: "Shop Glow+",
    img: "/figma/home/glow-plus.webp",
    frame: { ratio: 2200 / 1800, x: 0.5, y: 0.45 },
  },
  {
    eyebrow: "OUTDOOR SAUNA",
    name: "PureLight",
    promise: "Full-spectrum heat, built for outdoors.",
    pricing: { price: 6877, compareAt: 9995, save: 3118, discountPct: 31 },
    cta: "Shop PureLight",
    // Cut-out on transparent: centred on the sauna, which then fills ~85% of the card's height.
    img: "/figma/home/purelight.webp",
    frame: { ratio: 3000 / 2400, x: 0.525, y: 0.49 },
  },
  {
    eyebrow: "ICE BATH",
    name: "Niseko Ice Bath",
    promise: "Cold on tap. Down to 3°C.",
    pricing: SIZES.solo.withChiller,
    cta: "Shop Niseko",
    href: NISEKO_HREF,
    img: "/figma/home/niseko.webp",
  },
];

/** "From" sale price, struck-through original and the campaign badge, as in the product page buy box. */
function PriceLine({ p }: { p: Pricing }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-2 pt-1">
      <span className="text-h4 text-odin-grey">
        <span className="text-body mr-1 text-muted">From</span>
        {p.price ? money(p.price) : "Price TBC"}
      </span>
      {p.compareAt && <s className="text-price text-muted decoration-[1.5px]">{money(p.compareAt)}</s>}
      <CampaignBadge campaign={`Save ${money(p.save)}`} discount={p.discountPct ? `−${p.discountPct}%` : undefined} />
    </div>
  );
}

function Card({ t }: { t: Tile }) {
  return (
    <article className="flex w-full flex-col overflow-hidden rounded-[8px] bg-warm-off-white">
      <div className="relative h-[400px] w-full bg-gradient-to-b from-[#e8e0d4] to-[#ccc4b5] max-lg:h-[300px]">
        {t.img &&
          (t.frame ? (
            <FramedImage src={t.img} alt={t.name} sizes="(min-width: 1024px) 420px, 290px" {...t.frame} />
          ) : (
            <Image src={t.img} alt={t.name} fill sizes="(min-width: 1024px) 420px, 290px" className="object-cover" />
          ))}
      </div>
      <div className="flex flex-col gap-[10px] p-7 max-lg:p-6">
        <p className="text-label-sm text-muted">{t.eyebrow}</p>
        <h3 className="text-h2 text-odin-grey">{t.name}</h3>
        <p className="text-body text-olive-grey">{t.promise}</p>
        <PriceLine p={t.pricing} />
        <div className="flex flex-wrap items-center gap-5 pt-[10px]">
          <ButtonLink href={t.href ?? "#"}>{t.cta}</ButtonLink>
        </div>
      </div>
    </article>
  );
}

export function HeatOrCold() {
  return (
    <section id="range" className="scroll-mt-16 bg-odin-cream py-16 max-lg:py-10">
      <Container className="flex flex-col gap-10 max-lg:gap-5">
        <h2 className="text-h2 text-odin-grey">Choose your heat or your cold</h2>
        <SwipeRow
          label="Saunas and ice baths"
          gap="gap-6 max-lg:gap-3"
          itemClassName="max-lg:w-[290px]"
          dots
          items={TILES.map((t) => ({ key: t.name, node: <Card t={t} /> }))}
        />
      </Container>
    </section>
  );
}
