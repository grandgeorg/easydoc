"use strict";
const path = require("path");
const fs = require("fs");

const srcAssetsDir = path.join(__dirname, "www", "assets");

// assets shipped by EasyDoc that update.js refreshes on targets (paths relative to www/assets)
const updatableAssets = [
  "css/style.min.css",
  "css/prism.min.css",
  "fonts/EncodeSans.woff2",
  "fonts/fira-code.woff2",
  "js/app.min.js",
  "js/prism.js",
  "js/flowchart.min.js",
  "js/raphael.min.js",
  "js/clipboard.min.js",
  "js/vue.global.prod.js",
  "js/dashboard.min.js",
  "js/navbarsearch.min.js",
  "js/mermaid.tiny.min.js"
];

// copied on setup only, projects may customize them
const faviconAssets = [
  "img/icons/favicon-192x192.png",
  "img/icons/favicon-512x512.png",
  "img/icons/favicon.ico",
  "img/icons/favicon.svg"
];

/**
 * Copies assets from EasyDoc's www/assets into <distDir>/assets.
 * Returns the relative paths grouped by outcome: added, updated, unchanged, skipped.
 */
function copyAssets(list, distDir, options) {
  const overwrite = Boolean(options && options.overwrite);
  const result = { added: [], updated: [], unchanged: [], skipped: [] };

  list.forEach((asset) => {
    const src = path.join(srcAssetsDir, ...asset.split("/"));
    const dest = path.join(distDir, "assets", ...asset.split("/"));

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
      result.added.push(asset);
    } else if (!overwrite) {
      result.skipped.push(asset);
    } else if (fs.readFileSync(src).equals(fs.readFileSync(dest))) {
      result.unchanged.push(asset);
    } else {
      fs.copyFileSync(src, dest);
      result.updated.push(asset);
    }
  });

  return result;
}

module.exports = { updatableAssets, faviconAssets, copyAssets };
