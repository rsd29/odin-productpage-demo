import Image from "next/image";
import { Container } from "../ui/Container";
import { SwipeRow } from "../ui/SwipeRow";

/** Body copy as paragraphs of plain text and `{ b: "…" }` key points, set heavier. */
type Seg = string | { b: string };

const TILES: { title: string; img: string; body: Seg[][]; muted?: boolean }[] = [
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
    img: "/figma/science/tile-4.png",
    // A light photo: dimmed, with a lighter panel, as in the design.
    muted: true,
    body: [["Hemlock timber, soft lighting and built-in speakers."], [{ b: "Set your heat, pick your timer, settle in." }]],
  },
];

function Tile({ t, i }: { t: (typeof TILES)[number]; i: number }) {
  return (
    <article className="relative flex h-[560px] w-full flex-col justify-end overflow-hidden max-lg:h-[480px]">
      <Image
        src={t.img}
        alt=""
        fill
        sizes="(min-width: 1024px) 320px, 280px"
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

export function Research() {
  return (
    <section data-header-theme="dark" className="bg-odin-grey pb-[81px] pt-[78px] max-lg:py-14">
      <Container className="flex flex-col gap-10 max-lg:gap-5">
        <h2 className="text-h2 text-white">What the research says.</h2>
        <SwipeRow
          label="What the research says"
          gap="gap-2"
          itemClassName="max-lg:w-[280px]"
          items={TILES.map((t, i) => ({ key: t.title, node: <Tile t={t} i={i} /> }))}
        />
      </Container>
    </section>
  );
}
