"use strict";

const { test, expect } = require("./fixtures");

test.describe("lightbox", () => {
  test("clicking a plain image opens it in the lightbox", async ({ page }) => {
    await page.goto("images.html");
    await page.locator("#plain-image").click();
    const lightBox = page.locator(".modal .lightbox");
    await expect(lightBox).toBeVisible();
    await expect(lightBox.locator(".caption")).toHaveText("Plain image");
  });

  test("clicking a linked image follows the link instead", async ({ page }) => {
    await page.goto("images.html");
    await page.locator("#linked-image").click();
    await expect(page).toHaveURL(/no-tags\.html$/);
    await expect(page.locator(".lightbox")).toHaveCount(0);
  });
});
