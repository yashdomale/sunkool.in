import Image from "next/image";

export default function Hero() {
  return (
    <section className="city-hero bg-black">
      <div className="city-hero-media"><Image src="/images/cities/ernakulam/hero.png" alt="Family travelling by car in Ernakulam near the Kerala backwaters" fill priority sizes="100vw" className="city-hero-image" style={{ objectPosition: "center 70%" }} /></div>
      <div className="city-hero-content">
        <div className="hero-reveal">
          <h1 className="hero-headline headline flex flex-wrap items-end justify-center gap-x-3 gap-y-1">
            <span className="text-gradient-electric">Car Window Film in</span>
            <span className="text-[#f47521]">Ernakulam</span>
          </h1>
          <p className="hero-subtext font-bold text-white">Nano-Ceramic Window Film for Ernakulam&apos;s Heat, Humidity and Backwater Climate</p>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-silver-soft">Ernakulam doesn&apos;t do things halfway &ndash; the humidity clings, and the sun doesn&apos;t let up for hours at a stretch. Park anywhere near MG Road or get stuck in NH66 traffic, and your car turns into an oven fast. SUNKOOL&apos;s nano-ceramic film helps cut heat, glare and UV before they ever reach you.</p>
        </div>
      </div>
    </section>
  );
}
