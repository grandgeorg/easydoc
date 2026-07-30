---
name: planning-session
description: "Use when a change to EasyDoc needs a plan before coding — feature requests, refactors, or setup/deploy changes. Runs a discovery -> grilling Q&A -> written plan workflow: gather codebase context first, interview the user on the ambiguous decisions, then produce an approved, file-level implementation plan."
---

# Planning Session (Grilling Q&A)

A structured workflow for turning a vague request into an agreed, implementable plan
before writing code. Optimized for EasyDoc's conventions.

## When to use

- The request has real design ambiguity (delivery model, config surface, security).
- Multiple files or the `setup.js` scaffolding are affected.
- Skip for trivial, single-file, unambiguous edits.

## Workflow

### 1. Discovery (read-only)

Understand the code before proposing anything:

- Read the entry points: `index.js` (build), `setup.js` (scaffolds target projects),
  `searchApi.js` (optional search server), `deploy.js` (deployment).
- Note the **template-copy pattern**: `setup.js` runs in the target's `cwd`, copies
  templates from the EasyDoc install dir, and generates a `package.json` whose scripts
  reference EasyDoc's absolute file paths (`build`/`watch`/`deploy`).
- Check `.env` (the config surface, copied to targets), `setup/_gitignore`, and the
  Gitea remote. Confirm which files are templates vs. runtime.

### 2. Grilling (interview the user)

Ask focused, high-impact questions on the genuine forks. Provide options with a
recommended default. Typical axes for EasyDoc:

- Delivery model: copy a file into the target vs. reference EasyDoc's file by absolute
  path (like `build`/`watch`).
- Config surface: which `EASYDOC_*` variables, sensible defaults, extensibility.
- Security: anything with credentials must be git-ignored; prefer keys over passwords.
- Scope now vs. later: implement one path, stub the rest behind a type switch.

### 3. Plan

Write a file-level plan: numbered steps, the exact files to touch, verification steps,
explicit decisions, and out-of-scope items. Get approval before implementing.

## EasyDoc conventions to respect

- Reference model for new scripts: add a script to the generated `package.json` in
  `setup.js` pointing at `path.join(__dirname, "<file>.js")`; the script runs from
  EasyDoc's `node_modules`, reading the target's `.env` via `process.cwd()`.
- Extend `.env` with commented example variables for any new config.
- Never commit secrets; keep `.env` in `.gitignore`.
