export const profile = {
  name: "Rafael Bragança Oliveira",
  role: "Computer Science @ ETH Zurich",
  email: "rbraganca@ethz.ch",
  linkedin:
    "https://www.linkedin.com/in/rafael-bragan%C3%A7a-oliveira-9a624b1bb/",
  github: "https://github.com/RafaelBraganca1006",
  location: "Zürich, Switzerland",
};

export type Link = { label: string; href: string };

export type Logo =
  | { kind: "img"; src: string; alt: string }
  | { kind: "bmw" }
  | { kind: "tum" }
  | { kind: "mono"; text: string; bg: string };

export type Job = {
  id: string;
  logo: Logo;
  date: string;
  location?: string;
  title: string;
  org: string;
  note?: string;
  text?: string;
  points?: string[];
  links?: Link[];
  preview?: { src: string; href: string; alt: string };
};

export const experience: Job[] = [
  {
    id: "exp-bmw",
    logo: { kind: "bmw" },
    date: "Oct 2026 – Present",
    location: "Zurich",
    title: "AI Engineer, Working Student",
    org: "BMW — Financial Services",
    text: "Building AI automation for financial services, focused on collections and recovery: optimizing processes for the Collections & Recovery team and for the wider finance team.",
    points: [
      "Building AI automation for financial services, focused on collections and recovery.",
      "Optimizing processes for the Collections & Recovery team and for the wider finance team.",
    ],
  },
  {
    id: "exp-thesis",
    logo: { kind: "img", src: "/logos/eth.png", alt: "ETH Zürich" },
    date: "Mar 2026 – Sep 2026",
    location: "Zurich",
    title: "Bachelor Thesis — Federated Neural Architecture Search",
    org: "Distributed Computing Group, ETH Zürich",
    note: "Supervisors: Prof. Roger Wattenhofer, Antonio Di Maio",
    text: "Federated NAS lets many phones, wearables and hospital devices jointly train an AI model without their private data ever leaving the device, while still producing a model that fits each one. I built CASCADE (PyTorch), a method that splits the shared supernet's update into nested pieces, ordered so that any partial upload is already a smaller, valid model, and pairs it with a policy that sizes each device's model to its current connection, so a client with a slow or unstable connection still contributes to training instead of being dropped.",
    links: [
      { label: "Thesis (PDF)", href: "/cascade-thesis.pdf" },
      { label: "Code on GitHub", href: "https://github.com/RafaelBraganca1006/cascade-fednas" },
    ],
    preview: { src: "/thesis-preview.png", href: "/cascade-thesis.pdf", alt: "First page of the CASCADE thesis" },
    points: [
      "Federated NAS lets phones, wearables and hospital devices train one AI model together without sharing their private data.",
      "CASCADE (PyTorch) sends the shared supernet's update in nested pieces, so any partial upload is already a valid, smaller model.",
      "Each device gets a model sized to its connection, so slow or unstable clients still contribute.",
      "Result: up to 17 points more accurate than the current state of the art, and nearly every device now contributes instead of being left out.",
    ],
  },
  {
    id: "exp-tum",
    logo: { kind: "tum" },
    date: "Oct 2025 – Mar 2026",
    location: "Munich",
    title: "Research Assistant, AI Engineer",
    org: "GenAI Lab, Technical University of Munich (TUM)",
    points: [
      "Research assistant at the GenAI Lab and the Professorship of Digital Marketing.",
      "Research on AI-driven content creation: full-stack systems that automate the production of social media content.",
      "PersonaAI was the practical artifact of that research.",
    ],
  },
  {
    id: "exp-exchange",
    logo: { kind: "tum" },
    date: "Sep 2025 – Feb 2026",
    location: "Munich",
    title: "Exchange Semester",
    org: "Technical University of Munich (TUM)",
    points: [
      "One semester abroad from ETH Zürich at the Technical University of Munich.",
      "TUM is ranked the best university in the European Union (QS World University Rankings).",
    ],
    links: [{ label: "TUM ranking news", href: "https://www.tum.de/en/news-and-events/all-news/press-releases/details/tum-once-again-named-the-best-university-in-the-eu" }],
  },
  {
    id: "exp-ethbc",
    logo: { kind: "img", src: "/logos/eth-blockchain.png", alt: "ETH Blockchain Club" },
    date: "Mar 2026 – Present",
    location: "Zurich",
    title: "Board Member, Head of Marketing",
    org: "ETH Blockchain Club",
    text: "Partnered with Ethereum Foundation, Solana Foundation, ChainSecurity and Dialectic.",
    links: [{ label: "eth-blockchain.org", href: "https://eth-blockchain.org" }],
    points: [
      "Lead marketing for the club as Head of Marketing.",
      "Partnerships with the Ethereum Foundation, Solana Foundation, ChainSecurity and Dialectic.",
      "Events that promote technical education and career opportunities for the blockchain community.",
    ],
  },
  {
    id: "exp-claude",
    logo: { kind: "img", src: "/logos/claude-club.png", alt: "Claude Builder Club" },
    date: "Apr 2026 – Present",
    location: "Zurich",
    title: "Board Member, Technical Track",
    org: "Claude Builder Club Zürich",
    text: "Leading developer workshops with Anthropic tools.",
    links: [{ label: "claudethzurich.com", href: "https://www.claudethzurich.com" }],
    points: [
      "Coordinate events that grow the AI builder community at ETH Zurich, in collaboration with Anthropic.",
      "Connect students with industry leaders and startup founders.",
      "Run developer workshops with Anthropic tools.",
      "More than 1,000 people have attended our events.",
    ],
  },
  {
    id: "exp-brasa",
    logo: { kind: "img", src: "/logos/brasa.png", alt: "BRASA Zurich" },
    date: "Sep 2025 – Present",
    location: "Zurich",
    title: "Co-Founder & Board Member",
    org: "BRASA Zurich",
    text: "Brazilian Student Association in Zurich, grown to more than 100 members.",
    points: [
      "Co-founded the Brazilian Student Association in Zurich.",
      "Grew it to more than 100 members through social media outreach and community events.",
    ],
  },
  {
    id: "exp-eth",
    logo: { kind: "img", src: "/logos/eth.png", alt: "ETH Zürich" },
    date: "Sep 2023 – Present",
    location: "Zurich",
    title: "B.Sc. Computer Science",
    org: "ETH Zürich",
    points: [
      "Bachelor of Science in Computer Science, expected February 2027.",
      "ETH Zürich has one of the top 3 computer science departments in the world (Times Higher Education 2026).",
    ],
    links: [{ label: "THE computer science ranking", href: "https://www.timeshighereducation.com/world-university-rankings/2026/subject-ranking/computer-science" }],
  },
  {
    id: "exp-mundoai",
    logo: { kind: "img", src: "/logos/mundoai.png", alt: "MundoAI" },
    date: "Jul 2023 – Present",
    location: "Remote",
    title: "Founder & AI Content Engineer",
    org: "MundoAI — Independent AI Creator Project",
    text: "Built and scaled an AI-automated content platform to 200K+ followers, 7M+ likes and 60M+ views on TikTok, with end-to-end automation pipelines for AI-generated images, videos and interactive media.",
    links: [{ label: "@mundoai_", href: "https://www.tiktok.com/@mundoai_" }],
    points: [
      "Built a fully AI-automated content channel for Brazilian audiences interested in AI and technology.",
      "Reached 200K+ followers, 7M+ likes and 60M+ views on TikTok.",
      "Engineered end-to-end automation pipelines with the Claude API and Claude Code for content creation, orchestration and social media management.",
    ],
  },
];

