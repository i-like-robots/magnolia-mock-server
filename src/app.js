const express = require("express");
const get = require("just-safe-get");
const { getContent } = require("./contentUtils");
const { magnoliaTransform } = require("./magnoliaUtils");

const app = express();

const getPage = (path) => {
  const target = path.split("/").filter(Boolean);
  const content = get(app.locals.content, target);

  if (content) {
    return magnoliaTransform(content, path);
  }
};

app.get("/.rest/delivery/pages/:path(*)/@nodes", (req, res) => {
  const page = getPage(req.params.path);

  console.info({ request: req.originalUrl, path: req.params.path });

  if (page) {
    const children = [];

    page["@nodes"].forEach((node) => {
      if (page[node]["@nodeType"] === "mgnl:page") {
        children.push(page[node]);
      }
    });

    res.json(children);
  } else {
    res.status(404).send("Page not found.");
  }
});

app.get("/.rest/delivery/pages/:path(*)", (req, res) => {
  const page = getPage(req.params.path);

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
