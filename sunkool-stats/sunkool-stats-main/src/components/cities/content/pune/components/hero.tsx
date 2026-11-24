import Image from "next/image";

export default function Hero() {
  return (
    <>
      {/* 1. Hero: shared Nagpur city-page structure */}
      <section className="city-hero bg-black">
        <div className="city-hero-media">
          <Image
            src="/images/cities/pune/shaniwar.png"
            alt="Family driving with SUNKOOL window film tinted windows past Shaniwar Wada in Pune"
            fill
            priority
            sizes="100vw"
            className="city-hero-image"
          />
        </div>
        <div className="city-hero-content">
          <div className="hero-reveal">
            <h1 className="hero-headline headline flex flex-wrap items-end justify-center gap-x-3 gap-y-1">
              <span className="text-gradient-electric">Car Window Film in</span>
              <span className="text-sun uppercase">Pune</span>
            </h1>
            <p className="hero-subtext font-bold text-white">
              Pune&rsquo;s bright sunshine can overheat your cabin, create glare, and fade
              your interiors. SUNKOOL nano-ceramic window films block infrared heat and UV
              rays while keeping visibility clear.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
