"use strict";

const { test, expect } = require("./fixtures");

test.describe("navbar search", () => {
  test("typing opens the modal with matching pages; Escape closes it", async ({ page }) => {
    await page.goto("index.html");
    const modal = page.locator(".navbar-search-modal");

    await page.locator("#navbar-search-input").fill("fixture");
    await expect(modal).toBeVisible();
    await expect(modal.locator(".page-card")).toHaveCount(3);

    await page.keyboard.press("Escape");
    await expect(modal).toBeHidden();
  });

  test("matching tags are listed in the summary", async ({ page }) => {
    await page.goto("index.html");
    await page.locator("#navbar-search-input").fill("alp");
    const chip = page.locator(".navbar-search-modal .dashboard-summary .tag");
    await expect(chip).toHaveCount(1);
    await expect(chip).toContainText("Alpha");
    await expect(page.locator(".navbar-search-modal .page-card")).toContainText(["Fixture Home"]);
  });

  test("a query without matches shows the empty message", async ({ page }) => {
    await page.goto("index.html");
    await page.locator("#navbar-search-input").fill("zzzz-no-match");
    const modal = page.locator(".navbar-search-modal");
    await expect(modal.locator(".dashboard-empty")).toBeVisible();
    await expect(modal.locator(".page-card")).toHaveCount(0);
  });

  test("the clear button empties the query", async ({ page }) => {
    await page.goto("index.html");
    const input = page.locator("#navbar-search-input");
    await input.fill("fixture");
    await page.locator(".navbar-search-clear").click();
    await expect(input).toHaveValue("");
  });
});
