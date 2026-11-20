"use client";

import { useEffect } from "react";

/**
 * Scroll-driven parallax reveal. Every [data-reveal] element rises and fades in as it scrolls into view;
 * the amount of travel (data-reveal="1.5") differs per element, so neighbours move at different speeds.
 * Once an element has arrived its inline styles are removed, so nothing keeps a transform on it.
 */
export default function ScrollReveal() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    let frame = 0;

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const el of els) {
        const depth = parseFloat(el.dataset.reveal || "1") || 1;
        const top = el.getBoundingClientRect().top;
        const start = vh * 0.98;
        const end = vh * (0.98 - 0.3 * Math.min(depth, 1.6));
        const raw = (start - top) / (start - end);
        const p = Math.min(1, Math.max(0, raw));
        if (p >= 1) {
          if (el.style.transform || el.style.opacity) {
            el.style.transform = "";
            el.style.opacity = "";
            el.style.filter = "";
          }
          continue;
        }
        const e = 1 - Math.pow(1 - p, 3);
        el.style.transform = `translate3d(0, ${(1 - e) * 90 * depth}px, 0)`;
        el.style.opacity = String(e);
        el.style.filter = e < 0.98 ? `blur(${(1 - e) * 4}px)` : "";
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
      els.forEach((el) => {
        el.style.transform = el.style.opacity = el.style.filter = "";
      });
    };
  }, []);
  return null;
}
