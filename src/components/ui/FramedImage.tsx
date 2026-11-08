import Image from "next/image";

export type Frame = {
  /** Point of the image (0–1 fractions) to centre in the frame, e.g. the middle of the product. */
  x?: number;
  y?: number;
  /** 1 = plain object-cover; above 1 crops in tighter around the focus point. */
  zoom?: number;
};

type Props = Frame & {
  src: string;
  alt: string;
  sizes: string;
  /** Source width ÷ height. */
  ratio?: number;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  /** Fires once the image has loaded (e.g. to start a crossfade). */
  onLoad?: () => void;
};

/**
 * Fills its positioned parent like object-cover, but centred on a chosen focus point and optionally
 * zoomed in, so the product stays in frame whatever the box's shape. Offsets are clamped, so the
 * image always covers the box (no gaps at the edges).
 */
export function FramedImage({
  src,
  alt,
  sizes,
  x = 0.5,
  y = 0.5,
  zoom = 1,
  ratio = 1,
  priority,
  className = "",
  imgClassName = "",
  onLoad,
}: Props) {
  const w = `(max(100cqw, 100cqh * ${ratio}) * ${zoom})`;
  const h = `(${w} / ${ratio})`;
  return (
    <div className={`absolute inset-0 overflow-hidden [container-type:size] ${className}`}>
      <div
        className="absolute"
        style={{
          width: `calc${w}`,
          height: `calc${h}`,
          left: `clamp(calc(100cqw - ${w}), calc(50cqw - ${x} * ${w}), 0px)`,
          top: `clamp(calc(100cqh - ${h}), calc(50cqh - ${y} * ${h}), 0px)`,
        }}
      >
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} onLoad={onLoad} className={`object-cover ${imgClassName}`} />
      </div>
    </div>
  );
}
