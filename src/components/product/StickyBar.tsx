"use client";

import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { CampaignBadge } from "../ui/CampaignBadge";
import { LiquidGlass } from "../ui/LiquidGlass";
import { PRODUCT_NAME, SIZES, money, priceLabel, pricingFor, variantName } from "./data";
import { useProduct } from "./ProductContext";

/** Bar geometry — exported so pinned layouts (e.g. the gallery) can leave room for it. */
export const STICKY_BAR = { height: 52, bottom: 16 };
const EASE = "duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

/** Floating buy bar, shown after the main CTA and hidden when its bottom edge reaches the footer. */
export function StickyBar() {
  const { size, finish, tubOnly, ctaEl, stickyBarVisible: visible, setStickyBarVisible: setVisible } = useProduct();
  const lenis = useLenis();
  const [onDark, setOnDark] = useState(false);
  const s = SIZES[size];
  const p = pricingFor(s, tubOnly);

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

  // Adaptive contrast (same as the header): go light while the glass sits over a dark section.
  useEffect(() => {
    const probe = () => {
      const y = window.innerHeight - STICKY_BAR.bottom - STICKY_BAR.height / 2;
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

  const ink = onDark ? "text-odin-cream" : "text-odin-grey";
  const sub = onDark ? "text-muted-on-dark" : "text-muted";

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
        className="relative flex w-[760px] max-w-full items-center gap-3 overflow-hidden rounded-full py-[6px] pl-6 pr-[6px] max-lg:pl-5"
        style={{ height: STICKY_BAR.height }}
      >
        <LiquidGlass radius={STICKY_BAR.height / 2} className="rounded-full" />

        <p className={`relative min-w-0 flex-1 truncate transition-colors ${EASE}`}>
          <span className={`text-h5 ${ink}`}>{PRODUCT_NAME}</span>
          {/* Phones: just the name, price and button. */}
          <span className={`text-body max-lg:hidden ${sub}`}>
            {"  ·  "}
            {variantName(s, tubOnly, finish)}
          </span>
        </p>
        <span className={`text-price relative whitespace-nowrap transition-colors ${EASE} ${ink}`}>
          {priceLabel(p)}
        </span>
        <div className="relative max-lg:hidden">
          <CampaignBadge
            campaign={`Save ${money(p.save)}`}
            discount={p.discountPct ? `−${p.discountPct}%` : undefined}
          />
        </div>
        <Button
          variant={onDark ? "inverse" : "primary"}
          className="relative h-10 shrink-0 px-6 py-0 font-display! text-[15px]! font-medium! max-lg:px-5"
          onClick={() => lenis?.scrollTo(0)}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
