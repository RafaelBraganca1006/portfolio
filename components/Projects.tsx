import Section from "./Section";
import { projects } from "@/data/content";

const external = (h: string) => h.startsWith("http");
const open = (h: string) => (external(h) ? { target: "_blank", rel: "noopener noreferrer" } : {});

export default function Projects() {
  return (
    <Section id="projects" title="Projects" width="max-w-6xl">
      <ul className="grid gap-x-8 gap-y-16 sm:grid-cols-2">
        {projects.map((p) => (
          <li key={p.title}>
            <a
              href={p.links[0].href}
              {...open(p.links[0].href)}
              aria-label={p.title}
              className="group relative block overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_24px_60px_-32px_rgba(0,0,0,0.55)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_32px_70px_-30px_rgba(0,0,0,0.6)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt={p.alt}
                loading="lazy"
                style={{ objectPosition: p.position ?? "50% 50%" }}
                className="aspect-[16/9] w-full object-cover"
              />
              <span className="pointer-events-none absolute inset-0 flex items-end bg-black/80 p-5 text-left text-[13px] leading-relaxed text-white/90 opacity-0 backdrop-blur-sm transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:p-6 sm:text-sm">
                {p.tech}
              </span>
            </a>

            <h3 className="mt-5 font-display text-2xl leading-tight text-fg">{p.title}</h3>
            <p className="mt-1.5 max-w-md text-[15px] leading-relaxed text-fg/70">{p.desc}</p>
            <p className="mt-3 flex gap-5 text-sm">
              {p.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  {...open(l.href)}
                  className="text-accent underline decoration-accent/30 underline-offset-4 transition hover:decoration-accent"
                >
                  {l.label}
                </a>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
