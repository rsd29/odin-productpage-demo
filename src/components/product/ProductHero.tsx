import Image from "next/image";
import Link from "next/link";
import { Container } from "../ui/Container";
import { BuyBox } from "./BuyBox";
import { Gallery } from "./Gallery";

export function ProductHero() {
  return (
    <section className="bg-odin-cream pb-16 pt-6 max-lg:pb-10 max-lg:pt-4">
      <Container className="flex flex-col gap-5 max-lg:gap-4">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-4 gap-y-2 font-sans text-[11px] font-medium leading-5 tracking-[0.12em] uppercase">
            <li className="flex items-center">
              <Link
                href="/"
                aria-label="ODIN home"
                className="rounded-sm py-1 transition-opacity duration-200 hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-odin-grey motion-reduce:transition-none"
              >
                <Image src="/brand/odin-logo.svg" alt="ODIN" width={42} height={12} />
              </Link>
            </li>
            <li className="flex items-center gap-4">
              <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 text-muted/50">
                <path d="m4.5 2.5 3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <a
                href="#"
                className="rounded-sm text-muted underline-offset-4 transition-colors duration-200 hover:text-odin-grey hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-odin-grey motion-reduce:transition-none"
              >
                Ice Baths
              </a>
            </li>
            <li className="flex items-center gap-4">
              <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 text-muted/50">
                <path d="m4.5 2.5 3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span aria-current="page" className="font-semibold text-odin-grey">
                Niseko Ice Bath
              </span>
            </li>
          </ol>
        </nav>
        <div className="flex items-start gap-16 max-xl:gap-10 max-lg:flex-col max-lg:items-stretch max-lg:gap-8">
          <Gallery />
          <BuyBox />
        </div>
      </Container>
    </section>
  );
}
