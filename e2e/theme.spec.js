"use strict";

const { test, expect } = require("./fixtures");

test.describe("theme", () => {
  test("follows prefers-color-scheme when nothing is stored", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("index.html");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator(".theme-toggle")).toHaveClass(/\bdark\b/);
  });

  test("toggle switches the theme and the choice survives a reload", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("index.html");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-theme", "light");

    await page.locator(".theme-toggle").click();
    await expect(html).toHaveAttribute("data-theme", "dark");

    // The first stored setting asks for consent to use localStorage.
    const consent = page.locator(".cookie-consent-button");
    await expect(consent).toBeVisible();
    await consent.click();
    await expect(consent).toHaveCount(0);

    await page.reload();
    await expect(html).toHaveAttribute("data-theme", "dark");

    await page.locator(".theme-toggle").click();
    await expect(html).toHaveAttribute("data-theme", "light");
    await expect(page.locator(".cookie-consent-button")).toHaveCount(0);
  });
});
