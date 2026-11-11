"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Container } from "../ui/Container";
import { SwipeRow } from "../ui/SwipeRow";

/** Body copy as paragraphs of plain text and `{ b: "…" }` key points, set heavier. */
type Seg = string | { b: string };
/**
 * `raw`: serve the file as supplied (already web-compressed), without Next re-encoding it.
 * `lift`: scale the photo up from its bottom edge, so the subject sits higher (top of the photo is trimmed).
 */
type Tile = { title: string; img: string; body: Seg[][]; muted?: boolean; focus?: string; raw?: boolean; lift?: number };

const MODES = ["Sauna", "Ice Bath"] as const;
type Mode = (typeof MODES)[number];

const TILES: Record<Mode, Tile[]> = {
  Sauna: [
    {
      title: "Sweat deeper, not hotter",
      img: "/figma/science/tile-1.png",
      body: [
        [{ b: "A deep, satisfying sweat" }, " without the aggressive heat."],
        ["Full-spectrum infrared you can dial from ", { b: "30°C to 70°C" }, "."],
      ],
    },
    {
      title: "Harder work sessions",
      img: "/figma/science/tile-2.png",
      body: [
        [{ b: "Built-in red light therapy" }, " adds a second layer for recovery, skin and that post-session lift."],
        [{ b: "No extra device needed." }],
      ],
    },
    {
      title: "Put the benefits on repeat",
      img: "/figma/science/tile-3.png",
      body: [
        [{ b: "Simple setup and easy controls" }, " make it a habit, not a chore."],
        ["Plus ", { b: "free delivery and a 2-year warranty." }],
      ],
    },
    {
      title: "Settle into every detail",
      img: "/images/sauna-interior.webp",
      focus: "55% center",
      // A light photo: dimmed, with a lighter panel, as in the design.
      muted: true,
      body: [["Hemlock timber, soft lighting and built-in speakers."], [{ b: "Set your heat, pick your timer, settle in." }]],
    },
  ],
  // First three photos supplied by the client for this section.
  "Ice Bath": [
    {
      title: "Clean water, zero fuss",
      img: "/images/research-ice-1.webp",
      raw: true,
      body: [
        [{ b: "Ozone filtration" }, " keeps your water purified, sanitised and self-cleaning."],
        [{ b: "Push limits, not maintenance." }],
      ],
    },
    {
      title: "Cold that gets results",
      img: "/images/research-ice-cold.webp",
      focus: "50% 100%",
      lift: 1.15,
      body: [
        ["Recover in an ", { b: "icy 3–5°C" }, ", held steady by a powerful 1HP chiller."],
        [{ b: "Or heat to 35°C" }, " to boost circulation before you train."],
      ],
    },
    {
      title: "Built for every season",
      img: "/images/research-ice-3.webp",
      raw: true,
      body: [
        [{ b: "Certified Canadian red cedar" }, " and a triple-insulated cover lock in the cold, indoors or out."],
        [{ b: "Recover hard, all year round." }],
      ],
    },
    {
      title: "Make it a ritual",
      img: "/images/ice-bath-ritual.webp",
      body: [
        [{ b: "High-flow pump and easy controls" }, " make the cold a daily habit."],
        ["Plus ", { b: "free delivery and a 2-year warranty." }],
      ],
    },
  ],
};

function TileCard({ t, i }: { t: Tile; i: number }) {
  return (
    // clip-path (not just overflow-hidden) so the blurred panel and the scaled photo, which the browser
    // draws on their own layers, are cut to the same rounded corners in every browser, Safari included.
    <article className="relative isolate flex h-[560px] w-full animate-fade-in flex-col justify-end overflow-hidden rounded-[8px] [clip-path:inset(0_round_8px)] motion-reduce:animate-none max-lg:h-[480px]">
      <Image
        src={t.img}
        alt=""
        fill
        // Tiles are tall and crop with object-cover, so a photo is drawn about as wide as the tile is tall.
        sizes="(min-width: 1024px) 560px, 480px"
        unoptimized={t.raw}
        style={{
          objectPosition: t.focus,
          ...(t.lift && { transform: `scale(${t.lift})`, transformOrigin: "50% 100%" }),
        }}
        className={`object-cover ${t.muted ? "opacity-70" : ""}`}
      />
      {/* Height comes from --panel-h (the tallest copy across both tabs), so every panel matches. */}
      <div
        className={`relative min-h-[210px] rounded-b-[8px] p-6 text-white backdrop-blur-[12px] max-lg:min-h-[182px] ${
          t.muted ? "bg-black/45" : "bg-black/70"
        }`}
        style={{ height: "var(--panel-h, auto)" }}
      >
        <div data-panel-copy className="flex flex-col gap-3">
          <h3 className="flex items-center gap-[10px]">
            <span className="text-label-sm">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-h4">{t.title}</span>
          </h3>
          <div className="text-body flex flex-col gap-[1.5em]">
            {t.body.map((para, j) => (
              <p key={j}>
                {para.map((seg, k) => (typeof seg === "string" ? seg : <strong key={k} className="font-medium">{seg.b}</strong>))}
              </p>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

/** Pill switch between the two product types. */
function Toggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div role="group" aria-label="Show research for" className="inline-flex shrink-0 rounded-full border border-white/20 p-1">
      {MODES.map((m) => {
        const on = m === mode;
        return (
          <button
            key={m}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(m)}
            className={`text-label-md cursor-pointer rounded-full px-6 py-2.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white max-lg:px-5 max-lg:py-2 ${
              on ? "bg-odin-cream text-odin-grey" : "text-white/70 hover:text-white"
            }`}
          >
            {m}
          </button>
        );
      })}
    </div>
  );
}

/** Panel padding (p-6, top and bottom), added to the measured copy height. */
const PANEL_PAD = 48;

export function Research() {
  const [mode, setMode] = useState<Mode>("Sauna");
  const rows = useRef<HTMLDivElement>(null);

  // Both tabs are rendered (the inactive one invisibly, at the same width), so the tallest copy in
  // either one sets one panel height for all eight tiles. Re-measured whenever the copy reflows.
  useEffect(() => {
    const el = rows.current;
    if (!el) return;
    const measure = () => {
      const copies = el.querySelectorAll<HTMLElement>("[data-panel-copy]");
      const tallest = Math.max(0, ...Array.from(copies, (c) => c.offsetHeight));
      el.style.setProperty("--panel-h", `${Math.ceil(tallest) + PANEL_PAD}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    el.querySelectorAll("[data-panel-copy]").forEach((c) => ro.observe(c));
    return () => ro.disconnect();
  }, [mode]);

  return (
    <section data-header-theme="dark" className="bg-ink py-16 max-lg:py-10">
      <Container className="flex flex-col gap-10 max-lg:gap-5">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <h2 className="text-h2 text-white">What The Research Says</h2>
          <Toggle mode={mode} onChange={setMode} />
        </div>
        <div ref={rows} className="relative">
          {MODES.map((m) => {
            const on = m === mode;
            return (
              <div
                // Remounts on switch, so the fade replays and the phone row starts at the first tile.
                key={`${m}-${on}`}
                aria-hidden={!on}
                inert={!on}
                className={on ? "" : "pointer-events-none invisible absolute inset-x-0 top-0"}
              >
                <SwipeRow
                  label={`What the research says: ${m.toLowerCase()}`}
                  gap="gap-2"
                  itemClassName="max-lg:w-[280px]"
                  items={TILES[m].map((t, i) => ({ key: t.title, node: <TileCard t={t} i={i} /> }))}
                />
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
