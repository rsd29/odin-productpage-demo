import Image from "next/image";
import type { ReactNode } from "react";

const TONES = {
  grey: { text: "text-odin-grey", arrow: "/figma/faq/arrow-right.svg" },
  cream: { text: "text-odin-cream", arrow: "/figma/home/arrow-cream.svg" },
  white: { text: "text-white", arrow: "/figma/home/arrow-white.svg" },
} as const;

/** Text link with a trailing 16px arrow (Figma "Link / …"). */
export function ArrowLink({
  href = "#",
  tone = "grey",
  arrow,
  className = "",
  children,
}: {
  href?: string;
  tone?: keyof typeof TONES;
  /** Override the arrow asset where the design uses a different one. */
  arrow?: string;
  className?: string;
  children: ReactNode;
}) {
  const t = TONES[tone];
  return (
    <a href={href} className={`group/link inline-flex shrink-0 items-center gap-2 hover:opacity-80 ${className}`}>
      <span className={`text-label-md whitespace-nowrap ${t.text}`}>{children}</span>
      <Image
        src={arrow ?? t.arrow}
        alt=""
        width={16}
        height={16}
        className="transition-transform duration-200 ease-out group-hover/link:translate-x-0.5 motion-reduce:transition-none"
      />
    </a>
  );
}
