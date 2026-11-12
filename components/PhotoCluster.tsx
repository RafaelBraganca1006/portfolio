"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { layout, photoMeta, photos } from "@/data/photos";

type Open = { index: number; from: DOMRect } | null;

// The mosaic is a tree of splits: H = side by side, V = stacked. Hovering a photo gives the branches that
// contain it a bigger share of each split, so the others make room instead of being covered.
type Node = { dir: "H" | "V"; kids: Node[] } | { file: string };
const TREE: Node = {
  dir: "H",
  kids: [
    {
      dir: "V",
      kids: [
        { dir: "H", kids: [{ file: "IMG_6956.jpg" }, { file: "IMG_7133.jpg" }, { file: "IMG_0631.jpg" }, { file: "IMG_0195.jpg" }] },
        { dir: "H", kids: [{ file: "IMG_0587.jpg" }, { file: "portrait.jpg" }] },
        { dir: "H", kids: [{ file: "IMG_7467.jpg" }, { file: "IMG_7188.jpg" }, { file: "IMG_0031.jpg" }] },
      ],
    },
    { dir: "V", kids: [{ file: "IMG_9738.jpg" }, { file: "IMG_0189.jpg" }] },
  ],
};
const GAP = 0.9; // same gap as the generated layout, in % of the mosaic width
const GROW = 1.7; // how much more room a branch gets for the hovered photo

type Rect = { x: number; y: number; w: number; h: number };
const byFile = Object.fromEntries(layout.items.map((i) => [i.file, i]));
const leafRect = (file: string): Rect => {
  const it = byFile[file];
  const p = photoMeta[file];
  return { x: it.x, y: it.y, w: it.w, h: (it.w * p.h) / p.w };
};
const has = (n: Node, file: string): boolean => ("file" in n ? n.file === file : n.kids.some((k) => has(k, file)));
function bbox(n: Node): Rect {
  if ("file" in n) return leafRect(n.file);
  const r = n.kids.map(bbox);
  const x = Math.min(...r.map((q) => q.x));
  const y = Math.min(...r.map((q) => q.y));
  return { x, y, w: Math.max(...r.map((q) => q.x + q.w)) - x, h: Math.max(...r.map((q) => q.y + q.h)) - y };
}
const NATURAL = bbox(TREE);

function solve(n: Node, x: number, y: number, w: number, h: number, hover: string | null, out: Record<string, Rect>) {
  if ("file" in n) {
    out[n.file] = { x, y, w, h };
    return;
  }
  const horizontal = n.dir === "H";
  const weights = n.kids.map((k) => {
    const b = bbox(k);
    return (horizontal ? b.w : b.h) * (hover && has(k, hover) ? GROW : 1);
  });
  const total = weights.reduce((a, b) => a + b, 0);
  const avail = (horizontal ? w : h) - GAP * (n.kids.length - 1);
  let pos = horizontal ? x : y;
  n.kids.forEach((k, i) => {
    const size = (avail * weights[i]) / total;
    if (horizontal) solve(k, pos, y, size, h, hover, out);
    else solve(k, x, pos, w, size, hover, out);
    pos += size + GAP;
  });
}

export default function PhotoCluster() {
  const [open, setOpen] = useState<Open>(null);
  const [hover, setHover] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rects: Record<string, Rect> = {};
  solve(TREE, NATURAL.x, NATURAL.y, NATURAL.w, NATURAL.h, hover, rects);

  // a short delay so moving across the mosaic does not make it jump around
  const enter = (file: string) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setHover(file), hover ? 0 : 60);
  };
  const leave = () => {
    if (timer.current) clearTimeout(timer.current);
    setHover(null);
  };

  return (
    <>
      <div className="relative w-full" style={{ paddingBottom: `${layout.aspect}%` }} onMouseLeave={leave}>
        {layout.items.map((it) => {
          const p = photoMeta[it.file];
          const r = rects[it.file];
          return (
            <button
              key={it.file}
              onClick={(e) =>
                setOpen({
                  index: photos.findIndex((x) => x.file === it.file),
                  from: (e.currentTarget.firstElementChild as HTMLElement).getBoundingClientRect(),
                })
              }
              onMouseEnter={() => enter(it.file)}
              onFocus={() => enter(it.file)}
              onBlur={leave}
              aria-label={`Open photo: ${p.alt}`}
              className="absolute block cursor-zoom-in overflow-hidden rounded-[5px] outline-none transition-[left,top,width,height] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
              style={{
                left: `${r.x}%`,
                top: `${(r.y / layout.aspect) * 100}%`,
                width: `${r.w}%`,
                height: `${(r.h / layout.aspect) * 100}%`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hover === it.file ? `/photos/${it.file}` : `/photos/thumbs/${it.file}`}
                alt={p.alt}
                className="block h-full w-full object-cover"
              />
            </button>
          );
        })}
      </div>

      {open && <Lightbox open={open} onClose={() => setOpen(null)} />}
    </>
  );
}

function Lightbox({ open, onClose }: { open: NonNullable<Open>; onClose: () => void }) {
  const [index, setIndex] = useState(open.index);
  const imgRef = useRef<HTMLImageElement>(null);
  const first = useRef(true);
  const n = photos.length;

  const go = useCallback((d: number) => setIndex((i) => (i + d + n) % n), [n]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [go, onClose]);

  // zoom from the clicked thumbnail on first open, soft fade on later slides
  useLayoutEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    if (first.current) {
      first.current = false;
      const to = el.getBoundingClientRect();
      const dx = open.from.left + open.from.width / 2 - (to.left + to.width / 2);
      const dy = open.from.top + open.from.height / 2 - (to.top + to.height / 2);
      const s = open.from.width / to.width;
      el.animate(
        [{ transform: `translate(${dx}px, ${dy}px) scale(${s})` }, { transform: "none" }],
        { duration: 320, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
      );
    } else {
      el.animate([{ opacity: 0, transform: "scale(0.98)" }, { opacity: 1, transform: "none" }], {
        duration: 220,
        easing: "ease-out",
      });
    }
  }, [index, open.from]);

  const p = photos[index];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        key={p.file}
        src={`/photos/${p.file}`}
        alt={p.alt}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[86svh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
      />

      <button
        onClick={(e) => { e.stopPropagation(); go(-1); }}
        aria-label="Previous photo"
        className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
      >
        <Chevron dir="left" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); go(1); }}
        aria-label="Next photo"
        className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
      >
        <Chevron dir="right" />
      </button>
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
      </button>
      <p className="absolute bottom-4 left-0 right-0 text-center text-xs text-white/60">
        {index + 1} / {n}
      </p>
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={dir === "left" ? "m15 6-6 6 6 6" : "m9 6 6 6-6 6"} />
    </svg>
  );
}
