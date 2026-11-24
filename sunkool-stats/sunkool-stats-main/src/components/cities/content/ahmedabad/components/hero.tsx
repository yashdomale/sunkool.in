
export default function Hero() {
  return (
    <>
      <section className="city-hero bg-black">
        <div className="city-hero-media">
          <Image src="/images/cities/ahmedabad/hero.png" alt="SUNKOOL car window film in Ahmedabad" fill priority quality={100} sizes="100vw" className="city-hero-image" style={{ objectPosition: "center 70%" }} />
        </div>
        <div className="city-hero-content">
          <div className="hero-reveal">
            <h1
              className="hero-headline headline flex flex-wrap md:flex-nowrap items-end justify-center gap-x-3 gap-y-1"
              style={{ filter: "drop-shadow(0 2px 24px rgba(0,0,0,0.85))" }}
            >
              <span className="text-gradient-electric">Car Window Film in</span>
              <span className="text-[#f47521]">Ahmedabad</span>
            </h1>
            <p className="hero-subtext font-bold text-white" style={{ filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.75))" }}>{"Beat Ahmedabad's Heat With Nano-Ceramic Window Film. By April, an Ahmedabad afternoon can turn a parked car into something you'd rather not sit in. Between the SG Highway crawl and the open-sky parking that's common across the city, your windows spend most of the day absorbing heat you'll feel the moment you get back in. SUNKOOL's nano ceramic window films are built to cut that heat down, along with glare and UV exposure, before it reaches you."}</p>
          </div>
        </div>
      </section>
    </>
  );
}
import Image from "next/image";
