"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/** Height of the compact sticky header, so anchor targets land just below it. */
const HEADER_OFFSET = 45;

/**
 * Site-wide lerp-based smooth scrolling.
 * Lenis honours `prefers-reduced-motion` by default (lerp forced to 1).
 * Add `data-lenis-prevent` to any element that should keep native nested scrolling.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        // Lower lerp = silkier glide; higher wheelMultiplier = each notch travels further, so it still feels quick.
        lerp: 0.095,
        wheelMultiplier: 1.2,
        anchors: { offset: -HEADER_OFFSET },
        stopInertiaOnNavigate: true,
        // Let nested scrollers (e.g. the gallery's thumbnail rail) take the wheel until they reach an end.
        allowNestedScroll: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
