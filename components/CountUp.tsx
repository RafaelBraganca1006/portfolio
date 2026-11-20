"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts up to a value like "1,000+" or "200K+" once its stats block is revealed
 * (ScrollReveal marks the parent <dl data-in> and fires "stats-in"). Without motion it just shows the value.
 */
export default function CountUp({ value, index = 0 }: { value: string; index?: number }) {
  const m = value.match(/^([\d,.]+)(.*)$/);
  const target = m ? parseFloat(m[1].replace(/,/g, "")) : 0;
  const suffix = m ? m[2] : "";
  const shown = (n: number) => Math.round(n).toLocaleString("en-US") + suffix;
  const [text, setText] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const box = ref.current?.closest("dl");
    if (!m || !box || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setText(shown(0));
    let raf = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let started = false;
    let frozen = false;
    const run = () => {
      clearTimeout(timer);
      if (started && !frozen) return;
      frozen = false;
      started = true;
      const t0 = performance.now() + index * 140;
      const D = 1500;
      const tick = (now: number) => {
        const k = Math.min(1, Math.max(0, (now - t0) / D));
        setText(shown(target * (1 - Math.pow(1 - k, 4))));
        if (k < 1) raf = requestAnimationFrame(tick);
        else setText(value);
      };
      raf = requestAnimationFrame(tick);
    };
    if (box.dataset.in) run();
    // when scrolling back up the block fades out showing its final numbers; only then do they go back to 0
    const reset = () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf); // freeze while it fades out
      frozen = true;
      timer = setTimeout(() => {
        started = false;
        frozen = false;
        setText(shown(0));
      }, 900);
    };
    box.addEventListener("stats-in", run);
    box.addEventListener("stats-out", reset);
    return () => {
      box.removeEventListener("stats-in", run);
      box.removeEventListener("stats-out", reset);
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // the final value reserves the width, so the layout does not jump while the number counts up
  return (
    <span ref={ref} className="inline-grid tabular-nums">
      <span aria-hidden className="invisible col-start-1 row-start-1">
        {value}
      </span>
      <span className="col-start-1 row-start-1">{text}</span>
    </span>
  );
}
