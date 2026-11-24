import type { TemplateCopy } from "@/components/cities/content/nagpur/copy";
import Image from "next/image";

export default function Hero({ copy }: { copy: TemplateCopy["hero"] }) {
  return (
    <>
      <section className="city-hero bg-black">
        <div className="city-hero-media">
          <Image
            src={copy.image}
            alt={copy.imageAlt}
            fill
            priority
            quality={100}
            sizes="100vw"
            className="city-hero-image"
          />
        </div>
        <div className="city-hero-content">
          <div className="hero-reveal">
            <h1
              className="hero-headline headline flex flex-wrap md:flex-nowrap items-end justify-center gap-x-3 gap-y-1"
              style={{ filter: "drop-shadow(0 2px 24px rgba(0,0,0,0.85))" }}
            >
              <span className="text-gradient-electric">Car Window Film in</span>
              <span className="text-[#f47521] uppercase">{copy.cityName}</span>
            </h1>
            <p className="hero-subtext font-bold text-white" style={{ filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.75))" }}>{copy.subtext}</p>
          </div>
        </div>
      </section>
    </>
  );
}
