const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const MiniSearch = require("minisearch");

const port = Number(process.env.EASYDOC_SEARCH_API_PORT) || 3000;
// loopback only by default, so the API cannot be reached past the reverse proxy
const host = process.env.EASYDOC_SEARCH_API_HOST || "127.0.0.1";
const corsOrigin = process.env.EASYDOC_SEARCH_API_CORS_ORIGIN;
const maxQueryLength = 200;

const indexFile = path.join(__dirname, "searchIndex.json");
let index;
try {
  const indexData = JSON.parse(fs.readFileSync(indexFile, "utf8"));
  if (!indexData || !indexData.fieldIds) {
    throw new Error(
      "not a MiniSearch index (maybe built by an older EasyDoc that used elasticlunr) - rebuild it with the current EasyDoc and upload it again"
    );
  }
  // the indexed fields are read from the index itself, so they stay in sync with index.js
  index = MiniSearch.loadJS(indexData, {
    fields: Object.keys(indexData.fieldIds),
    idField: "file"
  });
} catch (error) {
  console.error(`Cannot load search index ${indexFile}: ${error.message}`);
  process.exit(1);
}

const app = express();
app.disable("x-powered-by");
app.use(cors(corsOrigin ? { origin: corsOrigin } : undefined));

app.get("/", function (req, res) {
  const query =
    typeof req.query.q === "string" ? req.query.q.slice(0, maxQueryLength) : "";
  if (!query) {
    res.json([]);
    return;
  }
  const results = index.search(query, {
    boost: { title: 2, tags: 1.5, body: 1, file_name: 1 },
    prefix: true,
    fuzzy: 0.2,
    combineWith: "AND"
  });
  res.json(results);
});

// Express 5 passes listen errors (e.g. EADDRINUSE) to this callback instead of throwing;
// exit non-zero so process managers like pm2 report the failure instead of a clean exit.
app.listen(port, host, function (error) {
  if (error) {
    console.error(`Cannot listen on http://${host}:${port}: ${error.message}`);
    process.exit(1);
  }
  console.log(
    `Server is listening on http://${host}:${port} - ready to accept requests! e.g. http://${host}:${port}/?q=mysql`
  );
});
