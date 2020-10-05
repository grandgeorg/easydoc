---
title: Example 1
---

# h1 Heading
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading

## Horizontal Rules

___

---

***


## Typographic replacements

(c) (C) (r) (R) (tm) (TM) (p) (P) +-

ellipsis .. ellipsis ... ellipsis ..... ellipsis ..... ellipsis ....

!!!!!! ???? ,,  -- ---

"Smartypants, double quotes" and 'single quotes'


## Emphasis

**This is bold text**

__This is bold text__

*This is italic text*

_This is italic text_

~~Strikethrough~~


## Blockquotes

> Blockquotes can also be nested...
>> ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.


## Lists

### Unordered

+ Create a list by starting a line with `+`, `-`, or `*`
+ Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    - Ac tristique libero volutpat at
    * Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
+ Very easy!

#### Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit

Lists can be interrupted and then resumed

3. Integer molestie lorem at massa

Start numbering with offset:

57. foo
58. bar

### Definition lists

Lorem ipsum dolor sed amet.

Some Definition Title 1
: Type: `string`
: Default: `empty`
: Some description

Some Definition Title 2
: Type: `bool`
: Default: `true`
: Some description

Lorem ipsum dolor sed amet.

Some Definition Title 3
:   Other definition style 
with lazy continuation.

Some Definition Title 4 with *inline markup*
:   Definition x

        { some code, part of Definition x }

    Third paragraph of Definition x.

_Other style:_

Term 1
  ~ Definition 1

Term 2
  ~ Definition 2a
  ~ Definition 2b


## Tables

| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

Right aligned columns

| Option | Description |
| ------:| -----------:|
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |


## Links

