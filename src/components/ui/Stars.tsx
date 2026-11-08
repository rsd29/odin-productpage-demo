import Image from "next/image";

/** Five-star rating row. `size` 15 = buy box, 13 = review cards. */
export function Stars({ rating = 5, size }: { rating?: number; size: 13 | 15 }) {
  const full = size === 15 ? "/figma/hero/star.svg" : "/figma/reviews/star.svg";
  const empty = "/figma/reviews/star-empty.svg";
  return (
    <div className="flex items-center gap-[2px]" aria-label={`${rating} out of 5 stars`} role="img">
      {Array.from({ length: 5 }, (_, i) => (
        <Image key={i} src={i < rating ? full : empty} alt="" width={size} height={size} />
      ))}
    </div>
  );
}
