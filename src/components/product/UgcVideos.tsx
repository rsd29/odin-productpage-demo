import Image from "next/image";
import { Container } from "../ui/Container";
import { SwipeRow } from "../ui/SwipeRow";

const VIDEOS = [
  { name: "Dana White", role: "UFC CEO", duration: "0:40" },
  { name: "Chris Hemsworth", role: "Actor · Thor", duration: "0:38" },
  { name: "Lewis Hamilton", role: "7-time F1 world champion", duration: "0:52" },
  { name: "Kamaru Usman", role: "UFC welterweight champion", duration: "0:31" },
  { name: "Patrick Cripps", role: "2-time Brownlow medallist", duration: "0:45" },
];

/** `product` names what the stories are about in the intro line (the Niseko on its page, Glow+ on the homepage). */
export function UgcVideos({ product = "the Niseko" }: { product?: string }) {
  return (
    <section data-header-theme="dark" className="bg-odin-grey pb-[77px] pt-[83px] max-lg:pb-14 max-lg:pt-14">
      <Container className="flex flex-col gap-12 max-lg:gap-8">
        <div className="flex items-end gap-6 max-lg:flex-col max-lg:items-start max-lg:gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <h2 className="text-h2 text-odin-cream">Real routines, real recovery.</h2>
            <p className="text-body text-muted-on-dark">
              How athletes and everyday recoverers fit {product} into their week.
            </p>
          </div>
          <a href="#" className="flex shrink-0 items-center gap-2 hover:opacity-80">
            <span className="text-label-md whitespace-nowrap text-odin-cream">Watch all stories</span>
            <Image src="/figma/shared/arrow-cream.svg" alt="" width={14} height={14} />
          </a>
        </div>
        {/* Phones: a swipeable row that bleeds to the screen edge, with dots to show there's more. */}
        <SwipeRow
          label="Customer stories"
          gap="gap-4"
          itemClassName="max-lg:w-[240px]"
          dots
          tone="dark"
          items={VIDEOS.map((v) => ({
            key: v.name,
            node: (
              <div className="flex w-full flex-col">
                <button
                  type="button"
                  aria-label={`Play ${v.name}'s story (${v.duration})`}
                  className="group relative h-[432px] w-full max-lg:h-[400px] cursor-pointer overflow-hidden rounded-[8px] bg-[linear-gradient(119.38deg,#47453e_8.33%,#2b2a2a_91.67%)]"
                >
                  <span className="absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/[0.22] pl-[2px] backdrop-blur-[6px] transition-transform group-hover:scale-105">
                    <Image src="/figma/ugc/play.svg" alt="" width={16} height={16} />
                  </span>
                  <span className="text-label-sm absolute right-[14px] top-[14px] rounded-[4px] bg-[rgba(31,31,31,0.55)] px-2 py-1 text-odin-cream">
                    {v.duration}
                  </span>
                </button>
                <div className="flex min-h-[73px] flex-col gap-1 pt-5">
                  <p className="text-h4 text-odin-cream">{v.name}</p>
                  <p className="font-sans text-[12px] font-light leading-[1.5] text-muted-on-dark">{v.role}</p>
                </div>
              </div>
            ),
          }))}
        />
      </Container>
    </section>
  );
}
