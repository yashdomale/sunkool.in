import Image from "next/image";

export default function Hero() {
  return (
    <>
      {/* 1. Hero — nav + hero together fill exactly one viewport (100svh);
          background photo is full-bleed object-fit: cover. */}
      <section className="city-hero bg-black">
        <div className="city-hero-media">
          <Image
            src="/images/cities/mumbai/mumbai-sedan.png"
            alt="Family driving past Chhatrapati Shivaji Maharaj Terminus (CSMT) with SUNKOOL heat-control window film"
            fill
            priority
            quality={100}
            sizes="100vw"
            className="city-hero-image"
          />
        </div>

        <div className="city-hero-content hero-reveal">
          <h1
            className="hero-headline headline"
            style={{ filter: "drop-shadow(0 2px 24px rgba(0,0,0,0.85))" }}
          >
            <span className="text-gradient-electric">Car Window Film in</span>{" "}
            <span className="text-sun">Mumbai</span>
          </h1>

          <p
            className="hero-subtext font-medium text-white"
            style={{ filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.75))" }}
          >
            Whether you&rsquo;re commuting through Mumbai&rsquo;s busy roads, driving in the
            afternoon or leaving your vehicle parked outdoors, solar heat can quickly make the
            cabin uncomfortable. A good window film addresses heat, glare and UV exposure
            together &mdash; and you don&rsquo;t necessarily need an extremely dark film to
            get meaningful heat rejection.
          </p>
        </div>
      </section>
    </>
  );
}
