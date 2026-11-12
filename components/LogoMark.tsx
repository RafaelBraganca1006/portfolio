import type { Logo } from "@/data/content";

const tile =
  "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl";

export default function LogoMark({ logo }: { logo: Logo }) {
  if (logo.kind === "img")
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={logo.src} alt={logo.alt} className={`${tile} object-cover`} />
    );

  if (logo.kind === "mono")
    return (
      <div
        className={`${tile} font-display text-xs text-white`}
        style={{ background: logo.bg }}
        aria-hidden
      >
        {logo.text}
      </div>
    );

  if (logo.kind === "tum")
    return (
      <div className={`${tile} bg-white`} aria-label="TUM">
        <svg viewBox="0 0 56 56" className="h-7 w-7">
          <text x="28" y="35" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="800" fontSize="22" fill="#0065bd" letterSpacing="-1">TUM</text>
        </svg>
      </div>
    );

  // BMW roundel
  return (
    <div className={`${tile} bg-transparent`} aria-label="BMW">
      <svg viewBox="0 0 100 100" className="h-10 w-10">
        <defs>
          <path id="bmw-arc" d="M 14 50 A 36 36 0 0 1 86 50" />
        </defs>
        <circle cx="50" cy="50" r="48" style={{ fill: "var(--fg)" }} />
                <circle cx="50" cy="50" r="31" fill="#fff" />
        <path d="M50 19 A31 31 0 0 1 81 50 L50 50 Z" fill="#1c69d4" />
        <path d="M50 81 A31 31 0 0 1 19 50 L50 50 Z" fill="#1c69d4" />
        <circle cx="50" cy="50" r="31" fill="none" stroke="#111" strokeWidth="1" />
        <text fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="13" style={{ fill: "var(--bg)" }} letterSpacing="3">
          <textPath href="#bmw-arc" startOffset="50%" textAnchor="middle">BMW</textPath>
        </text>
      </svg>
    </div>
  );
}
