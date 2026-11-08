import Image from "next/image";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { PaymentMarks } from "../ui/PaymentMarks";

const COLUMNS = [
  { title: "SHOP", links: ["Infrared saunas", "Traditional saunas", "Ice baths", "Ritual bundles", "Shop all"] },
  { title: "LEARN", links: ["The science", "Founder’s story", "About us", "Blog", "FAQs"] },
  {
    title: "SUPPORT",
    links: ["Contact us", "Track your order", "Delivery & setup", "Warranty", "Privacy & security", "Terms of use"],
  },
];

export function Footer() {
  return (
    <footer data-header-theme="dark" className="bg-odin-grey pb-10 pt-24 max-lg:pb-8 max-lg:pt-14">
      <Container className="flex flex-col gap-16 max-lg:gap-10">
        <div className="flex items-start gap-16 max-xl:gap-10 max-lg:flex-col">
          <div className="flex w-[420px] shrink-0 flex-col items-start gap-[26px] max-xl:w-[300px] max-lg:w-full">
            <Image
              src="/figma/footer/odin-lockup-white.png"
              alt="ODIN"
              width={111}
              height={134}
              className="h-[134px] w-[111px] object-contain"
            />
            <p className="text-body text-muted-on-dark">
              Saunas, ice baths and recovery gear. Built for performance.
            </p>
            <form className="flex w-full items-center gap-2" action="#">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Email address"
                className="text-body h-[30px] min-w-0 flex-1 rounded-[4px] bg-olive-grey px-3 py-0 text-odin-cream placeholder:text-muted-on-dark focus:outline-1 focus:outline-muted-on-dark"
              />
              <Button type="submit" variant="inverse" className="h-[30px] shrink-0 py-0">
                Sign up
              </Button>
            </form>
            <p className="text-body whitespace-pre-wrap text-muted-on-dark">
              {"Talk to a specialist  "}
              <a href="tel:1300888669">1300 888 669</a>, Mon–Sat
            </p>
          </div>
          {/* Phones: link columns in a two-column grid. */}
          <div className="contents max-lg:grid max-lg:w-full max-lg:grid-cols-2 max-lg:gap-x-6 max-lg:gap-y-10">
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title} className="flex min-w-0 flex-1 flex-col gap-[14px]">
              <p className="text-eyebrow whitespace-nowrap text-muted-on-dark">{col.title}</p>
              {col.links.map((l) => (
                <a key={l} href="#" className="text-body whitespace-nowrap text-odin-cream hover:opacity-70">
                  {l}
                </a>
              ))}
            </nav>
          ))}
          </div>
        </div>
        <div className="flex items-center gap-4 border-t border-olive-grey-line pt-7 max-lg:flex-col max-lg:items-start">
          <p className="text-body whitespace-nowrap text-muted-on-dark">
            © 2026 ODIN. All rights reserved.
          </p>
          <span className="flex-1" />
          <PaymentMarks tone="muted-on-dark" />
        </div>
      </Container>
    </footer>
  );
}
