const express = require("express");

function createApp(options) {
  const app = express();

  app.get(`/.rest/delivery/${options.rootPath}`, (req, res) => {
    res.status(501).json({ results: [] });
  });

  app.get(`/.rest/delivery/${options.rootPath}/:path(*)/@nodes`, (req, res) => {
    const content = app.locals.magnolia.getMagnoliaChildNodes(req.params.path);

    console.info({ request: req.originalUrl, path: req.params.path });

    if (content) {
      res.json(content);
    } else {
      const error = { code: "pathNotFound", message: req.params.path };
      res.status(404).json({ error });
    }
  });

  app.get(`/.rest/delivery/${options.rootPath}/:path(*)`, (req, res) => {
    const content = app.locals.magnolia.getMagnoliaNode(req.params.path);

    console.info({ request: req.originalUrl, path: req.params.path });

    if (content) {
      res.json(content);
    } else {
      const error = { code: "pathNotFound", message: req.params.path };
      res.status(404).json({ error });
    }
  });

  return app;
}

module.exports = createApp;
