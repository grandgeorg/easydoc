"use strict";

const { test, expect } = require("./fixtures");

async function acceptConsent(page) {
  const consent = page.locator(".cookie-consent-button");
  await expect(consent).toBeVisible();
  await consent.click();
  await expect(consent).toHaveCount(0);
}

function stored(page, key) {
  return page.evaluate((k) => localStorage.getItem(k), key);
}

test.describe("navigation state", () => {
  test("wide screen: drawer open state survives a reload", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("index.html");
    const burger = page.locator(".burger");
    const drawer = page.locator(".navigation-drawer");
    await expect(drawer).toBeHidden();

    await burger.click();
    await acceptConsent(page);
    await expect(drawer).toBeVisible();
    expect(await stored(page, "easydoc.navDrawerOpen")).toBe("true");

    await page.reload();
    await expect(drawer).toBeVisible();
    await expect(burger).toHaveAttribute("aria-expanded", "true");
    await expect(burger).toHaveClass(/\bopen\b/);
    // the instant restore must not leave transitions disabled
    await expect.poll(() => drawer.evaluate((el) => el.style.transition)).toBe("");

    await burger.click();
    await expect(drawer).toBeHidden();
    expect(await stored(page, "easydoc.navDrawerOpen")).toBe("false");
    await expect(page.locator(".cookie-consent-button")).toHaveCount(0);

    await page.reload();
    await expect(burger).toHaveAttribute("aria-expanded", "false");
    await expect(drawer).toBeHidden();
  });

  test("narrow screen: drawer state is neither restored nor stored", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("index.html");
    await page.evaluate(() => localStorage.setItem("easydoc.navDrawerOpen", "true"));
    await page.reload();

    const burger = page.locator(".burger");
    const drawer = page.locator(".navigation-drawer");
    await expect(burger).toHaveAttribute("aria-expanded", "false");
    await expect(drawer).toBeHidden();

    await burger.click();
    await expect(drawer).toBeVisible();
    await burger.click();
    await expect(drawer).toBeHidden();
    await expect(page.locator(".cookie-consent-button")).toHaveCount(0);
    expect(await stored(page, "easydoc.navDrawerOpen")).toBe("true");
  });

  test("pages navigation open state survives a reload", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("index.html");
    await page.locator(".burger").click();
    await acceptConsent(page);

    const details = page.locator("#pagesnav .pagesnav-details");
    await expect(details).not.toHaveAttribute("open");
    await details.locator("summary").click();
    await expect(details).toHaveAttribute("open");

    await page.reload();
    await expect(details).toHaveAttribute("open");

    await details.locator("summary").click();
    await expect(details).not.toHaveAttribute("open");
    await page.reload();
    await expect(details).not.toHaveAttribute("open");
  });

  test("pages navigation toggle asks for consent", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("index.html");
    await page.locator(".burger").click();
    await page.locator("#pagesnav .pagesnav-details summary").click();
    await acceptConsent(page);
    expect(await stored(page, "easydoc.pagesnavOpen")).toBe("true");
  });

  test("legacy storage keys are migrated into the easydoc namespace", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("index.html");
    await page.evaluate(() => {
      localStorage.setItem("theme", "dark");
      localStorage.setItem("easydocCookieConsent", "true");
    });
    await page.reload();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    expect(await stored(page, "easydoc.theme")).toBe("dark");
    expect(await stored(page, "easydoc.cookieConsent")).toBe("true");
    expect(await stored(page, "theme")).toBeNull();
    expect(await stored(page, "easydocCookieConsent")).toBeNull();

    await page.locator(".theme-toggle").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(page.locator(".cookie-consent-button")).toHaveCount(0);
  });
});
