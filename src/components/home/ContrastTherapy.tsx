import Image from "next/image";
import { ArrowLink } from "../ui/ArrowLink";
import { ButtonLink } from "../ui/Button";
import { Container } from "../ui/Container";

const HIGHLIGHTS = [
  { title: "Recover between sessions", body: "Heat to loosen up, cold to bounce back." },
  { title: "Reset after a long day", body: "A calmer head in under an hour." },
  { title: "Built for everyday use", body: "Indoor, plug-and-play, always ready." },
];

export function ContrastTherapy() {
  return (
    <section data-header-theme="dark" className="bg-odin-grey py-16 max-lg:py-10">
      <Container className="flex items-center gap-[107px] max-xl:gap-14 max-lg:flex-col max-lg:items-stretch max-lg:gap-8">
        <div className="flex w-[460px] shrink-0 flex-col items-start gap-[43px] max-xl:w-[400px] max-lg:w-full max-lg:gap-6">
          <h2 className="text-h2 text-odin-cream">Hot, Then Cold, Then Again</h2>
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
        <div className="flex min-w-0 flex-1 flex-col gap-3 max-lg:w-full max-lg:flex-none max-lg:gap-2">
          {/* Keep the full scene visible so the sauna and ice bath can both be seen. */}
          <div className="relative aspect-[2352/1405] overflow-hidden rounded-[8px] bg-olive-grey">
            <Image
              src="/images/contrast-therapy.webp"
              alt="A sauna and black ODIN ice bath together in a home recovery space"
              fill
              sizes="(min-width: 1440px) 713px, (min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 max-lg:gap-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[8px] bg-olive-grey">
              <Image
                src="/images/sauna-social.webp"
                alt="Friends enjoying a sauna session together"
                fill
                sizes="(min-width: 1440px) 350px, (min-width: 1024px) 25vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[8px] bg-olive-grey">
              <Image
                src="/images/ice-bath-ritual.webp"
                alt="A woman taking a quiet moment in a cedar ice bath"
                fill
                sizes="(min-width: 1440px) 350px, (min-width: 1024px) 25vw, 50vw"
                className="object-cover object-[50%_55%]"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
