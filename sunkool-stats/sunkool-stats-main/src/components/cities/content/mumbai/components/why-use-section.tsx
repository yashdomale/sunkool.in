import { Paragraph, IconCard } from "@/components/cities/content/mumbai/components/landing-blocks";

export default function WhyUseSection() {
  return (
    <>
      {/* 2. Why Use Car Window Film in Mumbai? */}
      <section className="relative w-full bg-black">
        <div className="container-lux py-16 sm:py-20 lg:py-28 text-center">
          <p className="reveal-fade-up eyebrow text-gradient-sun">Mumbai Heat Protection</p>

          <h2 className="text-[#f47521] headline text-balance mt-4 text-[clamp(42px,4vw,64px)]">
            Why Use Car <span className="text-gradient-electric">Window Film in Mumbai?</span>
          </h2>

          <Paragraph className="mt-6 max-w-[760px] mx-auto font-bold">
            Mumbai motorists have to deal with bright sun, glaring reflections, stop-and-go
            traffic and cars that heat up fast when left outside. Window film can solve several
            of these daily hassles without compromising visibility or connectivity.
          </Paragraph>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <IconCard
              icon="heat"
              color="kool"
              title="Decrease Cabin Heat"
              description="Nano-ceramic tint helps reflect the infrared rays trying to enter the vehicle through the windows, decreasing the heat that reaches the cabin — useful during Mumbai's warmer months."
            />
            <IconCard
              icon="glare"
              color="kool"
              title="Decrease Sun Glare"
              description="Bright sun and reflections off other vehicles and buildings can cause discomfort while driving. The right window film helps reduce sun glare without compromising visibility."
            />
            <IconCard
              icon="uv"
              color="kool"
              title="Protect Against UV Radiation"
              description="SUNKOOL window films offer UV rejection of up to 99%, helping decrease the risk of UV exposure inside the vehicle and offering additional protection for the interior."
            />
            <IconCard
              icon="seat"
              color="kool"
              title="Protect Your Car Interior"
              description="Long-term sunlight exposure leads to fading and deterioration of your dashboard, seats and upholstery. Window film adds an extra layer of protection from solar radiation."
            />
            <IconCard
              icon="signal"
              color="kool"
              title="Stay Connected"
              description="SUNKOOL nano-ceramic window tints are signal-safe and don't use metallic constructions, so GPS, mobile and toll-tag signals stay clear."
            />
            <IconCard
              icon="smile"
              color="kool"
              title="Accident Safety Protection"
              description="SUNKOOL window films help hold shattered glass together, reducing the risk of glass fragments flying into the cabin and potentially injuring children during an accident."
            />
          </div>
        </div>
      </section>
    </>
  );
}
