"use strict";

const path = require("path");
const fs = require("fs");
const pug = require("pug");
const fm = require("front-matter");
const t = require("./lang/langs.js");
const elasticlunr = require("elasticlunr");

const baseDir = process.cwd();
const docsDir = path.join(baseDir, "docs");
const distDir = path.join(baseDir, "www");
const navFile = path.join(baseDir, "nav.js");

// run checks if not in main directory
if (__dirname !== baseDir) {
  // check if .env file exists
  if (!fs.existsSync(path.join(baseDir, ".env"))) {
    fs.copyFileSync(path.join(__dirname, ".env"), path.join(baseDir, ".env"));
  }
  // check if docs directory exists
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir);
  }
  // check if nav file exists
  if (!fs.existsSync(navFile)) {
    fs.copyFileSync(path.join(__dirname, "nav.js"), path.join(baseDir, "nav.js"));
  }
  // check if dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
  }
  // check if assets directory exists
  if (!fs.existsSync(path.join(distDir, "assets"))) {
    fs.mkdirSync(path.join(distDir, "assets"));
    fs.mkdirSync(path.join(distDir, "assets", "css"));
    fs.mkdirSync(path.join(distDir, "assets", "fonts"));
    fs.mkdirSync(path.join(distDir, "assets", "js"));
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
  // check if img directory exists
  if (!fs.existsSync(path.join(distDir, "img"))) {
    fs.mkdirSync(path.join(distDir, "img"));
  }
}

require("dotenv").config();
const nav = require(navFile);

const withFulltextSearch = String(process.env.EASYDOC_ENABLE_FULLTEXT_SEARCH).toLowerCase() === "true";

const searchIndex = elasticlunr(function () {
  this.addField("title");
  this.addField("date");
  this.addField("tags");
  this.addField("body");
  this.addField("file_name");
  this.setRef("file");
});

const md = require("markdown-it")({
  html: true,
  linkify: true,
  typographer: true,
});
md.use(require("markdown-it-deflist"));

function getCustomContainer(name) {
  let regex = new RegExp(`^${name}(.*)$`, "i");
  return {
    validate: function (params) {
      return params.trim().match(regex);
    },
    render: function (tokens, idx) {
      let m = tokens[idx].info.trim().match(regex);
      if (tokens[idx].nesting === 1) {
        let className = tokens[idx].attrGet("class") ? " " + tokens[idx].attrGet("class") : "";
        // opening tags
        if (m && m[1]) {
          return `
            <div class="custom-conatiner ${name}${className}" tabindex="0">
              <div class="custom-conatiner-title ${name}-title">${md.utils.escapeHtml(m[1])}</div>
              <div class="custom-conatiner-body ${name}-body">\n`;
        } else {
          return `
            <div class="custom-conatiner ${name}${className}">
              <div class="custom-conatiner-body ${name}-body">\n`;
        }
      } else {
        // closing tags
        return "</div>\n</div>\n";
      }
    },
  };
}

md.use(require("markdown-it-container"), "tip", getCustomContainer("tip"));
md.use(require("markdown-it-container"), "info", getCustomContainer("info"));
md.use(require("markdown-it-container"), "warning", getCustomContainer("warning"));
md.use(require("markdown-it-container"), "danger", getCustomContainer("danger"));
md.use(require("markdown-it-container"), "line", getCustomContainer("line"));
// md.use(require("markdown-it-container"), "block");
md.use(require("markdown-it-container"), "details", {
  validate: function (params) {
    return params.trim().match(/^details\s+(.*)$/);
  },
  render: function (tokens, idx) {
    var m = tokens[idx].info.trim().match(/^details\s+(.*)$/);
    if (tokens[idx].nesting === 1) {
      let className = tokens[idx].attrGet("class") ? ' class="' + tokens[idx].attrGet("class") + '"' : "";
      let open = tokens[idx].attrGet("data-open") ? " open" : "";
      return `<details${className}${open}><summary>${md.utils.escapeHtml(m[1])}</summary>\n`;
    } else {
      return "</details>\n";
    }
  },
});
md.use(require("./src/js/markdown-it-flowchart"));
md.use(require("markdown-it-task-lists"));
md.use(require("markdown-it-footnote"));
const markdownItAttrs = require("markdown-it-attrs");
md.use(markdownItAttrs, {
  // optional, these are default options
  leftDelimiter: "{",
  rightDelimiter: "}",
  allowedAttributes: [], // empty array = all attributes are allowed
});

