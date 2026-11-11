import { FramedImage, type Frame } from "../ui/FramedImage";
import { SIZES, type SizeId } from "./data";

/** Tub centre + zoom per cut-out (measured from each image's opaque pixels) so every tub fills ~85% of its box. */
const N = "/products/niseko";
const VARIANT_FRAME: Record<string, Frame> = {
  [`${N}/variant-solo.webp`]: { x: 0.415, y: 0.505, zoom: 1.25 },
  [`${N}/variant-solo-tub.webp`]: { x: 0.49, y: 0.5, zoom: 1.33 },
  [`${N}/variant-lux.webp`]: { x: 0.485, y: 0.535, zoom: 1.6 },
  [`${N}/variant-grande.webp`]: { x: 0.5, y: 0.5, zoom: 1.38 },
  [`${N}/black-1.webp`]: { x: 0.506, y: 0.5, zoom: 1.07 },
  [`${N}/black-2.webp`]: { x: 0.5, y: 0.5, zoom: 1.31 },
  [`${N}/black-3.webp`]: { x: 0.502, y: 0.5, zoom: 1.25 },
  [`${N}/black-4.webp`]: { x: 0.5, y: 0.5, zoom: 1.36 },
};

/** Every size's cut-out in every finish, for preloading. */
export const VARIANT_IMAGES = Object.keys(VARIANT_FRAME);

/** Visual tweak on top of the true-to-length scale: Solo reads a touch bigger, Lux a touch smaller. */
const SIZE_NUDGE: Partial<Record<SizeId, number>> = { solo: 1.19, lux: 0.95 };

/**
 * A size's cut-out, scaled by length relative to Grande on a common baseline. Shared by the size cards
 * and the compare-sizes modal so the tubs read at exactly the same relative scale in both.
 * Fills its nearest positioned parent.
 */
export function SizeCutout({ id, src, sizes }: { id: SizeId; src: string; sizes: string }) {
  const scale = (SIZES[id].length / SIZES.grande.length) * (SIZE_NUDGE[id] ?? 1);
  return (
    <span className="absolute inset-0 origin-bottom" style={{ transform: `scale(${scale})` }}>
      <FramedImage src={src} alt={`Niseko ${SIZES[id].name}`} sizes={sizes} {...VARIANT_FRAME[src]} />
    </span>
  );
}
