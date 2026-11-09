// Source: masseusehealth.co/products/niseko-ice-bath (pasted page copy) + product imagery.
// Anything the page doesn't state is left undefined and shown as "TBC".

export type SizeId = "solo" | "lux" | "grande";

export type Pricing = {
  price?: number;
  compareAt?: number;
  save: number;
  discountPct?: number;
};

export type Size = {
  id: SizeId;
  name: string;
  /** Short line for the size card. */
  tagline: string;
  /** Full line from the "Niseko Ice Bath Sizes" section. */
  description: string;
  width: number;
  length: number;
  depth: number;
  capacity?: string;
  /** Empty weight, kg. */
  weight?: number;
  /** Variant cut-out (with step). */
  image: string;
  tubOnlyImage?: string;
  /** Black-finish cut-outs, shown when Black is selected. */
  black: { image: string; tubOnlyImage?: string };
  withChiller: Pricing;
  /** Only the Solo is sold as tub only. */
  tubOnly?: Pricing;
};

export const SIZES: Record<SizeId, Size> = {
  solo: {
    id: "solo",
    name: "Solo",
    tagline: "Compact performance",
    description: "Perfect for individual athletes or spaces where compact performance matters.",
    width: 64,
    length: 135,
    depth: 76,
    capacity: "260 L",
    weight: 95, // placeholder estimate
    image: "/products/niseko/variant-solo.webp",
    tubOnlyImage: "/products/niseko/variant-solo-tub.webp",
    black: { image: "/products/niseko/black-1.webp", tubOnlyImage: "/products/niseko/black-2.webp" },
    withChiller: { price: 5577, compareAt: 8495, save: 2918, discountPct: 34 },
    tubOnly: { price: 4995, compareAt: 7995, save: 3000, discountPct: 38 },
  },
  lux: {
    id: "lux",
    name: "Lux",
    tagline: "Extra room",
    description:
      "Ideal for those who want extra room, have larger home gyms or personal recovery spaces.",
    width: 88,
    length: 159,
    depth: 79,
    capacity: "440 L", // placeholder estimate, scaled from Solo
    weight: 125, // placeholder estimate
    image: "/products/niseko/variant-lux.webp",
    black: { image: "/products/niseko/black-3.webp" },
    withChiller: { price: 5877, compareAt: 8995, save: 3118, discountPct: 35 },
  },
  grande: {
    id: "grande",
    name: "Grande",
    tagline: "Elite recovery spaces",
    description: "Engineered for elite recovery spaces, home gyms, or team training environments.",
    width: 113,
    length: 173,
    depth: 75,
    capacity: "580 L", // placeholder estimate, scaled from Solo
    weight: 160, // placeholder estimate
    image: "/products/niseko/variant-grande.webp",
    black: { image: "/products/niseko/black-4.webp" },
    withChiller: { price: 7177, compareAt: 12995, save: 5818, discountPct: 45 },
  },
};

export const SIZE_ORDER: SizeId[] = ["solo", "lux", "grande"];

export type AddonId = "filter" | "chiller-warranty" | "tub-warranty";

export const ADDONS: { id: AddonId; name: string; price: number; needsChiller: boolean }[] = [
  { id: "filter", name: "Ice Bath Chiller Filter (1HP)", price: 59.95, needsChiller: true },
  { id: "chiller-warranty", name: "1 Year Extended Chiller Warranty", price: 495, needsChiller: true },
  { id: "tub-warranty", name: "5 Year Extended Ice Bath Warranty", price: 495, needsChiller: false },
];

export const FINISHES = ["Red Cedar", "Black"] as const;
export type Finish = (typeof FINISHES)[number];

export const PRODUCT_NAME = "Niseko Ice Bath";
export const PRODUCT_IMAGE = "/products/niseko/1.webp";

export const money = (n: number) =>
  "$" +
  n.toLocaleString("en-AU", {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  });

// Non-breaking spaces keep each "W64", "×" pair and "D76 cm" from splitting awkwardly.
export const dims = (s: Size) => `W${s.width}\u00a0× L${s.length}\u00a0× D${s.depth}\u00a0cm`;

export const pricingFor = (s: Size, tubOnly: boolean): Pricing =>
  tubOnly && s.tubOnly ? s.tubOnly : s.withChiller;

/** The size's cut-out for the chosen finish (and tub-only, where the size offers it). */
export const imageFor = (s: Size, tubOnly: boolean, finish: Finish) => {
  const set = finish === "Black" ? s.black : s;
  return tubOnly && set.tubOnlyImage ? set.tubOnlyImage : set.image;
};

export const variantName = (s: Size, tubOnly: boolean, finish: Finish) =>
  `${tubOnly && s.tubOnly ? `${s.name} (Tub Only)` : `${s.name} + 1HP Chiller`} · ${finish}`;

export const priceLabel = (p: Pricing) => (p.price ? money(p.price) : "Price TBC");
