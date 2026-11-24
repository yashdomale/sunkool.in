import { test } from "node:test";
import assert from "node:assert/strict";
import { BLOG_LEAD_SOURCES, DEFAULT_BLOG_LEAD_SOURCE, isBlogLeadSource, parseSourceFilter, toLeadSource } from "./source";

test("offers exactly the Blog form and Chatbot sources, Blog form first", () => {
  assert.deepEqual(
    BLOG_LEAD_SOURCES.map((s) => [s.value, s.label]),
    [
      ["blog", "Blog form"],
      ["chatbot", "Chatbot"],
    ]
  );
  assert.equal(DEFAULT_BLOG_LEAD_SOURCE, "blog");
});

test("recognises only the two sources", () => {
  assert.equal(isBlogLeadSource("blog"), true);
  assert.equal(isBlogLeadSource("chatbot"), true);
  for (const nope of ["", "Chatbot", "zoho", "all", null, undefined, 3]) assert.equal(isBlogLeadSource(nope), false);
});

test("?source= picks a source; anything else is the blog form", () => {
  assert.equal(parseSourceFilter("chatbot"), "chatbot");
  assert.equal(parseSourceFilter(["chatbot", "blog"]), "chatbot");
  for (const nope of [undefined, "", "CHATBOT", "chatbot ", "x'; drop table blog_leads;--", []]) assert.equal(parseSourceFilter(nope), "blog");
});

test("a row without a lead_source reads as a blog enquiry", () => {
  assert.equal(toLeadSource(undefined), "blog");
  assert.equal(toLeadSource(null), "blog");
  assert.equal(toLeadSource("blog"), "blog");
  assert.equal(toLeadSource("chatbot"), "chatbot");
  assert.equal(toLeadSource("something-new"), "blog");
});
