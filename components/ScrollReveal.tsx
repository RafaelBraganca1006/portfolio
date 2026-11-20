"use client";

import { useEffect } from "react";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/**
 * Scroll-driven effects, all computed from the element's position in the viewport:
 *  - [data-reveal="depth"]   rises and fades in (data-start / data-span set the window, as fractions of the viewport height)
 *  - [data-type]             "typewriter": the words appear one after another as the block scrolls up, with a caret
 *  - [data-drift="k"]        continuous parallax: shifts by k * (distance from the viewport centre)
 * Finished elements get their inline styles removed, so nothing keeps a transform on it.
 */
export default function ScrollReveal() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const reveals = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const drifts = Array.from(document.querySelectorAll<HTMLElement>("[data-drift]"));

    // split text into words (elements such as the hover pills stay whole, so React's markup is never touched)
    const caret = document.createElement("span");
    caret.setAttribute("aria-hidden", "true");
    caret.className = "type-caret";
    const typed = Array.from(document.querySelectorAll<HTMLElement>("[data-type]")).map((box) => {
      const parts: HTMLElement[] = [];
      const walk = (node: Node) => {
        for (const c of Array.from(node.childNodes)) {
          if (c.nodeType === Node.TEXT_NODE) {
            const frag = document.createDocumentFragment();
            for (const t of (c.textContent || "").split(/(\s+)/)) {
              if (!t) continue;
              if (!t.trim()) {
                frag.append(t);
                continue;
              }
              const s = document.createElement("span");
              s.textContent = t;
              s.style.opacity = "0.08";
              parts.push(s);
              frag.append(s);
            }
            c.replaceWith(frag);
          } else if (c instanceof HTMLElement) {
            if (c.tagName === "STRONG" || c.tagName === "A") walk(c);
            else {
              c.style.opacity = "0.08";
              parts.push(c);
            }
          }
        }
      };
      walk(box);
      return { box, parts, done: false };
    });

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;

      for (const el of reveals) {
        const depth = parseFloat(el.dataset.reveal || "1") || 1;
        const startF = parseFloat(el.dataset.start || "0.98");
        const spanF = parseFloat(el.dataset.span || String(0.3 * Math.min(depth, 1.6)));
        const p = clamp((vh * startF - el.getBoundingClientRect().top) / (vh * spanF));
        if (p >= 1) {
          if (el.style.opacity) el.style.transform = el.style.opacity = el.style.filter = "";
          continue;
        }
        const e = 1 - Math.pow(1 - p, 3);
        el.style.transform = `translate3d(0, ${(1 - e) * 90 * depth}px, 0)`;
        el.style.opacity = String(e);
        el.style.filter = e < 0.98 ? `blur(${(1 - e) * 4}px)` : "";
      }

      for (const t of typed) {
        const top = t.box.getBoundingClientRect().top;
        const p = clamp((vh * 0.86 - top) / (vh * 0.4));
        const n = t.parts.length;
        if (p >= 1) {
          if (!t.done) {
            t.parts.forEach((w) => (w.style.opacity = ""));
            caret.remove();
            t.done = true;
          }
          continue;
        }
        t.done = false;
        const head = p * (n + 3);
        t.parts.forEach((w, i) => {
          w.style.opacity = String(0.08 + 0.92 * clamp((head - i) / 3));
        });
        const at = t.parts[Math.min(n - 1, Math.floor(head))];
        if (p > 0 && at) at.before(caret);
        else caret.remove();
      }

      for (const el of drifts) {
        const r = el.getBoundingClientRect();
        const k = parseFloat(el.dataset.drift || "0");
        const y = (r.top + r.height / 2 - vh / 2) * k;
        el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)${el.dataset.scale ? ` scale(${el.dataset.scale})` : ""}`;
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
      caret.remove();
      reveals.forEach((el) => (el.style.transform = el.style.opacity = el.style.filter = ""));
      drifts.forEach((el) => (el.style.transform = ""));
      typed.forEach((t) => t.parts.forEach((w) => (w.style.opacity = "")));
    };
  }, []);
  return null;
}
