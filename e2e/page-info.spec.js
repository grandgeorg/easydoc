"use strict";

const { test, expect } = require("./fixtures");

test.describe("page info", () => {
  test("is closed by default and toggles open and closed", async ({ page }) => {
    await page.goto("index.html");
    const toggle = page.locator("#frontmatter-toggle");
    const info = page.locator("#page-info");

    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toHaveAttribute("aria-controls", "page-info");
    await expect(info).toBeHidden();

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(info).toHaveClass(/\bis-open\b/);
    await expect(info).toBeVisible();
    await expect.poll(() => info.evaluate((el) => el.getBoundingClientRect().height)).toBeGreaterThan(20);

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(info).toBeHidden();
  });

  test("animates, unless reduced motion is requested", async ({ page }) => {
    const duration = () =>
      page.locator("#page-info").evaluate((el) => getComputedStyle(el).transitionDuration);

    await page.goto("index.html");
    expect(await duration()).not.toMatch(/^0s(, 0s)*$/);

    await page.emulateMedia({ reducedMotion: "reduce" });
    expect(await duration()).toMatch(/^0s(, 0s)*$/);
  });

  test("shows title, uppercase language and tags", async ({ page }) => {
    await page.goto("index.html");
    await page.locator("#frontmatter-toggle").click();
    const info = page.locator("#page-info");
    await expect(info.locator(".page-title")).toHaveText("Fixture Home");
    await expect(info.locator(".page-lang-text")).toHaveText("EN");
    await expect(info.locator(".page-tags .tag")).toHaveText(["Alpha", "Beta"]);
  });

  test("tag buttons cannot be focused while the panel is closed", async ({ page }) => {
    await page.goto("index.html");
    const focusable = () =>
      page.locator("#page-info button.tag").first().evaluate((el) => {
        el.focus();
        return document.activeElement === el;
      });

    expect(await focusable()).toBe(false);
    await page.locator("#frontmatter-toggle").click();
    await expect(page.locator("#page-info")).toBeVisible();
    expect(await focusable()).toBe(true);
  });

  test("clicking a tag appends it to the navbar search once", async ({ page }) => {
    await page.goto("index.html");
    await page.locator("#frontmatter-toggle").click();
    const input = page.locator("#navbar-search-input");
    const modal = page.locator(".navbar-search-modal");
    const tag = (name) => page.locator(`#page-info button.tag[data-search-tag="${name}"]`);

    await tag("Alpha").click();
    await expect(input).toHaveValue("alpha");
    await expect(modal).toBeVisible();
    await expect(modal.locator(".page-card")).toContainText(["Fixture Home"]);

    await page.keyboard.press("Escape");
    await expect(modal).toBeHidden();
    await tag("Alpha").click();
    await expect(input).toHaveValue("alpha");

    await page.keyboard.press("Escape");
    await tag("Beta").click();
    await expect(input).toHaveValue("alpha beta");
  });

  test("page without tags has no tags row", async ({ page }) => {
    await page.goto("no-tags.html");
    await page.locator("#frontmatter-toggle").click();
    await expect(page.locator("#page-info")).toBeVisible();
    await expect(page.locator("#page-info .page-lang-text")).toHaveText("DE");
    await expect(page.locator("#page-info .page-tags")).toHaveCount(0);
  });

  test("disableShowPageInfo removes the panel and its toggle", async ({ page }) => {
    await page.goto("no-page-info.html");
    await expect(page.locator(".page-meta .mtime")).toBeVisible();
    await expect(page.locator("#page-info")).toHaveCount(0);
    await expect(page.locator("#frontmatter-toggle")).toHaveCount(0);
  });
});
