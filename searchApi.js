const fs = require("fs");
const path = require("path");
const express = require("express");
var cors = require('cors');
const elasticlunr = require("elasticlunr");
const serializedIndex = fs.readFileSync(path.join(__dirname, "searchIndex.json"));
const index = elasticlunr.Index.load(JSON.parse(serializedIndex));
const app = express();
app.use(cors());

app.get("/", function (req, res) {
  const query = req.query.q;
  const results = index.search(query, {
    fields: {
      title: { boost: 2 },
      tags: { boost: 1.5 },
      body: { boost: 1 },
      file_name: { boost: 1 }
    },
    expand: true,
  });
  res.json(results);
});
app.listen(3000, function () {
  console.log("Server is listening on port 3000. Ready to accept requests! e.g. http://localhost:3000/?q=mysql");
});
