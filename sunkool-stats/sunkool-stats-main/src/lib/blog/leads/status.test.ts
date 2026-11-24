import { test } from "node:test";
import assert from "node:assert/strict";
import { dbStatusesFor, dbStatusToWrite, isLeadStatus, LEAD_STATUSES, parseStatusFilter, toLeadStatus } from "./status";

test("the admin can set exactly two statuses", () => {
  assert.deepEqual([...LEAD_STATUSES], ["pending", "completed"]);
  assert.ok(isLeadStatus("pending") && isLeadStatus("completed"));
  for (const value of ["new", "closed", "Pending", "", "all", null, undefined, 1]) assert.equal(isLeadStatus(value), false);
});

test("database enum values read as Pending or Completed, never both", () => {
  assert.equal(toLeadStatus("new"), "pending");
  assert.equal(toLeadStatus("contacted"), "pending");
  assert.equal(toLeadStatus("converted"), "completed");
  assert.equal(toLeadStatus("closed"), "completed");
  // A value this code has never heard of must not hide the enquiry: it stays visible as Pending.
  assert.equal(toLeadStatus("something-new"), "pending");
});

test("the filter lists every enum value that reads as that status, and the two lists never overlap", () => {
  const pending = dbStatusesFor("pending");
  const completed = dbStatusesFor("completed");
  assert.deepEqual([...pending].sort(), ["contacted", "new"]);
  assert.deepEqual([...completed].sort(), ["closed", "converted"]);
  assert.equal(pending.filter((value) => completed.includes(value)).length, 0);
  for (const value of pending) assert.equal(toLeadStatus(value), "pending");
  for (const value of completed) assert.equal(toLeadStatus(value), "completed");
});

test("picking a status writes a value that reads back as the same status", () => {
  for (const status of LEAD_STATUSES) {
    assert.equal(toLeadStatus(dbStatusToWrite(status)), status);
    assert.ok(dbStatusesFor(status).includes(dbStatusToWrite(status)));
  }
});

test("only ?status=pending and ?status=completed filter; anything else shows everything", () => {
  assert.equal(parseStatusFilter("pending"), "pending");
  assert.equal(parseStatusFilter("completed"), "completed");
  assert.equal(parseStatusFilter(["completed", "pending"]), "completed");
  for (const value of [undefined, "", "all", "COMPLETED", "closed", "x", [], ["nope", "completed"]]) {
    assert.equal(parseStatusFilter(value as string | string[] | undefined), "all");
  }
});
