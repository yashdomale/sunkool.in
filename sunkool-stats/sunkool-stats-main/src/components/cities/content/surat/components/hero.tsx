import Image from "next/image";

export default function Hero() {
  return (
    <section className="city-hero bg-black">
      <div className="city-hero-media">
        <Image
          src="/images/cities/surat/hero.png"
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className="city-hero-image"
          style={{ objectPosition: "center 70%" }}
        />
      </div>
      <div className="city-hero-content">
        <div className="hero-reveal">
          <h1
            className="hero-headline headline flex flex-wrap items-end justify-center gap-x-3 gap-y-1 md:flex-nowrap"
            style={{ filter: "drop-shadow(0 2px 24px rgba(0,0,0,0.85))" }}
          >
            <span className="text-gradient-electric">Car Window Film in</span>
            <span className="text-heat">Surat</span>
          </h1>
          <p className="hero-subtext text-balance font-bold text-white" style={{ filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.75))" }}>
            Nano-Ceramic Window Film Built for Surat&apos;s Heat, Humidity and{" "}
            <span className="whitespace-nowrap">Diamond-City</span> Traffic
          </p>
        </div>
      </div>
    </section>
  );
}
