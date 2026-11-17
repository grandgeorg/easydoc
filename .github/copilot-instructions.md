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
| `index.js` | Build: reads `docs/*.md`, renders via `markdown-it` + `templates/*.pug`, writes HTML + `www/meta.js` (config, translations, pages, tags), copies images/pdf/zip/js, copies the project's `overrides.css` to `www/assets/css/` (linked after EasyDoc's CSS with a `?v=<hash>`; stale copy removed when the source is gone), and optionally writes `searchIndex.json`. |
| `setup.js` | Scaffolds a target project: copies `.env`, `nav.js`, `www/` assets, `.vscode/settings.json`, and templates from `setup/` (incl. a starter `overrides.css`); generates `package.json`. |
| `update.js` | Run from a scaffolded project (`npm run update`): overwrites the target's `www/assets` JS/CSS/fonts with EasyDoc's versions (favicons untouched), refreshes the target's `searchApi.js`, creates a starter `overrides.css` only if missing (never overwrites it), and swaps a legacy `elasticlunr` dependency for `minisearch` in its `package.json`. |
| `assets.js` | Shared asset list + `copyAssets()` used by `setup.js` and `update.js`. Add new shipped assets here. |
| `deploy.js` | Always runs the build first, then dispatches on `EASYDOC_DEPLOY_TYPE` (default `sftp`). SFTP upload via `ssh2-sftp-client`. |
| `searchApi.js` | Optional Express + `minisearch` full‑text search server on port 3000. |
| `nav.js` | Site navigation config (`exports.nav = [...]`). |
| `lang/langs.js` | UI translations (`en`, `de`). Add languages here. |
| `templates/` | `pug` templates: `layout.pug`, `nav.pug`, `pagesnav.pug`. |
| `src/js`, `src/scss` | Front‑end source; bundled with webpack (`npm run js`). |
| `setup/` | Template files copied into scaffolded projects (`_gitignore`, `_nodemon.json`, `_overrides.css`, `_searchApi.js`, `_vscode_settings.json`). |
| `www/` | Build output / distributable assets. |
| `.env` | All runtime config (`EASYDOC_*`), loaded with `dotenv`. |
| `e2e/` | Playwright end‑to‑end specs (`*.spec.js`), the shared `fixtures.js`, the committed test site `e2e/fixture/` (its `www/` is generated), `build-fixture.js`, and the static server `serve.js`. See **Testing**. |
| `playwright.config.js` | Playwright config: installed Edge (`channel: "msedge"`), `dot` reporter, own server on port 4311. |

## Commands

```bash
npm run build    # one-off build (docs/ -> www/)
npm run watch    # rebuild on change (nodemon)
npm run js       # webpack bundle of src/js
npm run search   # start the full-text search API (port 3000)
npm run deploy   # build, then deploy (SFTP)
npm run test:e2e # rebuild js + css, build the e2e fixture site, run all browser tests
npm run test:fixture  # only rebuild the e2e fixture site (e2e/fixture -> e2e/fixture/www)
npm run serve:test    # serve e2e/fixture/www on http://127.0.0.1:4310/ (arg: other dir)
```

## Testing

End‑to‑end tests use `@playwright/test` with the **installed Microsoft Edge**
(`channel: "msedge"`). Never run `npx playwright install`, install `playwright-core`
somewhere else, use Python's `http.server`, or add temporary pages to `docs/`.
Everything needed is already set up.

- **Run after every change** to `src/`, `templates/`, `index.js`, `lang/`, or `assets.js`.
  Use `--silent` to keep the output short:
  ```bash
  npm run --silent test:e2e                                # all specs (~10 s)
  npm run --silent test:e2e -- e2e/page-info.spec.js       # one spec file
  npm run --silent test:e2e -- -g "tag"                    # tests whose title matches
  ```
  A pass prints about five lines ending in `N passed`. A failure prints the assertion, a
  code frame, and paths to a screenshot and trace under `test-results/` (git‑ignored).
  The exit code is reliable, but **don't pipe the command into `Select-Object -First`**:
  that cuts the run short and hides the exit code. If the run fails with
  `http://127.0.0.1:4311 is already used`, a leftover server holds the port. Find its PID
  (`Get-NetTCPConnection -LocalPort 4311`) and stop it with `Stop-Process -Id <PID>`.
- **The suite is self‑contained:** it rebuilds `www/assets` (webpack + sass), rebuilds
  `e2e/fixture/www` from the committed fixture (shell `EASYDOC_*` variables are ignored;
  only `e2e/fixture/.env` counts), and starts its own server on port **4311**
  (`reuseExistingServer: false`).
- **Fixture site** (`e2e/fixture/`, committed): `.env`, `nav.js`, `docs/*.md`. Each page
  exists for a reason stated in its front matter (`index.md` has tags, code and a
  container; `no-tags.md` has no tags and `lang: de`; `no-page-info.md` sets
  `disableShowPageInfo: true`). To test a new option or page variant, **add a small
  page** with the needed front matter here. The smoke spec automatically checks every
  page in `e2e/fixture/docs/`. Options that only exist in `.env` change the fixture's
  `.env`, which affects all specs. Check them before changing a value.
- **Writing specs:** `const { test, expect } = require("./fixtures");` (not
  `@playwright/test` directly). Every test automatically **fails on any page error or
  `console.error`**. Use relative URLs (`page.goto("index.html")`), web‑first assertions
  (`toBeVisible`, `toHaveAttribute`, `expect.poll`), and no fixed `waitForTimeout`.
  Tests run in parallel with fresh storage (no `localStorage`, so no theme or cookie
  consent is stored).
- **Manual or visual checks:** start `npm run serve:test` as an async/background
  command (`npm run serve:test -- tests/www` serves the user's playground). Open
  `http://127.0.0.1:4310/` with the VS Code integrated browser tools (open page, read
  page, screenshot, click) if they're available, and stop the server afterwards. The
  automated suite uses port 4311, so it never conflicts with this server. The
  "Microsoft Edge Tools for VS Code" extension is a DevTools UI for people; agents
  can't use it.
- **`tests/`** is the user's private, git‑ignored playground (a scaffolded project with
  manual pages; scripts use `node ../index.js`). Use it only for manual checks; specs
  must never depend on it.
- Out of scope so far: `setup.js`/`update.js`/`deploy.js` and the full‑text search API.
  Verify scaffolding by running `setup.js` in a throwaway temp directory.

## Configuration (`.env`)

Everything is configured through `EASYDOC_*` variables loaded via `dotenv` (see the
commented template in `.env`). Global values are overridable **per page** through
Markdown front matter (e.g. `title`, `lang`, `tags`, `tocIncludeLevel`, `disableToc`,
`disableSiteNav`, `disableTagNavigator`, `disableNavigationBar`, `disableShowPageInfo`, `loadMermaid`, `disableFlowchart`,
`loadVueJs`, `disableThemeOverrides`, `brandURL`/`brandName`/`brandSecondary`). When adding a new option, expose
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
- Verify JS changes with `node --check <file>.js`, then run `npm run --silent test:e2e`
  for anything that affects the built site (see **Testing**); verify scaffolding by
  running `setup.js` in a throwaway temp directory.

## Ignore these directories

- `data/`