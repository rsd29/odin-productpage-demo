import { ArrowLink } from "../ui/ArrowLink";
import { ButtonLink } from "../ui/Button";
import { Container } from "../ui/Container";
import { FramedImage } from "../ui/FramedImage";

const HIGHLIGHTS = [
  { title: "Recover between sessions", body: "Heat to loosen up, cold to bounce back." },
  { title: "Reset after a long day", body: "A calmer head in under an hour." },
  { title: "Built for everyday use", body: "Indoor, plug-and-play, always ready." },
];

export function ContrastTherapy() {
  return (
    <section data-header-theme="dark" className="bg-odin-grey py-28 max-lg:py-14">
      <Container className="flex items-center gap-[107px] max-xl:gap-14 max-lg:flex-col max-lg:items-stretch max-lg:gap-8">
        <div className="flex w-[460px] shrink-0 flex-col items-start gap-[43px] max-xl:w-[400px] max-lg:w-full max-lg:gap-6">
          <h2 className="text-h2 text-odin-cream">Hot, then cold. Then again.</h2>
          <p className="text-body text-muted-on-dark">
            Pair Glow+ with the Niseko Ice Bath and get the hot and cold reset athletes swear by, in your own home.
            No gym membership, no waiting for a free bath.
          </p>
          <ul className="flex w-full flex-col">
            {HIGHLIGHTS.map((h) => (
              <li key={h.title} className="flex flex-col gap-[2px] border-t border-olive-grey-line py-4">
                <p className="text-h5 text-odin-cream">{h.title}</p>
                <p className="text-body text-muted-on-dark">{h.body}</p>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-6 pt-2 max-lg:flex-col max-lg:items-start max-lg:gap-5">
            <ButtonLink href="#" variant="inverse">
              Shop contrast therapy
            </ButtonLink>
            <ArrowLink tone="cream">See both products</ArrowLink>
          </div>
        </div>
        {/* Two people sharing the Niseko; cropped around them in the wide (desktop) and shorter (phone) frames. */}
        <div className="relative h-[496px] min-w-0 flex-1 overflow-hidden rounded-[8px] bg-olive-grey max-lg:h-[306px] max-lg:flex-none">
          <FramedImage
            src="/figma/home/contrast.webp"
            alt="Two people relaxing together in a Niseko Ice Bath"
            sizes="(min-width: 1024px) 720px, 100vw"
            ratio={1}
            x={0.5}
            y={0.45}
          />
        </div>
      </Container>
    </section>
  );
}
