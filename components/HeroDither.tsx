"use client";

import { useEffect, useRef } from "react";

// 4x4 Bayer matrix: the ordered-dither threshold for each pixel
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

const hash = (x: number, y: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** Very subtle dithered flakes behind the hero: smooth noise, thresholded with a Bayer matrix. */
export default function HeroDither() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const draw = () => {
      const CELL = 3;
      const w = cv.clientWidth;
      const h = cv.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      const ctx = cv.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);
      const style = getComputedStyle(document.documentElement);
      const light = document.documentElement.dataset.theme === "light";
      ctx.fillStyle = style.getPropertyValue("--fg").trim() || "#fff";
      ctx.globalAlpha = light ? 0.2 : 0.16;
      const cols = Math.ceil(w / CELL);
      const rows = Math.ceil(h / CELL);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const u = (x * CELL) / 260;
          const v = (y * CELL) / 260;
          // smooth pseudo-noise from a few sines, 0..1
          const n = (Math.sin(u * 1.3 + Math.sin(v * 0.9)) + Math.sin(v * 1.1 - u * 0.7) + Math.sin((u + v) * 0.6) + 3) / 6;
          const dens = Math.max(0, n - 0.42) * 0.55; // sparse: most of the page stays empty
          if (dens * 16 > BAYER[(y & 3) * 4 + (x & 3)] * 0.4 + hash(x + 5, y + 9) * 6 && hash(x, y) < 0.3) ctx.fillRect(x * CELL, y * CELL, CELL - 1, CELL - 1);
        }
      }
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(cv);
    const mo = new MutationObserver(draw);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="hero-dither pointer-events-none absolute inset-0 -z-10 h-full w-full"
      style={{ maskImage: "linear-gradient(to bottom, transparent, #000 12%, #000 70%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 12%, #000 70%, transparent)" }}
    />
  );
}