// custom renderer for fenced code blocks
// @see default render in node_modules/markdown-it/dist/markdown-it.js #L3093
const defaultRenderFence = md.renderer.rules.fence;
md.renderer.rules.fence = function (tokens, idx, options, env, slf) {
  // We mimic the default renderer,
  // but we set attributes on the pre tag instead of the code tag
  // otherwise prism.js can not handle data attributes for plugins.
  const token = tokens[idx];
  const info = token.info ? md.utils.unescapeAll(token.info).trim() : "";
  let langName = "",
    langAttrs = "",
    highlighted,
    infoParts,
    helperClass = "";
  if (info) {
    infoParts = info.split(/(\s+)/g);
    langName = infoParts[0];
    langAttrs = infoParts.slice(2).join("");
    if (options.highlight) {
      highlighted = options.highlight(token.content, langName, langAttrs) || md.utils.escapeHtml(token.content);
    } else {
      highlighted = md.utils.escapeHtml(token.content);
    }
    // if token has attribute data-line and has no class line-numbers add class .no-line-numbers
    if (
      token.attrGet("data-line") &&
      (!token.attrGet("class") || token.attrGet("class").indexOf("line-numbers") === -1)
    ) {
      helperClass += " no-line-numbers";
    }
    if (token.attrIndex("class") >= 0) {
      token.attrs[token.attrIndex("class")][1] += " " + options.langPrefix + langName + helperClass;
    } else {
      token.attrPush(["class", options.langPrefix + langName + helperClass]);
    }
    // add id attribute to pre tag
    if (token.attrIndex("id") === -1) {
      token.attrPush(["id", "codeblock-" + idx]);
    }
    return "<pre" + slf.renderAttrs(token) + ">" + "<code>" + highlighted + "</code>" + "</pre>";
  } else {
    return defaultRenderFence(tokens, idx, options, env, slf);
  }
};
const anchor = require("markdown-it-anchor");
md.use(anchor, {
  permalink: anchor.permalink.headerLink(),
  slugify: function (s) {
    return String("t-" + s)
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/gi, "");
  },
});
const tocIncludeLevel = process.env.EASYDOC_TOC_INCLUDELEVEL ? process.env.EASYDOC_TOC_INCLUDELEVEL : [1, 2, 3, 4];
const mdItToc = require("markdown-it-table-of-contents");
const templateDir = path.join(__dirname, "templates");
const layout = path.join(templateDir, "layout.pug");
// const distDir = path.join(__dirname, "www");
const rgxExt = /\.(?:md)$/;
const outExt = ".html";

const pages = [];
const tagCloud = [];
let notLowercaseTags = [];

const mtimeOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
};

function getFromatedMtime(mtime, lang) {
  const suffix = lang === "de" ? " Uhr" : "";
  return new Date(mtime).toLocaleDateString(lang, mtimeOptions) + suffix;
}

