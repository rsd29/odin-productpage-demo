import Image from "next/image";
import { ButtonLink } from "../ui/Button";
import { Container } from "../ui/Container";

export function TalkToUs() {
  return (
    <section id="contact" className="scroll-mt-16 bg-white py-16 max-lg:py-10">
      <Container className="flex items-start gap-[84px] max-xl:gap-12 max-lg:flex-col max-lg:gap-5">
        <h2 className="text-h3 whitespace-nowrap text-odin-grey">Talk To A Real Person</h2>
        <p className="text-body min-w-0 flex-1 text-olive-grey">
          Not sure which size fits, or what power you need?
          <br />
          Our recovery specialists will check it with you and plan delivery.
          <br />
          Real advice, zero pressure.
        </p>
        <ButtonLink href="tel:1300888669" className="gap-[10px] px-9 py-5 max-lg:mt-3 max-lg:w-full">
          <Image src="/figma/home/phone.svg" alt="" width={18} height={18} />
          Call 1300 888 669
        </ButtonLink>
      </Container>
    </section>
  );
}
