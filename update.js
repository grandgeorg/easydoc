"use strict";
const path = require("path");
const fs = require("fs");
const { updatableAssets, copyAssets } = require("./assets.js");

const baseDir = process.cwd();
const distDir = path.join(baseDir, "www");

if (__dirname === baseDir) {
  console.error("update.js updates a documentation project set up with setup.js; run it from that project's directory.");
  process.exit(1);
}

if (!fs.existsSync(distDir)) {
  console.error("No www directory found in " + baseDir + ". Run setup.js first.");
  process.exit(1);
}

const result = copyAssets(updatableAssets, distDir, { overwrite: true });

result.added.forEach((asset) => console.log("added:   www/assets/" + asset));
result.updated.forEach((asset) => console.log("updated: www/assets/" + asset));
console.log(
  "EasyDoc assets: " + result.added.length + " added, " +
  result.updated.length + " updated, " +
  result.unchanged.length + " unchanged."
);
