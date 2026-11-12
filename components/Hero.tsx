import PhotoCluster from "./PhotoCluster";
import BmwHoverCard from "./HoverCard";
import { BmwMark, BrazilFlag, EthMark, GitHubMark, LinkedInMark, MailMark, SwissFlag } from "./InlineMark";
import { profile } from "@/data/content";

const Link = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    target={href.startsWith("http") ? "_blank" : undefined}
    rel="noopener noreferrer"
    className="font-medium text-fg underline decoration-fg/35 underline-offset-[5px] transition hover:decoration-fg"
  >
    {children}
  </a>
);

const B = ({ children }: { children: React.ReactNode }) => (
  <strong className="font-medium text-fg">{children}</strong>
);

export default function Hero() {
  return (
    <section className="mx-auto flex min-h-svh max-w-2xl flex-col items-center px-6 pb-16 pt-24">
      <PhotoCluster />

      <div className="mt-10 w-full shrink-0 text-[16px] leading-[1.7] text-muted">
        <p className="font-display text-2xl text-fg">Hey,</p>

        <p className="mt-4">
          I&apos;m <B>Rafael</B>, a <B>Computer Science</B> student at <EthMark />{" "}
          <B>ETH Zurich</B>. Originally from <B>São Paulo, Brazil</B>{" "}
          <BrazilFlag />, now living in <B>Zurich</B> <SwissFlag />.
        </p>

        <div className="mt-3">
          Currently I work as a working student,{" "}
          <BmwHoverCard>AI Engineer at <BmwMark /> BMW</BmwHoverCard>, on the
          Financial Services team.
        </div>

        <p className="mt-5">
          Reach out to me via <LinkedInMark />{" "}
          <Link href={profile.linkedin}>LinkedIn</Link>, <MailMark />{" "}
          <Link href={`mailto:${profile.email}`}>Email</Link> or <GitHubMark />{" "}
          <Link href={profile.github}>GitHub</Link>.
        </p>
      </div>


      <a
        href="#experience"
        aria-label="Scroll down"
        className="mt-auto flex shrink-0 pt-12 text-muted transition hover:text-fg"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}
