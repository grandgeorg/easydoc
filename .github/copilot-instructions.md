# EasyDoc — Copilot / AI agent instructions

EasyDoc (`package.json` name: `easy-md-doc`) is a **Node.js static documentation
generator**: it turns Markdown in `docs/` into a self-contained HTML site in `www/`,
with code highlighting, navigation, tag filtering, optional full‑text search, and SFTP
deployment. No framework, no database — plain CommonJS scripts + `markdown-it` + `pug`.

These instructions apply to the whole repository and are the shared source of truth for
all AI assistants working here (GitHub Copilot and Claude — see `CLAUDE.md`).

## Two contexts (read this first)

This repo plays **two roles**, and most design decisions follow from the distinction:

1. **EasyDoc itself** (this repo). Here `__dirname === process.cwd()`, so the setup /
   self‑heal blocks in `index.js` are skipped.
2. **A scaffolded documentation project.** A user runs `node <easydoc>/setup.js` from
   another folder. `setup.js` copies templates into that folder and generates a
   `package.json` whose scripts point at **EasyDoc's absolute file paths**
   (`node <easydoc>/index.js`, `node <easydoc>/deploy.js`). The target uses EasyDoc's
   own `node_modules`; it does not reinstall the build dependencies.

**Reference model:** when adding a new runnable script, follow the existing pattern —
add it to the generated `package.json` in `setup.js` as `"name": "node " + <file>File`
(an absolute path via `path.join(__dirname, "...")`). Scripts run from the target's
`cwd` but resolve modules from EasyDoc's install. Do **not** copy runtime scripts into
the target unless there is a clear reason (`searchApi.js` is the historical exception).

## Key files

| File | Role |
|------|------|
| `index.js` | Build: reads `docs/*.md`, renders via `markdown-it` + `templates/*.pug`, writes HTML + `www/meta.js` (config, translations, pages, tags), copies images/pdf/zip/js, and optionally writes `searchIndex.json`. |
| `setup.js` | Scaffolds a target project: copies `.env`, `nav.js`, `www/` assets, `.vscode/settings.json`, and templates from `setup/`; generates `package.json`. |
| `deploy.js` | Always runs the build first, then dispatches on `EASYDOC_DEPLOY_TYPE` (default `sftp`). SFTP upload via `ssh2-sftp-client`. |
| `searchApi.js` | Optional Express + `elasticlunr` full‑text search server on port 3000. |
| `nav.js` | Site navigation config (`exports.nav = [...]`). |
| `lang/langs.js` | UI translations (`en`, `de`). Add languages here. |
| `templates/` | `pug` templates: `layout.pug`, `nav.pug`, `pagesnav.pug`. |
| `src/js`, `src/scss` | Front‑end source; bundled with webpack (`npm run js`). |
| `setup/` | Template files copied into scaffolded projects (`_gitignore`, `_nodemon.json`, `_searchApi.js`, `_vscode_settings.json`). |
| `www/` | Build output / distributable assets. |
| `.env` | All runtime config (`EASYDOC_*`), loaded with `dotenv`. |

## Commands

```bash
npm run build    # one-off build (docs/ -> www/)
npm run watch    # rebuild on change (nodemon)
npm run js       # webpack bundle of src/js
npm run search   # start the full-text search API (port 3000)
npm run deploy   # build, then deploy (SFTP)
```

## Configuration (`.env`)

Everything is configured through `EASYDOC_*` variables loaded via `dotenv` (see the
commented template in `.env`). Global values are overridable **per page** through
Markdown front matter (e.g. `title`, `lang`, `tags`, `tocIncludeLevel`, `disableToc`,
`disableSiteNav`, `disableTagNavigator`, `disableNavigationBar`, `loadMermaid`,
`loadVueJs`, `brandURL`/`brandName`/`brandSecondary`). When adding a new option, expose
it in `.env` (commented example), read it in `index.js`, and honor the front‑matter
override where it makes sense.

## Deployment

`deploy.js` builds and then uploads. `EASYDOC_DEPLOY_TYPE` selects the strategy
(`sftp` implemented; `rsync`/`ftp`/`local` are stubs). SFTP prefers a private key over a
password, uploads `www/` with merge/overwrite (never deletes remote files), and never
logs the password. Full details live in the `easydoc-deploy` skill
(`.github/skills/easydoc-deploy/SKILL.md`).

## Conventions

- **CommonJS**, `"use strict";`, `require(...)` — no ES modules.
- 2‑space indent, double‑quoted strings, semicolons, `camelCase`.
- Markdown extensions live in `index.js`: custom containers (`tip`, `info`, `warning`,
  `danger`, `line`, `details`), a custom fenced‑code renderer (Prism‑friendly, puts
  attributes on `<pre>`), Mermaid, TOC, anchors, footnotes, task lists, attrs, and the
  local `src/js/markdown-it-flowchart` plugin. Match these patterns when extending.
- **Secrets never get committed.** `.env` may hold an SFTP password; keep it in
  `.gitignore` (and in `setup/_gitignore` for scaffolded projects).
- Prefer small, targeted edits. Don't refactor unrelated code or add dependencies
  without need.

## Repo / workflow

- Git remote is a **self‑hosted Gitea** instance (`git.grandgeorg.de`); branches
  `master` and `gh-pages`. CI is not GitHub Actions — do not assume `.github/workflows`.
- For non‑trivial changes (features, refactors, `setup.js`/deploy changes), follow the
  `planning-session` skill: discover the code, ask the user about ambiguous decisions,
  then write a file‑level plan before coding.
- Verify JS changes with `node --check <file>.js`; verify scaffolding by running
  `setup.js` in a throwaway temp directory.
