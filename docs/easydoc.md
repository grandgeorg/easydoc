---
title: EasyDoc
tags:
  - markdown
  - javascript
  - documentation
  - tool
tocIncludeLevel: [1, 2, 3]
# disableBrand: true
# disableToc: true
# disableSiteNav: true
# disableTagNavigator: true
# disableNavigationBar: true
---

# EasyDoc {.text-center}

![EasyDoc](img/easydoc-banner.png)

---
  
##### _created by:_ {.text-center}

<!-- BRAND HTML -->
<a class="brand-link" href="https://grandgeorg.de">
  <div class="brand">Grandgeorg</div>
  <div class="brand-second">Websolutions</div>
</a>

<svg width="156" height="84" viewBox="0 0 52 28" class="logo gw-logo" style="margin-top:0.5rem">
  <path style="fill:#ff3300;stroke:#bf260066;stroke-width:2px;stroke-linecap:butt;stroke-linejoin:round;stroke-opacity:1" d="M 24,4 H 4 V 24 H 24 V 12 h -8 v 4 h 4 v 4 H 8 V 8 h 16 z"/>
  <path style="fill:#267dff;stroke:#1d5ebf66;stroke-width:2px;stroke-linecap:butt;stroke-linejoin:round;stroke-opacity:1" d="M 48,4 V 24 H 28 V 4 h 4 v 16 h 4 V 8 h 4 v 12 h 4 V 4 Z" />
</svg>
<!-- :BRAND HTML -->

---

## Features

::: details Generates completely local HTML Website.
-	You can just open the resulting HTML-files in the ```www``` directory locally in a browser. 
-	You can also drop / push the contents of the ```www``` directory to a HTTP-Server.
:::



## Install

```bash
# clone via https:
git clone https://git.grandgeorg.de/Viktor/easydoc.git
# or clone via SSH (if you have a key):
git clone git@git.grandgeorg.de:Viktor/easydoc.git
cd ./easydoc/
npm install
# start vscode if you like ...
code .
```

## Usage

```bash
# watches on file changes and runs build:
npm run watch
# or build one time
npm run build
```

::: details 🖿 easydoc directory structure
```filetree
🗁 easydoc
 ├🗀 .git
 ├🗀 .vscode
 ├🟢 docs
 │ └🗏 index.md 🖤
 ├🗀 lang 🖊️
 ├🗁 manual 📌
 │ ├🗀 assets
 │ ├🗀 img
 │ ├🗏 easydoc.html
 │ ├🗏 easydoc.md
 │ ├🗏 reference.html
 │ └🗏 reference.md 
 ├🗀 node_modules
 ├🗀 src 🖊️
 ├🗀 templates 🖊️
 ├🔵 www
 │ ├🗀 assets 🖊️
 │ ├🟢 img
 │ └🗏 index.html 🖤
 ├🗏 .env ✏️
 ├🗏 .gitignore
 ├🗏 .hintrc
 ├🗏 index.js 🖊️
 ├🗏 nav.js ✏️
 ├🗏 nodemon.json
 ├🗏 package.json
 ├🗏 package-lock.json
 └🗏 webpack.config.js

╭──────────────────────────═━┈💬┈━═──────────────────────────╮
│  🟢 input directories. Start creating files here.          │
│  🔵 output directory. Html files will be generated here.   │
│  ✏️ configure EasyDoc                                      │
│  🖊️ change EasyDoc                                         │
│  📌 It's me. You are reading these documents right now.    │
│  🖤 Remove these documentation files for a blank start.    │
╰──────────────────────────═━┈💬┈━═──────────────────────────╯
```
:::



--------------------------------------------------------------------------------
For configuration and further usage refer to the [EasyDoc Reference](reference.html) {.text-center}

--------------------------------------------------------------------------------

### Workflow

Use git if working in a team.

## Todos

- make CSS **print** version.