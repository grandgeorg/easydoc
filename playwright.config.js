"use strict";

const { defineConfig } = require("@playwright/test");

// The suite always starts its own server on a dedicated port, so a manual
// `npm run serve:test` (port 4310, possibly serving another site) never interferes.
const port = 4311;
const baseURL = `http://127.0.0.1:${port}`;

// Run via `npm run test:e2e`, which rebuilds assets and the fixture site first.
module.exports = defineConfig({
  testDir: "e2e",
  outputDir: "test-results",
  reporter: "dot",
  fullyParallel: true,
  forbidOnly: true,
  use: {
    baseURL: baseURL,
    // The installed Microsoft Edge is used, so no Playwright browser download is needed.
    channel: "msedge",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: `node e2e/serve.js e2e/fixture/www ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    stdout: "ignore",
  },
});
