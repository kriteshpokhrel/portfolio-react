import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Netlify deployment contracts", () => {
  it("routes the guestbook API before the SPA fallback", () => {
    const rules = readFileSync(new URL("../public/_redirects", import.meta.url), "utf8")
      .split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("#"));
    const api = rules.findIndex((line) => /^\/api\/guestbook\s+\/\.netlify\/functions\/guestbook\s+200$/.test(line));
    const fallback = rules.findIndex((line) => /^\/\*\s+\/index\.html\s+200$/.test(line));
    expect(api).toBeGreaterThanOrEqual(0);
    expect(fallback).toBeGreaterThan(api);
  });

  it("deploys only function entry points, not tests or helpers", () => {
    const files = readdirSync(new URL("../netlify/functions", import.meta.url), { withFileTypes: true })
      .filter((entry) => entry.isFile()).map((entry) => entry.name).sort();
    expect(files).toEqual(["guestbook.ts", "submission-created.ts"]);
  });

  it.each([
    ["guestbook-entry", ["name", "message", "drawing", "visitorId", "website"]],
    ["guestbook-report", ["entryId", "reason", "details", "visitorId", "website"]],
  ])("includes static Netlify detection fields for %s", (name, fields) => {
    const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
    const form = html.match(new RegExp(`<form name="${name}"[^>]*>[\\s\\S]*?</form>`))?.[0] ?? "";
    expect(form).toContain('data-netlify="true"');
    expect(form).toContain('netlify-honeypot="website"');
    for (const field of fields) expect(form).toContain(`name="${field}"`);
  });
});
