import Image from "next/image";
import { Container } from "../ui/Container";
import type { Menu, MenuProduct } from "./nav";

const LINK =
  "rounded-sm transition-opacity duration-150 ease-out hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-odin-grey motion-reduce:transition-none";

export const Arrow = ({ className = "" }: { className?: string }) => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" className={`shrink-0 ${className}`}>
    <path d="M2.5 7h9M8 3.5 11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Price, struck-through original and discount pill — or the card's call to action. */
export function PriceLine({ p }: { p: MenuProduct }) {
  if (!p.price)
    return (
      <span className="text-label-md flex items-center gap-1 text-odin-grey">
        {p.cta ?? "View"}
        <Arrow />
      </span>
    );
  return (
    <span className="flex flex-wrap items-center gap-2">
      <span className="text-price text-odin-grey">
        {p.from && <span className="text-body mr-1 text-muted">From</span>}
        {p.price}
      </span>
      {p.was && <s className="text-price text-muted">{p.was}</s>}
      {p.off && (
        // Hovering (or focusing) the product card grows the chip outward to reveal "BLACK FRIDAY" before
        // the discount. The label animates its grid column from 0 to its natural width.
        <span className="inline-flex items-center rounded-[4px] bg-odin-grey px-[6px] py-[2px] font-display text-[11px] font-medium text-odin-cream">
          <span className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/item:grid-cols-[1fr] group-focus-visible/item:grid-cols-[1fr] motion-reduce:transition-none">
            <span className="overflow-hidden whitespace-nowrap">
              <span className="inline-block -translate-x-1 pr-[5px] tracking-[0.06em] opacity-0 transition-[opacity,translate] duration-300 ease-out group-hover/item:translate-x-0 group-hover/item:opacity-100 group-hover/item:delay-100 group-focus-visible/item:translate-x-0 group-focus-visible/item:opacity-100 motion-reduce:transition-none">
                BLACK FRIDAY
              </span>
            </span>
          </span>
          {p.off}
        </span>
      )}
    </span>
  );
}

function ProductCard({ p }: { p: MenuProduct }) {
  return (
    <a href={p.href ?? "#"} className="group/item flex min-w-0 flex-col gap-4 rounded-[8px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-odin-grey">
      <span className="relative block aspect-[4/3] overflow-hidden rounded-[8px] bg-warm-off-white">
        <Image
          src={p.img}
          alt=""
          fill
          sizes="320px"
          style={p.focus ? { objectPosition: p.focus } : undefined}
          className="object-cover transition-transform duration-700 ease-out group-hover/item:scale-[1.04] motion-reduce:transition-none"
        />
      </span>
      <span className="flex flex-col gap-[6px]">
        <span className="text-h5 text-odin-grey">{p.name}</span>
        <span className="font-sans text-[13px] font-light leading-[1.4] text-muted">{p.tagline}</span>
        <span className="pt-1">
          <PriceLine p={p} />
        </span>
      </span>
    </a>
  );
}

/** Desktop mega-menu panel: up to three product cards and a "shop all" panel. */
export function MegaMenuPanel({ menu }: { menu: Menu }) {
  return (
    <Container className="grid grid-cols-4 gap-6 py-10">
      {menu.products.map((p) => (
        <ProductCard key={p.name} p={p} />
      ))}

      <div className="col-start-4 flex flex-col justify-between gap-6 rounded-[8px] bg-warm-off-white p-6">
        <div className="flex flex-col gap-3">
          <p className="text-eyebrow text-muted">{menu.all.eyebrow}</p>
          <p className="text-h4 text-odin-grey">{menu.all.title}</p>
        </div>
        <div className="flex flex-col gap-3">
          {menu.all.links.map((l) => (
            <a key={l.label} href={l.href ?? "#"} className={`text-label-md flex items-center gap-2 text-odin-grey ${LINK}`}>
              {l.label}
              <Arrow />
            </a>
          ))}
        </div>
      </div>
    </Container>
  );
}
