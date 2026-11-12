import { profile } from "@/data/content";

const link = "transition hover:text-fg";

export default function Footer() {
  return (
    <footer id="contact" className="mx-auto max-w-3xl border-t border-line px-6 pb-14 pt-14 text-sm text-muted">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-2xl text-fg">{profile.name}</p>
          <p className="mt-2">{profile.location}</p>
        </div>

        <nav aria-label="Contact" className="flex flex-col gap-2 sm:items-end">
          <a className={link} href={`mailto:${profile.email}`}>{profile.email}</a>
          <a className={link} href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a className={link} href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        </nav>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-line pt-6 text-xs">
        <a
          href="/professional"
          className="text-fg underline decoration-fg/30 underline-offset-[5px] transition hover:decoration-fg"
        >
          Professional version →
        </a>
        <a className={link} href="/Rafael_Braganca_CV.pdf" target="_blank" rel="noopener noreferrer">
          Download CV
        </a>
      </div>
    </footer>
  );
}
