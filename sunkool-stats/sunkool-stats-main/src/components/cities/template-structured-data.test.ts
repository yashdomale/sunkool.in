// Guards what the shared Nagpur landing-page template tells search engines about SUNKOOL's presence.
// Nagpur is the head office. Chennai, Delhi and Amritsar reuse the same template, and a LocalBusiness
// node with a postal address copied into them would claim a SUNKOOL business address in those cities.
import { test } from "node:test";
import assert from "node:assert/strict";
import { cities } from "@/lib/cities";
import type { TemplateCity } from "./content/nagpur/copy";
import { templateStructuredData } from "./template-structured-data";

const TEMPLATE_CITIES = ["nagpur", "chennai", "delhi", "amritsar"] as const satisfies readonly TemplateCity[];

type Node = { "@type": string; [key: string]: unknown };
const graphOf = (city: TemplateCity) => (JSON.parse(templateStructuredData(city)) as { "@graph": Node[] })["@graph"];
const nodesOf = (city: TemplateCity, type: string) => graphOf(city).filter((node) => node["@type"] === type);

test("only Nagpur, the head office, carries a LocalBusiness with a postal address", () => {
  assert.equal(nodesOf("nagpur", "LocalBusiness").length, 1);
  assert.match(templateStructuredData("nagpur"), /"addressLocality":"Nagpur"/);
  for (const city of TEMPLATE_CITIES.filter((c) => c !== "nagpur")) {
    const json = templateStructuredData(city);
    assert.equal(nodesOf(city, "LocalBusiness").length, 0, `${city} must not claim a local business`);
    assert.doesNotMatch(json, /PostalAddress|addressLocality|addressRegion|telephone/, `${city} must not carry an address or phone`);
  }
});

test("the service area on each page is the page's own city", () => {
  for (const city of TEMPLATE_CITIES) {
    const [service] = nodesOf(city, "Service");
    assert.deepEqual(service.areaServed, { "@type": "City", name: cities[city].name }, city);
  }
});

test("no Nagpur wording survives on the other cities' pages", () => {
  for (const city of TEMPLATE_CITIES.filter((c) => c !== "nagpur")) {
    assert.doesNotMatch(templateStructuredData(city), /Nagpur|Maharashtra|Wardha|Sitabuldi|Zero Mile|Congress Nagar/i, city);
  }
});

test("Delhi keeps its own FAQ and no image caption; the others keep the template's", () => {
  assert.equal(nodesOf("delhi", "ImageObject").length, 0);
  const [faq] = nodesOf("delhi", "FAQPage");
  assert.match(JSON.stringify(faq), /Delhi/);
  for (const city of ["nagpur", "chennai", "amritsar"] as const) assert.equal(nodesOf(city, "ImageObject").length, 1, city);
});

test("breadcrumbs and the organization are unchanged on every template city", () => {
  for (const city of TEMPLATE_CITIES) {
    assert.equal(nodesOf(city, "Organization").length, 1, city);
    const [crumbs] = nodesOf(city, "BreadcrumbList");
    const last = (crumbs.itemListElement as { item: string }[]).at(-1);
    assert.equal(last?.item, `https://www.sunkool.in/${city}`, city);
  }
});
