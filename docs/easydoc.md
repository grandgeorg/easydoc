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

::: details  directory structure 

```filetree
█ easydoc
│
├🖿 .git
├🗁.vscode
│ └🗏 settings.json
├🟢 docs
│ ├🗏 easydoc.md 📌 🖤
│ └🗏 reference.md 🖤
├🗁 lang
│ └🗏 langs.js 🖍️
├🖿 node_modules
├🗁 src
│└🗁 scss
│  ├🗏 prism.scss
│  ├🗏 style.scss
│  └🗏 _mixins.scss
├🗁 templates
│ └🗏 layout.pug 🖍️
├🔵 www
│├🗁 css
││ ├🗏 prism.min.css
││ └🗏 style.min.css
│├🗁 fonts
││ └🗏 EncodeSans.woff2
│├🟢 img
││ ├🗏 easydoc-banner.png 🖤
││ └🗏 logo.png 🖤
│├🗁 js
││ ├🗏 app.js
││ ├🗏 clipboard.min.js
││ ├🗏 flowchart.min.js
││ ├🗏 prism.js
││ └🗏 raphael.min.js
│├🗏 easydoc.html 📌
│└🗏 reference.html
├🗏 .env ✏️
├🗏 .gitignore
├🗏 index.js 🖍️
├🗏 nodemon.json
├🗏 package.json
└🗏 package-lock.json

🟢 input directories. Start creating files here.  
🔵 output directory  
✏️ configure EasyDoc  
🖍️ change EasyDoc  
📌 it's me
🖤 Remove these documentation files for a blank start.
```

hier auch

:::

## Configuration

--------------------------------------------------------------------------------


[EasyDoc Reference](reference.html) {.text-center}


```bash
```

hier Animiertes Gif einfügen...

### Workflow

Use git if working in a team.

## Todos

- make print css version.
- multisite navigation
