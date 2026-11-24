import Image from "next/image";

export default function Hero() {
  return (
    <section className="city-hero bg-black">
      <div className="city-hero-media">
        <Image src="/images/cities/kozhikode/hero.png" alt="Car driving through Kozhikode under bright sun with SUNKOOL heat-control window film" fill priority sizes="100vw" className="city-hero-image" style={{ objectPosition: "center 70%" }} />
      </div>
      <div className="city-hero-content">
        <div className="hero-reveal">
          <h1 className="hero-headline headline flex flex-wrap items-end justify-center gap-x-3 gap-y-1">
            <span className="text-gradient-electric">Car Window Film in</span>
            <span className="text-[#f47521]">Kozhikode</span>
          </h1>
          <p className="hero-subtext font-bold text-white">Nano-Ceramic Window Film for Kozhikode&apos;s Heat, Humidity &amp; UV Exposure</p>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-silver-soft">Kozhikode stays warm and humid through the year. Direct sun, long traffic waits and open parking can heat the cabin fast. SUNKOOL&apos;s nano-ceramic window films help cut heat, infrared energy, glare and UV exposure while maintaining optical clarity.</p>
        </div>
      </div>
    </section>
  );
}
