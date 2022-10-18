"use strict";

require("dotenv").config();
const path = require("path");
const fs = require("fs");
const pug = require("pug");
const fm = require("front-matter");
// get lang/langs.js file
const t = require("./lang/langs.js");

const md = require("markdown-it")({
  html: true,
  linkify: true,
  typographer: true,
});
md.use(require("markdown-it-deflist"));
md.use(require("markdown-it-container"), "tip");
md.use(require("markdown-it-container"), "info");
md.use(require("markdown-it-container"), "warning");
md.use(require("markdown-it-container"), "danger");
md.use(require("markdown-it-container"), "checklist");
md.use(require("markdown-it-container"), "details", {
  validate: function(params) {
    return params.trim().match(/^details\s+(.*)$/);
  },
  render: function (tokens, idx) {
    var m = tokens[idx].info.trim().match(/^details\s+(.*)$/);
    if (tokens[idx].nesting === 1) {
      return "<details><summary>" + md.utils.escapeHtml(m[1]) + "</summary>\n";
    } else {
      return "</details>\n";
    }
  },
});
md.use(require("markdown-it-flowchart"));
md.use(require("markdown-it-task-lists"));
md.use(require("markdown-it-footnote"));
md.use(require("markdown-it-attrs"), {
  // optional, these are default options
  leftDelimiter: "{",
  rightDelimiter: "}",
  allowedAttributes: [], // empty array = all attributes are allowed
});
// md.use(require("markdown-it-anchor").default);
const anchor = require("markdown-it-anchor");
md.use(anchor, {
  permalink: anchor.permalink.headerLink(),
  slugify: function (s) {
    return String(s)
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/gi, "");
  },
});
md.use(require("markdown-it-table-of-contents"), {
  includeLevel: [1, 2, 3, 4],
});

const docsDir = path.join(__dirname, "docs");
const templateDir = path.join(__dirname, "templates");
const layout = path.join(templateDir, "layout.pug");
const distDir = path.join(__dirname, "www");
const rgxExt = /\.(?:md)$/;
const outExt = ".html";

fs.readdir(docsDir, (err, files) => {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  files.forEach((file) => {
    let fmData = fm(fs.readFileSync(path.join(docsDir, file), "utf-8"));
    let stats = fs.statSync(path.join(docsDir, file));
    let toc = md.render("[[toc]]\n" + fmData.body);
    toc = toc.match(/<div class="table-of-contents">(.|\s)*?<\/div>/g)[0];
    let lang = fmData.attributes.lang ? fmData.attributes.lang : process.env.EASYDOC_LANG_FALLBACK;
    const page = pug.renderFile(layout, {
      toc: toc,
      t: t[lang],
      content: md.render(fmData.body),
      attributes: {
        title: fmData.attributes.title ? fmData.attributes.title : process.env.EASYDOC_TITLE_FALLBACK,
        lang: lang,
        mtime: stats.mtime,
        brandURL: fmData.attributes.brandURL ? fmData.attributes.brandURL : process.env.EASYDOC_BRAND_URL,
        brand: fmData.attributes.brand ? fmData.attributes.brand : process.env.EASYDOC_BRAND,
        brandSecondary: fmData.attributes.brandSecondary
          ? fmData.attributes.brandSecondary
          : process.env.EASYDOC_BRAND_SECONDARY,
      },
    });
    fs.writeFileSync(path.join(distDir, file.replace(rgxExt, outExt)), page);
  });
});
