"use strict";

require("dotenv").config();
const path = require("path");
const fs = require("fs");
const pug = require("pug");
const fm = require("front-matter");
const t = require("./lang/langs.js");
const nav = require("./nav.js");

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
md.use(require("./src/js/markdown-it-flowchart"));
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
  includeLevel: process.env.EASYDOC_TOC_INCLUDELEVEL ? process.env.EASYDOC_TOC_INCLUDELEVEL : [1, 2, 3, 4],
});

// console.log("Building site...");

const docsDir = path.join(__dirname, "docs");
const templateDir = path.join(__dirname, "templates");
const layout = path.join(templateDir, "layout.pug");
const distDir = path.join(__dirname, "www");
const rgxExt = /\.(?:md)$/;
const outExt = ".html";

const pages = [];
const tagCloud = [];
let notLowercaseTags = [];

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
    let title = fmData.attributes.title ? fmData.attributes.title : process.env.EASYDOC_TITLE_FALLBACK;
    let disableBrand = fmData.attributes.disableBrand ? Boolean(fmData.attributes.disableBrand) : Boolean(process.env.EASYDOC_DISABLE_BRAND);
    let disableToc = fmData.attributes.disableToc ? Boolean(fmData.attributes.disableToc) : Boolean(process.env.EASYDOC_DISABLE_TOC);
    let disableSiteNav = fmData.attributes.disableSiteNav ? Boolean(fmData.attributes.disableSiteNav) : Boolean(process.env.EASYDOC_DISABLE_SITE_NAV);
    let disableTagNavigator = fmData.attributes.disableTagNavigator ? Boolean(fmData.attributes.disableTagNavigator) : Boolean(process.env.EASYDOC_DISABLE_TAG_NAVIGATOR);
    let disableNavigationBar = fmData.attributes.disableNavigationBar ? Boolean(fmData.attributes.disableNavigationBar) : Boolean(process.env.EASYDOC_DISABLE_NAVIGATION_BAR);
    if (disableBrand && disableToc && disableSiteNav && disableTagNavigator) {
      disableNavigationBar = true;
    }
    let disableBurger = false;
    if (!disableBrand && disableToc && disableSiteNav && disableTagNavigator) {
      disableBurger = true;
    }

    let fileOut = file.replace(rgxExt, outExt);
    let tags = fmData.attributes.tags ? Array.isArray(fmData.attributes.tags) ? fmData.attributes.tags : [fmData.attributes.tags] : [];

    tags.forEach((tag) => {
      if (tag !== tag.toLowerCase()) {
        notLowercaseTags.push(tag);
      }
      // check if tag exists in tagCloud
      let tagExists = tagCloud.find((item) => item.name === tag);
      if (tagExists) {
        tagExists.count++;
        tagExists.files.push(fileOut);
      } else {
        tagCloud.push({
          name: tag,
          lcname: tag.toLowerCase(),
          count: 1,
          files: [fileOut]
        });
      }
    });
    pages.push({
      title: title,
      lang: lang,
      date: stats.mtime,
      file: fileOut,
      // toc: toc,
      tags: tags,
    });
    let navigation = '';
    if (!disableNavigationBar && !disableBurger && !disableSiteNav) {
      // console.log("Navigation rendered with t ", t[lang], " for file ", fileOut);
      navigation = pug.renderFile(path.join(templateDir, "nav.pug"), {
        nav: nav.nav,
        lang: lang,
        t: t[lang],
        file: fileOut,
      });
    }
    let page = pug.renderFile(layout, {
      toc: toc,
      t: t[lang],
      content: md.render(fmData.body),
      sitenav: navigation,
      attributes: {
        title: title,
        lang: lang,
        mtime: stats.mtime,
        brandURL: fmData.attributes.brandURL ? fmData.attributes.brandURL : process.env.EASYDOC_BRAND_URL,
        brandName: fmData.attributes.brandName ? fmData.attributes.brandName : process.env.EASYDOC_BRAND_NAME,
        brandSecondary: fmData.attributes.brandSecondary
          ? fmData.attributes.brandSecondary
          : process.env.EASYDOC_BRAND_SECONDARY,
        disableBrand: disableBrand,
        disableToc: disableToc,
        disableSiteNav: disableSiteNav,
        disableTagNavigator: disableTagNavigator,
        disableNavigationBar: disableNavigationBar,
        disableBurger: disableBurger,
      },
    });
    fs.writeFileSync(path.join(distDir, fileOut), page);
  });

  if (notLowercaseTags.length > 0) {
    notLowercaseTags.forEach((nlcName) => {
      let nlcTag = tagCloud.find((item) => item.name === nlcName);
      let lcTag = tagCloud.find((item) => item.name === nlcName.toLowerCase());
      if (lcTag) {
        let count = 0;
        nlcTag.files.forEach((file) => {
          if (!lcTag.files.includes(file)) {
            lcTag.files.push(file);
            count++;
          }
        });
        // add nlcTag count to lcTag count
        lcTag.count += count;
        // add lcTag files to nlcTag files
        nlcTag.files = lcTag.files;
        // add lcTag count to nlcTag count
        nlcTag.count = lcTag.count;
      }
      notLowercaseTags.forEach((nlcName2) => {
        if (nlcName !== nlcName2 && nlcName.toLowerCase() === nlcName2.toLowerCase()) {
          // console.log("Duplicate tag: " + nlcName);
          let nlcTag2 = tagCloud.find((item) => item.name === nlcName2);
          let count = 0;
          nlcTag.files.forEach((file) => {
            if (!nlcTag2.files.includes(file)) {
              nlcTag2.files.push(file);
              count++;
            }
          });
          // add nlcTag count to nlcTag2 count
          nlcTag2.count += count;
          // add nlcTag2 files to nlcTag files
          nlcTag.files = nlcTag2.files;
          // add nlcTag2 count to nlcTag count
          nlcTag.count = nlcTag2.count;
        }
      });
    });
  }

  // sort tagCloud alphabetically
  tagCloud.sort((a, b) => {
    if (a.lcname < b.lcname) {
      return -1;
    }
    if (a.lcname > b.lcname) {
      return 1;
    }
    return 0;
  });

  fs.writeFileSync(path.join(distDir, "meta.js"),
    `const easydocMeta = {
      t: ${JSON.stringify(t)},
      pages: ${JSON.stringify(pages)},
      tags: ${JSON.stringify(tagCloud)}
    };`
  );
});

