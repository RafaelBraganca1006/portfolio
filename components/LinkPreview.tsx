"use client";

import { useRef } from "react";

/**
 * External link that shows a screenshot of the page on hover / keyboard focus (desktop only; on touch screens
 * the link simply opens). The card is positioned from the link's own box and kept inside the window.
 */
export default function LinkPreview({
  href,
  image,
  host,
  alt,
  children,
}: {
  href: string;
  image: string;
  host: string;
  alt: string;
  children: React.ReactNode;
}) {
  const link = useRef<HTMLAnchorElement>(null);
  const card = useRef<HTMLSpanElement>(null);

  const place = (e?: React.MouseEvent) => {
    const a = link.current;
    const c = card.current;
    if (!a || !c) return;
    // the line of the link under the pointer (a link can wrap over two lines)
    const rects = Array.from(a.getClientRects());
    const r = (e && rects.find((q) => e.clientY >= q.top - 2 && e.clientY <= q.bottom + 2)) || rects[0];
    const W = c.offsetWidth;
    const H = c.offsetHeight;
    const m = 16;
    const left = Math.max(m, Math.min(r.left, window.innerWidth - W - m));
    const below = r.bottom + 6;
    const top = below + H > window.innerHeight - m && r.top - H - 6 > m ? r.top - H - 6 : below;
    c.style.left = `${left}px`;
    c.style.top = `${top}px`;
  };

  return (
    <span className="group/lp relative inline" onMouseEnter={place} onMouseMove={place} onFocus={() => place()}>
      <a
        ref={link}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-fg underline decoration-fg/30 underline-offset-[6px] transition hover:decoration-fg focus-visible:decoration-fg"
      >
        {children}
      </a>
      <span
        ref={card}
        aria-hidden
        className="pointer-events-none invisible fixed z-[60] hidden w-[22rem] max-w-[calc(100vw-2rem)] pt-0 font-sans text-base font-normal normal-case leading-normal tracking-normal opacity-0 transition-opacity duration-200 group-hover/lp:visible group-hover/lp:opacity-100 group-focus-within/lp:visible group-focus-within/lp:opacity-100 sm:block [@media(hover:none)]:!hidden"
      >
        <span className="block overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_28px_60px_-24px_rgba(0,0,0,0.6)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={alt} loading="lazy" className="block aspect-[8/5] w-full object-cover object-top" />
          <span className="block border-t border-line px-4 py-2.5 text-xs text-muted">{host} ↗</span>
        </span>
      </span>
    </span>
  );
}
