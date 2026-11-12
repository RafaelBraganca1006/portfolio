import type { Metadata } from "next";
import { experience, profile, projects, skillGroups, type Job } from "@/data/content";
import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Rafael Bragança Oliveira · Professional",
  description: "Computer Science at ETH Zürich. AI engineering, federated learning, applied ML.",
};

const STUDY = ["exp-eth", "exp-exchange"];
const work = experience.filter((j) => !STUDY.includes(j.id));
const study = experience.filter((j) => STUDY.includes(j.id));

const hover = "transition hover:text-fg";
const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
const isExt = (h: string) => h.startsWith("http");

function Heading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mb-8 text-xs uppercase tracking-[0.26em] text-muted">
      {children}
    </h2>
  );
}

function Entry({ job }: { job: Job }) {
  const body = job.text ? [job.text] : [];
  return (
    <li className="grid gap-2 py-8 sm:grid-cols-[11rem_1fr] sm:gap-10">
      <div className="text-sm text-muted">
        <p>{job.date}</p>
        {job.location && <p className="mt-0.5">{job.location}</p>}
      </div>
      <div>
        <h3 className="text-[17px] font-medium leading-snug text-fg">{job.title}</h3>
        <p className="mt-0.5 text-[15px] text-muted">
          {job.org}
          {job.note ? ` · ${job.note}` : ""}
        </p>
        {body.map((t) => (
          <p key={t} className="mt-4 text-[15px] leading-relaxed text-fg/75">
            {t}
          </p>
        ))}
        {!job.text && job.points && (
          <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-fg/75">
            {job.points.map((p) => (
              <li key={p} className="flex gap-3">
                <span className="mt-[11px] h-px w-3 shrink-0 bg-muted" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        )}
        {job.links && (
          <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm">
            {job.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                {...(isExt(l.href) ? ext : { target: "_blank" })}
                className="text-accent underline decoration-accent/30 underline-offset-4 transition hover:decoration-accent"
              >
                {l.label}
              </a>
            ))}
          </p>
        )}
      </div>
    </li>
  );
}

export default function Professional() {
  const social = "inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-fg transition hover:bg-surface";
  return (
    <>
      {/* header */}
      <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3.5 pr-16 sm:pr-20">
          <a href="#top" className="font-display text-lg text-fg">
            Rafael Bragança Oliveira
          </a>
          <nav aria-label="Sections" className="hidden items-center gap-6 text-sm text-muted sm:flex">
            <a className={hover} href="#experience">Experience</a>
            <a className={hover} href="#education">Education</a>
            <a className={hover} href="#projects">Projects</a>
            <a className={hover} href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-5xl px-6">
        {/* hero */}
        <section className="grid items-center gap-10 pb-20 pt-16 sm:grid-cols-[1.4fr_1fr] sm:gap-14 sm:pb-28 sm:pt-24">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-muted">{profile.location}</p>
            <h1 className="mt-4 font-display text-[40px] leading-[1.05] text-fg sm:text-6xl">{profile.name}</h1>
            <p className="mt-5 text-lg text-fg/80 sm:text-xl">
              Computer Science at ETH Zürich. AI engineer at BMW.
            </p>
            <p className="mt-8 flex flex-wrap gap-3">
              <a className={social} href={profile.linkedin} {...ext}><LinkedInIcon /> LinkedIn</a>
              <a className={social} href={profile.github} {...ext}><GitHubIcon /> GitHub</a>
              <a className={social} href={`mailto:${profile.email}`}><MailIcon /> Email</a>
            </p>
            <p className="mt-6 text-sm">
              <a className="text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent" href="/Rafael_Braganca_CV.pdf" {...ext}>
                Download CV (PDF)
              </a>
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/photos/portrait.jpg"
            alt="Rafael Bragança Oliveira"
            className="order-first aspect-square w-40 rounded-2xl object-cover sm:order-none sm:w-full"
          />
        </section>

        {/* experience */}
        <section id="experience" className="scroll-mt-20 border-t border-line pb-6 pt-14">
          <Heading id="experience-h">Experience</Heading>
          <ol className="divide-y divide-line">
            {work.map((j) => <Entry key={j.id} job={j} />)}
          </ol>
        </section>

        {/* education */}
        <section id="education" className="scroll-mt-20 border-t border-line pb-6 pt-14">
          <Heading id="education-h">Education</Heading>
          <ol className="divide-y divide-line">
            {study.map((j) => <Entry key={j.id} job={j} />)}
            <li className="grid gap-2 py-8 sm:grid-cols-[11rem_1fr] sm:gap-10">
              <div className="text-sm text-muted"><p>São Paulo</p></div>
              <div>
                <h3 className="text-[17px] font-medium leading-snug text-fg">German Abitur and Brazilian Ensino Médio</h3>
                <p className="mt-0.5 text-[15px] text-muted">Colégio Visconde de Porto Seguro</p>
                <p className="mt-4 text-[15px] leading-relaxed text-fg/75">
                  Selected for the bilingual German curriculum and completed both diplomas.
                </p>
              </div>
            </li>
          </ol>
        </section>

        {/* projects */}
        <section id="projects" className="scroll-mt-20 border-t border-line pb-6 pt-14">
          <Heading id="projects-h">Projects</Heading>
          <ul className="divide-y divide-line">
            {projects.map((p) => (
              <li key={p.title} className="grid gap-5 py-8 sm:grid-cols-[17rem_1fr] sm:gap-10">
                <a href={p.links[0].href} {...(isExt(p.links[0].href) ? ext : { target: "_blank" })} aria-label={p.title}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.alt}
                    loading="lazy"
                    style={{ objectPosition: p.position ?? "50% 50%" }}
                    className="aspect-[16/9] w-full rounded-xl border border-line object-cover"
                  />
                </a>
                <div>
                  <h3 className="text-[17px] font-medium text-fg">{p.title}</h3>
                  <p className="mt-1 text-[15px] text-muted">{p.desc}</p>
                  <p className="mt-4 text-[15px] leading-relaxed text-fg/75">{p.tech}</p>
                  <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                    {p.links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        {...(isExt(l.href) ? ext : { target: "_blank" })}
                        className="text-accent underline decoration-accent/30 underline-offset-4 transition hover:decoration-accent"
                      >
                        {l.label}
                      </a>
                    ))}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* skills */}
        <section className="border-t border-line pb-6 pt-14">
          <Heading id="skills-h">Skills</Heading>
          <dl className="space-y-5">
            {skillGroups.slice(0, 2).map((g) => (
              <div key={g.title} className="grid gap-1 sm:grid-cols-[11rem_1fr] sm:gap-10">
                <dt className="text-sm text-muted">{g.title}</dt>
                <dd className="text-[15px] leading-relaxed text-fg/75">{Array.from(new Set(g.items)).join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>

      {/* footer */}
      <footer id="contact" className="mx-auto mt-14 max-w-5xl scroll-mt-20 border-t border-line px-6 pb-16 pt-12">
        <p className="font-display text-3xl text-fg">Let&apos;s talk.</p>
        <p className="mt-3 max-w-md text-[15px] text-muted">
          I am open to conversations about AI engineering, research and building with student communities.
        </p>
        <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          <a className={hover} href={`mailto:${profile.email}`}>{profile.email}</a>
          <a className={hover} href={profile.linkedin} {...ext}>LinkedIn</a>
          <a className={hover} href={profile.github} {...ext}>GitHub</a>
          <a className={`${hover} sm:ml-auto`} href="/">The full site →</a>
        </p>
      </footer>
    </>
  );
}
