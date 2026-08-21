const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const elasticlunr = require("elasticlunr");

const port = Number(process.env.EASYDOC_SEARCH_API_PORT) || 3000;
// loopback only by default, so the API cannot be reached past the reverse proxy
const host = process.env.EASYDOC_SEARCH_API_HOST || "127.0.0.1";
const corsOrigin = process.env.EASYDOC_SEARCH_API_CORS_ORIGIN;
const maxQueryLength = 200;

const serializedIndex = fs.readFileSync(path.join(__dirname, "searchIndex.json"));
const index = elasticlunr.Index.load(JSON.parse(serializedIndex));

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
    fields: {
      title: { boost: 2 },
      tags: { boost: 1.5 },
      body: { boost: 1 },
      file_name: { boost: 1 }
    },
    expand: true,
    bool: "AND"
  });
  res.json(results);
});

app.listen(port, host, function () {
  console.log(
    `Server is listening on http://${host}:${port} - ready to accept requests! e.g. http://${host}:${port}/?q=mysql`
  );
});
