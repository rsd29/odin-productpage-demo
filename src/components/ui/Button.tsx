import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "inverse" | "inverseOutline";

const variants: Record<Variant, string> = {
  primary: "bg-odin-grey text-odin-cream hover:bg-black",
  secondary: "border-[1.2px] border-odin-grey text-odin-grey hover:bg-odin-grey/5",
  inverse: "bg-odin-cream text-odin-grey hover:bg-white",
  inverseOutline: "border-[1.2px] border-odin-cream text-odin-cream hover:bg-odin-cream/10",
};

const base =
  "text-label-md inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full px-7 py-[15px] text-center transition-colors";

/** HF / Button — pill buttons. Primary = ink, Secondary = outline, Inverse = for dark sections. */
export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button type="button" className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

/** The same pill, as a link (for buttons that navigate). */
export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant }) {
  return (
    <a className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </a>
  );
}
