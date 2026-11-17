"use strict";

// Shared test entry point for all e2e specs: use `require("./fixtures")` instead of
// "@playwright/test". Every test automatically fails on uncaught page errors and
// console errors, so specs don't need to check for them themselves.

const fs = require("fs");
const path = require("path");
const base = require("@playwright/test");

const test = base.test.extend({
  browserErrors: [
    async ({ page }, use) => {
      const errors = [];
      page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
      page.on("console", (message) => {
        if (message.type() === "error") {
          errors.push(`console: ${message.text()}`);
        }
      });
      await use(errors);
      base.expect(errors, "browser errors during the test").toEqual([]);
    },
    { auto: true },
  ],
});

// Output file names of all fixture pages (e2e/fixture/docs/*.md -> *.html).
function fixturePages() {
  return fs
    .readdirSync(path.join(__dirname, "fixture", "docs"))
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ".html"));
}

module.exports = { test, expect: base.expect, fixturePages };
