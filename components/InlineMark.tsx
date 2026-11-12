// Small logos used inline inside sentences.
const box = "mx-0.5 inline-block h-[1.05em] w-[1.05em] -translate-y-[0.12em] align-middle";

export function BmwMark() {
  return (
    <svg viewBox="0 0 100 100" className={box} aria-hidden>
      <circle cx="50" cy="50" r="48" style={{ fill: "var(--fg)" }} />
      <circle cx="50" cy="50" r="31" fill="#fff" />
      <path d="M50 19 A31 31 0 0 1 81 50 L50 50 Z" fill="#1c69d4" />
      <path d="M50 81 A31 31 0 0 1 19 50 L50 50 Z" fill="#1c69d4" />
    </svg>
  );
}

export function EthMark() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/logos/eth.png" alt="" className={`${box} rounded-[3px]`} />
  );
}

export function BrazilFlag() {
  return (
    <svg viewBox="0 0 28 20" className="mx-0.5 inline-block h-[0.85em] w-[1.19em] -translate-y-[0.06em] align-middle" aria-label="Brazil">
      <rect width="28" height="20" rx="2.5" fill="#009c3b" />
      <path d="M14 2.4 25 10 14 17.6 3 10Z" fill="#ffdf00" />
      <circle cx="14" cy="10" r="4.4" fill="#002776" />
    </svg>
  );
}

export function LinkedInMark() {
  return (
    <svg viewBox="0 0 100 100" className={box} aria-hidden>
      <rect width="100" height="100" rx="20" fill="#0a66c2" />
      <path fill="#fff" d="M24 38h12v38H24zM30 20a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM44 38h11v5c2-3.600 6-6 12-6 12 0 15 8 15 18v21H70V57c0-5-1-9-6-9s-8 3-8 9v19H44z" />
    </svg>
  );
}

export function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" className={box} aria-hidden fill="currentColor">
      <path className="text-fg" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

export function MailMark() {
  return (
    <svg viewBox="0 0 100 100" className={box} aria-hidden>
      <rect width="100" height="100" rx="20" fill="#ea4335" />
      <path d="M20 31h60v38H20z" fill="#fff" />
      <path d="m20 33 30 24 30-24" fill="none" stroke="#ea4335" strokeWidth="6" strokeLinejoin="round" />
    </svg>
  );
}

export function ImgMark({ src }: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className={`${box} rounded-[5px] object-cover`} />
  );
}

export function TumMark() {
  return (
    <svg viewBox="0 0 100 100" className={box} aria-hidden>
      <rect width="100" height="100" rx="20" fill="#fff" stroke="#d7dbe2" strokeWidth="3" />
      <text x="50" y="62" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="800" fontSize="36" fill="#0065bd" letterSpacing="-2">TUM</text>
    </svg>
  );
}

export function MonoMark({ text, bg }: { text: string; bg: string }) {
  return (
    <svg viewBox="0 0 100 100" className={box} aria-hidden>
      <rect width="100" height="100" rx="20" fill={bg} />
      <text x="50" y="65" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize={text.length > 1 ? 42 : 56} fill="#fff">{text}</text>
    </svg>
  );
}

export function SwissFlag() {
  return (
    <svg viewBox="0 0 20 20" className="mx-0.5 inline-block h-[0.95em] w-[0.95em] -translate-y-[0.06em] align-middle" aria-label="Switzerland">
      <rect width="20" height="20" rx="2.5" fill="#d52b1e" />
      <path d="M8.4 4h3.2v4.4H16v3.2h-4.400V16H8.400v-4.400H4V8.400h4.400z" fill="#fff" />
    </svg>
  );
}
