import FaqAccordion from "@/components/cities/content/bangalore/components/faq-accordion";

const faqs = [
  {
    q: "What is the best car window tint film for Banglore?",
    a: "The choice of film will depend on your needs and vehicle. A driver who prefers better visibility can choose higher VLT film, but another driver who looks forward to more solar rejection can go for a different film, as per the VLT standards.",
  },
  {
    q: "Does ceramic window film help in blocking out heat from the car?",
    a: "Yes, ceramic window films have been designed in such a way that it blocks out infrared rays and solar rays that enter into your car through glass.",
  },
  {
    q: "Is it useful to have nano-ceramic film in Banglore?",
    a: "Yes, even with Banglore's relatively moderate climate, direct sunlight, outdoor parking and long traffic waits can still raise cabin temperature. Nano-ceramic films can block solar energy that enters your car through glass.",
  },
  {
    q: "Does SUNKOOL window film block UV rays?",
    a: "UV rejection of SUNKOOL window films ranges between 99%, as per the product.",
  },
  {
    q: "Does ceramic window film block GPS/mobile/toll tags signals?",
    a: "SUNKOOL non-metallic nano-ceramic films are signal safe for GPS/mobile/toll tags.",
  },
  {
    q: "Which VLT is suitable for my vehicle?",
    a: "VLT needs to be looked into with respect to the original glass and the relevant laws. The actual VLT of the glazing installed is what should matter, and not just the VLT of the film label.",
  },
  {
    q: "Is car window tint legal in Banglore?",
    a: "It is recommended that you follow the laws regarding the vehicle-glass and the relevant VLT.",
  },
  {
    q: "Does dark film reject more heat?",
    a: "Dark film does not necessarily mean heat rejection will be better. Film performance can be assessed based on parameters like TSER, infrared rejection, and VLT.",
  },
  {
    q: "How long is the warranty period for SUNKOOL window film?",
    a: "The warranty period differs for different grades of SUNKOOL film. Check the relevant warranty period of the selected grade of the film.",
  },
  {
    q: "Where can I have my SUNKOOL window film fitted in Banglore?",
    a: "Contact SUNKOOL to confirm current installation availability and service options in Banglore.",
  },
];

export default function FAQSection() {
  return (
    <section className="relative w-full border-t border-white/10 bg-black">
      <div className="container-lux py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-[720px] text-center">
          <h2 className="reveal-fade-up headline text-gradient-silver text-balance mt-4 text-[clamp(42px,4vw,64px)]">
            FAQ&apos;s
          </h2>
        </div>
        <FaqAccordion items={faqs} />
      </div>
    </section>
  );
}
