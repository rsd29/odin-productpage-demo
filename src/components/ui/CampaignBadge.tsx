/** HF / Campaign badge — campaign price badge. */
export function CampaignBadge({
  campaign,
  discount,
  className = "",
}: {
  campaign: string;
  discount?: string;
  className?: string;
}) {
  return (
    <div className={`flex shrink-0 items-stretch overflow-hidden rounded-[4px] ${className}`}>
      {/* Neue Montreal Medium, like the prices it sits beside. */}
      <span className="flex items-center bg-odin-blue px-[9px] py-[5px] font-display text-[12px] font-medium uppercase leading-normal tracking-[0.08em] text-odin-grey whitespace-nowrap">
        {campaign}
      </span>
      {discount && (
        <span className="flex items-center bg-odin-grey px-2 py-[5px] font-display text-[12px] font-medium leading-normal text-odin-cream whitespace-nowrap">
          {discount}
        </span>
      )}
    </div>
  );
}
