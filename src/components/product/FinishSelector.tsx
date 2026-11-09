"use client";

import { FINISHES } from "./data";
import { useProduct } from "./ProductContext";

export function FinishSelector() {
  const { finish, setFinish } = useProduct();

  return (
    <fieldset className="min-w-0">
      {/* The chosen finish shows in the selector itself, so it isn't repeated beside the label. */}
      <legend className="text-h5 mb-3 text-odin-grey">Colour</legend>
      <div className="grid grid-cols-2 gap-3">
        {FINISHES.map((option) => (
          <label key={option} className="relative min-w-0 cursor-pointer">
            <input
              type="radio"
              name="finish"
              value={option}
              checked={finish === option}
              onChange={() => setFinish(option)}
              className="peer sr-only"
            />
            <span className="flex min-h-16 items-center gap-3 rounded-[6px] border border-line bg-white/40 px-4 py-3 transition-[border-color,background-color,box-shadow] duration-150 ease-out hover:border-muted peer-checked:border-odin-grey peer-checked:bg-white peer-checked:shadow-[0_0_0_1px_var(--color-odin-grey)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-odin-grey motion-reduce:transition-none">
              <span
                aria-hidden="true"
                className="size-8 shrink-0 rounded-full border border-black/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
                style={{
                  background:
                    option === "Black"
                      ? "linear-gradient(135deg, #474644, #1c1c1b)"
                      : "linear-gradient(135deg, rgb(255 255 255 / 0.12), rgb(0 0 0 / 0.1)), repeating-linear-gradient(92deg, #aa704c 0 3px, #bd875e 3px 6px, #b17a55 6px 9px)",
                }}
              />
              <span className="text-label-md text-odin-grey">{option}</span>
              <svg
                aria-hidden="true"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className={`ml-auto shrink-0 text-odin-grey transition-opacity duration-150 motion-reduce:transition-none ${finish === option ? "opacity-100" : "opacity-0"}`}
              >
                <path d="m3 7 2.5 2.5L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
