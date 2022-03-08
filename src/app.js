const express = require("express");
const { getContent } = require("./contentUtils");
const { validationMiddleware } = require("./middleware");
const { getMagnoliaContent, getMagnoliaNodes } = require("./magnoliaUtils");

const app = express();

const defaultOptions = Object.freeze({ depth: 10 });

app.use(validationMiddleware);

app.get("/.rest/delivery/pages/:path(*)/@nodes", (req, res) => {
  const page = getMagnoliaContent(app.locals.content, req.params.path, {
    ...defaultOptions,
    ...req.query,
  });

  console.info({ request: req.originalUrl, path: req.params.path });

  if (page) {
    res.json(getMagnoliaNodes(page));
  } else {
    res.status(404).send("Page not found.");
  }
});

app.get("/.rest/delivery/pages/:path(*)", (req, res) => {
  const page = getMagnoliaContent(app.locals.content, req.params.path, {
    ...defaultOptions,
    ...req.query,
  });

  console.info({ request: req.originalUrl, path: req.params.path });

  if (page) {
    res.json(page);
  } else {
    res.status(404).send("Page not found.");
  }
});

async function bootstrap(options) {
  try {
    app.locals.options = options;
    app.locals.content = await getContent({ source: options.sourceDir });
    return app;
  } catch (err) {
    throw new Error(`Failed to load content: ${err.message}`);
  }
}

module.exports = { app, bootstrap };
