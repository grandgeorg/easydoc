"use strict";

// Static server for the e2e fixture site (default) or any other built site:
//   node e2e/serve.js                  -> serves e2e/fixture/www on port 4310
//   node e2e/serve.js tests/www        -> serves the given directory
//   node e2e/serve.js <dir> <port>     -> custom port (the test suite uses 4311)

const path = require("path");
const fs = require("fs");
const express = require("express");

const rootDir = path.resolve(__dirname, "..");
const dir = path.resolve(rootDir, process.argv[2] || path.join("e2e", "fixture", "www"));
const port = Number(process.argv[3]) || 4310;

if (!fs.existsSync(path.join(dir, "index.html"))) {
  console.error(`No index.html in ${dir}. Build it first (npm run test:fixture).`);
  process.exit(1);
}

const app = express();
app.use(express.static(dir, { etag: false, lastModified: false, maxAge: 0 }));
app.listen(port, "127.0.0.1", () => {
  console.log(`serving ${path.relative(rootDir, dir) || "."} on http://127.0.0.1:${port}/`);
});
