import Section from "./Section";
import PianoLine from "./PianoLine";
import PhotoPop from "./PhotoPop";

const B = ({ children }: { children: React.ReactNode }) => (
  <strong className="font-medium text-fg">{children}</strong>
);

const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent"
  >
    {children} ↗
  </a>
);

export default function About() {
  return (
    <Section id="about" title="About Me">
      <div className="space-y-4 text-[15px] leading-relaxed text-fg/75">
        <p>
          My journey began in <B>São Paulo, Brazil</B>, where I grew up and attended <B>Colégio Visconde de Porto Seguro</B>. Selected for the bilingual German curriculum, I completed both the <B>German Abitur</B> and the <B>Brazilian Ensino Médio</B> diplomas.
        </p>
        <p>
          At 18, I moved to Switzerland to pursue a B.Sc. in Computer Science at <B>ETH Zürich</B> (ranked among the{" "}
          <A href="https://www.timeshighereducation.com/world-university-rankings/2026/subject-ranking/computer-science">Top 3 CS departments worldwide</A>). During my degree, I was selected for an academic exchange at the <B>Technical University of Munich (TUM)</B>, where I worked as an AI Researcher at the GenAI Lab &amp; Professorship of Digital Marketing, developing full-stack AI content automation systems.
        </p>
        <p>
          Beyond engineering, I actively shape university tech ecosystems: as Board Member &amp; Head of Marketing at{" "}
          <A href="https://eth-blockchain.org/">ETH Blockchain Club</A> (leading partnerships with the Ethereum Foundation, Solana Foundation, ChainSecurity, and Dialectic); Board Member of{" "}
          <A href="https://www.claudethzurich.com/">Claude Builder Club Zürich</A> (collaborating with Anthropic to drive adoption of Claude tools and agentic workflows); and Co-Founder &amp; Board Member of <B>BRASA Zurich</B> (Brazilian Student Association).
        </p>
        <PianoLine
          before={<>Outside of computer science and academia, I am deeply passionate about music and sports. I have been playing the </>}
          trigger="piano for over 15 years"
          after={<>, with a focus on Classical music and Jazz, and I am a big football fan and die-hard supporter of{" "}<PhotoPop icon="/photos/kid-corinthians-icon.jpg" photo="/photos/kid-corinthians.jpg" alt="Rafael as a kid in a Corinthians jersey, foot on a ball">Corinthians</PhotoPop>.</>}
        />
      </div>
    </Section>
  );
}
