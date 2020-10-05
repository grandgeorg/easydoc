'use strict';

const path = require('path');
const fs = require('fs');
const pug = require('pug');
const fm = require('front-matter')

const md = require('markdown-it')({
    html: true,
    linkify: true,
    typographer: true
});
md.use(require('markdown-it-deflist'));
md.use(require('markdown-it-container'), 'tip');
md.use(require('markdown-it-container'), 'warning');
md.use(require('markdown-it-container'), 'danger');
md.use(require('markdown-it-flowchart'));

const docsDir = path.join(__dirname, 'docs');
const templateDir = path.join(__dirname, 'templates');
const layout = path.join(templateDir, 'layout.pug');
const distDir = path.join(__dirname, 'www');
const rgxExt = /\.(?:md)$/;
const outExt = '.html';

fs.readdir(docsDir, (err, files) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    files.forEach((file) => {
        let fmData = fm(fs.readFileSync(path.join(docsDir, file), 'utf-8'));
        let stats = fs.statSync(path.join(docsDir, file))
        const page = pug.renderFile(layout, {
            content: md.render(fmData.body),
            attributes: {
                title: fmData.attributes.title? fmData.attributes.title : 'Documentation',
                lang: fmData.attributes.lang? fmData.attributes.lang : 'en',
                mtime: stats.mtime
            }
        });
        fs.writeFileSync(path.join(distDir, file.replace(rgxExt, outExt)), page);
    });
});