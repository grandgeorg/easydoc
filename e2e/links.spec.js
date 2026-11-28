"use strict";

const { test, expect } = require("./fixtures");

test("relative .md links point to the built .html pages", async ({ page }) => {
  await page.goto("index.html");
  const content = page.locator(".content");
  await expect(content.getByRole("link", { name: "Link to no-tags page" })).toHaveAttribute("href", "no-tags.html");
  await expect(content.getByRole("link", { name: "Link to no-tags heading" })).toHaveAttribute(
    "href",
    "no-tags.html#t-fixture-no-tags"
  );
  await expect(content.getByRole("link", { name: "External Markdown file" })).toHaveAttribute(
    "href",
    "https://example.com/readme.md"
  );

  await content.getByRole("link", { name: "Link to no-tags page" }).click();
  await expect(page).toHaveURL(/no-tags\.html$/);
  await expect(page.locator("main.page .content h1")).toHaveText(/Fixture No Tags/);
});

test("TOC link to a heading ID starting with a digit is handled by the smooth-scroll script", async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 800 });
  await page.goto("index.html");
  await page.locator(".burger").click();
  await page.locator(".cookie-consent-button").click();
  await page.locator('.toc a[href="#1-digit-heading"]').click();
  await expect(page.locator('[id="1-digit-heading"]')).toBeInViewport();
  // the script's click handler prevents the native jump, so no hash is added
  await expect(page).toHaveURL(/index\.html$/);
});
