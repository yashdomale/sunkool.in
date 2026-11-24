import { templateCopy, type TemplateCity } from "@/components/cities/content/nagpur/copy";

/**
 * The JSON-LD of the shared landing page that renders Nagpur, Chennai, Delhi and Amritsar. Each
 * city's graph lives in its copy file (content/nagpur/copy/<city>.ts). The LocalBusiness node and its
 * postal address describe the head office, so only Nagpur has one: on any other city it would claim a
 * SUNKOOL business address there. template-structured-data.test.ts guards that.
 */
export function templateStructuredData(city: TemplateCity): string {
  return JSON.stringify(templateCopy[city].structuredData);
}
