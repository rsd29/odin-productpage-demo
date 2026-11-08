import Image from "next/image";
import { Container } from "../ui/Container";
import { FramedImage, type Frame } from "../ui/FramedImage";

/** Body copy as paragraphs of plain text and `{ b: "…" }` key points, which are set heavier and brighter. */
type Seg = string | { b: string };

// Copy: masseusehealth.co/products/niseko-ice-bath ("Why Choose the Niseko Ice Bath" slides), split into
// short paragraphs so each tile reads hook → detail → payoff.
const TILES: {
  tag: string;
  title: string;
  body: Seg[][];
  img: string;
}[] = [
  {
    tag: "Advanced filtration",
    title: "Niseko’s ozone filtration keeps water crystal-clear",
    body: [
      [{ b: "Push limits, not maintenance." }],
      [
        "Niseko’s ",
        { b: "ozone filtration system" },
        " keeps your water ",
        { b: "purified, sanitised, and self-cleaning" },
        ", for powerful, hassle-free recovery every time.",
      ],
    ],
    img: "/products/niseko/why-1.webp",
  },
  {
    tag: "Powerful performance",
    title: "1HP chiller delivers 3–35°C ice bath control",
    body: [
      ["Immerse yourself in the performance-enhancing cold of the ", { b: "1HP chiller" }, "."],
      [
        "Accelerate recovery in an ",
        { b: "icy 3–5°C" },
        ", or ",
        { b: "heat up to 35°C" },
        " to boost circulation and prime your body for performance.",
      ],
    ],
    img: "/products/niseko/why-2.webp",
  },
  {
    tag: "Rugged durability",
    title: "Built to last: red cedar ice bath construction",
    body: [
      [
        "Niseko’s ",
        { b: "certified Canadian red cedar" },
        " body handles tough conditions, while the ",
        { b: "triple-insulated cover" },
        " locks in temperature, indoors or out.",
      ],
      [{ b: "So you recover hard, all-year-round." }],
    ],
    img: "/products/niseko/why-3.webp",
  },
];

/** Fixed so the photos line up across tiles whatever the copy length. */
const PANEL = 252;
/** One crop for every photo (9:16 portraits shot the same way), so all three sit identically. */
const FRAME: Frame = { x: 0.5, y: 0.43 };

export function TheScience() {
  return (
    <section
      data-header-theme="dark"
      className="relative isolate overflow-hidden bg-black pb-[81px] pt-[78px] max-lg:py-14"
    >
      <Container className="flex flex-col gap-10 max-lg:gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="text-h2 text-white">Why choose the Niseko Ice Bath.</h2>
          <p className="text-body max-w-[720px] text-muted-on-dark">
            Push harder. Recover faster. Build resilience where others break. Niseko delivers cold-driven
            recovery for athletes and high-performers who demand more.
          </p>
        </div>
        {/* Phones: a swipeable row of tiles that bleeds to the screen edge. */}
        <div className="flex gap-2 max-lg:-mx-5 max-lg:snap-x max-lg:snap-mandatory max-lg:scroll-px-5 max-lg:overflow-x-auto max-lg:px-5 max-lg:[scrollbar-width:none]">
          {TILES.map((t) => (
            <div key={t.tag} className="relative min-w-0 flex-1 max-lg:w-[300px] max-lg:flex-none max-lg:snap-start">
              {/*
                Ambient glow, like YouTube's ambient mode: a heavily blurred, dimmed copy of the
                photo behind the tile, bleeding its colours softly into the surrounding black.
              */}
              <div aria-hidden className="pointer-events-none absolute -inset-10 -z-10">
                <div className="relative size-full opacity-[0.28] blur-[60px] saturate-[1.6]">
                  <Image src={t.img} alt="" fill sizes="120px" className="object-cover" />
                </div>
              </div>
              <article className="relative flex h-[800px] w-full flex-col justify-end overflow-hidden rounded-[8px] bg-black max-lg:h-[560px]">
                {/* The photo fills the whole tile; the text panel sits over its lower part as frosted glass */}
                <FramedImage src={t.img} alt="" sizes="480px" ratio={1080 / 1920} {...FRAME} />
                <div
                  // Fixed height on wide screens so the photos line up; narrower tiles let the panel grow to fit the copy.
                  className="relative flex flex-col gap-3 border-t border-white/10 bg-[rgb(20_20_20/0.45)] p-6 text-white backdrop-blur-[16px] backdrop-saturate-[1.2] max-xl:h-auto! max-lg:p-5"
                  style={{ height: PANEL }}
                >
                  <div className="flex flex-col gap-[6px]">
                    <h3 className="text-h3">{t.tag}</h3>
                    <p className="text-h5 text-balance text-white/75">{t.title}</p>
                  </div>
                  <div className="text-body flex flex-col gap-2 text-white/75">
                    {t.body.map((para, i) => (
                      <p key={i}>
                        {para.map((seg, j) =>
                          typeof seg === "string" ? (
                            seg
                          ) : (
                            <strong key={j} className="font-medium text-white">
                              {seg.b}
                            </strong>
                          ),
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
