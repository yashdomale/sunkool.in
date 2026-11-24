import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cities, cityMetadata, isCitySlug } from "@/lib/cities";
import { cityContent, individualCities } from "@/components/cities/city-content";
import { templateCopy } from "@/components/cities/content/nagpur/copy";
import { CityLocation } from "@/components/cities/city-location";
import CityAnimations from "@/components/cities/city-animations";
import "@/components/cities/content/nagpur/styles.css";
import "@/components/cities/content/pune/styles.css";
import "@/components/cities/content/bangalore/styles.css";
import "@/components/cities/content/mumbai/styles.css";
import "@/components/cities/shared/individual-city/index.css";
import "@/components/cities/cities.css";

export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(cities).map(city => ({ city })); }
export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  if (!isCitySlug(city)) notFound();
  const seo = cityMetadata(city);
  return { title: { absolute: seo.title }, description: seo.description, alternates: { canonical: `/${city}` }, openGraph: { ...seo, url: `/${city}` } };
}
export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  if (!isCitySlug(city)) notFound();
  const { default: Content } = await cityContent[city]();
  // Cities rendered by the Nagpur template (they have a copy file) also need Nagpur's styles.
  const onNagpurTemplate = city !== "nagpur" && city in templateCopy;
  const individual = individualCities.includes(city);
  return <div id="city-landing" className={`city-landing city-${city}${onNagpurTemplate ? " city-nagpur" : ""}${individual ? " city-individual" : ""}`}>
    <CityLocation city={city} />
    {(city === "pune" || city === "bangalore" || city === "mumbai") && <CityAnimations key={city} />}
    <Content />
  </div>;
}
