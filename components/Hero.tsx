import PhotoCluster from "./PhotoCluster";
import BmwHoverCard from "./HoverCard";
import { BmwMark, BrazilFlag, EthMark, GitHubMark, LinkedInMark, MailMark, SwissFlag } from "./InlineMark";
import { profile } from "@/data/content";

type Vars = React.CSSProperties & { "--i"?: number };

export default function Hero() {
  // every word and icon gets an index, so the text appears one piece after another (see .rv in globals.css)
  let n = 0;
  const idx = (): Vars => ({ "--i": n++ });
  const W = (s: string) =>
    s.split(/(\s+)/).map((t, k) =>
      !t.trim() || /^[.,;:]+$/.test(t) ? (
        t
      ) : (
        <span key={k} className="rv" style={idx()}>
          {t}
        </span>
      )
    );
  const M = (mark: React.ReactNode) => (
    <span className="rv rv-pop" style={idx()}>
      {mark}
    </span>
  );
  const B = (children: string) => <strong className="font-medium text-fg">{W(children)}</strong>;
  const Link = (href: string, children: string) => {
    const i = n++;
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="rv ul-draw font-medium text-fg"
        style={{ "--i": i } as Vars}
      >
        {children}
      </a>
    );
  };

  return (
    <section className="mx-auto flex min-h-svh max-w-2xl flex-col items-center px-6 pb-16 pt-24">
      <PhotoCluster />

      <div className="hero-text mt-10 w-full shrink-0 text-[16px] leading-[1.7] text-muted">
        <p className="font-display text-2xl text-fg">{W("Hey,")}</p>

        <p className="mt-4">
          {W("I'm ")}
          {B("Rafael")}
          {W(", a ")}
          {B("Computer Science")}
          {W(" student at ")}
          {M(<EthMark />)} {B("ETH Zurich")}
          {W(". Originally from ")}
          {B("São Paulo, Brazil")} {M(<BrazilFlag />)}
          {W(", now living in ")}
          {B("Zurich")} {M(<SwissFlag />)}.
        </p>

        <div className="mt-3">
          {W("Currently I work as a working student, ")}
          <span className="rv-soft" style={idx()}>
            <BmwHoverCard>
              AI Engineer at <BmwMark /> BMW
            </BmwHoverCard>
          </span>
          {W(", on the Financial Services team.")}
        </div>

        <p className="mt-5">
          {W("Reach out to me via ")}
          {M(<LinkedInMark />)} {Link(profile.linkedin, "LinkedIn")}, {M(<MailMark />)}{" "}
          {Link(`mailto:${profile.email}`, "Email")}
          {W(" or ")}
          {M(<GitHubMark />)} {Link(profile.github, "GitHub")}.
        </p>
      </div>

      <a
        href="#experience"
        aria-label="Scroll down"
        className="rv rv-late mt-auto flex shrink-0 pt-12 text-muted transition hover:text-fg"
        style={{ "--i": n + 12 } as Vars}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}
