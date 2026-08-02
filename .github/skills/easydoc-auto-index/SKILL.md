---
name: easydoc-auto-index
description: "Use when working on EasyDoc's auto-generated index page or its Vue dashboard — the EASYDOC_GENERATE_AUTO_INDEX / EASYDOC_AUTO_INDEX_POSITION / EASYDOC_AUTO_INDEX_SHOW_DASHBOARD / EASYDOC_AUTO_INDEX_SHOW_TAG_NAVIGATOR options, the marker block patched into docs/index.md, dashboard.js search behaviour (tags, title, filename, fulltext scores), or the Vue.js loading override."
---

# EasyDoc auto index & dashboard

Covers the auto-generated `index.md` and the Vue-powered dashboard that can be injected
into it.

## Config surface (`.env`)

| Variable | Default | Meaning |
|---|---|---|
| `EASYDOC_GENERATE_AUTO_INDEX` | `false` | Master switch. When off, nothing below runs. |
| `EASYDOC_AUTO_INDEX_POSITION` | `prepend` | `prepend` \| `append`. Where the block is inserted **on first insert only**. |
| `EASYDOC_AUTO_INDEX_SHOW_DASHBOARD` | `false` | Inject the dashboard mount point + script. |
| `EASYDOC_AUTO_INDEX_SHOW_TAG_NAVIGATOR` | `false` | Reserved — **not implemented**. The tag navigator is a modal; this option is for a future inline variant. |

All four are parsed with an `envBool()` helper: `String(v).toLowerCase() === "true"`.
Do **not** use bare `Boolean(process.env.X)` — `Boolean("false")` is `true`.

## Marker block contract

```
<!-- easydoc:auto-index:start -->
<div id="dashboard"></div>
<script src="assets/js/dashboard.min.js"></script>
<!-- easydoc:auto-index:end -->
```

Rules, in order:

1. Runs in `index.js` **before** `fs.readdir(docsDir, …)`, so the patched file is picked
   up by the same build.
2. `docs/index.md` missing → create it with minimal front matter
   (`lang` from `EASYDOC_LANG_FALLBACK`, `title` from `EASYDOC_TITLE_FALLBACK`,
   `disableToc: true`) plus the block.
3. `docs/index.md` exists **with** markers → replace only what is between them; the block
   stays wherever the user moved it.
4. `docs/index.md` exists **without** markers → insert at `EASYDOC_AUTO_INDEX_POSITION`.
   `prepend` means **after the closing `---` of the front matter**, never at byte 0.
5. Dashboard disabled → create `index.md` if missing, but write no block.
6. Turning the feature off never removes an existing block.

### Watch-loop hazard

`nodemon.json` watches `docs/` for `md, js`. The build **must** compare the new file
content to the old and skip `writeFileSync` when identical, or `npm run watch` rebuilds
forever. Always verify with two consecutive builds and an unchanged `docs/index.md` mtime.

## Vue.js loading

- The `.env` variable is `EASYDOC_LOAD_VUEJS`. An earlier version of `index.js` read
  `EASYDOC_LOAD_VUE_JS`, which never matched — do not reintroduce that.
- When auto index + dashboard are on, `loadVueJs` is forced to `true` **for `index.md`
  only**, so other pages stay lean.
- `vue.global.prod.js` and `dashboard.min.js` must be copied by `setup.js` *and* by the
  `index.js` self-heal path. The historical self-heal block is wrapped in
  `if (!fs.existsSync(www/assets))`, so existing projects never receive new assets — use
  per-file existence checks instead.

## Dashboard (`src/js/dashboard.js` → `www/assets/js/dashboard.min.js`)

Plain IIFE using the global `Vue`; second webpack entry alongside `app.js`. Bails out
silently if `#dashboard`, `Vue`, or `easydocMeta` is missing.

### Search semantics

- Tokenize on whitespace **and** commas, lowercase.
- A page is a hit when **any token** matches **any criterion** (fully inclusive OR):
  - tag exact (case-insensitive equality against `page.tags`)
  - tag prefix (weaker "partial" hit, rendered differently)
  - title substring
  - filename substring
  - fulltext hit
- Empty query shows all pages.
- 300 ms debounce on everything.
- Query is mirrored to `?q=` with `history.replaceState`. No localStorage, so the
  cookie-consent flow in `app.js` does not apply.

### Fulltext

`searchApi.js` uses `bool: "AND"`, so **one request per token**, unioned client-side —
a single multi-token request would AND the tokens and break the inclusive-OR rule, and
per-token scores would be unavailable. A page's score is the **highest** score across
tokens. Format to 2 decimals in a `.score-chip`.

The API is a separate server (`npm run search`, port 3000) and is normally unreachable on
a deployed static site. Unreachable ⇒ silent fallback to local matching + a muted note in
the summary.

### Rendering

- Card list wrapper: `<div class="tag-navigation dashboard-pages">` so the existing
  `.page-card` SCSS applies unchanged.
- Card markup mirrors the modal's cards in `app.js` (title, filename, date + lang, tags),
  plus the score chip.
- Highlighting uses **segment splitting + plain interpolation**, never `v-html`. Page
  titles come from user front matter; `v-html` there is an injection vector.
- Summary sits under the input, grouped with headings and counts: Tags /
  Title & Filename / Fulltext.
- Clicking a tag on a card appends it to the search input.
- Ordering: fulltext score desc while a query is active, otherwise date desc.

## Build steps

```bash
npm run js     # webpack: app.min.js + dashboard.min.js
```

SCSS has **no npm script** — `www/assets/css/style.min.css` is produced by the Live Sass
Compiler VS Code extension configured in `.vscode/settings.json`.

## Testing

`test/testdocs/` is a checked-in EasyDoc instance scaffolded with `setup.js`: ~90 real
pages, its own `.env`/`nav.js`/`www/`, and a `package.json` whose scripts point at this
repo's absolute `index.js` path. Use it as the integration target:

```bash
cd test/testdocs
npm run build           # or: npm run watch
npm run search          # only when EASYDOC_ENABLE_FULLTEXT_SEARCH=true
```

Its `docs/index.md` already exists and has front matter plus real content, so it exercises
the *insert into an existing file* path (not the generate-from-scratch path). Reset it with
`git checkout` between marker-placement experiments.
