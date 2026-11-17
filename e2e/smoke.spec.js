"use strict";

const { test, expect, fixturePages } = require("./fixtures");

for (const file of fixturePages()) {
  test(`${file} renders without browser errors`, async ({ page }) => {
    await page.goto(file);
    await expect(page).toHaveTitle(/^Fixture/);
    await expect(page.locator("main.page .content h1")).toBeVisible();
    await expect(page.locator(".page-meta .mtime")).toBeVisible();
  });
}

test("code blocks are highlighted by Prism", async ({ page }) => {
  await page.goto("index.html");
  await expect(page.locator(".content pre code .token").first()).toBeVisible();
});

test("custom containers are rendered", async ({ page }) => {
  await page.goto("index.html");
  await expect(page.locator(".content .tip")).toContainText("A tip container.");
});
