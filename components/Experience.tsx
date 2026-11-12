import Section from "./Section";
import Pop from "./Pop";
import { BmwMark, EthMark, ImgMark, TumMark } from "./InlineMark";
import { experience } from "@/data/content";

type Stat = { value: string; label: string };

const stats: Record<string, Stat[]> = {
  "exp-claude": [{ value: "1,000+", label: "attendees at our events" }],
  "exp-mundoai": [
    { value: "200K+", label: "followers" },
    { value: "7M+", label: "likes" },
    { value: "60M+", label: "views" },
  ],
};

const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="font-medium text-fg underline decoration-fg/30 underline-offset-[6px] transition hover:decoration-fg"
  >
    {children}
  </a>
);

const B = ({ children }: { children: React.ReactNode }) => (
  <strong className="font-medium text-fg">{children}</strong>
);

/** The sentence for each experience. Underlined parts react to hover / tap. */
const sentences: Record<string, React.ReactNode> = {
  "exp-bmw": (
    <>
      Working as an <B>AI Engineer</B> at <B><BmwMark />&nbsp;BMW</B>, automating
      collections and recovery for the financial services team.
    </>
  ),
  "exp-thesis": (
    <>
      Wrote my{" "}
      <Pop id="exp-thesis" variant="preview" href="/cascade-thesis.pdf">bachelor thesis</Pop>{" "}
      on{" "}
      <Pop id="exp-thesis">
        federated neural architecture search at{" "}
        <span className="whitespace-nowrap"><EthMark />&nbsp;ETH</span> Zurich
      </Pop>
      , so that devices with slow connections still help train the model.
    </>
  ),
  "exp-tum": (
    <>
      Worked as a{" "}
      <Pop id="exp-tum">
        research assistant at the <span className="whitespace-nowrap"><TumMark />&nbsp;GenAI</span> Lab
      </Pop>
      , where I built{" "}
      <Pop id="persona" href="https://github.com/RafaelBraganca1006/persona_ai">PersonaAI</Pop>, an
      open-source platform for AI-generated social media content.
    </>
  ),
  "exp-exchange": (
    <>
      Spent an{" "}
      <Pop id="exp-exchange">
        exchange semester at <span className="whitespace-nowrap"><TumMark />&nbsp;TUM</span>
      </Pop>
      ,{" "}
      <A href="https://www.tum.de/en/news-and-events/all-news/press-releases/details/tum-once-again-named-the-best-university-in-the-eu">the best university in the European Union</A>.
    </>
  ),
  "exp-eth": (
    <>
      Started my{" "}
      <Pop id="exp-eth">
        computer science studies at <span className="whitespace-nowrap"><EthMark />&nbsp;ETH</span> Zurich
      </Pop>
      , home to one of the{" "}
      <A href="https://www.timeshighereducation.com/world-university-rankings/2026/subject-ranking/computer-science">top 3 CS departments in the world</A>.
    </>
  ),
  "exp-ethbc": (
    <>
      Board member and <B>Head of Marketing</B> at{" "}
      <Pop id="exp-ethbc" mark={<ImgMark src="/logos/eth-blockchain.png" />}>ETH Blockchain Club</Pop>,
      partnering with the Ethereum Foundation, Solana Foundation, Dialectic and
      more.
    </>
  ),
  "exp-claude": (
    <>
      Board member at{" "}
      <Pop id="exp-claude" mark={<ImgMark src="/logos/claude-club.png" />}>Claude Builder Club</Pop>,
      running developer workshops with Anthropic tools.
    </>
  ),
  "exp-brasa": (
    <>
      Co-founded{" "}
      <Pop id="exp-brasa" mark={<ImgMark src="/logos/brasa.png" />}>BRASA Zurich</Pop>,
      the Brazilian student association in Zurich.
    </>
  ),
  "exp-mundoai": (
    <>
      Founded{" "}
      <Pop id="exp-mundoai" mark={<ImgMark src="/logos/mundoai.png" />}>MundoAI</Pop>, an
      AI-automated TikTok channel for Brazilian audiences.
    </>
  ),
};

/** "Oct 2026 – Present" on one line, with the location below. */
function DateCol({ date, location }: { date: string; location?: string }) {
  return (
    <div className="pt-2 sm:text-right">
      <p className="whitespace-nowrap text-[13px] font-medium leading-snug text-fg/80">{date}</p>
      {location && (
        <p className="mt-1 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-muted sm:flex sm:justify-end">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.800-7 11-7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          {location}
        </p>
      )}
    </div>
  );
}

export default function Experience() {
  return (
    <Section id="experience" title="Experience">
      <div className="-mt-1 mb-14 flex justify-center">
        <a
          href="/Rafael_Braganca_CV.pdf"
          download
          className="group inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm text-fg transition hover:-translate-y-0.5 hover:border-fg/30"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="transition group-hover:translate-y-0.5">
            <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19.5h14" />
          </svg>
          Download CV
        </a>
      </div>

      <ol className="space-y-14 sm:space-y-16">
        {experience.map((job) => (
          <li
            key={job.id}
            id={job.id}
            className="grid scroll-mt-24 gap-3 sm:grid-cols-[10rem_1fr] sm:gap-7"
          >
            <DateCol date={job.date} location={job.location} />

            <div>
              <div className="font-display text-[22px] leading-[1.4] text-fg/55 sm:text-[26px]">
                {sentences[job.id]}
              </div>

              {stats[job.id] && (
                <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
                  {stats[job.id].map((s) => (
                    <div key={s.label}>
                      <dt className="font-display text-4xl leading-none text-fg sm:text-5xl">{s.value}</dt>
                      <dd className="mt-2 text-xs text-muted">{s.label}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 empty:hidden">
                {job.id === "exp-thesis" && (
                  <a
                    href="/cascade-thesis.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent"
                  >
                    Read the thesis (PDF) ↗
                  </a>
                )}
                {job.id === "exp-thesis" && (
                  <a
                    href="https://github.com/RafaelBraganca1006/cascade-fednas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent"
                  >
                    Code on GitHub ↗
                  </a>
                )}
                {job.id === "exp-mundoai" && (
                  <a
                    href="https://www.tiktok.com/@mundoai_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent"
                  >
                    @mundoai_ on TikTok ↗
                  </a>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
