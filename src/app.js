const express = require("express");
const { getContent } = require("./contentUtils");
const { validationMiddleware } = require("./middleware");
const MagnoliaAPI = require("./MagnoliaAPI");

const app = express();

app.use(validationMiddleware);

app.get("/.rest/delivery/pages/:path(*)/@nodes", (req, res) => {
  const content = app.locals.magnolia.getContentNodes(req.params.path);

  console.info({ request: req.originalUrl, path: req.params.path });

  if (content) {
    res.json(content);
  } else {
    res.status(404).send("Page not found.");
  }
});

app.get("/.rest/delivery/pages/:path(*)", (req, res) => {
  const content = app.locals.magnolia.getContent(req.params.path);

  console.info({ request: req.originalUrl, path: req.params.path });

  if (content) {
    res.json(content);
  } else {
    res.status(404).send("Page not found.");
  }
});

async function bootstrap(options) {
  try {
    const content = await getContent({ source: options.sourceDir });
    const magnolia = new MagnoliaAPI(content, options);

    Object.assign(app.locals, { content, magnolia });

    return app;
  } catch (err) {
    throw new Error(`Failed to load content: ${err.message}`);
  }
}

module.exports = { app, bootstrap };
