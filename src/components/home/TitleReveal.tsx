"use client";

import { useLayoutEffect } from "react";

/**
 * Fades the page's main titles in (opacity only, no movement) as each scrolls into view. Renders nothing:
 * it tags the matching headings and lets CSS do the fade ([data-reveal] in globals.css).
 *
 * Titles already on screen when the page loads are left alone, so nothing flickers; reduced motion skips
 * it entirely. Runs before paint (layout effect), so tagged titles never show and then disappear.
 */
export function TitleReveal({ selector = "main h2" }: { selector?: string }) {
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-revealed", "");
          io.unobserve(e.target);
        }
      },
      // Start the fade once a title is a little way up the screen, not the instant it peeks in.
      { rootMargin: "0px 0px -10% 0px" },
    );
    for (const el of document.querySelectorAll<HTMLElement>(selector)) {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) continue;
      el.setAttribute("data-reveal", "");
      io.observe(el);
    }
    return () => io.disconnect();
  }, [selector]);

  return null;
}
