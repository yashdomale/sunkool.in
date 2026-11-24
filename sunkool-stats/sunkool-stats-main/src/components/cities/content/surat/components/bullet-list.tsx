export default function BulletList({ items, className = "" }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={`grid gap-x-8 gap-y-3 ${className}`.trim()}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-[15px] font-bold leading-relaxed text-silver-soft sm:text-base">
          <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-kool" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
