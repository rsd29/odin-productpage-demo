import Image from "next/image";
import Link from "next/link";
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

/** Social links (placeholder URLs). Simple line icons in the cream of the footer text. */
const SOCIALS = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.25" cy="6.75" r="0.9" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: <path d="M13.5 20.5v-7h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.5V4.4a20 20 0 0 0-2.3-.1c-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5v7" />,
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
        <path d="M8 10.5v6" />
        <circle cx="8" cy="7.6" r="0.9" fill="currentColor" stroke="none" />
        <path d="M11.5 16.5v-6M11.5 13.25c0-1.65 1-2.75 2.5-2.75s2.5 1.05 2.5 2.75v3.25" />
      </>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <>
        <rect x="2.75" y="5.5" width="18.5" height="13" rx="4" />
        <path d="M10.25 9.5v5l4.25-2.5z" fill="currentColor" />
      </>
    ),
  },
];

export function Footer() {
  return (
    <footer data-header-theme="dark" className="bg-odin-grey pb-10 pt-24 max-lg:pb-8 max-lg:pt-14">
      <Container className="flex flex-col gap-16 max-lg:gap-10">
        <div className="flex items-start gap-16 max-xl:gap-10 max-lg:flex-col">
          <div className="flex w-[420px] shrink-0 flex-col items-start gap-[26px] max-xl:w-[300px] max-lg:w-full">
            <Link href="/" aria-label="ODIN home" className="transition-opacity hover:opacity-80">
              <Image
                src="/figma/footer/odin-lockup-white.png"
                alt="ODIN"
                width={111}
                height={134}
                className="h-[134px] w-[111px] object-contain"
              />
            </Link>
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
            <ul className="flex items-center gap-2" aria-label="Follow ODIN">
              {SOCIALS.map((so) => (
                <li key={so.label}>
                  <a
                    href={so.href}
                    aria-label={so.label}
                    className="flex size-10 items-center justify-center rounded-full border border-olive-grey-line text-odin-cream transition-colors hover:bg-olive-grey"
                  >
                    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      {so.icon}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* Phones: link columns in a two-column grid. */}
          <div className="contents max-lg:grid max-lg:w-full max-lg:grid-cols-2 max-lg:gap-x-6 max-lg:gap-y-10">
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title} className="flex min-w-0 flex-1 flex-col gap-[14px]">
              {/* Headings set heavier and brighter than the links beneath them. */}
              <p className="text-label-sm whitespace-nowrap text-white">{col.title}</p>
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
