import type { ReactNode } from "react";

/** 1440px design frame with 80px side gutters → 1280px content column. */
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1440px] px-20 max-lg:px-5 ${className}`}>{children}</div>;
}
