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
