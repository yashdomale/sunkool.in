
export default function Hero() {
  return (
    <>
      <section className="city-hero bg-black">
        <div className="city-hero-media">
          <Image src="/images/cities/hyderabad/hero.png" alt="SUNKOOL car window film in Hyderabad" fill priority quality={100} sizes="100vw" className="city-hero-image" style={{ objectPosition: "center 70%" }} />
        </div>
        <div className="city-hero-content">
          <div className="hero-reveal">
            <h1
              className="hero-headline headline flex flex-wrap md:flex-nowrap items-end justify-center gap-x-3 gap-y-1"
              style={{ filter: "drop-shadow(0 2px 24px rgba(0,0,0,0.85))" }}
            >
              <span className="text-gradient-electric">Car Window Film in</span>
              <span className="text-[#f47521]">Hyderabad</span>
            </h1>
            <p className="hero-subtext font-bold text-white" style={{ filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.75))" }}>
              Hyderabad has hot summers and a lot of sunlight, which may cause discomfort in a car interior. SUNKOOL nano ceramic window films help one reduce heat, solar glare, and UV rays inside the car interior.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
import Image from "next/image";
