import Image from "next/image";

export default function Hero() {
  return (
    <section className="city-hero bg-black">
      <div className="city-hero-media">
        <Image
          src="/images/cities/indore/HERO.png"
          alt="Premium car with professionally installed SUNKOOL nano-ceramic window film parked in Indore"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="city-hero-image"
          style={{ objectPosition: "center 70%" }}
        />
      </div>
      <div className="city-hero-content">
        <div className="hero-reveal">
          <h1 className="hero-headline headline flex flex-wrap items-end justify-center gap-x-3 gap-y-1">
            <span className="text-gradient-electric">Car Window Film in</span>
            <span className="text-[#f47521]">Indore</span>
          </h1>
          <p className="hero-subtext font-bold text-white">Nano-Ceramic Window Film for Indore&apos;s Heat, Glare &amp; UV Exposure</p>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-silver-soft">Indore&apos;s dry, intense summer can make your car cabin uncomfortable during outdoor parking and peak daytime drives. SUNKOOL nano-ceramic window films help reduce solar heat, infrared energy, glare and UV exposure while maintaining visibility and signal performance.</p>
        </div>
      </div>
    </section>
  );
}
