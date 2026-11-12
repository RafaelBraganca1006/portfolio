import LogoMark from "./LogoMark";
import { experience } from "@/data/content";

/** Inline link that shows a small preview window on hover / keyboard focus. */
export default function BmwHoverCard({ children }: { children: React.ReactNode }) {
  const job = experience.find((j) => j.id === "exp-bmw")!;

  return (
    <span className="group/card relative inline-block">
      <a
        href="#exp-bmw"
        className="font-medium text-fg underline decoration-fg/35 underline-offset-[5px] transition hover:decoration-fg"
      >
        {children}
      </a>

      {/* pt bridges the gap so the card stays open while the pointer moves onto it */}
      <span
        role="tooltip"
        className="pointer-events-none invisible absolute bottom-full left-1/2 z-40 w-[min(19rem,80vw)] -translate-x-1/2 translate-y-1 pb-3 opacity-0 transition duration-200 group-hover/card:pointer-events-auto group-hover/card:visible group-hover/card:translate-y-0 group-hover/card:opacity-100 group-focus-within/card:pointer-events-auto group-focus-within/card:visible group-focus-within/card:translate-y-0 group-focus-within/card:opacity-100"
      >
        <a
          href="#exp-bmw"
          className="block rounded-2xl border border-line bg-surface p-4 text-left shadow-[0_24px_50px_-20px_rgba(0,0,0,0.55)]"
        >
          <span className="flex items-center gap-3">
            <LogoMark logo={job.logo} />
            <span className="block">
              <span className="block font-display text-lg leading-tight text-fg">{job.title}</span>
              <span className="block text-xs text-muted">{job.org}</span>
            </span>
          </span>
          <span className="mt-3 block text-[13px] leading-relaxed text-fg/75">{job.text}</span>
          <span className="mt-3 block text-xs text-accent">See in Experience ↓</span>
        </a>
      </span>
    </span>
  );
}
