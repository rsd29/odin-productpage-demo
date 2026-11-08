"use client";

import { Fragment, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";

/**
 * Liquid glass — physically based refraction of the live page behind an element.
 *
 * Technique (after kube.io/blog/liquid-glass-css-svg): the glass is a slab whose top and bottom
 * edges curve down in a squircle bezel. For each pixel we trace a vertical ray through that surface
 * with Snell's law (n = ior) and compute how far it shifts, along the rim's normal, before hitting the
 * page. Those shifts are encoded into a displacement map (red = X, green = Y; 128 = none) and fed to an SVG
 * <feDisplacementMap> used as a backdrop-filter, so the content scrolling underneath bends at the
 * rims in real time. Three passes at slightly different strengths, one per colour channel, give
 * chromatic dispersion. No rim highlights or edge glow — just the refracting glass.
 *
 * SVG backdrop filters are Chromium-only; elsewhere this falls back to frosted glass.
 */

type Props = {
  /** Bezel depth in from the edges, px (capped at half the height). */
  bezel?: number;
  /** Glass thickness, px — scales how far light bends. */
  thickness?: number;
  /** Index of refraction (glass ≈ 1.5). */
  ior?: number;
  /** Frost under the refraction, px. */
  blur?: number;
  /** Channel spread for chromatic dispersion (0 = none). */
  dispersion?: number;
  /** Cream tint over the glass, 0–1. 0 = clear glass (the fallback always keeps some for legibility). */
  tint?: number;
  /**
   * Corner radius, px, for glass shaped like a rounded rectangle or pill (use a large value for a
   * pill), so its rounded ends refract too. Omit for a straight full-width bar.
   */
  radius?: number;
  className?: string;
};

const squircle = (t: number) => Math.pow(1 - Math.pow(1 - t, 4), 1 / 4);

/** Lateral shift of a vertical ray entering the glass `d` px in from its edge (0 once past the bezel). */
function rimShift(d: number, bezel: number, thickness: number, ior: number) {
  if (d >= bezel) return 0;
  const dt = 0.001;
  const t = Math.max(d / bezel, dt);
  const h = squircle(t) * thickness; // glass height above the page here
  const dh = ((squircle(Math.min(t + dt, 1)) - squircle(Math.max(t - dt, 0))) / (2 * dt)) * (thickness / bezel);
  const incidence = Math.atan(dh); // surface tilt = angle between vertical ray and normal
  const refracted = Math.asin(Math.sin(incidence) / ior);
  return h * Math.tan(incidence - refracted); // lateral travel through the slab
}

/**
 * Build the displacement map (R = x shift, G = y shift; 128 = none) and return it with its max shift.
 * `radius` undefined: a straight bar — only the top and bottom rims bend (1-px-wide column, stretched).
 * `radius` set: a rounded rectangle — every rim bends along its normal, including round pill ends.
 */
function buildMap(width: number, height: number, bezel: number, thickness: number, ior: number, radius?: number) {
  const cols = radius === undefined ? 2 : width;
  const dx = new Float32Array(cols * height);
  const dy = new Float32Array(cols * height);
  const hw = width / 2;
  const hh = height / 2;
  const r = Math.min(radius ?? 0, hw, hh);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < cols; x++) {
      let d: number, nx: number, ny: number; // distance in from the edge, outward normal
      const py = y + 0.5 - hh;
      if (radius === undefined) {
        d = hh - Math.abs(py);
        nx = 0;
        ny = Math.sign(py);
      } else {
        // Rounded-rectangle signed distance field.
        const px = x + 0.5 - hw;
        const qx = Math.abs(px) - (hw - r);
        const qy = Math.abs(py) - (hh - r);
        if (qx > 0 && qy > 0) {
          const len = Math.hypot(qx, qy);
          d = r - len;
          nx = (qx / len) * Math.sign(px);
          ny = (qy / len) * Math.sign(py);
        } else if (qx > qy) {
          d = r - qx;
          nx = Math.sign(px);
          ny = 0;
        } else {
          d = r - qy;
          nx = 0;
          ny = Math.sign(py);
        }
      }
      const s = rimShift(Math.max(d, 0), bezel, thickness, ior);
      // Convex rim bends rays inward: sample from further inside the glass.
      dx[y * cols + x] = -nx * s;
      dy[y * cols + x] = -ny * s;
    }
  }

  let max = 1e-6;
  for (let i = 0; i < dx.length; i++) max = Math.max(max, Math.abs(dx[i]), Math.abs(dy[i]));

  const canvas = document.createElement("canvas");
  canvas.width = cols;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(cols, height);
  for (let i = 0; i < dx.length; i++) {
    img.data[i * 4] = Math.round(128 + (dx[i] / max) * 127);
    img.data[i * 4 + 1] = Math.round(128 + (dy[i] / max) * 127);
    img.data[i * 4 + 2] = 128;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return { url: canvas.toDataURL(), max };
}

