"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { ADDONS, SIZES, type AddonId, type Finish, type SizeId } from "./data";

type ProductState = {
  size: SizeId;
  setSize: (s: SizeId) => void;
  finish: Finish;
  setFinish: (finish: Finish) => void;
  /** Tub only (no chiller) — Solo only. */
  tubOnly: boolean;
  setTubOnly: (v: boolean) => void;
  addons: Set<AddonId>;
  toggleAddon: (id: AddonId) => void;
  compareOpen: boolean;
  setCompareOpen: (open: boolean) => void;
  /** The buy-box CTA; the sticky bar appears once it scrolls out of view. */
  ctaEl: HTMLElement | null;
  setCtaEl: (el: HTMLElement | null) => void;
  /** Whether the sticky buy bar is showing (other sticky UI offsets below it). */
  stickyBarVisible: boolean;
  setStickyBarVisible: (v: boolean) => void;
};

const ProductContext = createContext<ProductState | null>(null);

const chillerAddons = new Set(ADDONS.filter((a) => a.needsChiller).map((a) => a.id));

export function ProductProvider({ children }: { children: ReactNode }) {
  const [size, setSizeState] = useState<SizeId>("solo");
  const [finish, setFinish] = useState<Finish>("Red Cedar");
  const [tubOnly, setTubOnlyState] = useState(false);
  const [addons, setAddons] = useState<Set<AddonId>>(() => new Set());
  const [compareOpen, setCompareOpen] = useState(false);
  const [ctaEl, setCtaEl] = useState<HTMLElement | null>(null);
  const [stickyBarVisible, setStickyBarVisible] = useState(false);

  const dropChillerAddons = () =>
    setAddons((prev) => new Set([...prev].filter((id) => !chillerAddons.has(id))));

  const setSize = (s: SizeId) => {
    setSizeState(s);
    if (!SIZES[s].tubOnly) setTubOnlyState(false);
  };

  const setTubOnly = (v: boolean) => {
    setTubOnlyState(v);
    if (v) dropChillerAddons();
  };

  const toggleAddon = (id: AddonId) =>
    setAddons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <ProductContext.Provider
      value={{
        size,
        setSize,
        finish,
        setFinish,
        tubOnly,
        setTubOnly,
        addons,
        toggleAddon,
        compareOpen,
        setCompareOpen,
        ctaEl,
        setCtaEl,
        stickyBarVisible,
        setStickyBarVisible,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProduct must be used inside <ProductProvider>");
  return ctx;
}
