---
title: EasyDoc
---

# EasyDoc {.text-center}

![EasyDoc](img/easydoc-banner.png)

---

##### _created by:_ {.text-center}

<!-- BRAND HTML -->
<a class="brand-link" href="https:grandgeorg.de">
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

::: details Generates completely offline HTML Website.
-	You can just open the resulting HTML-Files in the ```www``` directory locally in a browser. 
-	You can also drop / push the ```www``` directory to a HTTP-Server.
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
 │ ├🗏 easydoc.md 📌 🖤
 │ └🗏 reference.md 🖤
 ├🗀 lang 🖊️
 ├🗀 node_modules
 ├🗀 src 🖊️
 ├🗀 templates 🖊️
 ├🔵 www
 │ ├🗀 css
 │ ├🗀 fonts
 │ ├🟢 img
 │ │ └🗏 easydoc-banner.png 🖤
 │ ├🗀 js 🖊️
 │ ├🗏 easydoc.html 📌
 │ └🗏 reference.html
 ├🗏 .env ✏️
 ├🗏 .gitignore
 ├🗏 index.js 🖊️
 ├🗏 nodemon.jsons
 ├🗏 package.json
 └🗏 package-lock.json

╭──────────────────────────═━┈💬┈━═──────────────────────────╮
│  🟢 input directories. Start creating files here.          │
│  🔵 output directory. Html files will be generated here.   │
│  ✏️ configure EasyDoc                                      │
│  🖊️ change EasyDoc                                         │
│  📌 It's me. Your reading this document right now.         │
│  🖤 Remove these documentation files for a blank start.    │
╰──────────────────────────═━┈💬┈━═──────────────────────────╯

```

:::

## Configuration

### 📜 ```.env``` asd

```ini
EASYDOC_LANG_FALLBACK=en
EASYDOC_TITLE_FALLBACK=Documentation

EASYDOC_BRAND_URL=https://grandgeorg.de
EASYDOC_BRAND_NAME=Grandgeorg
EASYDOC_BRAND_SECONDARY=Websolutions

EASYDOC_TOC_INCLUDELEVEL=[1,2,3,4]

; EASYDOC_DISABLE_BRAND=true
; EASYDOC_DISABLE_NAVIGATION=true
```

```frontmatter

---
title: Docker Multi-Instanz Setup
lang: de
brandURL: https://culture-to-go.com
brandName: Culture
brandSecondary: to go
disableBrand: true
disableNav: trueasd
disableToc: true
disableNavigation: true
---

```

--------------------------------------------------------------------------------
[EasyDoc Reference](reference.html) {.text-center}

--------------------------------------------------------------------------------


![](img/001.png)

### Workflow

Use git if working in a team.

## Todos

- make print css version.
- multisite navigation
