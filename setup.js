"use strict";
const path = require("path");
const fs = require("fs");
// console.log(process.argv);
// console.log(__dirname);
// console.log(process.cwd());

const baseDir = process.cwd();
const docsDir = path.join(baseDir, "docs");
const distDir = path.join(baseDir, "www");
const navFile = path.join(baseDir, "nav.js");
const vscodeDir = path.join(baseDir, ".vscode");
const indexFile = path.join(__dirname, "index.js");

// check if .env file exists
if (!fs.existsSync(path.join(baseDir, ".env"))) {
  fs.copyFileSync(
    path.join(__dirname, ".env"),
    path.join(baseDir, ".env")
  );
}

// check if docs directory exists
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir);
}

// check if nav file exists
if (!fs.existsSync(navFile)) {
  fs.copyFileSync(
    path.join(__dirname, "nav.js"),
    path.join(baseDir, "nav.js")
  );
}

// check if dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
  fs.mkdirSync(path.join(distDir, "assets"));
  fs.mkdirSync(path.join(distDir, "assets", "css"));
  fs.mkdirSync(path.join(distDir, "assets", "fonts"));
  fs.mkdirSync(path.join(distDir, "assets", "js"));
  fs.mkdirSync(path.join(distDir, "img"));

  // copy assets
  fs.copyFileSync(
    path.join(__dirname, "www", "assets", "css", "style.min.css"),
    path.join(distDir, "assets", "css", "style.min.css")
  );
  fs.copyFileSync(
    path.join(__dirname, "www", "assets", "css", "prism.min.css"),
    path.join(distDir, "assets", "css", "prism.min.css")
  );
  fs.copyFileSync(
    path.join(__dirname, "www", "assets", "fonts", "EncodeSans.woff2"),
    path.join(distDir, "assets", "fonts", "EncodeSans.woff2")
  );
  fs.copyFileSync(
    path.join(__dirname, "www", "assets", "js", "app.min.js"),
    path.join(distDir, "assets", "js", "app.min.js")
  );
  fs.copyFileSync(
    path.join(__dirname, "www", "assets", "js", "prism.js"),
    path.join(distDir, "assets", "js", "prism.js")
  );
  fs.copyFileSync(
    path.join(__dirname, "www", "assets", "js", "flowchart.min.js"),
    path.join(distDir, "assets", "js", "flowchart.min.js")
  );
  fs.copyFileSync(
    path.join(__dirname, "www", "assets", "js", "raphael.min.js"),
    path.join(distDir, "assets", "js", "raphael.min.js")
  );
  fs.copyFileSync(
    path.join(__dirname, "www", "assets", "js", "clipboard.min.js"),
    path.join(distDir, "assets", "js", "clipboard.min.js")
  );
}

// check if .vscode directory exists
if (!fs.existsSync(vscodeDir)) {
  fs.mkdirSync(vscodeDir);
  fs.copyFileSync(
    path.join(__dirname, "setup", "_vscode_settings.json"),
    path.join(vscodeDir, "settings.json")
  );
}

// check if .gitignore file exists
if (!fs.existsSync(path.join(baseDir, ".gitignore"))) {
  fs.copyFileSync(
    path.join(__dirname, "setup", "_gitignore"),
    path.join(baseDir, ".gitignore")
  );
}

// check if nodemon.json file exists
if (!fs.existsSync(path.join(baseDir, "nodemon.json"))) {
  fs.copyFileSync(
    path.join(__dirname, "setup", "_nodemon.json"),
    path.join(baseDir, "nodemon.json")
  );
}

// check if searchApi.js file exists
if (!fs.existsSync(path.join(baseDir, "searchApi.js"))) {
  fs.copyFileSync(
    path.join(__dirname, "setup", "_searchApi.js"),
    path.join(baseDir, "searchApi.js")
  );
}

// check if package.json file exists
if (!fs.existsSync(path.join(baseDir, "package.json"))) {
  const packageJson = {
    name: "easydoc",
    version: "1.0.0",
    author: "EasyDoc",
    description: "",
    keywords: [],
    license: "GPL-3.0-or-later",
    scripts: {
      build: "node " + indexFile,
      watch: "nodemon " + indexFile,
      search: "node searchApi.js"
    },
    devDependencies: {
      "cors": "^2.8.5",
      "elasticlunr": "^0.9.5",
      "express": "^4.18.2",
      "nodemon": "^2.0.20"
    }
  };

  fs.writeFileSync(
    path.join(baseDir, "package.json"),
    JSON.stringify(packageJson, null, 2)
  );

}