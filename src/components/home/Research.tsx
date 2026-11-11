"use client";

import Image from "next/image";
import { useState } from "react";
import { Container } from "../ui/Container";
import { SwipeRow } from "../ui/SwipeRow";

/** Body copy as paragraphs of plain text and `{ b: "…" }` key points, set heavier. */
type Seg = string | { b: string };
type Tile = { title: string; img: string; body: Seg[][]; muted?: boolean; focus?: string };

const MODES = ["Sauna", "Ice Bath"] as const;
type Mode = (typeof MODES)[number];

const TILES: Record<Mode, Tile[]> = {
  Sauna: [
    {
      title: "Sweat Deeper, Not Hotter",
      img: "/figma/science/tile-1.png",
      body: [
        [{ b: "A deep, satisfying sweat" }, " without the aggressive heat."],
        ["Full-spectrum infrared you can dial from ", { b: "30°C to 70°C" }, "."],
      ],
    },
    {
      title: "Harder Work Sessions",
      img: "/figma/science/tile-2.png",
      body: [
        [{ b: "Built-in red light therapy" }, " adds a second layer for recovery, skin and that post-session lift."],
        [{ b: "No extra device needed." }],
      ],
    },
    {
      title: "Put the Benefits on Repeat",
      img: "/figma/science/tile-3.png",
      body: [
        [{ b: "Simple setup and easy controls" }, " make it a habit, not a chore."],
        ["Plus ", { b: "free delivery and a 2-year warranty." }],
      ],
    },
    {
      title: "Settle Into Every Detail",
      img: "/images/sauna-interior.webp",
      focus: "55% center",
      // A light photo: dimmed, with a lighter panel, as in the design.
      muted: true,
      body: [["Hemlock timber, soft lighting and built-in speakers."], [{ b: "Set your heat, pick your timer, settle in." }]],
    },
  ],
  "Ice Bath": [
    {
      title: "Cold That Gets Results",
      img: "/products/niseko/why-2.webp",
      body: [
        ["Recover in an ", { b: "icy 3–5°C" }, ", held steady by a powerful 1HP chiller."],
        [{ b: "Or heat to 35°C" }, " to boost circulation before you train."],
      ],
    },
    {
      title: "Clean Water, Zero Fuss",
      img: "/products/niseko/why-1.webp",
      body: [
        [{ b: "Ozone filtration" }, " keeps your water purified, sanitised and self-cleaning."],
        [{ b: "Push limits, not maintenance." }],
      ],
    },
    {
      title: "Built for Every Season",
      img: "/products/niseko/why-3.webp",
      body: [
        [{ b: "Certified Canadian red cedar" }, " and a triple-insulated cover lock in the cold, indoors or out."],
        [{ b: "Recover hard, all year round." }],
      ],
    },
    {
      title: "Make It a Ritual",
      img: "/images/ice-bath-ritual.webp",
      body: [
        ["A ", { b: "23 L/min high-flow pump" }, " and simple controls make the cold a daily habit."],
        ["Plus ", { b: "free delivery and a 2-year warranty." }],
      ],
    },
  ],
};

function TileCard({ t, i }: { t: Tile; i: number }) {
  return (
    <article className="relative flex h-[560px] w-full animate-fade-in flex-col justify-end overflow-hidden motion-reduce:animate-none max-lg:h-[480px]">
      <Image
        src={t.img}
        alt=""
        fill
        sizes="(min-width: 1024px) 320px, 280px"
        style={t.focus ? { objectPosition: t.focus } : undefined}
        className={`object-cover ${t.muted ? "opacity-70" : ""}`}
      />
      <div
        className={`relative flex h-[210px] flex-col gap-3 p-6 text-white backdrop-blur-[12px] max-lg:h-auto max-lg:min-h-[182px] ${
          t.muted ? "bg-black/45" : "bg-black/70"
        }`}
      >
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

export function Research() {
  const [mode, setMode] = useState<Mode>("Sauna");
  return (
    <section data-header-theme="dark" className="bg-odin-grey py-16 max-lg:py-10">
      <Container className="flex flex-col gap-10 max-lg:gap-5">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <h2 className="text-h2 text-white">What The Research Says</h2>
          <Toggle mode={mode} onChange={setMode} />
        </div>
        <SwipeRow
          key={mode}
          label={`What the research says: ${mode.toLowerCase()}`}
          gap="gap-2"
          itemClassName="max-lg:w-[280px]"
          items={TILES[mode].map((t, i) => ({ key: t.title, node: <TileCard t={t} i={i} /> }))}
        />
      </Container>
    </section>
  );
}
