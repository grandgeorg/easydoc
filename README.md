# EasyDoc

![EasyDoc](manual/img/easydoc-banner.jpg)

EasyDoc is a simple but powerful technical documentation tool that generates completely local HTML pages and websites from markdown files. It offers rich markdown support and code highlighting features, using [markdown-it](https://github.com/markdown-it/markdown-it) and [Prism](https://prismjs.com/) respectively.

EasyDoc is fully configurable and customizable, allowing you to tailor global and per page settings, customize components, and edit its theme. It also provides built-in navigation features such as a table of contents on pages, individual site navigation, and a Tag Navigator module.

##### _created by:_ [Grandgeorg Websolutions](https://grandgeorg.de)
---

## Requirements

- Node.js 22.15.0 or newer (an active LTS release is recommended)
- npm (comes with Node.js)
- git (optional)

## Install

Clone this [repository](https://github.com/grandgeorg/easydoc):

```bash
# clone via https:
git clone https://github.com/grandgeorg/easydoc.git
# or clone via SSH (if you have a key):
git clone git@github.com:grandgeorg/easydoc.git
```
If you don't have git installed, you can also download the repository as a zip file and extract it.

Change into `easydoc` directory and run install:

```bash
cd ./easydoc/
npm install
```

You could now use EasyDoc from this directory, but we recommend, that for your documentations in different paths you use the ```setup.js``` from EasyDoc as follows:

```bash
# cd to some directory in some project of yours, 
# where you want to setup your documentation with EasyDoc
cd /some/project/docs
# run setup.js from easydoc with node
node /path/where/you/cloned/and/installed/easydoc/setup.js
# edit newly generated config files (.env, nav.js, package.json - author, description, keywords)
# put some md-files into docs directory
# you can now run
npm run build
# if you also want to use nodemon to watch your file changes first run
npm install
# then you can run
npm run watch
```

## Usage

```bash
# watches on file changes and runs build:
npm run watch
# or build one time
npm run build
```

## Custom Theme Overrides

Put your own CSS into `overrides.css` in your documentation project's root (`setup.js` and `npm run update` create a commented-out starter if it is missing). On every build it is copied to `www/assets/css/overrides.css` and loaded after EasyDoc's own CSS, so your rules win. The theme colors are CSS custom properties per theme, e.g.:

```css
html[data-theme=dark] .navbar {
  --clr-brand: #00ee00;
}
html[data-theme=light] .navbar {
  --clr-brand: #006600;
}
```

The stylesheet is only linked when `overrides.css` exists, with a content hash (`?v=…`) so browsers pick up changes. `npm run update` never overwrites it. Set `EASYDOC_DISABLE_THEME_OVERRIDES=true` in `.env` to stop loading it, or use `disableThemeOverrides: true` / `false` in a page's front matter to override that per page. Projects set up before this feature can add `"overrides.css"` to `watch` (and `css` to `ext`) in their `nodemon.json` so `npm run watch` rebuilds on changes.

## Updating


After pulling a newer EasyDoc version, refresh the JS, CSS and font assets in your documentation project:

```bash
# run from your documentation project directory
npm run update
# or, for projects set up before the update script existed
node /path/where/you/cloned/and/installed/easydoc/update.js
```

Existing files in `www/assets/` (CSS, JS, fonts) are overwritten with EasyDoc's versions; favicons are left untouched. Your project's `searchApi.js` is replaced with EasyDoc's current version as well. If your `package.json` still lists `elasticlunr` (the full-text search engine used before MiniSearch), it is replaced with `minisearch`; run `npm install` afterwards.

`npm audit` may report a high-severity `braces` advisory (GHSA-vfj7-8cjw-p6xm) via `nodemon` → `chokidar`. No patched `braces` release exists yet. It only affects the local `npm run watch` tool, whose glob patterns come from your own `nodemon.json`. Do **not** run `npm audit fix --force`: it downgrades nodemon to 1.x. `npm audit --omit=dev` shows the production-relevant result.

## Deployment

You can deploy your generated documentation to a server using 

```bash
npm run deploy
```
 
Make sure to configure the deployment settings in the `.env` file before running the deploy command. 

The deployment process will build your documentation and then upload it to the specified server using the configured method. 

### SFTP Deployment

For now the only supported deployment method is SFTP. You can configure the SFTP settings in the `.env` file.

Refer to EasyDoc's reference for detailed information on configuring deployment settings: [EasyDoc reference](https://grandgeorg.github.io/easydoc/easydoc-reference.html#codeblock-20.112).

For search API integration, check the documentation for the [**Search API & Deployment**](https://grandgeorg.github.io/easydoc/easydoc-reference.html#t-search-api--deployment) settings in the [EasyDoc&nbsp;reference](https://grandgeorg.github.io/easydoc/easydoc-reference.html#t-search-api--deployment).

## Manual & Reference & Demo

The manual and reference are generated with EasyDoc itself, so you can see how it looks like.

- Find more information in the [EasyDoc short manual](https://grandgeorg.github.io/easydoc/).  
- For configuration and further usage refer to the [EasyDoc reference](https://grandgeorg.github.io/easydoc/easydoc-reference.html).