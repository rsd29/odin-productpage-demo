"use client";

import Image from "next/image";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { ScrollDots } from "../ui/ScrollDots";
import { Arrow, PriceLine } from "./MegaMenu";
import { CAMPAIGN_NOTE, MENUS, NAV_LINKS } from "./nav";

/**
 * Full-screen menu drawer for phones ("ODIN Mobile / Menu drawer" wireframe): slides in from the left,
 * search behind an icon at the top, one section open at a time, and account + tap-to-call after the links.
 */
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const lenis = useLenis();
  const [section, setSection] = useState<string | null>("ice-baths");
  const closeRef = useRef<HTMLButtonElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const productRow = useRef<HTMLUListElement>(null);

  // Freeze the page behind the drawer, move focus in, and close on Esc.
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    // Wait a frame or two: the drawer is still `visibility: hidden` at the very start of its slide-in.
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis, onClose]);

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={!open}
      data-lenis-prevent
      className={`fixed inset-0 z-50 flex flex-col bg-odin-cream transition-[translate,visibility] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none lg:hidden ${
        open ? "visible translate-x-0" : "invisible -translate-x-full"
      }`}
    >
      {/* Top: logo, search, bag, close; the search field opens from its icon. */}
      <div className={`flex flex-col border-b border-line px-5 pt-3 ${searchOpen ? "gap-3 pb-4" : "pb-3"}`}>
        <div className="flex h-11 items-center gap-4">
          <Link href="/" aria-label="ODIN home" onClick={onClose} className="flex min-h-11 items-center">
            <Image src="/brand/odin-logo.svg" alt="ODIN" width={96} height={27} />
          </Link>
          <span className="flex-1" />
          <button
            type="button"
            aria-label={searchOpen ? "Close search" : "Search"}
            aria-expanded={searchOpen}
            aria-controls="mm-search"
            onClick={() => {
              setSearchOpen((o) => !o);
              if (!searchOpen) window.setTimeout(() => searchRef.current?.focus(), 50);
            }}
            className="flex size-11 cursor-pointer items-center justify-center"
          >
            <Image src="/figma/header/search.svg" alt="" width={22} height={22} />
          </button>
          <a href="#" aria-label="Bag, 0 items" className="flex min-h-11 items-center gap-[6px]">
            <Image src="/figma/header/bag.svg" alt="" width={22} height={22} />
            <span className="text-label-sm text-odin-grey">0</span>
          </a>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="-mr-2 flex size-11 cursor-pointer items-center justify-center rounded-full text-odin-grey"
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M4 4l10 10M14 4 4 14" />
            </svg>
          </button>
        </div>
        <label id="mm-search" hidden={!searchOpen} className="flex h-11 items-center gap-3 rounded-full bg-warm-off-white px-4">
          <Image src="/figma/header/search.svg" alt="" width={18} height={18} className="opacity-60" />
          <span className="sr-only">Search</span>
          <input
            ref={searchRef}
            type="search"
            placeholder="Search saunas, ice baths, guides"
            className="text-body min-w-0 flex-1 bg-transparent text-odin-grey placeholder:text-muted focus:outline-none"
          />
        </label>
      </div>

      {/* Ice baths expands to its products; the other sections are plain links. */}
      <nav aria-label="Main" className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4 pt-1">
        {NAV_LINKS.map((l) => {
          const m = MENUS.find((menu) => menu.id === l.id);
          if (!m)
            return (
              <a key={l.id} href={l.href ?? "#"} onClick={onClose} className="flex items-center gap-2 border-b border-line py-4">
                <span className="text-h4 flex-1 text-odin-grey">{l.label}</span>
                <Arrow className="text-odin-grey" />
              </a>
            );
          const isOpen = section === m.id;
          return (
            <div key={m.id} className="border-b border-line">
              <button
                type="button"
                onClick={() => setSection(isOpen ? null : m.id)}
                aria-expanded={isOpen}
                aria-controls={`mm-${m.id}`}
                className="flex w-full cursor-pointer items-center gap-2 py-4 text-left"
              >
                <span className="text-h4 flex-1 text-odin-grey">{m.label}</span>
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="text-odin-grey">
                  <path d="M2.5 8H13.5" />
                  <path
                    d="M8 2.5V13.5"
                    className={`origin-center transition-[transform,opacity] duration-300 ease-in-out motion-reduce:transition-none ${
                      isOpen ? "rotate-90 opacity-0" : "opacity-100"
                    }`}
                  />
                </svg>
              </button>
              <div
                id={`mm-${m.id}`}
                inert={!isOpen}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  {/* Products as a swipeable row of cards (with dots), then the "shop all" links. */}
                  <div className="flex flex-col gap-4 pb-5 pt-1">
                    <ul
                      ref={productRow}
                      className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-px-5 px-5 [scrollbar-width:none]"
                    >
                      {m.products.map((p) => (
                        <li key={p.name} className="w-[220px] shrink-0 snap-start">
                          <a href={p.href ?? "#"} className="flex flex-col gap-3">
                            <span className="relative block aspect-[4/3] overflow-hidden rounded-[8px] bg-warm-off-white">
                              <Image src={p.img} alt="" fill sizes="220px" style={p.focus ? { objectPosition: p.focus } : undefined} className="object-cover" />
                            </span>
                            <span className="flex flex-col gap-1">
                              <span className="text-h5 text-odin-grey">{p.name}</span>
                              <PriceLine p={p} />
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                    <ScrollDots scroller={productRow} count={m.products.length} className="-mt-1" />
                    {m.all.links.map((l) => (
                      <a key={l.label} href={l.href ?? "#"} className="text-label-md flex items-center gap-2 text-odin-grey">
                        {l.label}
                        <Arrow />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {/* Account and tap-to-call follow the links (not pinned, so the menu gets the full height). */}
        <div className="mt-6 flex flex-col gap-3 pb-[max(8px,env(safe-area-inset-bottom))]">
          <div className="text-body flex gap-6 text-odin-grey">
            <a href="#">Account</a>
            <a href="#">Track my order</a>
          </div>
          <a href="tel:1300888669" className="flex items-center gap-3 rounded-[8px] border border-line bg-white px-4 py-3">
            <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
              <span className="text-h5 text-odin-grey">Talk to a specialist</span>
              <span className="font-sans text-[13px] font-light text-muted">Tap to call 1300 888 669, Mon–Sat</span>
            </span>
            <Arrow className="text-odin-grey" />
          </a>
          <p className="font-sans text-[12px] font-light text-muted">{CAMPAIGN_NOTE}</p>
        </div>
      </nav>

    </div>
  );
}
