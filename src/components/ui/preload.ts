import { getImageProps } from "next/image";

const done = new Set<string>();

/**
 * Warm the browser cache with images before they're shown. Uses the same optimised srcset and `sizes`
 * as the <Image> that will display them, so the browser picks (and caches) exactly the file it will
 * later need. Background images wait for idle time; interactive images can start immediately.
 */
export function preloadImages(srcs: string[], sizes: string, { eager = false } = {}) {
  if (typeof window === "undefined") return;
  const run = () => {
    for (const src of srcs) {
      const key = `${src}|${sizes}`;
      if (done.has(key)) continue;
      done.add(key);
      const { props } = getImageProps({ src, alt: "", fill: true, sizes });
      const img = new window.Image();
      img.fetchPriority = eager ? "auto" : "low";
      img.decoding = "async";
      if (props.sizes) img.sizes = props.sizes;
      if (props.srcSet) img.srcset = props.srcSet;
      img.src = props.src;
    }
  };
  if (eager) run();
  else if ("requestIdleCallback" in window) window.requestIdleCallback(run, { timeout: 2000 });
  else setTimeout(run, 300);
}
