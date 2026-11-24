import Image from "next/image";

export default function Hero() {
  return (
    <section className="city-hero bg-black">
      <div className="city-hero-media">
        <Image
          src="/images/cities/bangalore/banglore9.png"
          alt="Family driving with SUNKOOL window film tinted windows in Bangalore"
          fill
          priority
          sizes="100vw"
          className="city-hero-image reveal-image"
        />
      </div>
      <div className="city-hero-content">
        <div className="hero-reveal">
          <h1 className="hero-headline headline" style={{ filter: "drop-shadow(0 2px 24px rgba(0,0,0,0.85))" }}>
            <span className="text-gradient-electric">Car Window Film in</span>
            <br className="md:hidden" />{" "}
            <span className="text-sun">Bangalore</span>
          </h1>
          <p className="hero-subtext font-bold text-white" style={{ filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.75))" }}>
            Bangalore&rsquo;s bright sunshine, heat, glare, and long traffic hours can make your car cabin
            uncomfortable. SUNKOOL nano-ceramic window films block infrared heat and UV rays while keeping
            visibility clear.
          </p>
        </div>
      </div>
    </section>
  );
}
