import GlowCard from "@/components/cities/shared/glow-card";
import { IconHeatThermo, IconGlare, IconUVShield, IconSeat, IconBaby } from "@/components/cities/content/bangalore/components/icons";

const cards = [
  {
    icon: IconHeatThermo,
    title: "Reduce Cabin Heat",
    body: "SUNKOOL nano-ceramic films are designed to reject infrared energy before it contributes to cabin heat, helping create a more comfortable interior during Banglore's sunny drives and long traffic waits.",
  },
  {
    icon: IconGlare,
    title: "Reduce Glare While Driving",
    body: "Strong sunlight can create distracting glare through the windshield and side windows. The right window film helps reduce excessive brightness while maintaining appropriate visibility.",
  },
  {
    icon: IconUVShield,
    title: "Protect Against UV Exposure",
    body: "SUNKOOL offers UV rejection of up to 99%, depending on the selected product, helping reduce prolonged solar exposure to occupants and vehicle interiors.",
  },
  {
    icon: IconSeat,
    title: "Help Protect Your Car Interior",
    body: "Repeated sunlight exposure can contribute to fading of dashboard materials, seats, upholstery and door panels. Window film provides an additional layer of solar protection.",
  },
];

const fifthCard = {
  icon: IconBaby,
  title: "Accident Safety Protection",
  body: "SUNKOOL window films help hold shattered glass together, reducing the risk of glass fragments flying into the cabin and potentially injuring children during an accident.",
};

export default function WhyUseSection() {
  return (
    <section className="relative w-full bg-black">
      <div className="container-lux py-16 sm:py-20 lg:py-28 text-center">
        <p className="reveal-fade-up eyebrow text-gradient-sun">Banglore Heat Protection</p>
        <h2 className="reveal-fade-up text-[#f47521] headline text-balance mt-4 text-[clamp(42px,4vw,64px)]">
          Why Use Car <span className="text-gradient-electric">Window Film in Banglore?</span>
        </h2>
        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6">
          Banglore&rsquo;s weather is comparatively mild, but daily driving still brings its own set of
          challenges. Cars left in direct sunlight or stuck in heavy traffic often face heat, glare, UV
          damage, interior fading and reduced comfort.
        </p>

        <div className="reveal-stagger mt-8 grid gap-4 text-left sm:grid-cols-2">
          {cards.map(({ icon: Icon, title, body }) => (
            <GlowCard
              key={title}
              variant="reveal-card"
              kool
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] sm:p-6"
            >
              <span className="reveal-card-icon text-kool">
                <Icon />
              </span>
              <p className="text-gradient-silver mt-4 font-display text-lg font-semibold sm:text-xl">{title}</p>
              <p className="mt-2 text-[15px] font-bold leading-relaxed text-white/85 sm:text-base">{body}</p>
            </GlowCard>
          ))}
          <div className="sm:col-span-2 sm:mx-auto sm:w-[calc(50%-0.5rem)]">
            <GlowCard
              variant="reveal-card"
              kool
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] sm:p-6"
            >
              <span className="reveal-card-icon text-kool">
                <fifthCard.icon />
              </span>
              <p className="text-gradient-silver mt-4 font-display text-lg font-semibold sm:text-xl">
                {fifthCard.title}
              </p>
              <p className="mt-2 text-[15px] font-bold leading-relaxed text-white/85 sm:text-base">{fifthCard.body}</p>
            </GlowCard>
          </div>
        </div>
      </div>
    </section>
  );
}
