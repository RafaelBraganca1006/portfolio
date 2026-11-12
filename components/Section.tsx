export default function Section({
  id,
  title,
  wide,
  width,
  children,
}: {
  id: string;
  title: string;
  wide?: boolean;
  /** overrides the max width, e.g. "max-w-6xl" */
  width?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`mx-auto scroll-mt-16 px-6 pb-16 pt-10 sm:pb-20 sm:pt-12 ${width ?? (wide ? "max-w-5xl" : "max-w-3xl")}`}
    >
      <h2 className="mb-6 text-center text-base uppercase tracking-[0.28em] text-fg/80 sm:text-lg">
        {title}
      </h2>
      {children}
    </section>
  );
}
