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
    box.dataset.wait = "1";
    setText(shown(0));
    let raf = 0;
    let started = false;
    const run = () => {
      if (started) return;
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
    box.addEventListener("stats-in", run);
    return () => {
      box.removeEventListener("stats-in", run);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span ref={ref} className="tabular-nums">
      {text}
    </span>
  );
}