// console.log("Building site...");
fs.readdir(docsDir, (err, files) => {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  // console.log(files);
  files.forEach((file) => {
    // if file is an image, copy it to distDir
    if (file.match(/\.(png|jpe?g|gif|svg)$/)) {
      fs.copyFileSync(path
        .join(docsDir, file), path.join(distDir, file));
    } else if (file.match(/\.(pdf)$/)) {
      fs.copyFileSync(path
        .join(docsDir, file), path.join(distDir, file));
    } else if (file.match(/\.(zip)$/)) {
      fs.copyFileSync(path
        .join(docsDir, file), path.join(distDir, file));
    } else if (file.match(/\.(js)$/)) {
      fs.copyFileSync(path
        .join(docsDir, file), path.join(distDir, file));
    } else if (file.match(/\.(md)$/)) {
      let fmData = fm(fs.readFileSync(path.join(docsDir, file), "utf-8"));
      let stats = fs.statSync(path.join(docsDir, file));
      // console.log(stats);
      if (
        fmData.attributes.tocIncludeLevel &&
        fmData.attributes.tocIncludeLevel.length > 0 &&
        fmData.attributes.tocIncludeLevel !== tocIncludeLevel
      ) {
        md.use(mdItToc, {
          includeLevel: fmData.attributes.tocIncludeLevel,
        });
      } else {
        md.use(mdItToc, {
          includeLevel: tocIncludeLevel,
        });
      }
      let toc = md.render("[[toc]]\n" + fmData.body);
      toc = toc.match(/<div class="table-of-contents">(.|\s)*?<\/div>/g)[0];
      let lang = fmData.attributes.lang ? fmData.attributes.lang : process.env.EASYDOC_LANG_FALLBACK;
      if (!t[lang]) {
        lang = process.env.EASYDOC_LANG_FALLBACK;
      }
      let title = fmData.attributes.title ? fmData.attributes.title : process.env.EASYDOC_TITLE_FALLBACK;

      let loadVueJs = fmData.attributes.loadVueJs
        ? Boolean(fmData.attributes.loadVueJs)
        : Boolean(process.env.EASYDOC_LOAD_VUE_JS);
      let disableBrand = fmData.attributes.disableBrand
        ? Boolean(fmData.attributes.disableBrand)
        : Boolean(process.env.EASYDOC_DISABLE_BRAND);
      let navbarClass = disableBrand ? "no_brand" : "";
      let disableToc = fmData.attributes.disableToc
        ? Boolean(fmData.attributes.disableToc)
        : Boolean(process.env.EASYDOC_DISABLE_TOC);
      let disableSiteNav = fmData.attributes.disableSiteNav
        ? Boolean(fmData.attributes.disableSiteNav)
        : Boolean(process.env.EASYDOC_DISABLE_SITE_NAV);
      let disableTagNavigator = fmData.attributes.disableTagNavigator
        ? Boolean(fmData.attributes.disableTagNavigator)
        : Boolean(process.env.EASYDOC_DISABLE_TAG_NAVIGATOR);
      let disableNavigationBar = fmData.attributes.disableNavigationBar
        ? Boolean(fmData.attributes.disableNavigationBar)
        : Boolean(process.env.EASYDOC_DISABLE_NAVIGATION_BAR);
      if (disableBrand && disableToc && disableSiteNav && disableTagNavigator) {
        disableNavigationBar = true;
      }
      let disableBurger = false;
      if (!disableBrand && disableToc && disableSiteNav && disableTagNavigator) {
        disableBurger = true;
      }

      let fileOut = file.replace(rgxExt, outExt);
      let tags = fmData.attributes.tags
        ? Array.isArray(fmData.attributes.tags)
          ? fmData.attributes.tags
          : [fmData.attributes.tags]
        : [];

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
            files: [fileOut],
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
      let navigation = "";
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
          mtime: getFromatedMtime(stats.mtime, lang),
          brandURL: fmData.attributes.brandURL ? fmData.attributes.brandURL : process.env.EASYDOC_BRAND_URL,
          brandName: fmData.attributes.brandName ? fmData.attributes.brandName : process.env.EASYDOC_BRAND_NAME,
          brandSecondary: fmData.attributes.brandSecondary
            ? fmData.attributes.brandSecondary
            : process.env.EASYDOC_BRAND_SECONDARY,
          disableBrand: disableBrand,
          navbarClass: navbarClass,
          disableToc: disableToc,
          disableSiteNav: disableSiteNav,
          disableTagNavigator: disableTagNavigator,
          disableNavigationBar: disableNavigationBar,
          disableBurger: disableBurger,
          loadVueJs: loadVueJs,
        },
      });
      fs.writeFileSync(path.join(distDir, fileOut), page);
      if (withFulltextSearch) {
        searchIndex.addDoc({
          title: title,
          date: stats.mtime,
          tags: tags.join(" "),
          body: fmData.body,
          file_name: fileOut,
          file: fileOut,
        });
      }
    }
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

  const metaConfig = {
    lang_fallback: process.env.EASYDOC_LANG_FALLBACK,
    title_fallback: process.env.EASYDOC_TITLE_FALLBACK,
    brand_url: process.env.EASYDOC_BRAND_URL,
    brand_name: process.env.EASYDOC_BRAND_NAME,
    brand_secondary: process.env.EASYDOC_BRAND_SECONDARY,
    disable_brand:
      String(process.env.EASYDOC_DISABLE_BRAND).toLowerCase() === "false"
        ? false
        : Boolean(process.env.EASYDOC_DISABLE_BRAND),
    disable_toc:
      String(process.env.EASYDOC_DISABLE_TOC).toLowerCase() === "false"
        ? false
        : Boolean(process.env.EASYDOC_DISABLE_TOC),
    disable_site_nav:
      String(process.env.EASYDOC_DISABLE_SITE_NAV).toLowerCase() === "false"
        ? false
        : Boolean(process.env.EASYDOC_DISABLE_SITE_NAV),
    disable_tag_navigator:
      String(process.env.EASYDOC_DISABLE_TAG_NAVIGATOR).toLowerCase() === "false"
        ? false
        : Boolean(process.env.EASYDOC_DISABLE_TAG_NAVIGATOR),
    disable_navigation_bar:
      String(process.env.EASYDOC_DISABLE_NAVIGATION_BAR).toLowerCase() === "false"
        ? false
        : Boolean(process.env.EASYDOC_DISABLE_NAVIGATION_BAR),
    // disable_burger: Boolean(process.env.EASYDOC_DISABLE_BURGER),
    toc_include_level: tocIncludeLevel,
    enable_fulltext_search:
      String(process.env.EASYDOC_ENABLE_FULLTEXT_SEARCH).toLowerCase() === "false"
        ? false
        : Boolean(process.env.EASYDOC_ENABLE_FULLTEXT_SEARCH),
    easydoc_search_api_url: process.env.EASYDOC_SEARCH_API_URL,
    // search_index: searchIndex.toJSON(),
  };

  fs.writeFileSync(
    path.join(distDir, "meta.js"),
    `const easydocMeta = {
      config: ${JSON.stringify(metaConfig)},
      t: ${JSON.stringify(t)},
      pages: ${JSON.stringify(pages)},
      tags: ${JSON.stringify(tagCloud)}
    };`
  );

  if (withFulltextSearch) {
    // console.log("Building " + baseDir + "/searchIndex.json");
    fs.writeFileSync(path.join(baseDir, "searchIndex.json"), JSON.stringify(searchIndex));
  }
});