[metager](https://metager.de/)

[metager with title](https://metager.de/ "MetaGer")

Autoconverted link https://grandgeorg.de

[Local link to example 2](example-2.html "Example 2")


## Images

Fullsize 

![Random Image](https://source.unsplash.com/1920x1080/?cityscape,landscape,nature/__random__)

Small

![Random Image small](https://source.unsplash.com/320x180/?cityscape,landscape,nature/__random__ "Random Image small")

Like links, Images also have a footnote style syntax

![Alt text][img-id]


## Plugins


### Custom containers

::: tip
FYI - so that you know ...
:::

::: warning
*here be dragons 🦎*
:::

::: danger
### ⚠ You are going to die
... just kidding!
:::

### flowchart.js

#### Example 1

@flowstart
st=>start: Start
e=>end: The End
op1=>operation: My Operation|current
sub1=>subroutine: My Subroutine
cond=>condition: Has option?
io=>inputoutput: catch something...
st->op1->cond
cond(yes)->io->e
cond(no)->sub1(right)->op1
@flowend

#### Example 1

@flowstart
st=>start: Start:>https://grandgeorg.de[blank]
e=>end:>https://grandgeorg.de
op1=>operation: My Operation
sub1=>subroutine: My Subroutine
cond=>condition: Yes
or No?:>https://grandgeorg.de
io=>inputoutput: catch something...
para=>parallel: parallel tasks

st->op1->cond
cond(yes)->io->e
cond(no)->para
para(path1, bottom)->sub1(right)->op1
para(path2, top)->op1
@flowend


### Code blocks with prismjs

Some examples below. The current configuration is:

__languages__

+ markup
+ css
+ clike
+ javascript
+ apacheconf
+ bash
+ diff
+ editorconfig
+ elm
+ git
+ ini
+ javadoclike
+ json
+ json5
+ less
+ makefile
+ markup-templating
+ mongodb
+ nginx
+ php
+ phpdoc
+ php-extras
+ python
+ regex
+ scss
+ sql
+ stylus
+ typoscript
+ yaml

__plugins__

+ line-numbers
+ show-language
+ toolbar
+ copy-to-clipboard
+ diff-highlight

To get your own configuration go to: 
[prismjs](https://prismjs.com/download.html#themes=prism-tomorrow&languages=markup+css+clike+javascript)

#### HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<title>I can haz embedded CSS and JS</title>
	<style>
		@media print {
			p { color: red !important; }
		}
	</style>
</head>
<body>
	<h1>I can haz embedded CSS and JS</h1>
	<script>
	if (true) {
		console.log('foo');
	}
	</script>

</body>
</html>
```

##### JavaScript

```js
"use strict";

const path = require("path");
const fs = require("fs");
const pug = require("pug");
const fm = require("front-matter");

const md = require("markdown-it")({
  html: true,
  linkify: true,
  typographer: true,
});
md.use(require("markdown-it-deflist"));
md.use(require("markdown-it-container"), "tip");
md.use(require("markdown-it-container"), "warning");
md.use(require("markdown-it-container"), "danger");

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
    const page = pug.renderFile(layout, {
      content: md.render(fmData.body),
      attributes: {
        title: fmData.attributes.title
          ? fmData.attributes.title
          : "Documentation",
        lang: fmData.attributes.lang ? fmData.attributes.lang : "en",
        mtime: stats.mtime,
      },
    });
    fs.writeFileSync(path.join(distDir, file.replace(rgxExt, outExt)), page);
  });
});
```

#### CSS
```css
body, html {
    padding: 0;
    margin: 0;
    background-color: #000;
}

*, *:before, *:after {
    box-sizing: border-box;
}

a, article, aside, blockquote, body, code, dd, div, dl, dt, fieldset,
figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, legend, li,
main, nav, ol, p, pre, section, table, td, textarea, th, tr, ul {
    box-sizing: border-box;
}

hr {
    border-top-color: hsla(0,0%,100%,.1)
}

table {
    border-collapse: collapse;
}

tr:nth-child(2n) {
    background-color: rgb(32, 34, 35);
}

@media (min-width: 480px) {
    .content {
        padding: 2rem 2.5rem 1rem;
    }
    .mtime {
        padding: 0.7rem 2.5rem 0;
    }
}

```

### PHP

```php
declare(strict_types=1);
/*
 * This file is part of the Gws package.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Gws\Image;

use Gws\System\Msg;

/**
 * Image Compressor
 *
 * @author Viktor Grandgeorg <viktor@grandgeorg.de>
 */
class Compressor
{
    use Msg;

    protected $sysconf;
    protected $logger;
    protected $conf;
    protected $cFormat;
    protected $mandatories = [
        'input_dir',
        'output_dir',
        'resize',
        'jpeg_recompress'
    ];
    protected $ext = array('jpg', 'jpeg');

    public function __construct($sysconf, $logger, $conf)
    {
        $this->sysconf = $sysconf;
        $this->logger = $logger;
        $this->conf = $conf;
    }

    public function run(): int
    {
        foreach ($this->conf->get('formats') as $format) {
            if ($this->validateFormat($format) &&
                $this->validateDir($format['input_dir']) &&
                $this->validateDir($format['output_dir'], true))
            {
                $this->cFormat = array_merge(
                    $this->defaults,
                    $format,
                    [
                        'input_dir_realpath' => realpath($format['input_dir']),
                        'output_dir_realpath' => realpath($format['output_dir'])
                    ]
                );
                $this->filterJrcMethod();
                $this->dispatchImages();
            } else {
                return 1;        
            }
        }
        return 0;
    }

    protected function validateFormat(array $format): bool
    {
        foreach ($this->mandatories as $mandatory) {
            if (!array_key_exists($mandatory, $format)) {
                $this->msg(
                    sprintf($this->sysconf->get('msg'), $mandatory) . "\n", 
                    'all', 'debug', $format
                );
                return false;
            }
        }
        return true;
    }

    // ...
}
```


[img-id]: https://source.unsplash.com/480x270/?cityscape,landscape,nature/__random__  "The Dojocat"