/** Glass fallback for browsers without SVG backdrop filters: clear-ish body, heavier rims. */
const FALLBACK_BODY = "blur(6px) saturate(1.6)";
const FALLBACK_RIM = "blur(14px) saturate(1.9) brightness(1.04)";
const FALLBACK_TINT = 0.12;

/** Mask that keeps only the rim bands: top + bottom always, plus both ends for a pill. */
function rimMask(bezel: number, radius?: number) {
  const band = Math.round(bezel * 0.8);
  const vertical = `linear-gradient(to bottom, #000, transparent ${band}px, transparent calc(100% - ${band}px), #000)`;
  if (radius === undefined) return vertical;
  const end = Math.round(radius * 0.9);
  return `${vertical}, linear-gradient(to right, #000, transparent ${end}px, transparent calc(100% - ${end}px), #000)`;
}

// Only Chromium applies SVG filters as backdrop-filter. Static per session, so no subscription needed.
const noop = () => () => {};
const isChromium = () =>
  !!(navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }).userAgentData?.brands?.some(
    (b) => /Chromium/i.test(b.brand),
  );

const CHANNEL = {
  r: "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0",
  g: "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0",
  b: "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0",
};

export function LiquidGlass({
  bezel = 22,
  thickness = 28,
  ior = 1.5,
  blur = 3.5,
  dispersion = 0.05,
  tint = 0,
  radius,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const filterId = `liquid-glass-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const supported = useSyncExternalStore(noop, isChromium, () => false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((s) =>
        s && s.w === Math.round(width) && s.h === Math.round(height)
          ? s
          : { w: Math.round(width), h: Math.round(height) },
      );
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const height = size?.h ?? 0;
  // A straight bar's map doesn't depend on width, so don't rebuild it on horizontal resizes.
  const width = radius === undefined ? 0 : (size?.w ?? 0);
  const map = useMemo(
    () =>
      supported && height
        ? buildMap(width, height, Math.min(bezel, height / 2), thickness, ior, radius)
        : null,
    [supported, width, height, bezel, thickness, ior, radius],
  );

  const live = supported && map && size;
  const scale = live ? map.max * 2 : 0; // feDisplacementMap maps 0..1 → −scale/2..+scale/2

  return (
    <div ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      {live && (
        <svg width="0" height="0" className="absolute" colorInterpolationFilters="sRGB">
          <filter
            id={filterId}
            x="0"
            y="0"
            width={size.w}
            height={size.h}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation={blur} edgeMode="duplicate" result="frost" />
            <feColorMatrix in="frost" type="saturate" values="1.5" result="body" />
            <feImage
              href={map.url}
              x="0"
              y="0"
              width={size.w}
              height={size.h}
              preserveAspectRatio="none"
              result="map"
            />
            {(["r", "g", "b"] as const).map((c, i) => (
              // Filter primitives must be direct children of <filter> — no <g> wrapper.
              <Fragment key={c}>
                <feDisplacementMap
                  in="body"
                  in2="map"
                  scale={scale * (1 + (i - 1) * dispersion)}
                  xChannelSelector="R"
                  yChannelSelector="G"
                  result={`d${c}`}
                />
                <feColorMatrix in={`d${c}`} type="matrix" values={CHANNEL[c]} result={c} />
              </Fragment>
            ))}
            <feBlend in="r" in2="g" mode="screen" result="rg" />
            <feBlend in="rg" in2="b" mode="screen" result="refracted" />
            {/* Anti-alias the steep rim gradient so lensed content stays smooth, not stepped. */}
            <feGaussianBlur in="refracted" stdDeviation="0.4" edgeMode="duplicate" />
          </filter>
        </svg>
      )}

      {/* Refracting body (or the glass fallback's clear body) */}
      <div
        className="absolute inset-0 rounded-[inherit]"
        style={
          live
            ? { backdropFilter: `url(#${filterId})` }
            : { backdropFilter: FALLBACK_BODY, WebkitBackdropFilter: FALLBACK_BODY }
        }
      />
      {/*
        Fallback rims (Safari / every iPhone browser, Firefox): no SVG refraction there, so imitate the
        lensing instead — a band along each rim, as deep as the bezel, that blurs and saturates harder
        than the body, the way thicker curved glass smears what's behind it. Pills get rims at both ends
        too. No highlight or glow, matching the live glass.
      */}
      {!live && (
        <div
          className="absolute inset-0 rounded-[inherit]"
          style={{
            backdropFilter: FALLBACK_RIM,
            WebkitBackdropFilter: FALLBACK_RIM,
            maskImage: rimMask(bezel, radius),
            WebkitMaskImage: rimMask(bezel, radius),
          }}
        />
      )}
      {/* Optional tint (clear by default; the fallback keeps a whisper of cream for body) */}
      {(live ? tint : FALLBACK_TINT) > 0 && (
        <div
          className="absolute inset-0 rounded-[inherit]"
          style={{ backgroundColor: `rgb(254 247 239 / ${live ? tint : FALLBACK_TINT})` }}
        />
      )}
    </div>
  );
}
