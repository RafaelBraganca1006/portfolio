"use client";

import { useEffect } from "react";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/**
 * Scroll-driven effects, all computed from the element's position in the viewport:
 *  - [data-reveal="depth"]   rises and fades in (data-start / data-span set the window, as fractions of the viewport height)
 *  - [data-type]             phrases appear one after another as the block scrolls up
 *  - [data-drift="k"]        continuous parallax: shifts by k * (distance from the viewport centre)
 * Finished elements get their inline styles removed, so nothing keeps a transform on it.
 */
export default function ScrollReveal() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const reveals = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")).map((el) => ({ el, cur: -1 }));
    const drifts = Array.from(document.querySelectorAll<HTMLElement>("[data-drift]"));

    // split text into words (elements such as the hover pills stay whole, so React's markup is never touched)
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
      // group the words into phrases: a phrase ends at , . ; : or after ~6 words
      const chunk: number[] = [];
      let c = 0;
      let len = 0;
      parts.forEach((w, i) => {
        chunk[i] = c;
        len++;
        if (/[,.;:]$/.test(w.textContent || "") || len >= 6) {
          c++;
          len = 0;
        }
      });
      return { box, parts, chunk, count: len ? c + 1 : c, done: false };
    });

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;

      let moving = false;
      for (const r of reveals) {
        const el = r.el;
        const depth = parseFloat(el.dataset.reveal || "1") || 1;
        const startF = parseFloat(el.dataset.start || "0.98");
        const spanF = parseFloat(el.dataset.span || String(0.3 * Math.min(depth, 1.6)));
        const target = clamp((vh * startF - el.getBoundingClientRect().top) / (vh * spanF));
        // ease towards the target so the movement stays smooth even when the scroll wheel jumps
        r.cur = r.cur < 0 ? target : r.cur + (target - r.cur) * 0.16;
        if (Math.abs(target - r.cur) < 0.002) r.cur = target;
        else moving = true;
        const p = r.cur;
        if (p >= 1) {
          if (el.style.opacity) el.style.transform = el.style.opacity = el.style.filter = "";
          continue;
        }
        const e = 1 - Math.pow(1 - p, 3);
        el.style.transform = `translate3d(0, ${(1 - e) * 90 * depth}px, 0)`;
        el.style.opacity = String(e);
        el.style.filter = !el.dataset.noblur && e < 0.98 ? `blur(${(1 - e) * 4}px)` : "";
      }
      if (moving && !frame) frame = requestAnimationFrame(update);

      typed.forEach((t, idx) => {
        // an entry only shows once the one above it has finished typing
        const open = idx === 0 || typed[idx - 1].done;
        const li = t.box.closest<HTMLElement>("li");
        if (li) li.style.opacity = open ? "1" : "0";
        // stats and links of an entry wait for its own text to finish
        const rest = Array.from(t.box.parentElement?.children ?? []).filter((c): c is HTMLElement => c !== t.box && c instanceof HTMLElement);
        rest.forEach((c) => (c.style.visibility = t.done ? "" : "hidden"));
        if (!open) return;
        const top = t.box.getBoundingClientRect().top;
        const p = clamp((vh * 0.97 - top) / (vh * 0.3)); // finishes with the text still in the lower part of the screen
        if (p >= 1) {
          if (!t.done) {
            t.parts.forEach((w) => (w.style.opacity = ""));
            t.done = true;
            rest.forEach((c) => {
              if (c.tagName === "DL") {
                c.dataset.in = "1";
                c.dispatchEvent(new Event("stats-in"));
              }
            });
            rest.forEach((c) => {
              c.style.visibility = "";
              const r = reveals.find((x) => x.el === c);
              if (r) r.cur = 0; // so they rise in instead of popping
            });
            if (!frame) frame = requestAnimationFrame(update); // opens the next entry
          }
          return;
        }
        t.done = false;
        const head = p * (t.count + 0.8);
        t.parts.forEach((w, i) => {
          w.style.opacity = String(0.08 + 0.92 * clamp(head - t.chunk[i]));
        });
      });

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
      reveals.forEach(({ el }) => (el.style.transform = el.style.opacity = el.style.filter = ""));
      drifts.forEach((el) => (el.style.transform = ""));
      typed.forEach((t) => {
        t.parts.forEach((w) => (w.style.opacity = ""));
        const li = t.box.closest<HTMLElement>("li");
        if (li) li.style.opacity = "";
        Array.from(t.box.parentElement?.children ?? []).forEach((c) => c instanceof HTMLElement && (c.style.visibility = ""));
      });
    };
  }, []);
  return null;
}
