const express = require("express");

const app = express();

app.get("/.rest/delivery/pages", (req, res) => {
  res.status(501).json({ results: [] });
});

app.get("/.rest/delivery/pages/:path(*)/@nodes", (req, res) => {
  const content = app.locals.magnolia.getMagnoliaChildNodes(req.params.path);

  console.info({ request: req.originalUrl, path: req.params.path });

  if (content) {
    res.json(content);
  } else {
    const error = { code: "pathNotFound", message: req.params.path };
    res.status(404).json({ error });
  }
});

app.get("/.rest/delivery/pages/:path(*)", (req, res) => {
  const content = app.locals.magnolia.getMagnoliaNode(req.params.path);

  console.info({ request: req.originalUrl, path: req.params.path });

  if (content) {
    res.json(content);
  } else {
    const error = { code: "pathNotFound", message: req.params.path };
    res.status(404).json({ error });
  }
});

module.exports = app;
