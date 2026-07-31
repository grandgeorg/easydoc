# EasyDoc

![EasyDoc](manual/img/easydoc-banner.png)

EasyDoc is a simple but powerful technical documentation tool that generates completely local HTML pages and websites from markdown files. It offers rich markdown support and code highlighting features, using [markdown-it](https://github.com/markdown-it/markdown-it) and [Prism](https://prismjs.com/) respectively.

EasyDoc is fully configurable and customizable, allowing you to tailor global and per page settings, customize components, and edit its theme. It also provides built-in navigation features such as a table of contents on pages, individual site navigation, and a Tag Navigator module.

##### _created by:_ [Grandgeorg Websolutions](https://grandgeorg.de)
---

## Requirements

- Node.js
- npm
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

## Deployment

You can deploy your generated documentation to a server using 

```bash
npm run deploy
```
 
Make sure to configure the deployment settings in the `.env` file before running the deploy command. 

The deployment process will build your documentation and then upload it to the specified server using the configured method. 

### SFTP Deployment

For now the only supported deployment method is SFTP. You can configure the SFTP settings in the `.env` file.

```ini
EASYDOC_DEPLOY_TYPE=sftp

# SFTP deployment (runs `npm run build`, then uploads the built site).
EASYDOC_DEPLOY_SFTP_HOST=example.com
EASYDOC_DEPLOY_SFTP_PORT=22
EASYDOC_DEPLOY_SFTP_USERNAME=user
# Use a private key (preferred) OR a password.
EASYDOC_DEPLOY_SFTP_PRIVATE_KEY=/path/to/id_rsa
EASYDOC_DEPLOY_SFTP_PASSPHRASE=
# Use a password auth instead of a private key.
EASYDOC_DEPLOY_SFTP_PASSWORD=
# Remote directory the site is uploaded into.
EASYDOC_DEPLOY_SFTP_REMOTE_PATH=/var/www/vhost/doc.yourdomain.tld/public/some-doc
# Local directory to upload (defaults to the built output: www).
EASYDOC_DEPLOY_SFTP_LOCAL_DIR=www
```

## Manual & Reference & Demo

The manual and reference are generated with EasyDoc itself, so you can see how it looks like.

- Find more information in the [EasyDoc manual](https://grandgeorg.github.io/easydoc/).  
- For configuration and further usage refer to the [EasyDoc reference](https://grandgeorg.github.io/easydoc/easydoc-reference.html).