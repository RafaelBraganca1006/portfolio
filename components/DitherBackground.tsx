"use client";

import { useEffect, useRef } from "react";
import { DitherShaderEngine } from "@/lib/dither-shader";

export type Palette = {
  colorDark: number[];
  colorMid: number[];
  colorLight: number[];
};

export default function DitherBackground({
  src,
  palette,
}: {
  src: string;
  palette: Palette;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const engine = new DitherShaderEngine(ref.current, src, {
      fitMode: 0,
      contrast: 1.25,
      ...palette,
    });
    return () => engine.destroy?.();
  }, [src, palette]);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}