// Newest first: later start date on top; on a tie, the one that lasts longer comes first.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const stamp = (d: string) => (d === "Present" ? Infinity : Number(d.split(" ")[1]) * 12 + MONTHS.indexOf(d.split(" ")[0]));
const span = (d: string) => d.split(" – ").map((x) => x.trim());
experience.sort((a, b) => {
  const [as, ae = as] = span(a.date);
  const [bs, be = bs] = span(b.date);
  return stamp(bs) - stamp(as) || stamp(be) - stamp(ae);
});

export const skillGroups = [
  {
    title: "AI & Research",
    items: ["Neural Architecture Search", "Federated Learning", "LLM Multi-Agent Workflows", "PyTorch", "SLURM Cluster"],
  },
  {
    title: "Systems & CS",
    items: ["LLMs", "RAG", "PyTorch", "NumPy", "React", "Next.js"],
  },
  {
    title: "Leadership & Collaborations",
    items: ["ETH Blockchain Club", "Anthropic / Claude Club", "BRASA Zurich (Co-Founder)", "GenAI Lab @ TUM"],
  },
];

export type Project = {
  title: string;
  /** one short line */
  desc: string;
  /** the cover and the first link lead to the same place */
  image: string;
  alt: string;
  /** which part of the cover to keep when it is cropped to the card shape */
  position?: string;
  /** a longer, more technical description shown when hovering the cover */
  tech: string;
  links: Link[];
};

