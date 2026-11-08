import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "inverse";

const variants: Record<Variant, string> = {
  primary: "bg-odin-grey text-odin-cream hover:bg-black",
  secondary: "border-[1.2px] border-odin-grey text-odin-grey hover:bg-odin-grey/5",
  inverse: "bg-odin-cream text-odin-grey hover:bg-white",
};

/** HF / Button — pill buttons. Primary = ink, Secondary = outline, Inverse = for dark sections. */
export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type="button"
      className={`text-label-md inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full px-7 py-[15px] text-center transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
