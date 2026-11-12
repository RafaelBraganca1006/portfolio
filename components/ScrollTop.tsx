"use client";

import { useEffect } from "react";

/** Always start at the top (the intro), even on reload, instead of restoring the old scroll position. */
export default function ScrollTop() {
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (window.location.hash) history.replaceState(null, "", window.location.pathname + window.location.search);
    window.scrollTo(0, 0);
    const back = (e: PageTransitionEvent) => e.persisted && window.scrollTo(0, 0);
    window.addEventListener("pageshow", back);
    return () => window.removeEventListener("pageshow", back);
  }, []);
  return null;
}
