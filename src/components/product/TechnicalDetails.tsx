"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { SIZES, SIZE_ORDER } from "./data";

const FEATURES = [
  "Certified red cedar",
  "Premium stainless steel",
  "1HP chiller, 3°C – 35°C",
  "23 L/min high-flow pump",
  "Ozone and filtration",
  "Triple-insulated cover",
  "Premium cedar ice bath step",
  "Comfortable headrest",
  "Indoor and outdoor use",
  "Fits through standard doors",
];

const BENEFITS = [
  "Faster recovery",
  "Less soreness and inflammation",
  "Supports immune function",
  "Elevates mood",
  "Sharper mental clarity",
  "Improves metabolism",
];

const SIZE_HEAD = SIZE_ORDER.map((id) => SIZES[id].name.toUpperCase());
const perSize = (fn: (id: (typeof SIZE_ORDER)[number]) => string) => SIZE_ORDER.map(fn);

function SpecTable({ head, rows }: { head?: string[]; rows: [string, ...string[]][] }) {
  return (
    <div className="flex flex-col pl-[30px] max-lg:pl-0">
      {head && (
        <div className="text-label-sm flex items-center gap-2 py-2 text-muted">
          <span className="w-[150px] shrink-0 max-lg:w-[96px]" />
          {head.map((h) => (
            <span key={h} className="flex-1">
              {h}
            </span>
          ))}
        </div>
      )}
      {rows.map(([label, ...values], i) => (
        <div
          key={label}
          className={`text-body flex items-center gap-2 py-2 ${
            head || i > 0 ? "border-t-[0.5px] border-line" : ""
          }`}
        >
          <span className="w-[150px] shrink-0 text-muted max-lg:w-[96px]">{label}</span>
          {values.map((v, j) => (
            <span key={j} className="flex-1 text-odin-grey">
              {v}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Quiet text columns aligned with the accordion title, with hairlines separating rows. */
function PointGrid({ items }: { items: string[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-6 pl-[30px] max-lg:grid-cols-1">
      {items.map((label, i) => (
        <li
          key={label}
          // Hairlines between rows: every row on phones (one column), from the second row on desktop (two columns).
          className={`text-body flex min-w-0 items-center py-3 text-olive-grey ${i > 0 ? "max-lg:border-t-[0.5px] max-lg:border-line" : ""} ${i > 1 ? "lg:border-t-[0.5px] lg:border-line" : ""}`}
        >
          {label}
        </li>
      ))}
    </ul>
  );
}

const ITEMS: { id: string; title: string; icon: string; content: ReactNode }[] = [
  { id: "features", title: "Features", icon: "/figma/hero/acc-features.svg", content: <PointGrid items={FEATURES} /> },
  { id: "benefits", title: "Benefits", icon: "/figma/hero/acc-features.svg", content: <PointGrid items={BENEFITS} /> },
  {
    id: "dimensions",
    title: "Dimensions",
    icon: "/figma/hero/acc-dimensions.svg",
    content: (
      <SpecTable
        head={SIZE_HEAD}
        rows={[
          ["Width", ...perSize((id) => `${SIZES[id].width} cm`)],
          ["Length", ...perSize((id) => `${SIZES[id].length} cm`)],
          ["Depth", ...perSize((id) => `${SIZES[id].depth} cm`)],
          ["Doorways", "Fits through standard door frames"],
        ]}
      />
    ),
  },
  {
    id: "weight",
    title: "Weight & Volume",
    icon: "/figma/hero/acc-weight.svg",
    content: (
      <SpecTable
        head={SIZE_HEAD}
        rows={[
          ["Capacity", ...perSize((id) => SIZES[id].capacity ?? "TBC")],
          ["Weight", "TBC", "TBC", "TBC"],
        ]}
      />
    ),
  },
  {
    id: "electrical",
    title: "Electrical",
    icon: "/figma/hero/acc-electrical.svg",
    content: (
      <SpecTable
        rows={[
          ["Chiller", "1 HP"],
          ["Temperature range", "3°C – 35°C"],
          ["Pump flow", "23 L/min"],
          ["Water treatment", "Ozone treatment and water filtration"],
          ["Control", "Touch panel, WiFi app (iOS and Android)"],
          ["Voltage", "TBC"],
        ]}
      />
    ),
  },
  {
    id: "manual",
    title: "User Manual",
    icon: "/figma/hero/acc-manual.svg",
    content: (
      <div className="flex flex-col items-start gap-[10px] pl-[30px]">
        <a href="#" className="text-body text-odin-grey underline">
          Niseko user manual (PDF)
        </a>
        <a href="#" className="text-body text-odin-grey underline">
          Chiller quick start guide (PDF)
        </a>
      </div>
    ),
  },
];

export function TechnicalDetails() {
  const [open, setOpen] = useState<Set<string>>(() => new Set(["features"]));
  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="flex w-full flex-col border-b border-line">
      {ITEMS.map((item) => {
        const isOpen = open.has(item.id);
        return (
          <div key={item.id} className="flex flex-col border-t border-line py-4">
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              aria-controls={`tech-${item.id}`}
              className="flex w-full cursor-pointer items-center gap-3 text-left"
            >
              <Image src={item.icon} alt="" width={18} height={18} />
              <span className="text-h5 flex-1 text-odin-grey">{item.title}</span>
              {/* Same plus → minus as the FAQ: the vertical bar rotates and fades out. */}
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                className="shrink-0 text-odin-grey"
              >
                <path d="M2.5 8H13.5" />
                <path
                  d="M8 2.5V13.5"
                  className={`origin-center transition-[transform,opacity] duration-300 ease-in-out motion-reduce:transition-none ${
                    isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                  }`}
                />
              </svg>
            </button>
            {/* Same height + fade reveal as the FAQ. */}
            <div
              id={`tech-${item.id}`}
              aria-hidden={!isOpen}
              inert={!isOpen}
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="pt-[14px]">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
