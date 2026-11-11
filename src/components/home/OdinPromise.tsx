import Image from "next/image";
import { ArrowLink } from "../ui/ArrowLink";
import { Container } from "../ui/Container";
import { SwipeRow } from "../ui/SwipeRow";

const CARDS = [
  {
    icon: "delivery",
    stat: "Free",
    title: "Metro Delivery, On Us",
    body: "We bring your sauna or ice bath right to your door across metro areas, at no extra cost. Pick a delivery window that suits you, so there’s no waiting around all day.",
    link: "How delivery works",
  },
  {
    icon: "returns",
    stat: "30 days",
    title: "Try It at Home",
    body: "Live with it for a full month. If it’s not the right fit for your space or your routine, send it back. Easy returns, no hard sell.",
    link: "Our returns policy",
  },
  {
    icon: "warranty",
    stat: "2 years",
    title: "Warranty, Built In",
    body: "Every Odin is covered for two full years. If anything isn’t right, a real person on our team sorts it out, fast.",
    link: "Warranty details",
  },
  {
    icon: "pay",
    stat: "$75/wk",
    title: "Pay Over Time",
    body: "Spread the cost with Afterpay or Zip at checkout. Start your recovery routine today and pay for it as you go.",
    link: "Ways to pay",
  },
];

/** Figma "USP card": icon, a big stat, title and body, then a link pinned to the bottom. */
function UspCard({ c }: { c: (typeof CARDS)[number] }) {
  return (
    <article className="flex min-h-[420px] w-full flex-col rounded-[6px] border border-white/[0.08] bg-ink-raised p-6 max-lg:min-h-[400px]">
      <div className="flex items-center justify-between pb-8">
        <span className="flex size-[52px] items-center justify-center rounded-full bg-odin-cream">
          <Image src={`/figma/home/usp-${c.icon}.svg`} alt="" width={24} height={24} />
        </span>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-display text-odin-cream">{c.stat}</p>
        <h3 className="text-h4 text-odin-cream">{c.title}</h3>
        <p className="text-body text-muted-on-dark">{c.body}</p>
      </div>
      <div className="flex-1" />
      <div className="flex flex-col gap-5 pt-7">
        <span aria-hidden className="h-px w-full bg-white/10" />
        <ArrowLink tone="cream">{c.link}</ArrowLink>
      </div>
    </article>
  );
}

export function OdinPromise() {
  return (
    <section data-header-theme="dark" className="bg-ink py-16 max-lg:py-10">
      <Container className="flex flex-col gap-10 max-lg:gap-6">
        <h2 className="text-h2 text-white">Why Choose Us</h2>
        <SwipeRow
          label="The ODIN promise"
          gap="gap-4 max-lg:gap-3"
          itemClassName="max-lg:w-[282px]"
          dots
          tone="dark"
          items={CARDS.map((c) => ({ key: c.title, node: <UspCard c={c} /> }))}
        />
      </Container>
    </section>
  );
}
