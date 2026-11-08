import Image from "next/image";

export function CampaignBar() {
  return (
    <a
      href="#"
      className="flex h-9 items-center justify-center gap-[10px] bg-odin-grey px-20 text-odin-cream max-lg:px-5"
    >
      <span className="text-body truncate max-lg:text-[13px]">Black Friday: Our biggest sale of the year</span>
      <Image src="/figma/shared/arrow-cream.svg" alt="" width={14} height={14} />
    </a>
  );
}
