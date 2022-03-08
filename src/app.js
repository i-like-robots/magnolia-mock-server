const express = require("express");
const get = require("just-safe-get");
const { getContent } = require("./contentUtils");
const { validationMiddleware } = require("./middleware");
const { getMagnoliaContent, getMagnoliaChildren } = require("./magnoliaUtils");

const app = express();

const defaultOptions = { depth: 10 };

const getPage = (path, options) => {
  const target = path.split("/").filter(Boolean);
  const content = get(app.locals.content, target);

  if (content) {
    return getMagnoliaContent(content, path, { ...defaultOptions, ...options });
  }
};

app.use(validationMiddleware);

app.get("/.rest/delivery/pages/:path(*)/@nodes", (req, res) => {
  const page = getPage(req.params.path, req.query);

  console.info({ request: req.originalUrl, path: req.params.path });

  if (page) {
    res.json(getMagnoliaChildren(page));
  } else {
    res.status(404).send("Page not found.");
  }
});

app.get("/.rest/delivery/pages/:path(*)", (req, res) => {
  const page = getPage(req.params.path, req.query);

  console.info({ request: req.originalUrl, path: req.params.path });

  if (page) {
    res.json(page);
  } else {
    res.status(404).send("Page not found.");
  }
});

async function bootstrap() {
  try {
    app.locals.content = await getContent({ source: "./content" });
    return app;
  } catch (err) {
    throw new Error(`Failed to load content: ${err.message}`);
  }
}

module.exports = { app, bootstrap };
