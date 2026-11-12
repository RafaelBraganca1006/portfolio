"use client";

import { useEffect, useState } from "react";

const items = [
  {
    id: "home",
    label: "Start",
    icon: (
      <>
        <path d="M3.5 11 12 4l8.5 7" />
        <path d="M5.5 9.5V20h13V9.5" />
        <path d="M10 20v-5.5h4V20" />
      </>
    ),
  },
  {
    id: "experience",
    label: "Experience",
    icon: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2.5" />
        <path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7M3 13h18" />
      </>
    ),
  },
  {
    id: "projects",
    label: "Projects",
    icon: (
      <>
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.8" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.8" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.8" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.8" />
      </>
    ),
  },
  {
    id: "about",
    label: "About me",
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4.5 20.5c.8-3.700 3.700-5.500 7.500-5.500s6.700 1.800 7.500 5.500" />
      </>
    ),
  },
];

export default function Dock() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = items
      .map((i) => document.getElementById(i.id))
      .filter(Boolean) as HTMLElement[];

    const update = () => {
      // the section currently crossing the middle of the viewport is the active one
      const mid = window.innerHeight * 0.5;
      let current: string | null = null;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) current = el.id;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    // sits in the page flow under the intro, then sticks to the top once you scroll past it
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center">
    <nav
      aria-label="Sections"
      className="pointer-events-auto rounded-full border border-line bg-bg/70 p-1.5 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)] backdrop-blur-xl"
    >
      <ul className="flex items-center gap-1">
        {items.map((i) => {
          const home = i.id === "home";
          const on = home ? active === null : active === i.id;
          const cls = `flex h-11 w-11 items-center justify-center rounded-full transition duration-300 ${
            on ? "bg-surface text-fg shadow-[0_2px_10px_rgba(0,0,0,0.25)]" : "text-muted hover:text-fg"
          }`;
          const svg = (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {i.icon}
            </svg>
          );
          return (
            <li key={i.id} className="group relative">
              {home ? (
                <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to the start" aria-current={on ? "true" : undefined} className={cls}>
                  {svg}
                </button>
              ) : (
                <a href={`#${i.id}`} aria-label={i.label} aria-current={on ? "true" : undefined} className={cls}>
                  {svg}
                </a>
              )}
              <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-fg px-2 py-1 text-xs text-bg opacity-0 transition group-hover:opacity-100">
                {i.label}
              </span>
            </li>
          );
        })}
        <li className="group relative">
          <button
            type="button"
            aria-label="Piano"
            onClick={() => window.dispatchEvent(new Event("open-piano"))}
            className="flex h-11 w-11 items-center justify-center rounded-full text-muted transition duration-300 hover:text-fg"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5.5" width="18" height="13.5" rx="2.2" />
              <path d="M7.5 13V19" />
              <path d="M12 13V19" />
              <path d="M16.5 13V19" />
              <rect x="6.2" y="5.5" width="2.6" height="8" rx="0.6" fill="currentColor" stroke="none" />
              <rect x="10.7" y="5.5" width="2.6" height="8" rx="0.6" fill="currentColor" stroke="none" />
              <rect x="15.2" y="5.5" width="2.6" height="8" rx="0.6" fill="currentColor" stroke="none" />
            </svg>
          </button>
          <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-fg px-2 py-1 text-xs text-bg opacity-0 transition group-hover:opacity-100">
            Piano
          </span>
        </li>
      </ul>
    </nav>
    </div>
  );
}
