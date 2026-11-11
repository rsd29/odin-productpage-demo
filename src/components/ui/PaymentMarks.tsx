const marks = [
  { src: "/figma/shared/pay-1.png", w: 40, h: 22, label: "Visa" },
  { src: "/figma/shared/pay-2.png", w: 46, h: 22, label: "American Express" },
  { src: "/figma/shared/pay-3.png", w: 40, h: 22, label: "Apple Pay" },
  { src: "/figma/shared/pay-4.png", w: 34, h: 18, label: "PayPal" },
  { src: "/figma/shared/pay-5.png", w: 42, h: 22, label: "Google Pay" },
  { src: "/figma/shared/pay-6.png", w: 81, h: 30, label: "Afterpay" },
];

type Tone = "muted" | "muted-on-dark";
const toneBg = (tone: Tone) => (tone === "muted" ? "bg-muted" : "bg-muted-on-dark");

/** Monochrome payment logos, tinted via CSS mask (as in the Figma "Grey logo" layers). */
export function PaymentMarks({ tone, omit = [] }: { tone: Tone; /** Labels to leave out, e.g. ["Afterpay"]. */ omit?: string[] }) {
  const bg = toneBg(tone);
  return (
    <ul className="flex max-w-full flex-wrap items-center gap-2" aria-label="Accepted payment methods">
      {marks.filter((m) => !omit.includes(m.label)).map((m) => (
        <li
          key={m.src}
          role="img"
          aria-label={m.label}
          className={`shrink-0 rounded-[4px] ${bg}`}
          style={{
            width: m.w,
            height: m.h,
            maskImage: `url(${m.src})`,
            WebkitMaskImage: `url(${m.src})`,
            maskSize: `${m.w}px ${m.h}px`,
            WebkitMaskSize: `${m.w}px ${m.h}px`,
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
          }}
        />
      ))}
    </ul>
  );
}

/**
 * The Afterpay wordmark alone, in the same grey as the payment marks, for inline use in copy.
 * The source PNG has padding around the logo (visible area: x 9–72, y 8.5–21.5 of 81×30), so the
 * mask is offset and scaled to crop it out, and `height` is the height of the logo itself.
 */
export function AfterpayMark({ tone = "muted", height = 15 }: { tone?: Tone; height?: number }) {
  const k = height / 13;
  const size = `${81 * k}px ${30 * k}px`;
  const position = `${-9 * k}px ${-8.5 * k}px`;
  return (
    <span
      role="img"
      aria-label="Afterpay"
      className={`inline-block shrink-0 ${toneBg(tone)}`}
      style={{
        width: 63 * k,
        height,
        maskImage: "url(/figma/shared/pay-6.png)",
        WebkitMaskImage: "url(/figma/shared/pay-6.png)",
        maskSize: size,
        WebkitMaskSize: size,
        maskPosition: position,
        WebkitMaskPosition: position,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
    />
  );
}
