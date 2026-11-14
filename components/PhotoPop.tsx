"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** zoomed-in square crop used as the tiny inline icon */
  icon: string;
  /** the full photo shown on hover / tap */
  photo: string;
  alt: string;
  children: string;
};

/**
 * Underlined text with a tiny photo icon in front. Hover, focus or tap shows the full photo.
 */
export default function PhotoPop({ icon, photo, alt, children }: Props) {
  const root = useRef<HTMLSpanElement>(null);
  const card = useRef<HTMLSpanElement>(null);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (!pinned) return;
    const down = (e: Event) => {
      if (!root.current?.contains(e.target as Node)) setPinned(false);
    };
    const key = (e: KeyboardEvent) => e.key === "Escape" && setPinned(false);
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("keydown", key);
    };
  }, [pinned]);

  // keep the photo inside the viewport horizontally (desktop)
  const fit = () => {
    const el = card.current;
    if (!el || window.innerWidth < 640) return;
    el.style.marginLeft = "0px";
    const r = el.getBoundingClientRect();
    const m = 16;
    el.style.marginLeft = `${Math.max(Math.min(0, window.innerWidth - m - r.right), m - r.left)}px`;
  };

  const [first, ...rest] = children.split(" ");

  return (
    <span ref={root} className="group/pop relative inline" onMouseEnter={fit} onFocus={fit}>
      <span
        tabIndex={0}
        role="button"
        onClick={() => {
          fit();
          setPinned((p) => !p);
        }}
        className="cursor-pointer font-medium text-fg underline decoration-fg/40 underline-offset-[6px] outline-none transition hover:decoration-fg focus-visible:decoration-fg"
      >
        <span className="whitespace-nowrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={icon}
            alt=""
            className="mx-0.5 inline-block h-[1.05em] w-[1.05em] -translate-y-[0.12em] rounded-[5px] object-cover align-middle"
          />
          {" "}
          {first}
        </span>
        {rest.length ? ` ${rest.join(" ")}` : ""}
      </span>

      <span
        ref={card}
        role="tooltip"
        className={`pointer-events-none invisible fixed inset-x-4 bottom-4 top-auto z-[60] mx-auto block max-h-[80svh] w-[min(18rem,calc(100vw-2rem))] translate-y-1 pb-2 sm:translate-y-1 text-left opacity-0 transition duration-200 sm:absolute sm:inset-x-auto sm:left-0 sm:bottom-full sm:top-auto sm:mx-0 sm:w-[18rem] group-hover/pop:pointer-events-auto group-hover/pop:visible group-hover/pop:translate-y-0 group-hover/pop:opacity-100 group-focus-within/pop:pointer-events-auto group-focus-within/pop:visible group-focus-within/pop:translate-y-0 group-focus-within/pop:opacity-100 ${pinned ? "pointer-events-auto visible translate-y-0 opacity-100" : ""}`}
      >
        <span className="block overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_28px_60px_-24px_rgba(0,0,0,0.6)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt={alt} className="block max-h-[70svh] w-full object-cover" />
        </span>
      </span>
    </span>
  );
}
