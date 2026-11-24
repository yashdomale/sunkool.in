import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

export function PageHeader({
  eyebrow,
  title,
  description,
  accent = "rgba(88,167,232,0.25)",
  titleClassName = "headline max-w-4xl text-5xl sm:text-7xl text-gradient-silver",
  className,
  descriptionClassName = "mt-6 max-w-2xl text-lg leading-relaxed text-white",
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  accent?: string;
  titleClassName?: string;
  className?: string;
  descriptionClassName?: string;
}) {
  return (
    <section
      className={cn("relative overflow-hidden pt-36 pb-16", className)}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[40vh] w-[70vh] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }}
      />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-25 mask-fade-y" />
      <div className="container-lux relative">
        <Reveal>
          <p className="eyebrow mb-4">{eyebrow}</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className={titleClassName}>
            {title}
          </h1>
        </Reveal>
        {description && (
          <Reveal delay={0.12}>
            <p className={descriptionClassName}>
              {description}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
