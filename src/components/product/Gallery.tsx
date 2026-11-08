"use client";

import Lenis from "lenis";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { FramedImage, type Frame } from "../ui/FramedImage";
import { useProduct } from "./ProductContext";
import { STICKY_BAR } from "./StickyBar";

const IMAGES = Array.from(
  { length: 15 },
  (_, i) => `/products/niseko/${i + 1}.webp`,
);
/** Main image width (712 column − 88 thumbs − 12 gap). */
const MAIN = 612;
/** Per-image framing (index → focus/zoom); unlisted images are centred square photos shown whole. */
const FRAME: Record<number, Frame & { ratio?: number }> = {
  0: { x: 0.49, y: 0.52, zoom: 1.1 },
  10: { ratio: 1.5, x: 0.45 },
};

/** Pinned below the compact header (45) + gap. */
const TOP = 45 + 24;
const BOTTOM_GAP = 24;
/** Room to leave above the floating bottom buy bar when it's showing. */
const BOTTOM_WITH_BAR = STICKY_BAR.bottom + STICKY_BAR.height + 16;

const Chevron = ({ up }: { up?: boolean }) => (
  <svg
    aria-hidden="true"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    className={up ? "rotate-180" : ""}
  >
    <path
      d="m3.5 5.25 3.5 3.5 3.5-3.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function Gallery() {
  const [active, setActive] = useState(0);
  // The image being crossfaded out, kept underneath until the new one has faded in.
  const [prev, setPrev] = useState<number | null>(null);
  const [ready, setReady] = useState(true);
  const [edges, setEdges] = useState({ start: false, end: true, v: true });
  const rail = useRef<HTMLDivElement>(null);
  const railInner = useRef<HTMLDivElement>(null);
  /** Smooth (lerped) wheel scrolling for the vertical rail, matching the page's Lenis feel. */
  const railLenis = useRef<Lenis | null>(null);
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);
  const { stickyBarVisible } = useProduct();
  const top = TOP;
  const bottom = stickyBarVisible ? BOTTOM_WITH_BAR : BOTTOM_GAP;

  const select = (i: number) => {
    const next = (i + IMAGES.length) % IMAGES.length;
    if (next === active) return;
    setPrev(active);
    setReady(false);
    setActive(next);
  };

  /** The rail is vertical beside the image on wide screens and horizontal underneath it on narrower ones. */
  const vertical = () => {
    const inner = railInner.current;
    return !!inner && getComputedStyle(inner).flexDirection === "column";
  };

  const measure = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const v =
      !!railInner.current &&
      getComputedStyle(railInner.current).flexDirection === "column";
    const pos = v ? el.scrollTop : el.scrollLeft;
    const max = v
      ? el.scrollHeight - el.clientHeight
      : el.scrollWidth - el.clientWidth;
    setEdges({ start: pos > 2, end: pos < max - 2, v });
  }, []);

  useEffect(() => {
    measure();
    const el = rail.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  // Desktop rail: its own Lenis instance, so the wheel glides with the same lerp as the page instead of
  // stepping natively. At either end it overscrolls, handing the wheel back to the page.
  useEffect(() => {
    const wrapper = rail.current;
    const content = railInner.current;
    if (!wrapper || !content) return;
    const wide = window.matchMedia("(min-width: 80rem)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const setup = () => {
      railLenis.current?.destroy();
      railLenis.current =
        wide.matches && !reduce.matches
          ? new Lenis({
              wrapper,
              content,
              lerp: 0.1,
              wheelMultiplier: 0.9,
              overscroll: true,
              autoRaf: true,
            })
          : null;
    };
    setup();
    wide.addEventListener("change", setup);
    return () => {
      wide.removeEventListener("change", setup);
      railLenis.current?.destroy();
      railLenis.current = null;
    };
  }, []);

  // Keep the selected thumbnail in view inside the rail (without scrolling the page).
  useEffect(() => {
    const el = rail.current;
    const t = thumbs.current[active];
    if (!el || !t) return;
    const v = vertical();
    const start = v ? t.offsetTop : t.offsetLeft;
    const size = v ? t.offsetHeight : t.offsetWidth;
    const view = v ? el.clientHeight : el.clientWidth;
    const pos = v ? el.scrollTop : el.scrollLeft;
    const pad = 24;
    let to: number | null = null;
    if (start - pad < pos) to = start - pad;
    else if (start + size + pad > pos + view) to = start + size + pad - view;
    if (to === null) return;
    if (v && railLenis.current) railLenis.current.scrollTo(to);
    else el.scrollTo({ [v ? "top" : "left"]: to, behavior: "smooth" });
  }, [active]);

  /** Page the rail by roughly three thumbnails. */
  const page = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const v = vertical();
    const step = (v ? el.clientHeight : el.clientWidth) * 0.75;
    const l = railLenis.current;
    if (v && l) l.scrollTo(l.targetScroll + dir * step);
    else el.scrollBy({ [v ? "top" : "left"]: dir * step, behavior: "smooth" });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const back = e.key === "ArrowUp" || e.key === "ArrowLeft";
    const fwd = e.key === "ArrowDown" || e.key === "ArrowRight";
    if (!back && !fwd) return;
    e.preventDefault();
    const next = (active + (fwd ? 1 : -1) + IMAGES.length) % IMAGES.length;
    select(next);
    thumbs.current[next]?.focus({ preventScroll: true });
  };

  // Fades at the rail's ends show there's more to scroll to.
  const fade = (dir: "bottom" | "right") =>
    `linear-gradient(to ${dir}, ${edges.start ? "transparent, #000 48px" : "#000, #000"}, ${
      edges.end ? "#000 calc(100% - 48px), transparent" : "#000"
    })`;

  return (
    // Pinned beside the buy box until the hero section ends.
    <div
      // Phones: not pinned; full-width image with the thumbnails in a row underneath.
      className="sticky flex w-[712px] shrink-0 gap-3 self-start transition-[top] duration-300 max-xl:w-auto max-xl:min-w-0 max-xl:flex-1 max-xl:flex-col-reverse max-lg:static max-lg:w-full max-lg:self-stretch"
      style={{ top }}
    >
      {/* Thumbnail carousel: every image, scrollable (wheel, swipe, buttons or arrow keys) and selectable. */}
      <div className="group/rail relative w-[88px] shrink-0 max-xl:w-full">
        <div
          ref={rail}
          role="listbox"
          aria-label="Product images"
          aria-orientation={edges.v ? "vertical" : "horizontal"}
          onScroll={measure}
          onKeyDown={onKeyDown}
          // Desktop: smooth Lenis scrolling (no snapping, which made the wheel jerky). Narrower: a native
          // horizontal swipe row that snaps to each thumbnail.
          className="absolute inset-0 overflow-y-auto [scrollbar-width:none] max-xl:static max-xl:snap-x max-xl:snap-mandatory max-xl:overflow-x-auto max-xl:overflow-y-hidden max-lg:-mx-5 max-lg:scroll-px-5"
          style={{
            maskImage: `var(--rail-mask)`,
            WebkitMaskImage: `var(--rail-mask)`,
            ["--rail-mask" as string]: fade(edges.v ? "bottom" : "right"),
          }}
        >
          <div
            ref={railInner}
            className="flex flex-col gap-[10px] max-xl:w-max max-xl:flex-row max-xl:gap-2 max-lg:px-5"
          >
            {IMAGES.map((src, i) => {
              const on = active === i;
              return (
                <button
                  key={src}
                  ref={(el) => {
                    thumbs.current[i] = el;
                  }}
                  type="button"
                  role="option"
                  aria-selected={on}
                  aria-label={`Image ${i + 1} of ${IMAGES.length}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => select(i)}
                  className="relative size-[88px] shrink-0 cursor-pointer snap-start overflow-hidden rounded-[6px] bg-warm-off-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-odin-grey max-xl:size-[72px] max-lg:size-[64px]"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="88px"
                    className={`object-cover transition-opacity duration-300 ease-out ${on ? "opacity-100" : "opacity-70 hover:opacity-100"}`}
                  />
                  <span
                    aria-hidden
                    className={`absolute inset-0 rounded-[6px] border-2 transition-colors duration-300 ${on ? "border-odin-grey" : "border-transparent"}`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Up / down buttons on the vertical rail, shown when there's more in that direction. */}
        {(["up", "down"] as const).map((d) => {
          const show = d === "up" ? edges.start : edges.end;
          return (
            <button
              key={d}
              type="button"
              tabIndex={-1}
              aria-hidden
              onClick={() => page(d === "up" ? -1 : 1)}
              className={`absolute left-1/2 z-10 flex size-7 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full bg-odin-cream/90 text-odin-grey shadow-[0_2px_8px_rgba(0,0,0,0.12)] backdrop-blur-[6px] transition-opacity duration-200 max-xl:hidden ${
                d === "up" ? "top-1" : "bottom-1"
              } ${show ? "opacity-0 group-hover/rail:opacity-100" : "pointer-events-none opacity-0"}`}
            >
              <Chevron up={d === "up"} />
            </button>
          );
        })}
      </div>

      <div
        className="relative min-w-0 flex-1 overflow-hidden rounded-[8px] bg-warm-off-white transition-[height] duration-300 max-xl:aspect-square max-xl:h-auto! max-xl:w-full max-xl:flex-none"
        // Square, like the photos, so nothing is cropped off the sides; shrinks only if the viewport can't fit it while pinned.
        style={{ height: `min(${MAIN}px, calc(100dvh - ${top + bottom}px))` }}
      >
        {/* Crossfade: the outgoing image stays underneath until the incoming one has loaded and faded in. */}
        {prev !== null && (
          <div key={`prev-${prev}`} className="absolute inset-0">
            <FramedImage
              src={IMAGES[prev]}
              alt=""
              sizes="720px"
              {...FRAME[prev]}
            />
          </div>
        )}
        <div
          key={active}
          className={`absolute inset-0 ${ready ? "animate-gallery-in motion-reduce:animate-none" : "opacity-0"}`}
          onAnimationEnd={() => setPrev(null)}
        >
          <FramedImage
            src={IMAGES[active]}
            alt={`Niseko Ice Bath, image ${active + 1} of ${IMAGES.length}`}
            priority={active === 0}
            sizes="720px"
            onLoad={() => {
              setReady(true);
              // No fade with reduced motion, so drop the outgoing layer straight away.
              if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
                setPrev(null);
            }}
            {...FRAME[active]}
          />
        </div>
      </div>
    </div>
  );
}
