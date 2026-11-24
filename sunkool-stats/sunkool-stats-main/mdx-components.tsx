import type { MDXComponents } from "mdx/types";
import Image, { type ImageProps } from "next/image";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // ── Headings ────────────────────────────────────────────────────────
    h1: ({ children }) => (
      <h1 className="mt-0 mb-6 font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-14 mb-4 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 mb-3 font-display text-xl font-medium text-white sm:text-2xl">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-8 mb-2 font-display text-lg font-medium text-silver-soft">
        {children}
      </h4>
    ),

    // ── Body ─────────────────────────────────────────────────────────────
    p: ({ children }) => (
      <p className="mb-6 leading-[1.85] text-fog">{children}</p>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-silver-soft">{children}</strong>
    ),
    em: ({ children }) => <em className="italic text-fog">{children}</em>,

    // ── Links ─────────────────────────────────────────────────────────────
    a: ({ href, children }) => {
      const isExternal = href?.startsWith("http");
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-electric underline underline-offset-2 transition-colors hover:text-glow"
          >
            {children}
          </a>
        );
      }
      return (
        <Link
          href={href ?? "#"}
          className="text-electric underline underline-offset-2 transition-colors hover:text-glow"
        >
          {children}
        </Link>
      );
    },

    // ── Lists ─────────────────────────────────────────────────────────────
    ul: ({ children }) => (
      <ul className="mb-6 space-y-2 pl-0">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-6 list-decimal space-y-2 pl-6 text-fog">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="flex gap-3 text-fog [ol_&]:list-item [ol_&]:pl-0">
        <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-electric [ol_&]:hidden" />
        <span>{children}</span>
      </li>
    ),

    // ── Blockquote ───────────────────────────────────────────────────────
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-electric pl-6 text-fog/80 italic">
        {children}
      </blockquote>
    ),

    // ── Code ─────────────────────────────────────────────────────────────
    code: ({ children, className }) => {
      // Block code (inside <pre>) passes a className like "language-ts"
      if (className) {
        return (
          <code className={`${className} block text-sm leading-relaxed text-silver-soft`}>
            {children}
          </code>
        );
      }
      // Inline code
      return (
        <code className="rounded-md bg-carbon-2 px-1.5 py-0.5 font-mono text-[0.85em] text-glow">
          {children}
        </code>
      );
    },
    pre: ({ children }) => (
      <pre className="my-8 overflow-x-auto rounded-2xl border border-white/8 bg-carbon p-6">
        {children}
      </pre>
    ),

    // ── Table ────────────────────────────────────────────────────────────
    table: ({ children }) => (
      <div className="my-8 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="border-b border-white/10 bg-carbon">{children}</thead>
    ),
    tbody: ({ children }) => <tbody className="divide-y divide-white/8">{children}</tbody>,
    tr: ({ children }) => <tr className="transition-colors hover:bg-white/4">{children}</tr>,
    th: ({ children }) => (
      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-fog">
        {children}
      </th>
    ),
    td: ({ children }) => <td className="px-4 py-3 text-fog">{children}</td>,

    // ── Divider ──────────────────────────────────────────────────────────
    hr: () => <hr className="my-12 border-white/10" />,

    // ── Images ───────────────────────────────────────────────────────────
    img: (props) => {
      const { src, alt, width, height, ...rest } = props as ImageProps & {
        src: string;
        alt?: string;
      };
      return (
        <span className="my-10 block overflow-hidden rounded-2xl border border-white/10">
          <Image
            src={src}
            alt={alt ?? ""}
            width={Number(width) || 1200}
            height={Number(height) || 675}
            sizes="(max-width: 768px) 100vw, 800px"
            className="w-full object-cover"
            {...rest}
          />
        </span>
      );
    },

    ...components,
  };
}
