"use strict";

const path = require("path");
const fs = require("fs");
const { spawnSync } = require("child_process");

require("dotenv").config();

const baseDir = process.cwd();
const distDir = path.join(baseDir, "www");

function fail(message) {
  console.error("[deploy] " + message);
  process.exit(1);
}

// 1. Always build first (spawn easydoc's index.js in the target's cwd).
console.log("[deploy] Building site...");
const build = spawnSync(process.execPath, [path.join(__dirname, "index.js")], {
  cwd: baseDir,
  stdio: "inherit",
});
if (build.status !== 0) {
  fail("Build failed. Aborting deployment.");
}

if (!fs.existsSync(distDir)) {
  fail("Build output directory not found: " + distDir);
}

// 2. Dispatch by deployment type.
const deployType = String(process.env.EASYDOC_DEPLOY_TYPE || "sftp").toLowerCase();

switch (deployType) {
  case "sftp":
    deploySftp();
    break;
  case "rsync":
    fail('Deploy type "rsync" is not implemented yet.');
    break;
  case "ftp":
    fail('Deploy type "ftp" is not implemented yet.');
    break;
  case "local":
    fail('Deploy type "local" is not implemented yet.');
    break;
  default:
    fail('Unknown EASYDOC_DEPLOY_TYPE "' + deployType + '". Supported: sftp.');
}

async function deploySftp() {
  const host = process.env.EASYDOC_DEPLOY_SFTP_HOST;
  const username = process.env.EASYDOC_DEPLOY_SFTP_USERNAME;
  const remotePath = process.env.EASYDOC_DEPLOY_SFTP_REMOTE_PATH;
  const port = process.env.EASYDOC_DEPLOY_SFTP_PORT
    ? parseInt(process.env.EASYDOC_DEPLOY_SFTP_PORT, 10)
    : 22;
  const password = process.env.EASYDOC_DEPLOY_SFTP_PASSWORD;
  const privateKeyPath = process.env.EASYDOC_DEPLOY_SFTP_PRIVATE_KEY;
  const passphrase = process.env.EASYDOC_DEPLOY_SFTP_PASSPHRASE;
  const localDir = process.env.EASYDOC_DEPLOY_SFTP_LOCAL_DIR
    ? path.resolve(baseDir, process.env.EASYDOC_DEPLOY_SFTP_LOCAL_DIR)
    : distDir;

  // Validate required configuration.
  const missing = [];
  if (!host) missing.push("EASYDOC_DEPLOY_SFTP_HOST");
  if (!username) missing.push("EASYDOC_DEPLOY_SFTP_USERNAME");
  if (!remotePath) missing.push("EASYDOC_DEPLOY_SFTP_REMOTE_PATH");
  if (!privateKeyPath && !password) {
    missing.push("EASYDOC_DEPLOY_SFTP_PRIVATE_KEY or EASYDOC_DEPLOY_SFTP_PASSWORD");
  }
  if (missing.length > 0) {
    fail("Missing SFTP configuration in .env: " + missing.join(", "));
  }
  if (!fs.existsSync(localDir)) {
    fail("Local directory to upload does not exist: " + localDir);
  }

  const connectConfig = { host, port, username };
  // Private key is preferred when provided; otherwise fall back to password.
  if (privateKeyPath) {
    if (!fs.existsSync(privateKeyPath)) {
      fail("SFTP private key not found: " + privateKeyPath);
    }
    connectConfig.privateKey = fs.readFileSync(privateKeyPath);
    if (passphrase) {
      connectConfig.passphrase = passphrase;
    }
  } else {
    connectConfig.password = password;
  }

  const Client = require("ssh2-sftp-client");
  const sftp = new Client();

  try {
    console.log("[deploy] Connecting to " + username + "@" + host + ":" + port + " ...");
    await sftp.connect(connectConfig);
    console.log("[deploy] Uploading " + localDir + " -> " + remotePath + " ...");
    // Merge/overwrite: uploads and overwrites files, never deletes remote files.
    await sftp.uploadDir(localDir, remotePath);
    console.log("[deploy] Upload complete.");
  } catch (err) {
    fail("SFTP deployment failed: " + err.message);
  } finally {
    try {
      await sftp.end();
    } catch (_) {
      // ignore errors while closing the connection
    }
  }
}
