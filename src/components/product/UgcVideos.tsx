"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Container } from "../ui/Container";
import { ScrollDots } from "../ui/ScrollDots";
import { SWIPE_ROW } from "../ui/SwipeRow";

type Video = {
  name: string;
  role: string;
  /** Self-hosted, web-optimised MP4 (fast-start H.264, ≤ 720p) in /public/videos. No file = "coming soon". */
  src?: string;
  /** Still shown before playback (and the whole tile when there's no video yet). */
  poster: string;
  /** Focus point for the poster crop, e.g. "48% 50%". */
  focus?: string;
};

const V = "/videos";
const VIDEOS: Video[] = [
  { name: "Dana White", role: "UFC CEO", src: `${V}/dana-white.mp4`, poster: `${V}/posters/dana-white.jpg` },
  { name: "Chris Hemsworth", role: "Actor · Thor", src: `${V}/chris-hemsworth.mp4`, poster: `${V}/posters/chris-hemsworth.jpg` },
  // Video to come (Drive: 1TWzNTbzq4s0109mRU49JKdC9ampw7jRA); the photo stands in until then.
  { name: "Lewis Hamilton", role: "7-time F1 world champion", poster: `${V}/posters/lewis-hamilton.jpg`, focus: "48% 50%" },
  { name: "Kamaru Usman", role: "UFC welterweight champion", src: `${V}/kamaru-usman.mp4`, poster: `${V}/posters/kamaru-usman.jpg` },
  { name: "Patrick Cripps", role: "2-time Brownlow medallist", src: `${V}/patrick-cripps.mp4`, poster: `${V}/posters/patrick-cripps.jpg` },
  { name: "Mark Wahlberg", role: "Actor & producer", poster: "" }, // video to come
];

const canHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function PlayIcon() {
  return <Image src="/figma/ugc/play.svg" alt="" width={16} height={16} />;
}
function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <rect x="3.5" y="2.5" width="3" height="11" rx="1" fill="white" />
      <rect x="9.5" y="2.5" width="3" height="11" rx="1" fill="white" />
    </svg>
  );
}
function SoundIcon({ muted }: { muted: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M2.5 6h2.5l3.5-3v10L5 10H2.5z" fill="white" />
      {muted ? (
        <path d="M11 6l3.5 4m0-4L11 10" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      ) : (
        <path d="M11 5.5a3.5 3.5 0 010 5M12.75 3.75a6 6 0 010 8.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      )}
    </svg>
  );
}

/**
 * One story, played in its own tile. Desktop hover runs a muted, looping preview; a click (or tap on
 * phones) carries on from that frame with sound, a pause/play toggle and a progress bar. Only one story
 * plays with sound at a time, and a playing story pauses once it's scrolled out of view.
 */
function StoryCard({ video: v, active, onActivate }: { video: Video; active: boolean; onActivate: (on: boolean) => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [state, setState] = useState<"idle" | "preview" | "playing" | "paused">("idle");
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.pause();
    el.muted = true;
    el.loop = true;
    el.currentTime = 0;
    setState("idle");
    setLoading(false);
  };

  // Another story took over: go quiet and rewind.
  useEffect(() => {
    if (!active && (state === "playing" || state === "paused")) reset();
  }, [active, state]);

  // Pause when scrolled out of view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting && !el.paused) {
        el.pause();
        setState((s) => (s === "playing" ? "paused" : s === "preview" ? "idle" : s));
      }
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Progress bar driven per frame (smoother than timeupdate's ~4 Hz) while playing with sound.
  useEffect(() => {
    if (state !== "playing") return;
    let raf = 0;
    const tick = () => {
      const el = ref.current;
      if (el && bar.current && el.duration) bar.current.style.transform = `scaleX(${el.currentTime / el.duration})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state]);

  if (!v.src) {
    return (
      <div className="flex w-full flex-col">
        <div className="relative h-[432px] w-full overflow-hidden rounded-[8px] bg-[linear-gradient(119.38deg,#47453e_8.33%,#2b2a2a_91.67%)] max-lg:h-[400px]">
          {v.poster && (
            <Image src={v.poster} alt="" fill sizes="(min-width: 1024px) 280px, 240px" className="object-cover" style={{ objectPosition: v.focus }} />
          )}
          <span className="text-label-sm absolute right-[14px] top-[14px] rounded-[4px] bg-[rgba(31,31,31,0.55)] px-2 py-1 text-odin-cream">
            VIDEO COMING SOON
          </span>
        </div>
        <Caption v={v} />
      </div>
    );
  }

  const enter = () => {
    const el = ref.current;
    if (!el || state !== "idle" || !canHover() || reducedMotion()) return;
    el.muted = true;
    el.loop = true;
    setState("preview");
    el.play().catch(() => setState("idle"));
  };
  const leave = () => {
    if (state === "preview") reset();
  };
  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (state === "playing") {
      el.pause();
      setState("paused");
      return;
    }
    onActivate(true);
    el.muted = muted;
    el.loop = false;
    setState("playing");
    el.play().catch(() => setState("paused"));
  };
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = ref.current;
    if (!el) return;
    el.muted = !muted;
    setMuted(!muted);
  };

  const withSound = state === "playing" || state === "paused";
  return (
    <div className="flex w-full flex-col">
      <div
        onMouseEnter={enter}
        onMouseLeave={leave}
        className="group relative h-[432px] w-full overflow-hidden rounded-[8px] bg-[#2b2a2a] max-lg:h-[400px]"
      >
        <video
          ref={ref}
          src={v.src}
          poster={v.poster}
          muted
          loop
          playsInline
          preload="metadata"
          onWaiting={() => setLoading(true)}
          onPlaying={() => setLoading(false)}
          onEnded={() => {
            reset();
            onActivate(false);
          }}
          className={`absolute inset-0 size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
            state === "preview" ? "scale-[1.03]" : "scale-100"
          }`}
        />
        {/* Soft shade at the bottom so the controls read over any frame; lifts while playing. */}
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent transition-opacity duration-500 ${
            state === "playing" ? "opacity-0" : "opacity-100"
          }`}
        />
        {/* The whole tile is the play / pause control. */}
        <button
          type="button"
          onClick={toggle}
          aria-label={state === "playing" ? `Pause ${v.name}'s story` : `Play ${v.name}'s story`}
          className="absolute inset-0 cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-odin-cream"
        >
          <span
            className={`absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/[0.22] backdrop-blur-[6px] transition-[opacity,scale] duration-300 ${
              state === "playing"
                ? "scale-100 opacity-0 group-hover:opacity-100" // pause control appears on hover
                : state === "preview"
                  ? "scale-90 opacity-0"
                  : "scale-100 pl-[2px] opacity-100 group-hover:scale-105"
            }`}
          >
            {state === "playing" ? <PauseIcon /> : <PlayIcon />}
          </span>
          {loading && withSound && (
            <span className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          )}
        </button>
        {withSound && (
          <>
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="absolute right-[12px] top-[12px] flex size-9 cursor-pointer items-center justify-center rounded-full bg-[rgba(31,31,31,0.55)] backdrop-blur-[6px] animate-fade-in"
            >
              <SoundIcon muted={muted} />
            </button>
            <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-white/20">
              <span ref={bar} className="block h-full origin-left scale-x-0 bg-odin-cream" />
            </span>
          </>
        )}
      </div>
      <Caption v={v} />
    </div>
  );
}

function Caption({ v }: { v: Video }) {
  return (
    <div className="flex min-h-[73px] flex-col gap-1 pt-5">
      <p className="text-h4 text-odin-cream">{v.name}</p>
      <p className="font-sans text-[12px] font-light leading-[1.5] text-muted-on-dark">{v.role}</p>
    </div>
  );
}

/** Desktop: snap scrolling without a visible scrollbar (phones get the same from SWIPE_ROW). */
const DESKTOP_ROW = "lg:snap-x lg:snap-mandatory lg:overflow-x-auto lg:overflow-y-hidden lg:overscroll-x-contain lg:[scrollbar-width:none]";

function Chevron({ dir }: { dir: -1 | 1 }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className={dir < 0 ? "rotate-180" : ""}>
      <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** `product` names what the stories are about in the intro line (the Niseko on its page, Glow+ on the homepage). */
export function UgcVideos({ product = "the Niseko" }: { product?: string }) {
  const row = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  // The one story playing with sound (starting another quiets it).
  const [active, setActive] = useState<string | null>(null);

  // Disable each arrow once the row reaches that end.
  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const update = () => {
      setAtStart(el.scrollLeft <= 1);
      setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 1);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  // One card per click (card width + the 16px gap); snapping settles it on a card edge.
  const step = (dir: -1 | 1) => {
    const el = row.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * (card.offsetWidth + 16), behavior: reduce ? "auto" : "smooth" });
  };

  const arrow = "flex size-11 cursor-pointer items-center justify-center rounded-full border border-odin-cream/30 text-odin-cream transition-[background-color,opacity] hover:bg-odin-cream/10 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <section data-header-theme="dark" className="bg-odin-grey py-16 max-lg:py-10">
      <Container className="flex flex-col gap-12 max-lg:gap-8">
        <div className="flex items-end gap-6 max-lg:flex-col max-lg:items-start max-lg:gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <h2 className="text-h2 text-odin-cream">
              Real Routines,{" "}
              <span className="max-lg:block">Real Recovery</span>
            </h2>
            <p className="text-body text-muted-on-dark">
              How athletes and everyday recoverers fit {product} into their week.
            </p>
          </div>
          {/* Desktop: step through the stories. Phones swipe, with dots below. */}
          <div className="flex shrink-0 gap-3 max-lg:hidden">
            <button type="button" aria-label="Previous stories" disabled={atStart} onClick={() => step(-1)} className={arrow}>
              <Chevron dir={-1} />
            </button>
            <button type="button" aria-label="Next stories" disabled={atEnd} onClick={() => step(1)} className={arrow}>
              <Chevron dir={1} />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          {/* Desktop shows four and a half cards, so the cut-off one signals there's more. */}
          <ul ref={row} aria-label="Customer stories" className={`flex gap-4 ${SWIPE_ROW} ${DESKTOP_ROW}`}>
            {VIDEOS.map((v) => (
              <li key={v.name} className="flex w-[calc((100%-4*16px)/4.5)] shrink-0 snap-start max-lg:w-[240px]">
                <StoryCard
                  video={v}
                  active={active === v.name}
                  onActivate={(on) => setActive((cur) => (on ? v.name : cur === v.name ? null : cur))}
                />
              </li>
            ))}
          </ul>
          <ScrollDots scroller={row} count={VIDEOS.length} tone="dark" />
        </div>
      </Container>
    </section>
  );
}
