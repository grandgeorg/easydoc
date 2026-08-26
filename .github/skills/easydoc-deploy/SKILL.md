---
name: easydoc-deploy
description: "Use when deploying an EasyDoc site or configuring/troubleshooting EasyDoc deployment. Covers `npm run deploy`, the deploy.js build-then-upload flow, SFTP configuration in .env (host/port/username/password/private key/remote path), the extensible EASYDOC_DEPLOY_TYPE switch, and credential security."
---

# EasyDoc Deploy

`deploy.js` builds the site and then publishes the output. It is referenced by the
`deploy` script in a project's `package.json` (added by `setup.js`) and reads all
configuration from the project's `.env`.

## Run

```bash
npm run deploy
```

This **always** runs the build first (equivalent to `npm run build`) and then uploads
the built `www/` directory. There is no opt-out for the build step.

## Deployment types

`EASYDOC_DEPLOY_TYPE` selects the strategy (default: `sftp`).

| Value   | Status          |
|---------|-----------------|
| `sftp`  | Implemented     |
| `rsync` | Stub (planned)  |
| `ftp`   | Stub (planned)  |
| `local` | Stub (planned)  |

## SFTP configuration (`.env`)

| Variable | Required | Notes |
|----------|----------|-------|
| `EASYDOC_DEPLOY_SFTP_HOST` | yes | Server hostname/IP |
| `EASYDOC_DEPLOY_SFTP_USERNAME` | yes | SSH username |
| `EASYDOC_DEPLOY_SFTP_REMOTE_PATH` | yes | Target directory on the server |
| `EASYDOC_DEPLOY_SFTP_PORT` | no | Defaults to `22` |
| `EASYDOC_DEPLOY_SFTP_PRIVATE_KEY` | one of | Path to private key — **preferred** when set |
| `EASYDOC_DEPLOY_SFTP_PASSPHRASE` | no | Passphrase for the private key |
| `EASYDOC_DEPLOY_SFTP_PASSWORD` | one of | Used only if no private key is provided |
| `EASYDOC_DEPLOY_SFTP_LOCAL_DIR` | no | Directory to upload; defaults to `www` |
| `EASYDOC_DEPLOY_SFTP_SEARCH_INDEX_REMOTE_PATH` | no | If set, upload `searchIndex.json` here. A value ending in `.json` is a full remote file path; otherwise it is a remote directory the file is placed into. Only uploaded when full-text search is enabled and the file exists. |

Provide **either** a private key or a password. If both are set, the private key wins.

## Behavior

- Upload is **merge/overwrite**: existing remote files are overwritten and new files
  added, but remote files are never deleted.
- If `EASYDOC_DEPLOY_SFTP_SEARCH_INDEX_REMOTE_PATH` is set, `searchIndex.json` is
  uploaded to that path after the site upload (skipped with a warning if the file is
  missing, e.g. when full-text search is disabled).
- The build must succeed (exit code 0) or deployment aborts.
- The password is never printed to the console.

## Security

- `.env` holds credentials and is git-ignored by generated projects. Never commit it.
- Prefer key-based auth over passwords.

## Existing projects

`setup.js` only writes `package.json`, `.env`, and `.gitignore` when they don't already
exist. For a project scaffolded before deployment support was added, manually:

1. Add `"deploy": "node <path-to-easydoc>/deploy.js"` to `package.json` scripts.
2. Append the `EASYDOC_DEPLOY_*` variables to `.env`.
3. Ensure `.env` is listed in `.gitignore`.
