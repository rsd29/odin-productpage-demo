"use client";

import { useRef, type ReactNode } from "react";
import { ScrollDots } from "./ScrollDots";

/** Classes for a phone swipe row: snapping, edge-to-edge, horizontal only (no vertical wobble or back-swipe). */
export const SWIPE_ROW =
  "max-lg:-mx-5 max-lg:snap-x max-lg:snap-mandatory max-lg:scroll-px-5 max-lg:overflow-x-auto max-lg:overflow-y-hidden max-lg:overscroll-x-contain max-lg:px-5 max-lg:[scrollbar-width:none]";

/**
 * A row of equal tiles on desktop that becomes a swipeable, snapping row on phones, bleeding to the
 * screen edge. Optional dots under the row show which tile is in view (phones only).
 */
export function SwipeRow({
  items,
  gap,
  itemClassName = "",
  dots,
  tone = "light",
  label,
}: {
  items: { key: string; node: ReactNode }[];
  /** Tailwind gap class(es), e.g. "gap-6 max-lg:gap-3". */
  gap: string;
  /** Extra classes per tile, typically the phone width, e.g. "max-lg:w-[290px]". */
  itemClassName?: string;
  dots?: boolean;
  /** Dot colour: light = on cream, dark = on dark sections. */
  tone?: "light" | "dark";
  label?: string;
}) {
  const row = useRef<HTMLUListElement>(null);
  return (
    <div className="flex flex-col gap-5">
      <ul ref={row} aria-label={label} className={`flex ${gap} ${SWIPE_ROW}`}>
        {items.map((it) => (
          <li key={it.key} className={`flex min-w-0 flex-1 max-lg:flex-none max-lg:snap-start ${itemClassName}`}>
            {it.node}
          </li>
        ))}
      </ul>
      {dots && <ScrollDots scroller={row} count={items.length} tone={tone} />}
    </div>
  );
}
