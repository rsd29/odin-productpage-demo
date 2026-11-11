"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { Container } from "../ui/Container";
import { LiquidGlass } from "../ui/LiquidGlass";
import { MegaMenuPanel } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";
import { MENUS, NAV_LINKS } from "./nav";

/** Fallback campaign-bar height; the real one is measured, so the header compacts exactly as the bar leaves. */
const SCROLL_THRESHOLD = 48;
const EASE = "duration-150 ease-out motion-reduce:transition-none";
const SIZE_EASE = "duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";
const CONTROL = "inline-flex min-h-11 items-center justify-center rounded-sm transition-opacity duration-150 ease-out hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current motion-reduce:transition-none";

/** Mega-menu timing from the wireframe's developer notes. */
const OPEN_DELAY = 150;
const CLOSE_DELAY = 300;

/**
 * `overlay`: the header starts out transparent, with cream text and icons, over a full-bleed hero (the homepage),
 * then turns into the usual glass bar once scrolled. Hover / focus / an open menu still bring back solid cream.
 */
export function Header({ overlay = false }: { overlay?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  // Keeps the last menu rendered while the panel fades out.
  const [shownId, setShownId] = useState(MENUS[0].id);
  const [drawer, setDrawer] = useState(false);
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});
  const burger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const bar = document.querySelector<HTMLElement>("[data-campaign-bar]");
      const compact = window.scrollY >= (bar?.offsetHeight ?? SCROLL_THRESHOLD);
      setScrolled(compact);
      const probeY = compact ? 22 : 38;
      // Adaptive contrast, like iOS: go light when the glass sits over a dark section.
      const dark = Array.from(document.querySelectorAll<HTMLElement>("[data-header-theme='dark']")).some(
        (el) => {
          const r = el.getBoundingClientRect();
          return r.top <= probeY && r.bottom >= probeY;
        },
      );
      setOnDark(dark);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const open = useCallback((id: string) => {
    window.clearTimeout(closeTimer.current);
    setShownId(id);
    setOpenId(id);
  }, []);
  const close = useCallback(() => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
    setOpenId(null);
  }, []);

  // Hover: open after a short pause (instantly when switching between menus); close shortly after leaving.
  const hoverTrigger = (id: string) => (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return; // touch: first tap opens via click instead
    window.clearTimeout(closeTimer.current);
    window.clearTimeout(openTimer.current);
    openTimer.current = window.setTimeout(() => open(id), openId ? 0 : OPEN_DELAY);
  };
  const leaveMenu = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(openTimer.current);
    closeTimer.current = window.setTimeout(close, CLOSE_DELAY);
  };
  const enterMenu = () => window.clearTimeout(closeTimer.current);

  // Esc closes and returns focus to the trigger; scrolling away also closes.
  useEffect(() => {
    if (!openId) return;
    const startY = window.scrollY;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      triggers.current[openId]?.focus();
      close();
    };
    const onScroll = () => Math.abs(window.scrollY - startY) > 80 && close();
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [openId, close]);

  useEffect(() => () => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawer(false);
    burger.current?.focus();
  }, []);

  const menuOpen = openId !== null;
  // Transparent over the hero at the top of an overlay page.
  const clear = overlay && !scrolled && !menuOpen;
  // Light foreground while it's clear over the hero, or glass over a dark section; hover/focus/open menu brings solid cream back.
  const light = clear || (scrolled && onDark && !menuOpen);
  const ink = `transition-[color,filter] ${EASE} ${
    light ? "group-hover:text-odin-grey group-focus-within:text-odin-grey" : ""
  }`;
  const iconInk = `transition-[filter] ${EASE} ${
    light ? "brightness-0 invert group-hover:brightness-100 group-hover:invert-0 group-focus-within:brightness-100 group-focus-within:invert-0" : ""
  }`;
  const solid = (!scrolled && !overlay) || menuOpen;

  return (
    <header
      data-scrolled={scrolled}
      // Reserve the original space so shrinking never shifts the page or changes the scroll threshold.
      className="pointer-events-none sticky top-0 z-40 h-[75px] max-lg:h-[60px]"
    >
      {/* Page dims behind the open menu; clicking it closes the menu. */}
      <div
        aria-hidden
        onClick={close}
        className={`fixed inset-0 -z-10 bg-odin-grey/45 transition-opacity duration-300 ease-out motion-reduce:transition-none max-lg:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "opacity-0"
        }`}
      />

      <div
        onPointerEnter={enterMenu}
        onPointerLeave={leaveMenu}
        // Solid at the top of the page; liquid glass once scrolled. Hover / keyboard focus / an open menu restores solid.
        className={`group pointer-events-auto relative border-b transition-[height,background-color,border-color] motion-reduce:transition-none [transition-duration:350ms,150ms,150ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1),ease-out,ease-out] ${
          scrolled ? "h-[45px]" : "h-[75px] max-lg:h-[60px]"
        } ${
          solid
            ? "border-line bg-odin-cream"
            : "border-transparent bg-transparent focus-within:border-line focus-within:bg-odin-cream hover:border-line hover:bg-odin-cream"
        }`}
      >
        <LiquidGlass
          className={`transition-opacity ${EASE} group-hover:opacity-0 group-focus-within:opacity-0 ${
            solid || clear ? "opacity-0" : "opacity-100"
          }`}
        />
        <Container className="relative h-full">
          <nav className="flex h-full items-center" aria-label="Main">
            <Link href="/" aria-label="ODIN home" className={`${CONTROL} shrink-0`}>
              <span
                className={`block transition-[width] ${SIZE_EASE} ${scrolled ? "w-[84px]" : "w-[119px] max-lg:w-[96px]"}`}
              >
                <Image src="/brand/odin-logo.svg" alt="ODIN" width={119} height={34} priority className={`h-auto w-full ${iconInk}`} />
              </span>
            </Link>
            <div className="flex-1" />
            <ul
              className={`flex items-center gap-10 font-display text-[16px] font-medium leading-[1.5] max-xl:gap-7 max-lg:hidden ${
                light ? "text-odin-cream" : "text-odin-grey"
              } ${ink}`}
            >
              {NAV_LINKS.map((l) => {
                const m = MENUS.find((menu) => menu.id === l.id);
                // Plain link: hovering it while the mega menu is open lets the menu close.
                if (!m)
                  return (
                    <li key={l.id}>
                      <a href={l.href ?? "#"} onPointerEnter={leaveMenu} className={`${CONTROL} whitespace-nowrap`}>
                        {l.label}
                      </a>
                    </li>
                  );
                const isOpen = openId === m.id;
                return (
                  <li key={m.id}>
                    <button
                      ref={(el) => {
                        triggers.current[m.id] = el;
                      }}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls="mega-panel"
                      onPointerEnter={hoverTrigger(m.id)}
                      onClick={() => (isOpen ? close() : open(m.id))}
                      className={`${CONTROL} cursor-pointer gap-[6px] whitespace-nowrap underline-offset-[6px] ${isOpen ? "underline decoration-1" : ""}`}
                    >
                      {m.label}
                      <svg
                        aria-hidden="true"
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        className={`transition-transform duration-200 ease-out motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
                      >
                        <path d="m2 3.75 3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="flex-1" />
            <div className="flex items-center gap-[22px] max-lg:gap-4">
              <button type="button" aria-label="Search" className={`${CONTROL} cursor-pointer`}>
                <Image src="/figma/header/search.svg" alt="" width={22} height={22} className={iconInk} />
              </button>
              <a href="#" aria-label="Account" className={`${CONTROL} max-lg:hidden`}>
                <Image src="/figma/header/account.svg" alt="" width={22} height={22} className={iconInk} />
              </a>
              <a href="#" aria-label="Bag, 0 items" className={`${CONTROL} gap-[6px]`}>
                <Image src="/figma/header/bag.svg" alt="" width={22} height={22} className={iconInk} />
                <span className={`text-label-sm ${light ? "text-odin-cream" : "text-odin-grey"} ${ink}`}>0</span>
              </a>
              <button
                ref={burger}
                type="button"
                aria-label="Open menu"
                aria-expanded={drawer}
                aria-controls="mobile-menu"
                onClick={() => setDrawer(true)}
                className={`${CONTROL} -mr-2 w-11 cursor-pointer lg:hidden ${light ? "text-odin-cream" : "text-odin-grey"} ${ink}`}
              >
                <svg aria-hidden="true" width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M3.5 6.5h15M3.5 11h15M3.5 15.5h15" />
                </svg>
              </button>
            </div>
          </nav>
        </Container>

        {/* Desktop mega menu panel */}
        <div
          id="mega-panel"
          role="region"
          aria-label={`${MENUS.find((m) => m.id === shownId)?.label} menu`}
          inert={!menuOpen}
          className={`absolute inset-x-0 top-full border-t border-line bg-odin-cream shadow-[0_16px_32px_rgba(0,0,0,0.1)] transition-[opacity,translate,visibility] duration-250 ease-out motion-reduce:transition-none max-lg:hidden ${
            menuOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
          }`}
        >
          {MENUS.map((m) => (
            <div key={m.id} hidden={m.id !== shownId}>
              <MegaMenuPanel menu={m} />
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-auto">
        <MobileMenu open={drawer} onClose={closeDrawer} />
      </div>
    </header>
  );
}
