/** Line icons for the Features / Benefits grid — same 24px grid and fine stroke as UspIcon. */
const PATHS = {
  cedar: (
    <>
      <path d="M12 20.5v-6.25" />
      <path d="M12 3.5c3.4 3 5.5 6.1 5.5 8.75a5.5 5.5 0 0 1-11 0C6.5 9.6 8.6 6.5 12 3.5z" />
      <path d="M12 14.25l2.25-2.25M12 11.5l-1.75-1.75" />
    </>
  ),
  steel: (
    <>
      <path d="M4.25 7h15.5l-1.4 11.1a2 2 0 0 1-2 1.65H7.65a2 2 0 0 1-2-1.65z" />
      <path d="M4.8 11.25h14.4" />
      <path d="M3.5 7h17" />
    </>
  ),
  chiller: (
    <>
      <path d="M12 3.5v17M4.65 7.75l14.7 8.5M4.65 16.25l14.7-8.5" />
      <path d="M9.75 4.75L12 6.75l2.25-2M9.75 19.25l2.25-2 2.25 2" />
    </>
  ),
  flow: (
    <>
      <path d="M3.5 8.5c1.9-1.4 3.8-1.4 5.7 0s3.8 1.4 5.7 0 3.8-1.4 5.6 0" />
      <path d="M3.5 12.5c1.9-1.4 3.8-1.4 5.7 0s3.8 1.4 5.7 0 3.8-1.4 5.6 0" />
      <path d="M3.5 16.5c1.9-1.4 3.8-1.4 5.7 0s3.8 1.4 5.7 0 3.8-1.4 5.6 0" />
    </>
  ),
  water: (
    <>
      <path d="M12 3.5c3.5 4.2 5.5 7.3 5.5 10a5.5 5.5 0 0 1-11 0c0-2.7 2-5.8 5.5-10z" />
      <path d="M9.4 14a2.6 2.6 0 0 0 2.6 2.6" />
    </>
  ),
  cover: (
    <>
      <path d="M3.5 12a8.5 8.5 0 0 1 17 0z" />
      <path d="M12 12v6.25a1.75 1.75 0 0 1-3.5 0" />
    </>
  ),
  step: (
    <>
      <path d="M3.5 19.5h17" />
      <path d="M5 19.5v-5h4.5v-4.5h4.5v-4.5H19v14" />
    </>
  ),
  headrest: (
    <>
      <path d="M4.5 10c0-1.9 1.3-3.25 3.2-3.25h8.6c1.9 0 3.2 1.35 3.2 3.25v4c0 1.9-1.3 3.25-3.2 3.25H7.7c-1.9 0-3.2-1.35-3.2-3.25z" />
      <path d="M8.5 12h7" />
    </>
  ),
  outdoor: (
    <>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6L18 18M6 18l1.4-1.4M16.6 7.4L18 6" />
    </>
  ),
  door: (
    <>
      <path d="M6.75 20.25V4.75a1 1 0 0 1 1-1h8.5a1 1 0 0 1 1 1v15.5" />
      <path d="M4.5 20.25h15" />
      <path d="M14.25 12v.5" />
    </>
  ),
  recovery: (
    <>
      <path d="M19.25 12a7.25 7.25 0 0 1-12.6 4.9" />
      <path d="M4.75 12a7.25 7.25 0 0 1 12.6-4.9" />
      <path d="M17.6 3.75v3.5h-3.5M6.4 20.25v-3.5h3.5" />
    </>
  ),
  soreness: (
    <>
      <path d="M10 14.25V5.5a2 2 0 0 1 4 0v8.75a3.75 3.75 0 1 1-4 0z" />
      <path d="M12 16.75v-5.5" />
      <path d="M17.5 6.5v5M15.75 9.75l1.75 1.75 1.75-1.75" />
    </>
  ),
  immune: (
    <>
      <path d="M12 3.25l6.75 2.5v5.5c0 4.3-2.8 7.7-6.75 9.25-3.95-1.55-6.75-4.95-6.75-9.25v-5.5z" />
      <path d="M12 9.25v5.5M9.25 12h5.5" />
    </>
  ),
  mood: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.75 14a4 4 0 0 0 6.5 0" />
      <path d="M9.5 9.75v.5M14.5 9.75v.5" />
    </>
  ),
  clarity: (
    <>
      <path d="M9.75 17.25h4.5M10.25 20.25h3.5" />
      <path d="M12 3.5a5.5 5.5 0 0 0-3.3 9.9c.5.4.8 1 .8 1.6v.25h5v-.25c0-.6.3-1.2.8-1.6A5.5 5.5 0 0 0 12 3.5z" />
    </>
  ),
  metabolism: <path d="M13 3.25L5.75 13.5H12l-1 7.25 7.25-10.25H12z" />,
} as const;

export type FeatureIconName = keyof typeof PATHS;

export function FeatureIcon({ name, size = 20 }: { name: FeatureIconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
