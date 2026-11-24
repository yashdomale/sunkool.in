import Image from "next/image";

export default function Hero() {
  return (
    <>
      <section className="city-hero bg-black">
        <div className="city-hero-media">
          <Image src="/images/cities/kolkata/hero.png" alt="SUNKOOL car window film in Kolkata" fill priority quality={100} sizes="100vw" className="city-hero-image" style={{ objectPosition: "center 70%" }} />
        </div>
        <div className="city-hero-content">
          <div className="hero-reveal">
            <h1
              className="hero-headline headline flex flex-wrap md:flex-nowrap items-end justify-center gap-x-3 gap-y-1"
              style={{ filter: "drop-shadow(0 2px 24px rgba(0,0,0,0.85))" }}
            >
              <span className="text-gradient-electric">Car Window Film in</span>
              <span className="text-[#f47521]">Kolkata</span>
            </h1>
            <p className="hero-subtext font-bold text-white" style={{ filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.75))" }}>
              Kolkata&apos;s warm and humid weather and intense sunlight can make your car cabin uncomfortable. SUNKOOL nano-ceramic window films assist in cutting down infrared heat, solar glare and UV exposure without compromising on optics and signals.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
