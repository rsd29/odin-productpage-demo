import { SIZES, money } from "./data";

/**
 * Header navigation and mega-menu content, shared by the desktop mega menu and the mobile drawer.
 * Only Ice baths has a mega menu: its products as cards, then a "shop all" panel.
 *
 * The Niseko is real (prices come from the product data, so campaign prices always match). Fjord and
 * Valhalla are concept placeholders for the demo: names, prices and copy are made up, and their photos
 * are borrowed from imagery already in the project. Replace them with the real range before launch.
 */

export type MenuLink = { label: string; href?: string };

export type MenuProduct = {
  name: string;
  href?: string;
  tagline: string;
  img: string;
  /** CSS object-position for the card crop (defaults to centre). */
  focus?: string;
  /** "From" pricing for products sold in several sizes. */
  from?: boolean;
  price?: string;
  was?: string;
  off?: string;
  /** Call to action for non-product cards (e.g. guides). */
  cta?: string;
};

export type Menu = {
  id: string;
  label: string;
  products: MenuProduct[];
  all: { eyebrow: string; title: string; links: MenuLink[] };
};

export const NISEKO_HREF = "/products/niseko-ice-bath";

export const CAMPAIGN_NOTE = "Black Friday prices shown. Ends Sunday";

const solo = SIZES.solo.withChiller;
const NISEKO: MenuProduct = {
  name: "Niseko Ice Bath",
  href: NISEKO_HREF,
  tagline: "Red cedar and 316 steel, with a 1HP chiller",
  img: "/products/niseko/2.webp",
  from: true,
  price: money(solo.price ?? 0),
  was: solo.compareAt ? money(solo.compareAt) : undefined,
  off: solo.discountPct ? `−${solo.discountPct}%` : undefined,
};

/** Top-level header links. Only the ones with an entry in MENUS open a mega menu; the rest are plain links. */
export const NAV_LINKS: { id: string; label: string; href?: string }[] = [
  { id: "saunas", label: "Saunas" },
  { id: "ice-baths", label: "Ice baths" },
  { id: "bundles", label: "Bundles" },
  { id: "recovery", label: "Recovery" },
  { id: "learn", label: "Learn" },
];

export const MENUS: Menu[] = [
  {
    id: "ice-baths",
    label: "Ice baths",
    products: [
      NISEKO,
      {
        name: "Fjord Cold Plunge",
        tagline: "A compact all-black plunge for smaller spaces",
        img: "/products/niseko/why-1.webp",
        focus: "50% 22%",
        price: "$3,995",
        was: "$5,495",
        off: "−27%",
      },
      {
        name: "Valhalla Duo Ice Bath",
        tagline: "Room for two, for shared recovery sessions",
        img: "/products/niseko/14.webp",
        price: "$8,495",
        was: "$11,995",
        off: "−29%",
      },
    ],
    all: {
      eyebrow: "ICE BATHS",
      title: "Cold on demand, from 3°C.",
      links: [{ label: "Shop all ice baths" }, { label: "Compare ice baths" }, { label: "Filters and accessories" }],
    },
  },
];
