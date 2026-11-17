"use strict";

// Builds the committed e2e fixture site (e2e/fixture) into e2e/fixture/www with the
// current EasyDoc assets. Only the fixture's own .env is used: EASYDOC_* variables
// from the calling shell are removed so test results don't depend on the environment.

const path = require("path");
const fs = require("fs");
const { spawnSync } = require("child_process");
const { updatableAssets, faviconAssets, copyAssets } = require("../assets.js");

const rootDir = path.resolve(__dirname, "..");
const fixtureDir = path.join(__dirname, "fixture");
const distDir = path.join(fixtureDir, "www");

fs.rmSync(distDir, { recursive: true, force: true });
copyAssets(updatableAssets.concat(faviconAssets), distDir, { overwrite: true });

const env = {};
Object.keys(process.env).forEach((key) => {
  if (!key.startsWith("EASYDOC_")) {
    env[key] = process.env[key];
  }
});

const result = spawnSync(process.execPath, [path.join(rootDir, "index.js")], {
  cwd: fixtureDir,
  env: env,
  encoding: "utf8",
});

if (result.status !== 0) {
  process.stdout.write(result.stdout || "");
  process.stderr.write(result.stderr || "");
  console.error("Fixture build failed.");
  process.exit(result.status || 1);
}

const pages = fs.readdirSync(distDir).filter((file) => file.endsWith(".html"));
console.log(`fixture built: ${pages.length} pages in e2e/fixture/www`);
