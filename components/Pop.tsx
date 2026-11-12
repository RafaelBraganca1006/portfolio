"use client";

import { useEffect, useRef, useState } from "react";
import LogoMark from "./LogoMark";
import { experience, popCards } from "@/data/content";

type Props = {
  id: string;
  /** "details": the full card. "preview": a large look at the thesis PDF. */
  variant?: "details" | "preview";
  /** if set, clicking the underlined text opens it (e.g. the PDF) */
  href?: string;
  /** optional logo, kept glued to the first word of the text */
  mark?: React.ReactNode;
  children: React.ReactNode;
};

/**
 * Underlined text that opens a small window on hover, keyboard focus or tap.
 */
export default function Pop({ id, variant = "details", href, mark, children }: Props) {
  const job = [...experience, ...popCards].find((j) => j.id === id)!;
  const root = useRef<HTMLSpanElement>(null);
  const card = useRef<HTMLSpanElement>(null);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (!pinned) return;
    const down = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setPinned(false);
    };
    const key = (e: KeyboardEvent) => e.key === "Escape" && setPinned(false);
    document.addEventListener("mousedown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", down);
      document.removeEventListener("keydown", key);
    };
  }, [pinned]);

  // keep the window inside the viewport horizontally
  const fit = () => {
    const el = card.current;
    if (!el) return;
    el.style.marginLeft = "0px";
    const r = el.getBoundingClientRect();
    const m = 16;
    el.style.marginLeft = `${Math.max(Math.min(0, window.innerWidth - m - r.right), m - r.left)}px`;
  };

  const triggerClass =
    "cursor-pointer font-medium text-fg underline decoration-fg/40 underline-offset-[6px] outline-none transition hover:decoration-fg focus-visible:decoration-fg";

  // the logo stays glued to the first word so it never wraps on its own
  let inner: React.ReactNode = children;
  if (mark && typeof children === "string") {
    const [first, ...rest] = children.split(" ");
    inner = (
      <>
        <span className="whitespace-nowrap">
          {mark}
          {"\u00a0"}
          {first}
        </span>
        {rest.length ? ` ${rest.join(" ")}` : ""}
      </>
    );
  }

  const width = variant === "preview" ? "w-[min(22rem,calc(100vw-2rem))]" : "w-[min(28rem,calc(100vw-2rem))]";

  return (
    <span
      ref={root}
      className="group/pop relative inline"
      onMouseEnter={fit}
      onFocus={fit}
    >
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={triggerClass}>
          {inner}
        </a>
      ) : (
        <span
          tabIndex={0}
          role="button"
          onClick={() => {
            fit();
            setPinned((p) => !p);
          }}
          className={triggerClass}
        >
          {inner}
        </span>
      )}

      <span
        ref={card}
        role="tooltip"
        className={`pointer-events-none invisible absolute left-0 top-full z-30 block ${width} translate-y-1 pt-2 text-left font-sans text-base font-normal normal-case leading-normal tracking-normal opacity-0 transition duration-200 group-hover/pop:pointer-events-auto group-hover/pop:visible group-hover/pop:translate-y-0 group-hover/pop:opacity-100 group-focus-within/pop:pointer-events-auto group-focus-within/pop:visible group-focus-within/pop:translate-y-0 group-focus-within/pop:opacity-100 ${pinned ? "pointer-events-auto visible translate-y-0 opacity-100" : ""}`}
      >
        <span className="block overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_28px_60px_-24px_rgba(0,0,0,0.6)]">
          {variant === "preview" && job.preview ? (
            <a href={job.preview.href} target="_blank" rel="noopener noreferrer" className="block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={job.preview.src} alt={job.preview.alt} className="block w-full" />
              <span className="block border-t border-line px-4 py-2.5 text-xs text-muted">
                Open the thesis (PDF) ↗
              </span>
            </a>
          ) : (
            <>
              <span className="flex items-center gap-3 border-b border-line px-5 py-3.5">
                <LogoMark logo={job.logo} />
                <span className="block min-w-0">
                  <span className="block font-display text-[17px] leading-tight text-fg">{job.title}</span>
                  <span className="mt-0.5 block text-xs text-muted">{job.org}</span>
                  {job.note && <span className="block text-xs text-muted/80">{job.note}</span>}
                </span>
              </span>

              {job.points && (
                <span className="block space-y-2 px-5 py-4">
                  {job.points.map((p) => (
                    <span key={p} className="flex gap-3 text-[13px] leading-relaxed text-fg/80">
                      <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                      <span>{p}</span>
                    </span>
                  ))}
                </span>
              )}

              {job.links && (
                <span className="flex flex-wrap gap-x-5 gap-y-1 border-t border-line bg-fg/[0.03] px-5 py-2.5 text-xs">
                  {job.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent"
                    >
                      {l.label} ↗
                    </a>
                  ))}
                </span>
              )}
            </>
          )}
        </span>
      </span>
    </span>
  );
}
