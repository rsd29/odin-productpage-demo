import Image from "next/image";
import { Container } from "../ui/Container";
import { FramedImage } from "../ui/FramedImage";
import { Signature } from "./Signature";

export function FounderStory() {
  return (
    <section className="relative isolate overflow-hidden bg-warm-off-white pb-[79px] pt-[87px] max-lg:py-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[4%] top-1/2 max-lg:hidden w-[min(48vw,700px)] -translate-y-1/2 -rotate-12 opacity-[0.045] [mask-image:linear-gradient(to_right,transparent,black_30%)]"
      >
        <Image
          src="/brand/odin-emblem.svg"
          alt=""
          width={442}
          height={477}
          sizes="(min-width: 1460px) 700px, 48vw"
          className="h-auto w-full"
        />
      </div>
      <Container className="relative z-10 flex flex-col gap-16 max-lg:gap-8">
        <h2 className="text-h2 text-odin-grey">In his own words, from the Founder of Odin</h2>
        <div className="flex items-start gap-20 max-xl:gap-12 max-lg:flex-col max-lg:gap-8">
          {/* Founder portrait: the right-hand part of the photo, centred on Michael. */}
          <div className="relative h-[620px] w-[520px] shrink-0 overflow-hidden rounded-[8px] bg-olive-grey max-xl:w-[40%] max-lg:h-[440px] max-lg:w-full">
            <FramedImage
              src="/figma/founder/michael-clark.webp"
              alt="Michael Clark, founder of ODIN"
              sizes="(min-width: 1024px) 520px, 100vw"
              ratio={1488 / 1600}
              x={0.47}
              y={0.45}
            />
          </div>
          <div className="text-body flex min-w-0 flex-1 flex-col gap-7 text-olive-grey">
            <p>
              In 2020, lockdown shut the gyms. Michael had been training four days a week. Suddenly he was
              in a two-bedroom apartment with a young family, so every morning he packed the car and
              trained down at Port Phillip Bay.
            </p>
            <p>
              He set himself one rule: get in the ocean every day. For about a year and a half, through
              two Melbourne winters, he spent at least five minutes in the water. His head was calmer, he
              had more energy, and he recovered faster.
            </p>
            <blockquote className="border-l-2 border-odin-grey py-1 pl-6">
              <p className="text-h4 text-odin-grey">
                “Your nervous system is primed to move calmly through any stresses of the day.”
              </p>
            </blockquote>
            <p>
              Back in the gym, he built a routine around hot and cold. Five and a half minutes in the ice,
              ten to twenty in the sauna with slow breathing, then back into the ice. The problem was the
              gear: ice baths that were never quite cold, and never quite clean.
            </p>
            <p>
              A few months later, in a friend’s ice bath, he felt his body panic, then used slow breathing
              to bring it back. That reset is what he wants everyone to have, properly built and at home.
              It’s why ODIN exists.
            </p>
            {/*
              Signed off on the right: the name sits flush right, tucked up under the signature (the signature image
              has empty space below the ink, hence the negative margin).
            */}
            <div className="flex flex-col items-end self-end">
              <Signature />
              <div className="-mt-9 flex flex-col items-end gap-[2px] whitespace-nowrap max-lg:-mt-8">
                <p className="text-h4 text-odin-grey">Michael Clark</p>
                <p className="text-label-sm text-muted">FOUNDER, ODIN</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