// Order matters: this is the order on the page (two per row).
export const projects: Project[] = [
  {
    title: "CASCADE",
    tech: "Federated neural architecture search with an elastic supernet that is streamed to clients in cascading stages, so each device receives the largest subnetwork that fits its bandwidth and deadline. Compared with SuperFedNAS on CIFAR-10 and CIFAR-100 under non-IID data, with accuracy versus compute Pareto fronts.",
    desc: "Keeps slow devices in the loop when AI is trained across phones and sensors.",
    image: "/projects/cascade.jpg",
    alt: "CASCADE: ETH Zürich bachelor thesis, with a results figure from the paper",
    links: [
      { label: "Paper", href: "/cascade-thesis.pdf" },
      { label: "Code", href: "https://github.com/RafaelBraganca1006/cascade-fednas" },
    ],
  },
  {
    title: "Jasmin",
    tech: "Groq Whisper transcribes the consultation live, then a five-step LangGraph agent builds the clinical record: anamnesis, exam and odontogram, CID-10 diagnosis, treatment plan and gap review. A billing agent checks TUSS codes and authorization rules, flags claim-denial risks and generates the TISS form. Next.js 15 and TypeScript. Judged by Henrique Vaz (co-founder of Enter) and Mônica Saggioro (Maya Capital).",
    desc: "An AI assistant that transcribes and summarizes consultations. Top 8 finalist in Laura Dubugras's coding club challenge, sponsored by Cognition.",
    image: "/jasmin.png",
    alt: "Jasmin, an AI assistant for clinical consultations",
    position: "50% 30%",
    links: [
      { label: "Code", href: "https://github.com/RafaelBraganca1006/jasmin" },
    ],
  },
  {
    title: "InteliSUS",
    tech: "Rebuilds the nightly census of every SUS hospital since 2014 from DATASUS admissions, syncs to the latest complete data and propagates it with an M(t)/G/∞ model and calibrated 50/80/95% intervals. A Monte Carlo simulator runs scenarios with regional regulation. DuckDB and NumPy pipeline, React, MapLibre and ECharts.",
    desc: "Forecasts hospital bed occupancy in São Paulo and simulates policy scenarios.",
    image: "/projects/intelisus.jpg",
    alt: "InteliSUS: a map of hospital bed occupancy in São Paulo state",
    links: [{ label: "Code", href: "https://github.com/RafaelBraganca1006/intelisus" }],
  },
  {
    title: "Apuração 2026",
    tech: "A static site fed by a Python collector that polls the official TSE portal for all 5,757 municipalities and writes a single compact JSON file, refreshed every minute or so. The client polls it every 30 seconds and renders a dark choropleth map with live status and history.",
    desc: "A live city-by-city map of Brazil's 2026 runoff, on official TSE data.",
    image: "/projects/apuracao.jpg",
    alt: "Apuração 2026: Lula versus Flávio, the live map of the runoff",
    links: [{ label: "Code", href: "https://github.com/RafaelBraganca1006/apuracao-2026" }],
  },
  {
    title: "PersonaAI",
    tech: "A pipeline from persona profile to idea, slide prompts, images generated from reference photos for a consistent face, and caption. Includes a React Flow workflow builder, Veo 3.1 video, a rate limiter for Gemini quotas and row-level security on Supabase. No custom backend. Built from a project at the GenAI Lab, TUM.",
    desc: "Generates Instagram carousels and videos for AI personas. Built from a GenAI Lab project at TUM.",
    image: "/projects/persona.jpg",
    alt: "PersonaAI: generated Instagram posts for an AI persona",
    links: [{ label: "Code", href: "https://github.com/RafaelBraganca1006/persona_ai" }],
  },
  {
    title: "MundoAI",
    tech: "An automated short-video pipeline that generates, edits and publishes AI content to TikTok at scale, growing to 200K+ followers and 60M+ views.",
    desc: "An AI-automated TikTok channel with 200K+ followers and 60M+ views.",
    image: "/projects/mundoai.jpg",
    alt: "MundoAI logo",
    links: [{ label: "TikTok", href: "https://www.tiktok.com/@mundoai_" }],
  },
];

/** Extra cards that open from the text but are not timeline entries. */
export const popCards: Job[] = [
  {
    id: "persona",
    logo: { kind: "img", src: "/logos/persona.png", alt: "PersonaAI" },
    date: "",
    title: "PersonaAI",
    org: "Open source · built at the GenAI Lab, TUM",
    points: [
      "Generates Instagram carousels and short videos for AI personas, from the first idea to a ready-to-post caption.",
      "Each persona has a personality, visual style and audience that steer every generation.",
      "Built with React, Supabase and the Gemini API.",
    ],
    links: [{ label: "View on GitHub", href: "https://github.com/RafaelBraganca1006/persona_ai" }],
  },
];
