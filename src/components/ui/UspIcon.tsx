/** Line icons for the buy-box USPs — 24px grid, fine stroke, inherit colour. Sit directly on the USP panel. */
const PATHS = {
  delivery: (
    <>
      <path d="M2.5 9.5h3M3.5 12.5h2" />
      <path d="M7.5 6.5h8v9.5h-8z" />
      <path d="M15.5 9.5h3.2l2.3 3v3.5h-5.5" />
      <circle cx="10" cy="17" r="1.75" fill="var(--color-warm-off-white)" />
      <circle cx="18" cy="17" r="1.75" fill="var(--color-warm-off-white)" />
    </>
  ),
  warranty: (
    <>
      <path d="M12 3.25l6.75 2.5v5.5c0 4.3-2.8 7.7-6.75 9.25-3.95-1.55-6.75-4.95-6.75-9.25v-5.5z" />
      <path d="M9.25 12.25l2 2 3.75-4" />
    </>
  ),
  concierge: (
    <>
      <path d="M12 6.25v2" />
      <path d="M10.5 6.25h3" />
      <path d="M5.25 16.5a6.75 6.75 0 0 1 13.5 0" />
      <path d="M3.5 16.5h17" />
      <path d="M5 19.25h14" />
    </>
  ),
} as const;

export type UspIconName = keyof typeof PATHS;

export function UspIcon({ name }: { name: UspIconName }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-odin-grey"
      aria-hidden
    >
      {PATHS[name]}
    </svg>
  );
}
