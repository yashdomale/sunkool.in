export const cities = {
  indore: { name: "Indore", state: "Madhya Pradesh", slug: "indore", lat: 22.7203616, lon: 75.8681996 },
  vijayawada: { name: "Vijayawada", state: "Andhra Pradesh", slug: "vijayawada", lat: 16.5115306, lon: 80.6160469 },
  kozhikode: { name: "Kozhikode", state: "Kerala", slug: "kozhikode", lat: 11.2450558, lon: 75.7754716 },
  bhopal: { name: "Bhopal", state: "Madhya Pradesh", slug: "bhopal", lat: 23.2584857, lon: 77.4019890 },
  bhubaneswar: { name: "Bhubaneswar", state: "Odisha", slug: "bhubaneswar", lat: 20.2602964, lon: 85.8394521 },
  amritsar: { name: "Amritsar", state: "Punjab", slug: "amritsar", lat: 31.6356659, lon: 74.8787496 },
  ahmedabad: { name: "Ahmedabad", state: "Gujarat", slug: "ahmedabad", lat: 23.0215374, lon: 72.5800568 },
  hyderabad: { name: "Hyderabad", state: "Telangana", slug: "hyderabad", lat: 17.3605890, lon: 78.4740613 },
  kolkata: { name: "Kolkata", state: "West Bengal", slug: "kolkata", lat: 22.5726459, lon: 88.3638953 },
  delhi: { name: "Delhi", state: "Delhi", slug: "delhi", lat: 28.6664535, lon: 77.2169781 },
  nagpur: { name: "Nagpur", state: "Maharashtra", slug: "nagpur", lat: 21.1498134, lon: 79.0820556 },
  chennai: { name: "Chennai", state: "Tamil Nadu", slug: "chennai", lat: 13.0836939, lon: 80.2701860 },
  pune: { name: "Pune", state: "Maharashtra", slug: "pune", lat: 18.5213738, lon: 73.8545071 },
  bangalore: { name: "Bangalore", state: "Karnataka", slug: "bangalore", lat: 12.9767936, lon: 77.5900820 },
  mumbai: { name: "Mumbai", state: "Maharashtra", slug: "mumbai", lat: 19.0549990, lon: 72.8692035 },
  jaipur: { name: "Jaipur", state: "Rajasthan", slug: "jaipur", lat: 26.9154576, lon: 75.8189817 },
  ernakulam: { name: "Ernakulam", state: "Kerala", slug: "ernakulam", lat: 9.9837257, lon: 76.2740001 },
  surat: { name: "Surat", state: "Gujarat", slug: "surat", lat: 21.2094892, lon: 72.8317058 },
  vadodara: { name: "Vadodara", state: "Gujarat", slug: "vadodara", lat: 22.2973142, lon: 73.1942567 },
  rajkot: { name: "Rajkot", state: "Gujarat", slug: "rajkot", lat: 22.3053263, lon: 70.8028377 },
  ranchi: { name: "Ranchi", state: "Jharkhand", slug: "ranchi", lat: 23.3700501, lon: 85.3250387 },
  jamshedpur: { name: "Jamshedpur", state: "Jharkhand", slug: "jamshedpur", lat: 22.8015194, lon: 86.2029579 },
  raipur: { name: "Raipur", state: "Chhattisgarh", slug: "raipur", lat: 21.2380912, lon: 81.6336993 },
} as const;
export type CitySlug = keyof typeof cities;
// Cities listed under "Cities We Serve" in the footer, in display order. A landing page in `cities`
// is not enough to belong here: add a slug only once SUNKOOL has confirmed it serves that city (its
// own office, or a named authorised installer).
export const servedCitySlugs = [
  "nagpur", "mumbai", "pune", "bangalore", "chennai", "delhi", "kolkata", "hyderabad",
  "ahmedabad", "amritsar", "bhopal", "jaipur", "ernakulam", "kozhikode", "vijayawada",
  "indore", "surat", "vadodara", "rajkot", "ranchi", "jamshedpur", "bhubaneswar", "raipur",
] as const satisfies readonly CitySlug[];
export function cityLocation(slug: CitySlug) { return `Sunkool – ${cities[slug].name}, ${cities[slug].state}`; }
export function isCitySlug(value: string): value is CitySlug { return Object.hasOwn(cities, value); }
export function cityMetadata(slug: CitySlug) {
  const { name } = cities[slug];
  return {
    title: `Car Window Film in ${name} | Nano-Ceramic Heat Protection | SUNKOOL`,
    description: `Looking for car window film in ${name}? SUNKOOL nano-ceramic films help reduce heat, glare and UV exposure while maintaining clarity and signal-safe performance.`,
  };
}
const EARTH_RADIUS_KM = 6371;
// Beyond this, GPS coordinates aren't confidently "in" any covered city,
// so the caller should leave the visitor on the page they opened.
const NEAREST_CITY_MAX_KM = 75;

function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

// Matches GPS coordinates to the closest covered city by great-circle distance
// instead of a third-party reverse-geocoding API, so it works offline, instantly,
// and isn't at the mercy of that API's CORS/rate-limit behaviour.
export function nearestCity(lat: number, lon: number): CitySlug | null {
  let closest: CitySlug | null = null;
  let closestDistance = Infinity;
  for (const slug of Object.keys(cities) as CitySlug[]) {
    const distance = distanceKm(lat, lon, cities[slug].lat, cities[slug].lon);
    if (distance < closestDistance) {
      closestDistance = distance;
      closest = slug;
    }
  }
  return closestDistance <= NEAREST_CITY_MAX_KM ? closest : null;
}
