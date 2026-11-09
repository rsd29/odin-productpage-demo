"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Dots under a horizontal swipe row showing which item is in view (phones only, by default).
 * The active item is read from the scroll position, so it follows the user's swipe exactly.
 */
export function ScrollDots({
  scroller,
  count,
  tone = "light",
  className = "lg:hidden",
}: {
  scroller: RefObject<HTMLElement | null>;
  count: number;
  /** light = on cream/white, dark = on dark sections. */
  tone?: "light" | "dark";
  className?: string;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setActive(max > 0 ? Math.round((el.scrollLeft / max) * (count - 1)) : 0);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [scroller, count]);

  const dot = tone === "dark" ? "bg-odin-cream" : "bg-odin-grey";
  return (
    <div aria-hidden className={`flex items-center justify-center gap-[6px] ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={`h-[5px] rounded-full transition-[width,opacity] duration-300 ease-out motion-reduce:transition-none ${dot} ${
            i === active ? "w-[18px]" : "w-[5px] opacity-20"
          }`}
        />
      ))}
    </div>
  );
}
