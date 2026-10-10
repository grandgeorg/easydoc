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

const searchApiFile = path.join(baseDir, "searchApi.js");
const searchApiTemplate = fs.readFileSync(path.join(__dirname, "setup", "_searchApi.js"));
if (!fs.existsSync(searchApiFile) || !fs.readFileSync(searchApiFile).equals(searchApiTemplate)) {
  const existed = fs.existsSync(searchApiFile);
  fs.writeFileSync(searchApiFile, searchApiTemplate);
  console.log((existed ? "updated: " : "added:   ") + "searchApi.js");
}

// searchApi.js uses minisearch since EasyDoc replaced elasticlunr
const packageFile = path.join(baseDir, "package.json");
if (fs.existsSync(packageFile)) {
  const packageJson = JSON.parse(fs.readFileSync(packageFile, "utf8"));
  let swapped = false;
  ["dependencies", "devDependencies"].forEach((section) => {
    const deps = packageJson[section];
    if (deps && deps.elasticlunr) {
      delete deps.elasticlunr;
      if (!deps.minisearch) {
        deps.minisearch = "^7.2.0";
      }
      swapped = true;
    }
  });
  if (swapped) {
    fs.writeFileSync(packageFile, JSON.stringify(packageJson, null, 2));
    console.log("updated: package.json (elasticlunr -> minisearch). Run \"npm install\" to install it.");
  }
}
