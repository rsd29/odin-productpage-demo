import Image from "next/image";

export function CampaignBar() {
  return (
    <a
      href="#"
      data-campaign-bar
      className="flex h-12 items-center justify-center gap-3 bg-odin-grey px-20 text-odin-cream max-lg:h-11 max-lg:px-5"
    >
      <span className="truncate py-[2px] font-sans text-[16px] font-medium leading-[1.35] max-lg:text-[14px]">
        Black Friday: Our biggest sale of the year
      </span>
      <Image src="/figma/shared/arrow-cream.svg" alt="" width={16} height={16} />
    </a>
  );
}
