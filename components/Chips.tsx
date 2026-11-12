export default function Chips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((t) => (
        <li
          key={t}
          className="rounded-full border border-line bg-white/[0.03] px-3 py-1 text-xs text-fg/70"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}
