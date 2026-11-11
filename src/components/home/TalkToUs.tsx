import { Container } from "../ui/Container";

const PHONE = { href: "tel:1300423428", label: "1300 423 428" };

function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden className={className}>
      <path
        d="M4.2 2.5H6.6L7.8 5.6L6.2 6.7C6.9 8.3 8.1 9.6 9.7 10.4L10.9 8.8L14 10V12.4C14 13.3 13.3 14 12.4 14C7.2 13.7 3.3 9.8 3 4.6C3 3.6 3.6 2.5 4.2 2.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Contact banner: the whole section is one dark band, with the pitch on the left and a call card on the
 * right (stacked on phones). The whole card is one tap target for the phone number.
 */
export function TalkToUs() {
  return (
    <section id="contact" data-header-theme="dark" className="relative isolate scroll-mt-16 overflow-hidden bg-ink py-12 max-lg:py-10">
      {/* A soft, cool glow behind the call card. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-[8%] top-1/2 -z-10 size-[720px] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(176,209,227,0.14),transparent)] max-lg:-right-[45%] max-lg:top-auto max-lg:-bottom-[20%] max-lg:translate-y-0"
      />
      <Container className="grid items-center gap-14 max-xl:gap-10 max-lg:grid-cols-1 max-lg:gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex min-w-0 flex-col items-start gap-4">
          <h2 className="text-h2 text-odin-cream">Talk to a Real Person</h2>
          <p className="text-body max-w-[520px] text-muted-on-dark">
            Not sure which size fits, or what power you need? Our recovery specialists will check it with you and
            plan delivery. Real advice, zero pressure.
          </p>
        </div>

        {/* Call card. */}
        <a
          href={PHONE.href}
          className="group relative flex flex-col gap-4 rounded-[10px] border border-white/10 bg-ink-raised px-7 py-6 transition-[border-color,translate] duration-300 hover:-translate-y-[2px] hover:border-white/20 motion-reduce:transition-none max-lg:p-5"
        >
          <div className="flex items-center gap-4">
            <span className="relative flex size-14 shrink-0 items-center justify-center rounded-full bg-odin-cream text-odin-grey">
              <span aria-hidden className="absolute inset-0 rounded-full border border-odin-cream/40 motion-safe:animate-ring" />
              <PhoneIcon className="size-[22px]" />
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-label-sm text-muted-on-dark">CALL US DIRECT</span>
              <span className="font-display text-[30px] font-medium leading-none tabular-nums text-odin-cream max-lg:text-[26px]">
                {PHONE.label}
              </span>
            </span>
          </div>
          <div className="h-px w-full bg-white/10" />
          <p className="text-body text-muted-on-dark">
            Speak to someone who knows the gear inside out, from sizing to setup day.
          </p>
        </a>
      </Container>
    </section>
  );
}
