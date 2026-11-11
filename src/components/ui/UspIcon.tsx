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
      <path d="M4.5 13v-2a7.5 7.5 0 0 1 15 0v2" />
      <rect x="3.5" y="11" width="4" height="6" rx="1.5" />
      <rect x="16.5" y="11" width="4" height="6" rx="1.5" />
      <path d="M18.5 17v1a2.5 2.5 0 0 1-2.5 2.5h-4" />
    </>
  ),
} as const;

export type UspIconName = keyof typeof PATHS;

export function UspIcon({ name, size = 26 }: { name: UspIconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-odin-grey"
      aria-hidden
    >
      {PATHS[name]}
    </svg>
  );
}
