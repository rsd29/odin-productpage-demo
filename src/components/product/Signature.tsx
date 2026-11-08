"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Michael Clark's signature, "written" in when it scrolls into view: a soft-edged mask sweeps left to
 * right across the image like a pen stroke. Plays once. Reduced motion shows it straight away.
 */
export function Signature() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      // Wait until it's comfortably on screen, so the stroke is seen from the start.
      { threshold: 0.6, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The mask is 2.2× the image width: opaque for one image-width, a feathered edge 0.2 wide, then clear.
  // At 100% position the feather sits just left of the image (nothing shows); at 0% the opaque part covers
  // it exactly. Sliding between them sweeps the edge left to right across the whole signature, like ink
  // following the pen, with no dead time at either end.
  const mask = "linear-gradient(to right, #000 45.45%, transparent 54.55%)";

  return (
    <div
      ref={ref}
      className="transition-[mask-position,-webkit-mask-position] duration-[1800ms] ease-[cubic-bezier(0.45,0.05,0.35,1)] motion-reduce:transition-none motion-reduce:[mask-position:0_0]!"
      style={{
        maskImage: mask,
        WebkitMaskImage: mask,
        maskSize: "220% 100%",
        WebkitMaskSize: "220% 100%",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: shown ? "0% 0" : "100% 0",
        WebkitMaskPosition: shown ? "0% 0" : "100% 0",
      }}
    >
      <Image
        src="/figma/founder/signature.png"
        alt="Michael Clark signature"
        width={340}
        height={138}
        className="h-[138px] w-[340px] object-contain max-lg:h-auto max-lg:w-[220px]"
      />
    </div>
  );
}
