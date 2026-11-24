import Image from "next/image";

export default function Hero() {
  return (
    <section className="city-hero bg-black">
      <div className="city-hero-media"><Image src="/images/cities/bhopal/hero.png" alt="Family travelling by car in Bhopal in warm sunlight" fill priority sizes="100vw" className="city-hero-image" style={{ objectPosition: "center 70%" }} /></div>
      <div className="city-hero-content">
        <div className="hero-reveal">
          <h1 className="hero-headline headline flex flex-wrap items-end justify-center gap-x-3 gap-y-1">
            <span className="text-gradient-electric">Car Window Film in</span>
            <span className="text-[#f47521]">Bhopal</span>
          </h1>
          <p className="hero-subtext font-bold text-white">Nano-Ceramic Window Film Built for Bhopal&apos;s Heat, Sun and City Traffic</p>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-silver-soft">Bhopal summers hit early. By late March, a car parked for even a few minutes starts baking. With traffic piling up around MP Nagar and Hoshangabad Road, SUNKOOL&apos;s nano-ceramic film helps cut heat, glare and UV before they reach the cabin.</p>
        </div>
      </div>
    </section>
  );
}
