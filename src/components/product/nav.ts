import { SIZES, money } from "./data";

/**
 * Header navigation and mega-menu content, shared by the desktop mega menu and the mobile drawer.
 * Ice baths has a mega menu: its products as cards, then a "shop all" panel. Saunas opens the same way
 * in the mobile drawer only (desktop keeps it as a plain link).
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
  /** "contain" for cut-outs on transparent, so the whole product shows (defaults to a cover crop). */
  fit?: "cover" | "contain";
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
  /** Only in the mobile drawer; the desktop header keeps a plain link for it. */
  mobileOnly?: boolean;
};

export const NISEKO_HREF = "/products/niseko-ice-bath";


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
  { id: "saunas", label: "Saunas", href: "/#range" },
  { id: "ice-baths", label: "Ice baths" },
  { id: "about", label: "About us", href: "/#founder" },
  { id: "contact", label: "Contact", href: "/#contact" },
];

export const MENUS: Menu[] = [
  {
    // Same products and Black Friday "from" prices as the homepage range (HeatOrCold).
    id: "saunas",
    label: "Saunas",
    mobileOnly: true,
    products: [
      {
        name: "Glow+ Infrared Sauna",
        tagline: "Infrared indoor sauna",
        img: "/figma/home/glow-plus.webp",
        fit: "contain",
        from: true,
        price: money(3877),
        was: money(5995),
        off: "−35%",
      },
      {
        name: "PureLight Outdoor Sauna",
        tagline: "Full-spectrum heat, built for outdoors",
        img: "/figma/home/purelight.webp",
        fit: "contain",
        from: true,
        price: money(6877),
        was: money(9995),
        off: "−31%",
      },
    ],
    all: { eyebrow: "SAUNAS", title: "Heat that helps you recover", links: [{ label: "Shop all saunas", href: "/#range" }] },
  },
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
      title: "Cold on demand, from 3°C",
      links: [{ label: "Shop all ice baths" }, { label: "Compare ice baths" }, { label: "Filters and accessories" }],
    },
  },
];

/** Mega menus shown in the desktop header. */
export const DESKTOP_MENUS = MENUS.filter((m) => !m.mobileOnly);
