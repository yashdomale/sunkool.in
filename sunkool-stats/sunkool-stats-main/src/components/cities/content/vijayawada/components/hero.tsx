import Image from "next/image";

export default function Hero() {
  return (
    <section className="city-hero bg-black">
      <div className="city-hero-media">
        <Image src="/images/cities/vijayawada/hero.png" alt="SUNKOOL car window film in Vijayawada" fill priority sizes="100vw" className="city-hero-image" style={{ objectPosition: "center 70%" }} />
      </div>
      <div className="city-hero-content">
        <div className="hero-reveal">
          <h1 className="hero-headline headline flex flex-wrap items-end justify-center gap-x-3 gap-y-1">
            <span className="text-gradient-electric">Car Window Film in</span>
            <span className="text-[#f47521]">Vijayawada</span>
          </h1>
          <p className="hero-subtext font-bold text-white">Nano-Ceramic Window Film for Vijayawada&apos;s Heat, Glare &amp; UV Exposure</p>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-silver-soft">Vijayawada&apos;s intense climate can make your car cabin uncomfortable during outdoor parking and peak daytime drives. SUNKOOL nano-ceramic window films help reduce solar heat, infrared energy, glare and UV exposure while maintaining visibility and signal performance.</p>
        </div>
      </div>
    </section>
  );
}
