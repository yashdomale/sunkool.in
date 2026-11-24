import Image from "next/image";

export default function Hero() {
  return (
    <section className="city-hero bg-black">
      <div className="city-hero-media"><Image src="/images/cities/jaipur/hero.png" alt="Family travelling by car in Jaipur in warm sunlight" fill priority sizes="100vw" className="city-hero-image" style={{ objectPosition: "center 70%" }} /></div>
      <div className="city-hero-content">
        <div className="hero-reveal">
          <h1 className="hero-headline headline flex flex-wrap items-end justify-center gap-x-3 gap-y-1">
            <span className="text-gradient-electric">Car Window Film in</span>
            <span className="text-[#f47521]">Jaipur</span>
          </h1>
          <p className="hero-subtext font-bold text-white">Nano-Ceramic Window Film Built for Jaipur&apos;s Heat, Sun and City Traffic</p>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-silver-soft">Jaipur&apos;s sun is intense for most of the year, and between the Pink City&apos;s dense old-city traffic and long stretches like Tonk Road and JLN Marg, a car here spends a lot of time sitting still under direct sun rather than moving through it. SUNKOOL&apos;s nano-ceramic film helps cut heat, glare and UV before they reach the cabin.</p>
        </div>
      </div>
    </section>
  );
}
