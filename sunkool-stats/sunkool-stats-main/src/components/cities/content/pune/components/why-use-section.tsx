import SpotlightGrid from "@/components/cities/content/pune/components/spotlight-grid";
import { Eyebrow, Paragraph, IconCard } from "@/components/cities/content/pune/components/landing-blocks";

export default function WhyUseSection() {
  return (
    <>
      {/* 2. Why Use Car Window Film in Pune? */}
      <section className="relative w-full border-t border-white/10 bg-black">
        <div className="container-lux py-16 sm:py-20 lg:py-28">
          <div className="text-center">
            <Eyebrow>Pune Heat Protection</Eyebrow>

            <h2 className="reveal-fade-up headline text-balance mt-4 text-[clamp(42px,4vw,64px)]">
              <span className="text-[#f47521]">Why Use Car</span>{" "}
              <span className="text-gradient-electric">Window Film in Pune?</span>
            </h2>
          </div>

          <Paragraph className="mt-6 text-center font-bold">
            Pune&rsquo;s sun stays strong through most of the year, especially during
            high-temperature months. Cars exposed to constant sunlight often face heat,
            glare, UV damage, interior fading and reduced comfort during afternoon drives.
          </Paragraph>

          <p className="mt-8 text-center text-lg font-semibold text-white sm:text-xl">
            The right window film helps solve these problems without making your glass look
            too dark.
          </p>

          <SpotlightGrid className="mt-14 sm:mt-16 lg:mt-20">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[
              {
                icon: "heat" as const,
                color: "kool" as const,
                title: "Reduce Cabin Heat",
                description:
                  "SUNKOOL nano-ceramic films are designed to reject infrared energy before it contributes to cabin heat, helping create a more comfortable interior during Pune's sunny drives and long traffic waits.",
                bold: true,
              },
              {
                icon: "windshield" as const,
                color: "kool" as const,
                title: "Reduce Glare While Driving",
                description:
                  "Strong sunlight can create distracting glare through the windshield and side windows. The right window film helps reduce excessive brightness while maintaining appropriate visibility.",
              },
              {
                icon: "uv" as const,
                color: "kool" as const,
                title: "Protect Against UV Exposure",
                description:
                  "SUNKOOL offers UV rejection of up to 99%, depending on the selected product, helping reduce prolonged solar exposure to occupants and vehicle interiors.",
              },
              {
                icon: "seat" as const,
                color: "kool" as const,
                title: "Help Protect Your Car Interior",
                description:
                  "Repeated sunlight exposure can contribute to fading of dashboard materials, seats, upholstery and door panels. Window film provides an additional layer of solar protection.",
              },
              {
                icon: "baby" as const,
                color: "kool" as const,
                title: "Accident Safety Protection",
                description:
                  "SUNKOOL window films help hold shattered glass together, reducing the risk of glass fragments flying into the cabin and potentially injuring children during an accident.",
              },
            ].map((benefit, index, arr) => (
              <div
                key={benefit.title}
                className={index === arr.length - 1 ? "sm:col-span-2 sm:mx-auto sm:w-1/2" : ""}
              >
                <IconCard
                  icon={benefit.icon}
                  color={benefit.color}
                  title={benefit.title}
                  description={benefit.description}
                  bold={benefit.bold}
                />
              </div>
            ))}
          </div>
          </SpotlightGrid>
        </div>
      </section>
    </>
  );
}
