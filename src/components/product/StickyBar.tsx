"use client";

import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/Button";
import { CampaignBadge } from "../ui/CampaignBadge";
import { ADDONS, PRODUCT_NAME, SIZES, money, priceLabel, pricingFor, variantName } from "./data";
import { useProduct } from "./ProductContext";

/** Bar geometry — exported so pinned layouts (e.g. the gallery) can leave room for it. */
export const STICKY_BAR = { height: 68, bottom: 16 };
const EASE = "duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

/** Floating buy bar, shown after the main CTA and hidden when its bottom edge reaches the footer. */
export function StickyBar() {
  const { size, finish, tubOnly, addons, ctaEl, stickyBarVisible: visible, setStickyBarVisible: setVisible } = useProduct();
  const lenis = useLenis();
  const [onDark, setOnDark] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const s = SIZES[size];
  const p = pricingFor(s, tubOnly);
  const addonTotal = ADDONS.filter((a) => addons.has(a.id)).reduce((sum, a) => sum + a.price, 0);
  const price = p.price ? money(p.price + addonTotal) : priceLabel(p);
  // Add-ons aren't discounted, so they count towards the was price too.
  const wasPrice = p.price && p.compareAt ? money(p.compareAt + addonTotal) : undefined;

  useEffect(() => {
    if (!ctaEl) return;
    const footer = document.querySelector("footer");
    const updateVisibility = () => {
      const pastCta = ctaEl.getBoundingClientRect().bottom <= 0;
      const clearOfFooter = !footer || footer.getBoundingClientRect().top > window.innerHeight - STICKY_BAR.bottom;
      setVisible(pastCta && clearOfFooter);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
    // Recheck when accordions, fonts, or images move the footer without a scroll.
    const resizeObserver = new ResizeObserver(updateVisibility);
    resizeObserver.observe(document.body);
    resizeObserver.observe(ctaEl);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
      resizeObserver.disconnect();
    };
  }, [ctaEl, setVisible]);

  // Adaptive contrast: a solid grey bar on light sections, a solid cream one over dark sections.
  useEffect(() => {
    const probe = () => {
      const height = bar.current?.offsetHeight ?? STICKY_BAR.height;
      const y = window.innerHeight - STICKY_BAR.bottom - height / 2;
      setOnDark(
        Array.from(document.querySelectorAll<HTMLElement>("[data-header-theme='dark']")).some((el) => {
          const r = el.getBoundingClientRect();
          return r.top <= y && r.bottom >= y;
        }),
      );
    };
    probe();
    window.addEventListener("scroll", probe, { passive: true });
    window.addEventListener("resize", probe);
    return () => {
      window.removeEventListener("scroll", probe);
      window.removeEventListener("resize", probe);
    };
  }, []);

  // Solid fill (not glass) so it stays legible over photos and busy sections.
  const fill = onDark ? "bg-odin-cream" : "bg-odin-grey";
  const ink = onDark ? "text-odin-grey" : "text-odin-cream";
  const sub = onDark ? "text-muted" : "text-muted-on-dark";

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      // Enters by sliding up and fading in; leaves by fading out in place. When hidden, the drop back down
      // to the start position is delayed until the fade has finished (and takes no time), so it's never seen.
      className={`fixed inset-x-0 z-30 flex justify-center px-5 transition-[translate,opacity] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
        visible
          ? "translate-y-0 opacity-100 [transition-delay:0ms,0ms] [transition-duration:500ms,500ms]"
          : "pointer-events-none translate-y-6 opacity-0 [transition-delay:500ms,0ms] [transition-duration:0ms,500ms]"
      }`}
      style={{ bottom: STICKY_BAR.bottom }}
    >
      <div
        ref={bar}
        className={`relative flex w-[760px] max-w-full items-center gap-3 overflow-hidden rounded-full py-2.5 pl-6 pr-2.5 shadow-[0_12px_32px_rgba(0,0,0,0.25)] transition-colors max-lg:h-[60px]! max-lg:py-2 max-lg:pl-5 max-lg:pr-2 ${EASE} ${fill}`}
        style={{ height: STICKY_BAR.height }}
      >

        {/* Desktop: name · variant, then the price. */}
        <p className={`relative min-w-0 flex-1 truncate transition-colors max-lg:hidden ${EASE}`}>
          <span className={`text-h5 ${ink}`}>{PRODUCT_NAME}</span>
          <span className={`text-body ${sub}`}>
            {"  ·  "}
            {variantName(s, tubOnly, finish)}
          </span>
        </p>
        <span className={`relative whitespace-nowrap font-display text-[24px] font-medium tabular-nums transition-colors max-lg:hidden ${EASE} ${ink}`}>
          {price}
        </span>
        {/* Phones: name on top, sale price and struck-through was price underneath. */}
        <div className={`relative flex min-w-0 flex-1 flex-col gap-[2px] transition-colors lg:hidden ${EASE}`}>
          <span className={`text-h5 truncate leading-[1.2] ${ink}`}>{PRODUCT_NAME}</span>
          <span className="flex items-baseline gap-2 whitespace-nowrap font-display font-medium leading-[1.2] tabular-nums">
            <span className={`text-[17px] ${ink}`}>{price}</span>
            {wasPrice && <s className={`text-[14px] decoration-[1.5px] ${sub}`}>{wasPrice}</s>}
          </span>
        </div>
        <div className="relative max-lg:hidden">
          <CampaignBadge
            campaign={`Save ${money(p.save)}`}
            discount={p.discountPct ? `−${p.discountPct}%` : undefined}
          />
        </div>
        <Button
          variant={onDark ? "primary" : "inverse"}
          className="relative h-12 shrink-0 px-6 py-0 font-display! text-[15px]! font-medium! max-lg:h-11 max-lg:px-4"
          onClick={() => lenis?.scrollTo(0)}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
