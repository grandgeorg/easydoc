# EasyDoc

![EasyDoc](manual/img/easydoc-banner.png)

EasyDoc is a powerful technical documentation tool that generates completely local HTML pages and websites from markdown files. It offers rich markdown support and code highlighting features, using [markdown-it](https://github.com/markdown-it/markdown-it) and [Prism](https://prismjs.com/) respectively.

EasyDoc is fully configurable and customizable, allowing you to tailor global and per page settings, customize components, and edit its theme. It also provides built-in navigation features such as a table of contents on pages, individual site navigation, and a Tag Navigator module.

##### _created by:_ [Grandgeorg Websolutions](https://grandgeorg.de)
---

## Requirements

- Node.js
- npm
- git

## Install

Clone this [repository](https://github.com/grandgeorg/easydoc):

```bash
# clone via https:
git clone https://github.com/grandgeorg/easydoc.git
# or clone via SSH (if you have a key):
git clone git@github.com:grandgeorg/easydoc.git
```

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

## Manual & Reference & Demo

The manual and reference are generated with EasyDoc itself, so you can see how it looks like.

- Find more information in the [EasyDoc manual](https://grandgeorg.github.io/easydoc/).  
- For configuration and further usage refer to the [EasyDoc reference](https://grandgeorg.github.io/easydoc/easydoc-reference.html).